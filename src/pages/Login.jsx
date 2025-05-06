import { useState } from "react";
import axios from "axios";
import { Bounce, toast } from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { login, logout } from "../redux/reducers/auth.reducer";

const API_URL = import.meta.env.VITE_API_URL;
const Login = ({ handleAgoraLogin }) => {

    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isOtpSendLoading, setIsOtpSendLoading] = useState(false);
    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isValidPhone = (phone) => {
        return /^\+91[6-9][0-9]{9}$/.test(phone);
    };

    const isValidOtp = (phone) => {
        return /^\d{6}$/.test(phone);
    };

    const onSendOTP = async () => {
        try {

            if (!phoneNumber) {
                return toast.info("Please enter phone number first", {
                    position: "bottom-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                });
            }

            if (!isValidPhone(phoneNumber)) {
                return toast.warn("Please enter a valid phone number", {
                    position: "bottom-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                });
            }

            setIsOtpSendLoading(true);
            await axios.post(`${API_URL}/user/otp`, { phone: phoneNumber })
            setIsOtpSent(true)

            toast.success("OTP Sent Successfully", {
                position: "bottom-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        }
        catch (error) {
            toast.error(error.message, {
                position: "bottom-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
            console.log(error, "error from send otp");
        }
        finally {
            setIsOtpSendLoading(false);
        }
    }

    const onLogin = async () => {
        try {

            if (!otp) {
                return toast.info("Please enter otp", {
                    position: "bottom-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                });
            }

            if (!isValidOtp(otp)) {
                return toast.warn("Invailid OTP", {
                    position: "bottom-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                });
            }

            setIsLoginLoading(true)

            const { data } = await axios.post(`${API_URL}/user/login`, { phone: phoneNumber, otp: otp })

            Cookies.set("agora_access_token", data.agora_access_token);
            Cookies.set("auth_token", data.authToken, { expires: 1 });
            Cookies.set("username", data.username, { expires: 1 });

            const isLoginSuccess = await handleAgoraLogin(data.username, data.agora_access_token)

            if (isLoginSuccess) {
                dispatch(login())
                toast.success("Login Successfully", {
                    position: "bottom-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                });

                return navigate("/profile");
            } else {
                dispatch(logout())
                toast.error("login failed, try again later", {
                    position: "bottom-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                });
            }
        }
        catch (error) {
            toast.error(error.message, {
                position: "bottom-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
            console.log(error, "error from login");
        }
        finally {
            setIsLoginLoading(false);
        }

    }

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
    )
}

export default Login;


// {/* <>
// <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
//     <div className="sm:mx-auto sm:w-full sm:max-w-sm">
//         {/* <img
//             alt="Your Company"
//             src="https://s3.ap-south-1.amazonaws.com/appsinvo.website/header/logo.webp"
//             className="mx-auto h-10 w-auto"
//         /> */}
//         <h2 className="mt-4 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
//             Login in to your account
//         </h2>
//     </div>

//     <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
//         <form action="#" method="POST" className="space-y-6">
//             <div>
//                 <div className="flex items-center justify-between">
//                     <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
//                         Email
//                     </label>
//                 </div>
//                 <div className="mt-2">
//                     <input
//                         id="email"
//                         name="email"
//                         type="email"
//                         required
//                         className="block w-full rounded-md bg-white px-3 py-1.5
//                         text-base text-gray-900 outline-2 -outline-offset-2
//                       outline-double outline-indigo-600 placeholder:text-gray-400 focus:outline-2
//                           focus:-outline-offset-2 focus:border-indigo-600 sm:text-sm/6"
//                     />
//                 </div>
//             </div>

//             <div>
//                 <div className="flex items-center justify-between">
//                     <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
//                         Password
//                     </label>
//                 </div>
//                 <div className="mt-2">
//                     <input
//                         id="password"
//                         name="password"
//                         type="password"
//                         required
//                         autoComplete="current-password"
//                         className="block w-full rounded-md bg-white px-3 py-1.5
//                         text-base text-gray-900 outline-2 -outline-offset-2
//                       outline-double outline-indigo-600 placeholder:text-gray-400 focus:outline-2
//                           focus:-outline-offset-2 focus:border-indigo-600 sm:text-sm/6"
//                     />
//                 </div>
//             </div>

//             <div>
//                 <button
//                     type="submit"
//                     className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//                 >
//                     Login
//                 </button>
//             </div>
//         </form>

//         {/* <p className="mt-10 text-center text-sm/6 text-gray-500">
//             Not a member?{' '}
//             <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
//                 Start a 14 day free trial
//             </a>
//         </p> */}
//     </div>
// </div>
// </> */}