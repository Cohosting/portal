import React, { useContext } from 'react'
import { Layout } from './Layout'
import { AuthContext } from '../../context/authContext';
import { TrialStatus } from '../../components/TrialStatus';

export const Dashboard = () => {  
  const { user } = useContext(AuthContext);
  return (
    <Layout user={user}>
      <TrialStatus />
    </Layout>
  );
}
