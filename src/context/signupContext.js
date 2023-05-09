import { createContext, useState } from 'react';

const AuthProvider = createContext({
  userCredentials: {},
  step: 1,

  setSteo: () => {},
  setUserCredentials: () => {},
});

export const SignupContext = ({ children }) => {
  const [step, setStep] = useState(1);

  const [userCredentials, setUserCredentials] = useState({
    name: '',
    email: '',
    password: '',
    foundOn: '',
    companyName: '',
    portalURL: '',
    industry: '',
    companySize: '',
    clients: '',
    typeOfService: '',
  });

  const contextValue = {
    userCredentials,
    step,
    setUserCredentials,
    setStep,
  };


  

  return (
    <AuthProvider.Provider value={contextValue}>
      {children}
    </AuthProvider.Provider>
  );
};

export default AuthProvider;
