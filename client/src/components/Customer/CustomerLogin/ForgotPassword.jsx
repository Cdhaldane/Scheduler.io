import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import "./ForgotPassword.css";

// TODO: if the forget password page is used anywhere else it needs logic to determine if a booking is being made or not during the process
// TODO: button isn't centered. It's off to the right a bit and I have no idea why
// TODO: I really really really really really want the forgot password state to be able to return to the booking page with the email and phone number but it doesn't. for now I think I'll just boot to the home page.
const ForgotPassword = () => {
    //const location = useLocation();
    const navigate = useNavigate();
    //const { email: initialEmail, phoneNumber } = location.state || {}; PART OF THE TODO WITH STATES
    //const [email, setEmail] = useState(initialEmail || ''); PART OF THE TODO WITH STATES
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [isCodeVerified, setIsCodeVerified] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordReset, setIsPasswordReset] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // send 6 digit code to email given (regardless if it exists or not)
        // open a new textbox asking for the code and requested new password
        setIsCodeVerified(true);
    };

    const handleCodeVerification = () => {
        // send the code to backend to verify
        setIsCodeVerified(true);
    };

    const handlePasswordReset = () => {
        // send the new password to backend to reset
        setIsPasswordReset(true);
    };

    const handlePasswordResetRedirect = () => {
        // send the new password to backend to reset
        //navigate("/customer-bookingPage", {state: {email, phoneNumber}}); PART OF THE TODO WITH STATES
    };
    
    const handleModalOpen = () => {
        setIsModalOpen(true);
    };

    return (
        <div className="login-container">
            <h2>Forgot Password</h2>
            {!isCodeVerified && (
                <form onSubmit={handleSubmit}>
                    <h3>Please enter the email used for your account below.</h3>
                    <input 
                        className='input'
                        type="email" 
                        name="email" 
                        placeholder="Enter the email used for your account" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button className="button">Reset Password</button>
                </form>
            )}
            {isCodeVerified && !isPasswordReset && (
                <form onSubmit={handlePasswordReset}>
                    <h3>A verification code has been sent to your email. Please enter it below.</h3>
                    <label htmlFor="code">Verification Code:</label>
                    <input 
                        className='input'
                        type="text" 
                        id="code" 
                        name="code" 
                        placeholder="Enter the verification code" 
                        value={code} 
                        onChange={(e) => setCode(e.target.value)} 
                    />
                    <button className="button" onClick={handleModalOpen}>Reset Password</button>
                </form>
            )}
            {isPasswordReset && (
                <div>
                    <p>Password reset successful!</p>
                </div>
            )}
            
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Change Password</h3>
                        <input 
                            className='input'
                            type="password" 
                            id="newPassword" 
                            name="newPassword" 
                            placeholder="Enter your new password" 
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)} 
                        />
                        <input 
                            className='input'
                            type="password" 
                            id="confirmPassword" 
                            name="confirmPassword" 
                            placeholder="Confirm your password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                        />
                        
                        <button className="button" onClick={() => navigate("/")} >Reset Password</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ForgotPassword;