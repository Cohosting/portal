import React, { useContext } from 'react'
import { Layout } from './Layout'
import { AuthContext } from '../../context/authContext';

export const Dashboard = () => {  
  const { user } = useContext(AuthContext);
  return (
   <Layout user={user}>
      Dashboard
   </Layout>
  )
}
