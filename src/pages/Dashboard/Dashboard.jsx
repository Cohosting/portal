import React from 'react'
import { Layout } from './Layout'
import { TrialStatus } from '../../components/TrialStatus';
import { useSelector } from 'react-redux';

export const Dashboard = () => {  
  const { user } = useSelector(state => state.auth)
  return (
    <Layout user={user}>
      <TrialStatus />
    </Layout>
  );
}
