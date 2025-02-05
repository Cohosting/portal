import { foundOn } from "../../../utils/constant";
import PortalURLInput from "../../../components/PortalURLInput";
import { useSelector, useDispatch } from "react-redux";
import { setPersonalInfoStep, setStep } from "../../../store/slices/authSlice";
import InputField from "../../../components/InputField";
import Header from "../../../components/Header";
import Select from "../../../components/Select";
import { useEffect, useState } from "react";

const PersonalInfoStep = ({ isLargerThan450 }) => {
  const dispatch = useDispatch();
  const { personalInfoStep, portalURLValidation, step } = useSelector((state) => state.auth);
  const [stopGoForward, setStopGoForward] = useState(false);

  const handleChange = (e) => {
    const { value, name } = e.target;
    dispatch(setPersonalInfoStep({
      ...personalInfoStep,
      [name]: value,
    }));
  };

  const isFormValid = () => {
    return (
      personalInfoStep.name.trim() !== '' &&
      personalInfoStep.company_name.trim() !== '' &&
      personalInfoStep.portal_url.trim() !== '' &&
      portalURLValidation.isAvailable &&
      !portalURLValidation.isChecking
    );
  };

  useEffect(() => {
    if (!portalURLValidation.isChecking && portalURLValidation.isAvailable) {
      setStopGoForward(false);
    }
  }, [personalInfoStep]);

  return (
    <div className="flex min-w-full items-center flex-col justify-center">
      <Header title="Finish creating your account"
        subTitle="First things first, tell us a bit about yourself"
      />
      <div className="flex flex-col gap-y-5 mt-5">
        <InputField
          name={'name'}
          value={personalInfoStep.name}
          type="text"
          errorMessage={'Full name'}
          handleChange={handleChange}
          label={'Full name'}
        />
        <div>
          <Select
            list={foundOn}
            selected={personalInfoStep.found_on}
            setSelected={(value) => dispatch(setPersonalInfoStep({
              ...personalInfoStep,
              found_on: value
            }))}
          />
        </div>

        <InputField
          name={'company_name'}
          value={personalInfoStep.company_name}
          type="text"
          errorMessage={'Company Name'}
          handleChange={handleChange}
          label={'Company Name'}
        />

        <PortalURLInput
          value={personalInfoStep.portal_url}
          setStopGoForward={setStopGoForward}
          handleChange={(url,) => {
            dispatch(
              setPersonalInfoStep({
                ...personalInfoStep,
                portal_url: url,
                portalURLValidation: {
                  ...portalURLValidation,
                  isChecking: true,
                  isAvailable: false,
                }
              }))
          }}
        />

        <button
          onClick={() => {
            if (stopGoForward && isFormValid()) {
              dispatch(setStep(step + 1));
            }
          }}
          className={`mt-3 btn-indigo ${!stopGoForward || !isFormValid() ? 'bg-gray-400 cursor-not-allowed hover:bg-gray-400' : ''}`}
          disabled={!isFormValid()}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default PersonalInfoStep;
