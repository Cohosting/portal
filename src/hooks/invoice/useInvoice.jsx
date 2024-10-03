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
};
// Utility function for deep comparison
function deepEqual(obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}
const useInvoice = (defaultValue = {}) => {
  const [invoiceState, setInvoiceState] = useState(defaultInvoiceState);
  const navigate = useNavigate();
  const { mode } = useParams(); // Assuming mode is part of the URL params
  const location = useLocation();
  const { user, currentSelectedPortal } = useSelector(state => state.auth);
  const { data: portal } = usePortalData(currentSelectedPortal);
  const [isClientError, setIsClientError] = useState(false);
  const prevDefaultValueRef = useRef();
  const isEditMode = mode === 'edit';

  useEffect(() => {
    const fetchInvoice = async () => {
      const id = queryString.parse(location.search).id;
      if (!id) return; // Exit if no ID is found

      setInvoiceState(prevState => ({ ...prevState, isLoading: true }));
      try {
        const invoices = await fetchInvoiceData(id)

        if (invoices) {
          setInvoiceState(prevState => ({
            ...prevState,
            ...invoices,
            isLoading: false,


          }));
        } else {
          console.error('No such document!');
          setInvoiceState(prevState => ({ ...prevState, isLoading: false }));
        }
      } catch (error) {
        console.error('Error fetching invoice:', error);
        setInvoiceState(prevState => ({ ...prevState, isLoading: false }));
      }
    };

    if (isEditMode) {
      fetchInvoice();
    }
  }, [isEditMode, location.search]);

  const saveInvoice = async (invoiceData) => {
    // Input validation
    if (!invoiceState.client) {
      return setIsClientError(true);
    };

    setInvoiceState(prevState => ({ ...prevState, isLoading: true }));

    try {
      // remove client object before persisting
      const { client, isLoading, ...rest } = invoiceState;

      await createInvoice(rest, portal);
      navigate('/billing'); // Adjust the path as necessary
    } catch (error) {
      console.error('Error saving invoice:', error);
    } finally {
      setInvoiceState(prevState => ({ ...prevState, isLoading: false }));
    }
  };

  const updateInvoice = async () => {
    const id = queryString.parse(location.search).id;
    if (!id) return; // Exit if no ID is found

    setInvoiceState(prevState => ({ ...prevState, isLoading: true }));
    try {
      const { client, isLoading, ...rest } = invoiceState;

      await updateClientInvoice(id, rest);
      navigate('/billing'); // Adjust the path as necessary
    } catch (error) {
      console.error('Error updating invoice:', error);
    } finally {
      setInvoiceState(prevState => ({ ...prevState, isLoading: false }));
    }
  };

  useEffect(() => {
    // Only update if defaultValue has actually changed
    if (!deepEqual(defaultValue, prevDefaultValueRef.current)) {
      setInvoiceState(prevState => ({ ...prevState, ...defaultValue }));
      prevDefaultValueRef.current = defaultValue; // Update the ref to the new value
    }
  }, [defaultValue]); // Dependency array


  useEffect(() => {
    if (!isClientError) return;

    setIsClientError(false);

  }
    , [invoiceState]);
  return {
    invoiceState,
    setInvoiceState,
    saveInvoice,
    updateInvoice,
    isClientError
  };
};

export default useInvoice;