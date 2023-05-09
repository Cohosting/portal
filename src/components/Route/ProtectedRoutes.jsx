import { Flex, Spinner } from "@chakra-ui/react";
import {  useContext } from "react";
import { AuthContext } from "../../context/authContext";

export const ProtectedRoutes = ({ children }) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  console.log( {user, isAuthenticated})
  if (isAuthenticated === null) return (
    <Flex alignItems={'center'} justifyContent={'center'} >
      <Spinner m={4} />;
    </Flex>
  )

  if (user === null && !isAuthenticated) {
    window.location.href = window.location.origin + '/' + 'login'
  };
  return children
}