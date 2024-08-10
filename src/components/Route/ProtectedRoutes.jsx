import { Flex, Spinner } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useDomainInfo } from "../../hooks/useDomainInfo";

export const ProtectedRoutes = ({ children }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth)

  if (isAuthenticated === null) return (
    <Flex alignItems={'center'} justifyContent={'center'} >
      <Spinner m={4} />;
    </Flex>
  )

  if (user === null && isAuthenticated === false) {
    console.log('hey user not available')
    window.location.href = window.location.origin + '/login' 
  };
  return children
}