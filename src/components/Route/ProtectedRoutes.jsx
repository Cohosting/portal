import { useSelector } from "react-redux";
import { useDomainInfo } from "../../hooks/useDomainInfo";

export const ProtectedRoutes = ({ children }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth)

  if (isAuthenticated === null) return (
    <div className="flex items-center justify-center">
      <div className="m-4 animate-spin border-4 border-t-transparent border-blue-500 rounded-full w-8 h-8"></div>
    </div>
  )

  if (user === null && isAuthenticated === false) {
    console.log('hey user not available')
    window.location.href = window.location.origin + '/login' 
  };
  return children
}