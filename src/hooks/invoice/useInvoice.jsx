// src/hooks/invoice/useInvoice.js

import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { usePortalData } from '../react-query/usePortalData';
import { createInvoice, fetchInvoiceData, updateClientInvoice } from '../../services/invoiceService';

const defaultInvoiceState = {
  title: '',
  description: '',
  isLoading: false,
  line_items: [{
    id: uuidv4(),
    description: '',
    quantity: 1,
    unit_amount: 0,
  }],
  attachments: [],
  settings: {
    card: false,
    achDebit: false,
  },
  memo: '',
  client: null,
  due_date: null
};

// Utility function for deep comparison
function deepEqual(obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

// Validation functions
const validateInvoiceData = (invoiceState) => {
  const errors = {};

  // Title validation
  if (!invoiceState.title || invoiceState.title.trim().length === 0) {
    errors.title = 'Title is required';
  } else if (invoiceState.title.length > 100) {
    errors.title = 'Title must be less than 100 characters';
  }

  // Client validation
  if (!invoiceState.client) {
    errors.client = 'Please select a client';
  }

  // Due date validation
  if (!invoiceState.due_date) {
    errors.due_date = 'Due date is required';
  } else {
    const dueDate = new Date(invoiceState.due_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dueDate < today) {
      errors.due_date = 'Due date cannot be in the past';
    }
  }

  // Line items validation
  if (!invoiceState.line_items || invoiceState.line_items.length === 0) {
    errors.line_items = 'At least one line item is required';
  } else {
    const lineItemErrors = [];
    invoiceState.line_items.forEach((item, index) => {
      const itemErrors = {};

      if (!item.description || item.description.trim().length === 0) {
        itemErrors.description = 'Description is required';
      }

      if (!item.quantity || item.quantity <= 0) {
        itemErrors.quantity = 'Required';
      }

      if (!item.unit_amount || item.unit_amount <= 0) {
        itemErrors.unit_amount = 'Required';
      }

      if (Object.keys(itemErrors).length > 0) {
        lineItemErrors[index] = itemErrors;
      }
    });

    if (lineItemErrors.length > 0) {
      errors.line_items = lineItemErrors;
    }
  }

  // Description validation (optional but with length limit)
  if (invoiceState.description && invoiceState.description.length > 500) {
    errors.description = 'Description must be less than 500 characters';
  }

  // Memo validation (optional but with length limit)
  if (invoiceState.memo && invoiceState.memo.length > 1000) {
    errors.memo = 'Comment must be less than 1000 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

const useInvoice = (defaultValue = {}) => {
  const [invoiceState, setInvoiceState] = useState(defaultInvoiceState);
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const navigate = useNavigate();
  const { mode } = useParams();
  const location = useLocation();
  const { user, currentSelectedPortal } = useSelector(state => state.auth);
  const { data: portal } = usePortalData(currentSelectedPortal);
  const prevDefaultValueRef = useRef();
  const isEditMode = mode === 'edit';

  // Real-time validation effect (fixed to avoid infinite loop)
  useEffect(() => {
    if (Object.keys(validationErrors).length > 0) {
      const validation = validateInvoiceData(invoiceState);
      const newErrors = { ...validationErrors };
      let hasChanges = false;

      Object.keys(validationErrors).forEach(field => {
        const oldErr = validationErrors[field];
        const newErr = validation.errors[field];

        // If the field passed validation, remove its error
        if (!newErr) {
          delete newErrors[field];
          hasChanges = true;
        } else {
          // Compare contents (deep) before updating
          const oldString = JSON.stringify(oldErr || null);
          const newString = JSON.stringify(newErr);
          if (oldString !== newString) {
            newErrors[field] = newErr;
            hasChanges = true;
          }
        }
      });

      if (hasChanges) {
        setValidationErrors(newErrors);
      }
    }
  }, [invoiceState, validationErrors]);

  // Fetch invoice data for edit mode
  useEffect(() => {
    const fetchInvoice = async () => {
      const id = queryString.parse(location.search).id;
      if (!id) {
        setFetchError('No invoice ID provided');
        return;
      }

      setInvoiceState(prevState => ({ ...prevState, isLoading: true }));
      setFetchError(null);

      try {
        const invoices = await fetchInvoiceData(id);

        if (invoices) {
          setInvoiceState(prevState => ({
            ...prevState,
            ...invoices,
            isLoading: false,
          }));
        } else {
          setFetchError('Invoice not found');
          setInvoiceState(prevState => ({ ...prevState, isLoading: false }));
        }
      } catch (error) {
        console.error('Error fetching invoice:', error);
        setFetchError('Failed to load invoice data. Please try again.');
        setInvoiceState(prevState => ({ ...prevState, isLoading: false }));
      }
    };

    if (isEditMode) {
      fetchInvoice();
    }
  }, [isEditMode, location.search]);

  const saveInvoice = async () => {
    setIsSubmitting(true);
    setValidationErrors({});

    try {
      // Validate the invoice data
      const validation = validateInvoiceData(invoiceState);

      if (!validation.isValid) {
        setValidationErrors(validation.errors);
        setIsSubmitting(false);
        return {
          success: false,
          errors: validation.errors
        };
      }

      setInvoiceState(prevState => ({ ...prevState, isLoading: true }));

      await createInvoice(invoiceState, portal);

      return {
        success: true,
        message: 'Invoice created successfully!'
      };
    } catch (error) {
      console.error('Error saving invoice:', error);

      // Handle different types of errors
      let errorMessage = 'Failed to save invoice. Please try again.';

      if (error.response?.status === 400) {
        errorMessage = 'Invalid invoice data. Please check your inputs.';
      } else if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to create invoices.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      }

      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsSubmitting(false);
      setInvoiceState(prevState => ({ ...prevState, isLoading: false }));
    }
  };

  const updateInvoice = async () => {
    const id = queryString.parse(location.search).id;
    if (!id) {
      return {
        success: false,
        error: 'No invoice ID provided'
      };
    }

    setIsSubmitting(true);
    setValidationErrors({});

    try {
      // Validate the invoice data
      const validation = validateInvoiceData(invoiceState);

      if (!validation.isValid) {
        setValidationErrors(validation.errors);
        setIsSubmitting(false);
        return {
          success: false,
          errors: validation.errors
        };
      }

      setInvoiceState(prevState => ({ ...prevState, isLoading: true }));

      const { client, isLoading, ...rest } = invoiceState;
      await updateClientInvoice(id, rest);

      return {
        success: true,
        message: 'Invoice updated successfully!'
      };
    } catch (error) {
      console.error('Error updating invoice:', error);

      let errorMessage = 'Failed to update invoice. Please try again.';

      if (error.response?.status === 400) {
        errorMessage = 'Invalid invoice data. Please check your inputs.';
      } else if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to update this invoice.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Invoice not found. It may have been deleted.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      }

      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsSubmitting(false);
      setInvoiceState(prevState => ({ ...prevState, isLoading: false }));
    }
  };

  // Update state when defaultValue changes
  useEffect(() => {
    if (!deepEqual(defaultValue, prevDefaultValueRef.current)) {
      setInvoiceState(prevState => ({ ...prevState, ...defaultValue }));
      prevDefaultValueRef.current = defaultValue;
    }
  }, [defaultValue]);

  // Validate individual fields
  const validateField = (fieldName, value) => {
    const tempState = { ...invoiceState, [fieldName]: value };
    const validation = validateInvoiceData(tempState);

    return validation.errors[fieldName] || null;
  };

  // Clear all errors
  const clearErrors = () => {
    setValidationErrors({});
    setFetchError(null);
  };

  return {
    invoiceState,
    setInvoiceState,
    saveInvoice,
    updateInvoice,
    validationErrors,
    isSubmitting,
    fetchError,
    validateField,
    clearErrors,
    // Backward compatibility
    isClientError: validationErrors.client ? true : false
  };
};

export default useInvoice;
