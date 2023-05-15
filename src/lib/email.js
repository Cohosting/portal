import { addDoc, collection } from 'firebase/firestore';
import { db } from './firebase';

export const addMail = async (email, name, message) => {
  const colRef = collection(db, 'mail');
  await addDoc(colRef, {
    to: email,
    message: {
      subject: `Hello ${name}`,
      html: `
      <div>
      ${message}
      </div>
      `,
    },
  });
};
