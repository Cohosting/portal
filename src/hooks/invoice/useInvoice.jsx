// src/hooks/invoice/useInvoice.js
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { v4 as uuidv4 } from 'uuid';
import { useSelector } from 'react-redux';
import { usePortalData } from '../react-query/usePortalData';
import {
  createInvoice,
  fetchInvoiceData,
  updateClientInvoice,
} from '../../services/invoiceService';

const defaultInvoiceState = {
  title: '',
  description: '',
  isLoading: false,
  line_items: [
    {
      id: uuidv4(),
      description: '',
      quantity: 1,
      unit_amount: 0,
    },
  ],
  attachments: [],
  settings: {
    ach_debit: false,
    card: false,
  },
  memo: '',
  client: null,     // UI-only
  client_id: null,  // DB column
  due_date: null,
  is_external: false,
  status: 'draft',
};

function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

const validateInvoiceData = (invoiceState) => {
  const errors = {};

  // Title validation
  if (!invoiceState.title?.trim()) {
    errors.title = 'Title is required';
  } else if (invoiceState.title.length > 100) {
    errors.title = 'Title must be less than 100 characters';
  }

  // Client validation
  if (!invoiceState.client_id) {
    errors.client = 'Please select a client';
  }

  // Due date validation
  if (!invoiceState.due_date) {
    errors.due_date = 'Due date is required';
  } else if (!invoiceState.is_external) {
    // Only validate past dates for internal invoices
    const due = new Date(invoiceState.due_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (due < today) {
      errors.due_date = 'Due date cannot be in the past';
    }
  }

  // Line items validation
  if (!Array.isArray(invoiceState.line_items) || invoiceState.line_items.length === 0) {
    errors.line_items = 'At least one line item is required';
  } else {
    const itemErrs = [];
    invoiceState.line_items.forEach((item, idx) => {
      const ie = {};
      if (!item.description?.trim()) ie.description = 'Description is required';
      if (!item.quantity || item.quantity <= 0) ie.quantity = 'Required';
      if (!item.unit_amount || item.unit_amount <= 0) ie.unit_amount = 'Required';
      if (Object.keys(ie).length) itemErrs[idx] = ie;
    });
    if (itemErrs.length) errors.line_items = itemErrs;
  }

  // Optional fields length
  if (invoiceState.description?.length > 500) {
    errors.description = 'Description must be less than 500 characters';
  }
  if (invoiceState.memo?.length > 1000) {
    errors.memo = 'Comment must be less than 1000 characters';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};
const useInvoice = (defaultValue = {}) => {
  const [invoiceState, setInvoiceState] = useState(defaultInvoiceState);
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const navigate = useNavigate();
  const { mode } = useParams();
  const location = useLocation();
  const { currentSelectedPortal } = useSelector((s) => s.auth);
  const { data: portal } = usePortalData(currentSelectedPortal);
  const prevDefaultRef = useRef();
  const isEditMode = mode === 'edit';

  // Apply portal defaults only on create
  useEffect(() => {
    if (!isEditMode && !deepEqual(defaultValue, prevDefaultRef.current)) {
      setInvoiceState((prev) => ({ ...prev, ...defaultValue }));
      prevDefaultRef.current = defaultValue;
    }
  }, [defaultValue, isEditMode]);

  // Fetch existing invoice in edit mode
  useEffect(() => {
    if (!isEditMode) return;

    const fetchInvoice = async () => {
      const id = queryString.parse(location.search).id;
      if (!id) {
        setFetchError('No invoice ID provided');
        return;
      }
      setInvoiceState((p) => ({ ...p, isLoading: true }));
      try {
        const fetched = await fetchInvoiceData(id);
        if (!fetched) {
          setFetchError('Invoice not found');
        } else {
          setInvoiceState({ ...fetched, isLoading: false });
        }
      } catch (err) {
        console.error('Error fetching invoice:', err);
        setFetchError('Failed to load invoice data. Please try again.');
        setInvoiceState((p) => ({ ...p, isLoading: false }));
      }
    };

    fetchInvoice();
  }, [isEditMode, location.search]);

  const saveInvoice = async () => {
    setIsSubmitting(true);
    setValidationErrors({});
    try {
      const { isValid, errors } = validateInvoiceData(invoiceState);
      if (!isValid) {
        setValidationErrors(errors);
        return { success: false, errors };
      }

      setInvoiceState((p) => ({ ...p, isLoading: true }));
      if (!invoiceState.is_external) {
      await createInvoice({
        ...invoiceState,
        status: "draft"
      }, portal);

      } else {
      await createInvoice(invoiceState, portal);

      }
      
      return { success: true, message: 'Invoice created successfully!' };
    } catch (err) {
      console.error('Error saving invoice:', err);
      return {
        success: false,
        error: err.message || 'Failed to save invoice. Please try again.',
      };
    } finally {
      setIsSubmitting(false);
      setInvoiceState((p) => ({ ...p, isLoading: false }));
    }
  };

  const updateInvoice = async () => {
    const id = queryString.parse(location.search).id;
    if (!id) {
      return { success: false, error: 'No invoice ID provided' };
    }

    setIsSubmitting(true);
    setValidationErrors({});
    try {
      const { isValid, errors } = validateInvoiceData(invoiceState);
      if (!isValid) {
        setValidationErrors(errors);
        return { success: false, errors };
      }

      setInvoiceState((p) => ({ ...p, isLoading: true }));

      // strip out UI-only props before sending to DB
      const { client, isLoading, portal, ...payload } = invoiceState;
      await updateClientInvoice(id, payload);

      return { success: true, message: 'Invoice updated successfully!' };
    } catch (err) {
      console.error('Error updating invoice:', err);
      return {
        success: false,
        error: err.message || 'Failed to update invoice. Please try again.',
      };
    } finally {
      setIsSubmitting(false);
      setInvoiceState((p) => ({ ...p, isLoading: false }));
    }
  };

  return {
    invoiceState,
    setInvoiceState,
    saveInvoice,
    updateInvoice,
    validationErrors,
    isSubmitting,
    fetchError,
  };
};

export default useInvoice;
