import { useContext, useState, createContext } from "react";


const Context = createContext(null);



export const SignupStepContext = ({ children }) => {
    const [personalInfoStep, setPersonalInfoStep] = useState({
        name: '',
        foundOn: 'Tiktok',
        companyName: '',
        portalURL: '',
    });
    const [businessDetailsStep, setBusinessDetailsStep] = useState({
        industry: 'Accounting and bookkeeping',
        companySize: 'Just me',
        clients: `I don't have any clients yet`,
        typeOfService: 'Companies',
    });

    const [portalURLValidation, setPortalURLValidation] = useState({
        isAvailable: false,
        isChecking: false,
    });
    const [step, setStep] = useState(1);

    return (
        <Context.Provider
            value={{ personalInfoStep, businessDetailsStep, setPersonalInfoStep, setBusinessDetailsStep, portalURLValidation, setPortalURLValidation, step, setStep }}
        >
            {children}
        </Context.Provider>
    )
};


const useSignupContext = () => {
    const context = useContext(Context);
    if (context === null) {
        throw new Error("useSignupContext must be used within a SignupStepProvider");
    }
    return context;
}

export default useSignupContext;