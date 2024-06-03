import { db } from '../../firebase-config';
import { doc, getDoc } from 'firebase/firestore';

export const fetchUserProfile = async (userId) => {
    const userRef = doc(db, "users", userId);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
        return {
            firstName: docSnap.data().firstName,
            lastName: docSnap.data().lastName,
            imageUrl: docSnap.data().imageUrl || ''
        };
    } else {
        return null;
    }
};
