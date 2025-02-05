import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clients, industries, sizes, types } from "../../../utils/constant";
import { useNavigate } from 'react-router-dom';
import { setBusinessDetailsStep } from "../../../store/slices/authSlice";
import { initializeOrganizationSetup } from "../../../utils/signupUtils";
import useCustomerOnDemand from "../../../hooks/useCustomerOnDemand";
import Header from "../../../components/Header";
import Select from "../../../components/Select";
import { useQueryClient } from "react-query";

const BusinessDetailsStep = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { personalInfoStep, businessDetailsStep, user, currentSelectedPortal } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const queryClient = useQueryClient()
  const createCustomer = useCustomerOnDemand()

  const setupOrganizationAndNavigate = async () => {
    console.log({
      user,
      personalInfoStep,
      businessDetailsStep,
    })
    try {
      setIsLoading(true);
      await initializeOrganizationSetup(user, personalInfoStep, businessDetailsStep, createCustomer);
      window.location.href = '/';
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-w-full items-center flex-col justify-center">
      <Header title="Finish creating your account"
        subTitle="First things first, tell us a bit about your business"
      />

      <div className="w-full flex flex-col gap-y-5 mt-5">
        <Select
          label={'Which industry are you in?'}
          list={industries}
          selected={businessDetailsStep.industry}
          setSelected={(value) => dispatch(setBusinessDetailsStep({
            ...businessDetailsStep,
            industry: value
          }))
          }
        />

        <Select
          label={'How large is your company?'}
          list={sizes}
          selected={businessDetailsStep.company_size}
          setSelected={(value) => dispatch(setBusinessDetailsStep({
            ...businessDetailsStep,
            company_size: value
          }))
          }
        />

        <Select
          label={'How many clients do you have?'}
          list={clients}
          selected={businessDetailsStep.clients}
          setSelected={(value) => dispatch(setBusinessDetailsStep({
            ...businessDetailsStep,
            clients: value
          }))
          }
        />

        <Select
          label={'Do you serve companies, individuals, or a mix of both?'}
          list={types}
          selected={businessDetailsStep.type_of_service}
          setSelected={(value) => dispatch(setBusinessDetailsStep({
            ...businessDetailsStep,
            type_of_service: value
          }))
          }
        />
        {error && <p className="text-red-500">{error}</p>}

        <button onClick={setupOrganizationAndNavigate} className={`mt-3 btn-indigo ${Object.values(businessDetailsStep).includes('') ? 'bg-gray-400 cursor-not-allowed hover:bg-gray-400' : ''} `}>{
          isLoading ? 'Loading...' : 'Continue'
        }</button>
      </div>
    </div>
  );
};

export default BusinessDetailsStep;
