import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { createInvoice, fetchInvoiceData, updateClientInvoice } from '../services/invoiceService';
import { useSelector } from 'react-redux';
import { usePortalData } from './react-query/usePortalData';



const defaultInvoiceState = {
  isLoading: false,
  line_items: [],
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
  const { user } = useSelector(state => state.auth);
  const { data: portal } = usePortalData(user?.portals);
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

  const updateInvoice = async (invoiceData) => {
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
  return {
    invoiceState,
    setInvoiceState,
    saveInvoice,
    updateInvoice,
  };
};

export default useInvoice;