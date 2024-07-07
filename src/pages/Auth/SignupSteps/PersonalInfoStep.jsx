import { Box, Button, Divider, Flex, Text } from "@chakra-ui/react";
import CustomSelect from "../../../components/CustomSelect";
import { foundOn } from "../../../utils/constant";
import { CustomInput } from "../../../components/CustomInput";
import PortalURLInput from "../../../components/PortalURLInput";
import { useSelector, useDispatch } from "react-redux";
import { setPersonalInfoStep, setStep } from "../../../store/slices/authSlice";
import InputField from "../../../components/InputField";
import Header from "../../../components/Header";
import Select from "../../../components/Select";

const PersonalInfoStep = ({ isLargerThan450 }) => {
  const dispatch = useDispatch();
  const { personalInfoStep, portalURLValidation, step } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { value, name } = e.target;
    dispatch(setPersonalInfoStep({
      ...personalInfoStep,
      [name]: value,
    }));
  };

  return (
    <Flex
      minW={'100%'}
      alignItems={'center'}
      flexDirection={'column'}
      justify={'center'}
    >
      <Header title="Finish creating your account"
        subTitle="First things first, tell us a bit about yourself"

      />
      <div className=" flex flex-col gap-y-5 mt-5 ">
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
            }))
            }
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
          handleChange={(url) => dispatch(setPersonalInfoStep({
            ...personalInfoStep,
            portal_url: url
          }))}
        />

        <button onClick={() => {
            if (!Object.values(personalInfoStep).includes('')) {
              dispatch(setStep(step + 1)); // Assuming step 2 is the next step
            }
        }} className={` mt-3  btn-indigo ${Object.values(personalInfoStep).includes('') || !portalURLValidation.isAvailable ? 'bg-gray-400 cursor-not-allowed hover:bg-gray-400' : ''} `}>Continue</button>

      </div>
    </Flex>
  );
};

export default PersonalInfoStep;
