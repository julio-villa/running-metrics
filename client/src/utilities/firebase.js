import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { getDatabase, onValue, ref, set, get, update, push } from 'firebase/database';
import { useEffect, useState, useCallback } from "react";

const firebaseConfig = {
    apiKey: "apikeygoeshere",
    authDomain: "runningstatsdashboard.firebaseapp.com",
    databaseURL: "https://runningstatsdashboard-default-rtdb.firebaseio.com",
    projectId: "runningstatsdashboard",
    storageBucket: "runningstatsdashboard.appspot.com",
    messagingSenderId: "1065011097330",
    appId: "1:1065011097330:web:e075e9d41ef7c77ea6aa6b"
};

const firebase = initializeApp(firebaseConfig);
export const database = getDatabase(firebase);
export const auth = getAuth(firebase);


export const signInWithGoogle = async () => {
    let provider = new GoogleAuthProvider();
    provider.setCustomParameters({
        prompt: "select_account"
    });

    try {
        const res = await signInWithPopup(getAuth(firebase), provider);
        const user = res.user;

        // Add user to database
        const db = getDatabase();
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);

        if (!snapshot.exists()) {
            const userRef = ref(db, `users/${user.uid}`);
            await set(userRef, {
                name: user.displayName,
                runs: [null] 
            });
            console.log(`User ${user.uid} added to database.`);
        } else {
            console.log(`User ${user.uid} already exists in the database.`);
        }

        console.log('User processed in database');
        return res; 
    } catch (error) {
        console.error("Error signing in with Google or processing user in database:", error);
        throw error; 
    }
};

export const firebaseSignOut = () => signOut(getAuth(firebase));


export const useAuthState = () => {
    const [user, setUser] = useState();

    useEffect(() => (
        onAuthStateChanged(getAuth(firebase), setUser)
    ), []);

    return [user];
};

// Fetching data without API (this is NOT used anymore!)
export const useDbData = (path) => {
    const [data, setData] = useState();
    const [error, setError] = useState(null);

    useEffect(() => (
        onValue(ref(database, path), (snapshot) => {
            setData(snapshot.val());
        }, (error) => {
            setError(error);
        })
    ), [path]);

    return [data, error];
};

// Updating the database without API (this is NOT used anymore!)
export const useDbUpdate = (path) => {
    const [result, setResult] = useState();

    const makeResult = (error = null) => ({
        success: !error,
        error: error ? error.message : null,
    });

    const updateData = useCallback(async (value) => {
        const dbRef = ref(getDatabase(), path);

        try {
            const snapshot = await get(dbRef);
            if (snapshot.exists()) {
                let userData = snapshot.val();

                // Initialize 'runs' as an array
                if (!Array.isArray(userData.runs)) {
                    userData.runs = [];
                }

                userData.runs.push(value);

                // Update the user data with the new 'runs' array
                await update(dbRef, { runs: userData.runs });
                setResult(makeResult());
            } else {
                // Handle case where the snapshot does not exist
                setResult(makeResult(new Error("No user data found at the provided path.")));
            }
        } catch (error) {
            setResult(makeResult(error));
        }
    }, [path]);

    return [updateData, result];
};

export default firebase;