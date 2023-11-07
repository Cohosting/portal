import { addDoc, collection } from 'firebase/firestore';
import { db } from './firebase';

export const addMail = async (
  email,
  name,
  subject,
  message,
  teamName,
  html
) => {
  const colRef = collection(db, 'mail');
  await addDoc(colRef, {
    to: email,
    message: {
      subject: subject ? subject : `Hello ${name}`,
      text: `You have been invited to join ${teamName} team`,
      html: html
        ? html
        : `
      <div>
       ${message ? message : ''}
      </div>
      `,
    },
  });
};

export const sentTeamInviteEmail = async (email, name, teamName, token) => {
  const colRef = collection(db, 'mail');
  console.log(`http://dashboard.localhost:3000/accept-team?token=${token}`);
  await addDoc(colRef, {
    to: email,
    message: {
      subject: `Hello ${name}`,
      text: `You have been invited to join ${teamName} team`,
      html: `
      <div>
        <p>You have been invited to join ${teamName} team</p>
        <p>Click Here</p>
        <p>http://dashboard.localhost:3000/accept-team?token=${token}</p>
      </div>
      `,
    },
  });
};
