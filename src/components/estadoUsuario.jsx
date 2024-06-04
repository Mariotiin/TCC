import React, { createContext, useState, useEffect } from 'react';
import { auth, database } from '../services/firebaseConfig';
import { ref, onValue } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';

const UserContext = createContext({
    user: null,
    uid: null,
});

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [uid, setUid] = useState(null);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (userAuth) => {
            if (userAuth) {
                setUid(userAuth.uid);
                const userRef = ref(database, 'users/' + userAuth.uid);
                const unsubscribeDatabase = onValue(userRef, (snapshot) => {
                    const data = snapshot.val();
                    setUser(data);
                });

                return () => unsubscribeDatabase();
            } else {
                setUser(null);
                setUid(null);
            }
        });

        return () => unsubscribeAuth();
    }, []);

    return (
        <UserContext.Provider value={{ user, uid }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;