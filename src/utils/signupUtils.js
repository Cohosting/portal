import { defaultAppList } from './constant';
import { supabase } from '../lib/supabase';
import { getCurrentTimestamp } from './dateUtils';

// Standardizing date handling

// Extracting seat creation into its own function
const createSeats = async (portalId, user) => {
  const seats = [];
  for (let i = 0; i < 5; i++) {
    seats.push({
      portal_id: portalId,
      status: i === 0 ? 'occupied' : 'available',
      user_id: i === 0 ? user.id : null,
      seat_type: 'free',
    });
  }
  const { error } = await supabase.from('seats').insert(seats);
  if (error) throw error;
};

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
    trial_start_date: trialStartDate,
    trial_end_date: trialEndDate,
    is_subscribed: false,
    is_expiry_count: true,
  };
};

export const prepareTeamMemberData = (portalId, personalInfoStep, user) => {
  let [first_name, last_name] = personalInfoStep.name.split(' ');
  first_name = first_name !== undefined ? first_name : '';
  last_name = last_name !== undefined ? last_name : '';

  return {
    portal_id: portalId,
    first_name: first_name,
    last_name: last_name,
    email: user.email,
    uid: user.id,
    status: 'active',
    role: 'owner',
    created_at: getCurrentTimestamp(),
  };
};

export const initializeOrganizationSetup = async (
  user,
  personalInfoStep,
  businessDetailsStep,
  createCustomer
) => {
  console.log('Initializing organization setup', {
    user,
    personalInfoStep,
    businessDetailsStep,
  });
  try {
    validateInput(user, personalInfoStep, businessDetailsStep);
    console.log('Input validated successfully');

    const portalData = preparePortalData(
      user,
      personalInfoStep,
      businessDetailsStep
    );

    console.log('Inserting portal data', portalData);
    const { data: portal, error: portalError } = await supabase
      .from('portals')
      .insert([portalData])
      .select()
      .single();
    if (portalError) throw portalError;
    console.log('Portal data inserted successfully', portal);

    const memberData = prepareTeamMemberData(portal.id, personalInfoStep, user);
    console.log('Inserting team member data', memberData);
    const { error: memberError } = await supabase
      .from('team_members')
      .insert([memberData]);
    if (memberError) throw memberError;
    console.log('Team member data inserted successfully');

    console.log('Inserting default app list', defaultAppList);
    const { error: portalAppError } = await supabase.from('portal_apps').insert(
      defaultAppList.map(app => ({
        ...app,
        portal_id: portal.id,
      }))
    );
    if (portalAppError) throw portalAppError;
    console.log('Default app list inserted successfully');

    console.log('Updating user portals', {
      user_id: user.id,
      portal_id: portal.id,
      first_name: memberData.first_name,
      last_name: memberData.last_name,
    });
    const { error: userError } = await supabase.rpc('update_user_portals', {
      user_id: user.id,
      portal_id: portal.id,
      first_name: memberData.first_name,
      last_name: memberData.last_name,
    });
    if (userError) throw userError;
    console.log('User portals updated successfully');

    console.log('Creating seats for portal', portal.id);
    await createSeats(portal.id, user);
    console.log('Seats created successfully');

    console.log('Creating customer', portalData, memberData, portal.id);
    await createCustomer(portalData, memberData, portal.id);
    console.log('Organization setup successful');
  } catch (error) {
    console.error('Error persisting data:', error);
    throw error;
  }
};
