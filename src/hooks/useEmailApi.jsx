
import { useState } from 'react';
import axiosInstance from '../api/axiosConfig';

export const useSendEmail = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendEmail = async (to, subject, htmlContent) => {
    console.log({
      to,
      subject,
      htmlContent
    })
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post('/email/send', {
        to,
        subject,
        htmlContent
      });
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'An error occurred while sending the email');
      throw err;
    }
  };

  return { sendEmail, loading, error };
};

export const useEmailLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/email/logs');
      setLogs(response.data.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'An error occurred while fetching email logs');
    }
  };

  return { logs, fetchLogs, loading, error };
};