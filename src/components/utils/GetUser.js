import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function useAuth() {
    const [authUser, setAuthUser] = useState(null);
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            if (user) {
                console.log("User is authenticated:", user.uid); // Check the console to see this output
                setAuthUser(user);
            } else {
                console.log("No user is authenticated.");
                setAuthUser(null);
            }
        });

        return () => unsubscribe(); // Cleanup subscription
    }, [auth]);

    return authUser;
}

export default useAuth;
