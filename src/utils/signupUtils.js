import { supabase } from '../lib/supabase';
import { getOrCreateUser } from '../lib/auth';
import { brandPresets, createBrandSettings } from './brandSettingsHelper';
// Standardizing date handling

const validateInput = (user, personalInfoStep, businessDetailsStep) => {
  if (!user || !user.id) throw new Error('Invalid user data');
  if (!personalInfoStep.name)
    throw new Error('Personal info must include a name');
  if (!personalInfoStep.portal_url)
    throw new Error('Personal info must include a portal URL');
  if (!businessDetailsStep) throw new Error('Business details are required');
};

export const preparePortalData = (
  user,
  personalInfoStep,
  businessDetailsStep
) => {
  const trialStartDate = new Date();
  const trialEndDate = new Date(trialStartDate);
  trialEndDate.setDate(trialStartDate.getDate() + 7);
  return {
    subscription_type: 'freemium',
    portal_url: personalInfoStep.portalURL,
    created_by: user.id,
    settings: {
      ach_debit: true,
      card: false,
      auto_import: false,
    },
  };
};

export const prepareTeamMemberData = (portalId, user) => {
  return {
    portal_id: portalId,
    email: user.email,
    uid: user.id,
    status: 'active',
    role: 'owner',
  };
};

export const initializeOrganizationSetup = async (
  user,
  personalInfoStep,
  businessDetailsStep,
  createCustomer
) => {
  try {
    if (!navigator.onLine) {
      throw new Error("You appear to be offline. Please connect to the internet to continue.");
    }

    validateInput(user, personalInfoStep, businessDetailsStep);

    const { data: portalData, error: portalError } = await supabase
      .from('portals')
      .select('*')
      .eq('created_by', user.id)
      .single();

    if (portalError || !portalData) {
      throw new Error("Failed to load portal data. Please check your connection.");
    }

    const customer_id = await createCustomer(
      portalData,
      { uid: user.id, email: user.email },
      portalData.id
    );

    const { data: updatedPortal, error: updateError } = await supabase
    .from('portals')
    .update({
      portal_url: personalInfoStep.portal_url,
      brand_settings: createBrandSettings({
        brandName: personalInfoStep.company_name,
      
      }),
      customer_id
    })
    .eq('id', portalData.id)
    .select('*');
    if (updateError || !updatedPortal) {
      throw new Error("Failed to update portal data.");
    }

    await supabase
      .from('users')
      .update({
        name: personalInfoStep.name,
        is_profile_completed: true,
        additional_data: {
          ...businessDetailsStep,
          ...personalInfoStep,
        },
      })
      .eq('id', user.id);
  } catch (error) {
    console.error('Error during organization setup:', error);
    throw error;
  }
};

export const initializeUser = async user => {
  return await getOrCreateUser(user, {
    is_profile_completed: false,
    portals: [],
    email: user.email,
    id: user.id,
  });
};

export const signUpUserWithPortalAndSeat = async supabaseUser => {
  let dataObject = {
    user_id: supabaseUser.id,
    user_email: supabaseUser.email,
  };

  const { data, error } = await supabase.rpc(
    'sign_up_user_with_portal_and_seat',
    dataObject
  );

  if (error) {
    console.error('Error signing up user with portal and seat:', error);
    throw error;
  }
  return data;
};
