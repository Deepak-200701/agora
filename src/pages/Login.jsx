import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useAgoraChat } from '../hooks/useAgoraChat';

const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { handleLogin } = useAgoraChat();

    const isValidPhone = (phone) => {
        return /^\+91[6-9][0-9]{9}$/.test(phone);
    };

    const isValidOtp = (code) => {
        return /^\d{6}$/.test(code);
    };

    const onSendOTP = async () => {
        if (!phoneNumber) {
            toast.info('Please enter phone number first');
            return;
        }

        if (!isValidPhone(phoneNumber)) {
            toast.warn('Please enter a valid phone number (+91XXXXXXXXXX)');
            return;
        }

        try {
            setIsLoading(true);
            await axios.post(`${API_URL}/user/otp`, { phone: phoneNumber });
            setIsOtpSent(true);
            toast.success('OTP Sent Successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
            console.error('Error sending OTP:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const onLogin = async () => {
        if (!otp) {
            toast.info('Please enter OTP');
            return;
        }

        if (!isValidOtp(otp)) {
            toast.warn('Invalid OTP format');
            return;
        }

        try {
            setIsLoading(true);
            const { data } = await axios.post(`${API_URL}/user/login`, {
                phone: phoneNumber,
                otp: otp,
            });

            // Store tokens in cookies
            Cookies.set('agora_access_token', data.agora_access_token);
            Cookies.set('auth_token', data.authToken, { expires: 1 });
            Cookies.set('username', data.username, { expires: 1 });

            // Connect to Agora chat
            const isLoginSuccess = await handleLogin(data.username, data.agora_access_token);

            if (isLoginSuccess) {
                toast.success('Login Successful');
                navigate('/chat');
            } else {
                Cookies.remove('agora_access_token');
                Cookies.remove('auth_token');
                Cookies.remove('username');
                toast.error('Login failed, please try again');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen flex flex-col justify-center items-center bg-slate-50">
            <h1 className="text-3xl mb-8 underline underline-offset-8 font-bold text-center">Agora Chat</h1>
            <div className="flex flex-col w-[40%] mx-auto">
                {
                    !isOtpSent ? (
                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="phone" className="block text-sm/6 font-medium text-gray-900">
                                    Phone Number
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    placeholder="Enter the Phone Number with country code Ex- +91XXXXXXXXXX"
                                    className="
            block w-full rounded-sm bg-white px-3 py-1.5 
            text-base text-gray-900 outline outline-1 outline-gray-500
            placeholder:text-gray-400 sm:text-sm/6 transition delay-150 duration-300 ease-in-out
            "
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            isOtpSent ? onLogin() : onSendOTP();
                                        }
                                    }}

                                />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="otp" className="block text-sm/6 font-medium text-gray-900">
                                    Enter OTP
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    placeholder="Enter the OTP"
                                    className="
        block w-full rounded-sm bg-white px-3 py-1.5 
        text-base text-gray-900 outline outline-1 outline-gray-500
        placeholder:text-gray-400 sm:text-sm/6
        "
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                            </div>
                        </div>
                    )
                }

                <div>
                    <button
                        type="submit"
                        className="mt-4 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={isOtpSent ? onLogin : onSendOTP}
                    >
                        {isOtpSent ? "Login" : "Send Otp"}
                    </button>
                </div>

                <p className="mt-5 text-center text-sm/6 text-gray-500">
                    Don't have an acount?{' '}
                    <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
