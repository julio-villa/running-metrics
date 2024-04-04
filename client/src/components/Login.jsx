import React, {useEffect} from 'react';
import { signInWithGoogle } from '../utilities/firebase';
import { useNavigate, Navigate } from "react-router-dom";
import { auth } from '../utilities/firebase';

function Login({user}) {
    let navigate = useNavigate();
    
    useEffect(() => {
      if (user) {
        navigate('/stats');
      }
    }, [user, navigate]);

    const handleGoogleLogin = async () => {
        try {
            await signInWithGoogle();
          } catch (error) {
            console.error(error);
          }
    }

    return (
        <div data-cy="login" className="login">
            <h2>Login with Google:</h2>
            <br></br>
            <button data-testid="login-button" id="button" className="btn btn-primary" onClick={handleGoogleLogin}>Login</button>
        </div>
    );
}

export default Login;
