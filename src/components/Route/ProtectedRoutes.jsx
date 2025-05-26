import { useSelector } from "react-redux";
import SkeletonLoading from "../SkeletonLoading";

export const ProtectedRoutes = ({ children }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
 
  // Get current hostname to determine user type
  const hostname = window.location.hostname;
  
  // Check if it's a dashboard user (dashboard.huehq.com or dashboard.localhost:3000)
  const isDashboardUser = hostname === 'dashboard.huehq.com' || hostname === 'dashboard.localhost:3000';
  
  // For portal users (anyother.huehq.com, anyother.localhost:3000, or custom domains)
  const isPortalUser = !isDashboardUser;

  // Handle loading state
  if (isAuthenticated === null) {
    // For dashboard users, show skeleton loading while checking authentication
    if (isDashboardUser) {
      return <SkeletonLoading />;
    }
    // For portal users, you might want to show a different loading state or redirect immediately
    return <SkeletonLoading />;
  }

  // Handle unauthenticated state
  if (isAuthenticated === false) {
    if (isPortalUser) {
      // For portal users, redirect to login immediately
      console.log('Portal user not authenticated, redirecting to login');
      window.location.href = window.location.origin + '/login';
      return null; // Return null while redirecting
    }
    
    if (isDashboardUser && user === null) {
      // For dashboard users, also redirect if no user data
      console.log('Dashboard user not available, redirecting to login');
      window.location.href = window.location.origin + '/login';
      return null;
    }
  }

  // Handle authenticated dashboard users
  if (isDashboardUser && isAuthenticated === true) {
    // Wait for user data to be available before rendering children
    if (user === null) {
      return <SkeletonLoading />;
    }
  }

  // If we reach here, user is authenticated and (if dashboard user) user data is available
  return children;
};