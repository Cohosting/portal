import {
  writeBatch,
  doc,
  collection,
  arrayUnion,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { defaultAppList } from '.';

// Standardizing date handling
const getCurrentTimestamp = () => serverTimestamp();

// Extracting seat creation into its own function
const createSeats = (batch, portalRef, user) => {
  for (let i = 0; i < 5; i++) {
    const seatRef = doc(collection(db, 'seats'));
    batch.set(seatRef, {
      id: seatRef.id,
      portalId: portalRef.id,
      status: i === 0 ? 'occupied' : 'available',
      userId: i === 0 ? user.uid : null,
      createdAt: getCurrentTimestamp(),
      seatType: 'free',
    });
  }
};

const validateInput = (user, personalInfoStep, businessDetailsStep) => {
  if (!user || !user.uid) throw new Error('Invalid user data');
  if (!personalInfoStep.name)
    throw new Error('Personal info must include a name');
  if (!personalInfoStep.portalURL)
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
    subscriptionType: 'freemium',
    others: {
      ...personalInfoStep,
      ...businessDetailsStep,
    },
    portalURL: personalInfoStep.portalURL,
    createdBy: user.uid,
    settings: {
      achDebit: true,
      card: false,
      autoImport: false,
    },
    apps: defaultAppList,
    trialStartDate,
    trialEndDate,
    isSubscribed: false,
    isExpiryCount: true,
  };
};

export const prepareTeamMemberData = (portalRef, personalInfoStep, user) => {
  let [firstName, lastName] = personalInfoStep.name.split(' ');
  // Explicitly check for undefined and replace with an empty string
  firstName = firstName !== undefined ? firstName : '';
  lastName = lastName !== undefined ? lastName : '';

  return {
    portalId: portalRef.id,
    firstName: firstName,
    lastName: lastName,
    email: user.email,
    uid: user.uid,
    status: 'active',
    role: 'owner',
    createdAt: getCurrentTimestamp(),
  };
};
export const initializeOrganizationSetup = async (
  user,
  personalInfoStep,
  businessDetailsStep
) => {
  try {
    validateInput(user, personalInfoStep, businessDetailsStep); // Validate input data

    const batch = writeBatch(db);
    const userRef = doc(db, 'users', user.uid);
    const portalRef = doc(collection(db, 'portals'));
    const memberRef = doc(collection(db, 'teamMembers'));

    const portalData = preparePortalData(
      user,
      personalInfoStep,
      businessDetailsStep
    );
    const memberData = prepareTeamMemberData(portalRef, personalInfoStep, user);

    batch.set(portalRef, { ...portalData, id: portalRef.id });
    batch.set(memberRef, { ...memberData, id: memberRef.id });

    // User Document Update
    batch.update(userRef, {
      isProfileCompleted: true,
      portals: arrayUnion(portalRef.id),
      name: `${memberData.firstName} ${memberData.lastName}`,
    });

    createSeats(batch, portalRef, user); // Creating seats in a separate function

    await batch.commit();
  } catch (error) {
    console.error('Error persisting data:', error);
    throw error;
  }
};
