import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bounce, toast } from 'react-toastify';

const Register = () => {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [profile, setProfile] = useState("");
    const [isSubmited, setIsSubmitted] = useState(false)
    const [otp, setOtp] = useState('');

    const navigate = useNavigate();

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    const isValidPhone = (phone) => {
        return /^\+91[6-9][0-9]{9}$/.test(phone);
    };

    const isValidOtp = (code) => {
        return /^\d{6}$/.test(code);
    };

    const onRegister = async (e) => {
        try {
            e.preventDefault();
            const payload = {
                name,
                username,
                phoneNumber: phone,
                email,
                password,
                avatar_url: profile
            };

            if (!name) {
                return toast.info("Full name is required", {
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

            if (!username) {
                return toast.info("Username is required", {
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

            if (!email) {
                return toast.info("Email is required", {
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

            if (!isValidEmail(email)) {
                return toast.info("Enter Vailid Email", {
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

            if (!phone) {
                return toast.info("Phone Number is required", {
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

            if (!isValidPhone(phone)) {
                return toast.info("Enter Vailid phone number", {
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

            if (!password) {
                return toast.warn("Password is required.", {
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

            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}/user/register`,
                payload
            )

            // Sets all user attributes
            // const options = {
            //     nickname: name,
            //     avatarurl: profile || "https://img.freepik.com/premium-vector/male-face-avatar-icon-set-flat-design-social-media-profiles_1281173-3806.jpg?semt=ais_hybrid&w=740",
            //     mail: email,
            //     phone: phone
            // };

            // chatClient.updateUserInfo(options).then((res) => {
            //     console.log(res);
            // });


            await axios.post(`${import.meta.env.VITE_API_URL}/user/otp`, { phone: phone });

            // navigate("/");
            setIsSubmitted(true);

            return toast.success("Register Successfully and OTP Sent your phone number, Verify you number", {
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
            return toast.error(error.message, {
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

    //     try {
    //         setIsLoading(true);
    //         await axios.post(`${API_URL}/user/otp`, { phone: phone });
    //         setIsOtpSent(true);
    //         // toast.success('OTP Sent Successfully');
    //     } catch (error) {
    //         toast.error(error.response?.data?.message || error.message);
    //         console.error('Error sending OTP:', error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    const verifyOTP = async () => {

        if (!otp) {
            toast.info('Please Enter OTP');
            return;
        }

        if (!isValidOtp(otp)) {
            toast.info('Invalid OTP format');
            return;
        }

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/user/verify-otp`, { phone: phone, otp: otp });
            navigate("/")
            toast.success('Phone Number Verified Successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
            console.error('Error sending OTP:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {
                !isSubmited ? (
                    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-7 lg:px-8 bg-slate-50">
                        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                            <h2 className="mt-2 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                                Sign up to your account
                            </h2>
                        </div>

                        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
                            <form className="space-y-3" onSubmit={(e) => onRegister(e)}>
                                <div>
                                    <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">
                                        Full Name
                                    </label>
                                    <div className="mt-0">
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            className="block w-full rounded-sm bg-white px-3 py-1.5 
                                      text-base text-gray-900 outline outline-1 outline-gray-500
                                    placeholder:text-gray-400 sm:text-sm/6"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                                        Username
                                    </label>
                                    <div className="mt-0">
                                        <input
                                            id="username"
                                            name="username"
                                            type="text"
                                            className="block w-full rounded-sm bg-white px-3 py-1.5 
                                      text-base text-gray-900 outline outline-1 outline-gray-500
                                    placeholder:text-gray-400 sm:text-sm/6"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                                        Email Address
                                    </label>
                                    <div className="mt-0">
                                        <input
                                            id="email"
                                            name="email"
                                            type="text"
                                            className="block w-full rounded-sm bg-white px-3 py-1.5 
                                      text-base text-gray-900 outline outline-1 outline-gray-500
                                    placeholder:text-gray-400 sm:text-sm/6"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm/6 font-medium text-gray-900">
                                        Phone Number
                                    </label>
                                    <div className="mt-0">
                                        <input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            className="block w-full rounded-sm bg-white px-3 py-1.5 
                                      text-base text-gray-900 outline outline-1 outline-gray-500
                                    placeholder:text-gray-400 sm:text-sm/6"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                                        Password
                                    </label>
                                    <div className="mt-0">
                                        <input
                                            id="password"
                                            name="paswword"
                                            type="text"
                                            className="block w-full rounded-sm bg-white px-3 py-1.5
                                      text-base text-gray-900 outline outline-1 outline-gray-500
                                    placeholder:text-gray-400 sm:text-sm/6"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                                        Profile Photo
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            className="block w-full rounded-sm bg-white px-3 py-1 
                                      text-base text-gray-900 outline outline-1 outline-gray-500
                                    placeholder:text-gray-400 sm:text-sm/6"
                                            value={profile}
                                            onChange={(e) => setProfile(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        Sign up
                                    </button>
                                </div>
                            </form>

                            <p className="mt-5 text-center text-sm/6 text-gray-500">
                                Already have an acount?{' '}
                                <Link to="/" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                    Login
                                </Link>
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex min-h-screen flex-1 flex-col justify-center items-center px-6 py-7 lg:px-8 bg-slate-50">
                        <div className="flex items-center justify-between w-[450px]">
                            <label htmlFor="otp" className="block text-sm/6 font-medium text-gray-900">
                                Enter OTP
                            </label>
                        </div>
                        <div className="mt-2 w-[450px]">
                            <input
                                type="text"
                                placeholder="Enter the OTP"
                                className="
                                block w-full rounded-sm bg-white px-3 py-1.5 
                                text-base text-gray-900 outline-1 outline-gray-500
                                placeholder:text-gray-400 sm:text-sm/6
                                "
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        verifyOTP();
                                    }
                                }}
                            />
                            <div>
                                <button
                                    type="submit"
                                    className="mt-3 flex w-full justify-center rounded-md bg-indigo-600 px-6 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    onClick={verifyOTP}
                                >
                                    Verify
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default Register;

// import axios from "axios";
// import { useNavigate, Link } from "react-router-dom";
// import { Bounce, toast } from "react-toastify";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as Yup from "yup";
// import { useEffect } from "react";

// // Validation schema using Yup
// const validationSchema = Yup.object().shape({
//     name: Yup.string().required("Full name is required"),
//     username: Yup.string().required("Username is required"),
//     email: Yup.string().email("Enter a valid email").required("Email is required"),
//     phone: Yup.string()
//         .matches(/^\+91[6-9][0-9]{9}$/, "Enter a valid phone number")
//         .required("Phone number is required"),
//     password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
//     profile: Yup.string().url("Enter a valid URL"),
// });

// const Register = () => {
//     const navigate = useNavigate();
//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//         setValue,
//     } = useForm({
//         resolver: yupResolver(validationSchema),
//     });

//     useEffect(() => {
//         Object.keys(errors).forEach((fieldName) => {
//             setValue(fieldName, ""); // Clear input if it has error
//         });
//     }, [errors, setValue]);

//     const onSubmit = async (data) => {
//         try {

//             if (errors[field.name]) {
//                 toast.info("Registered successfully!", {
//                     position: "bottom-right",
//                     autoClose: 1000,
//                     transition: Bounce,
//                 });
//             }
//             await axios.post(`${import.meta.env.VITE_API_URL}/user/register`, {
//                 name: data.name,
//                 username: data.username,
//                 phoneNumber: data.phone,
//                 email: data.email,
//                 password: data.password,
//                 avatar_url: data.profile
//             });

//             toast.success("Registered successfully!", {
//                 position: "bottom-right",
//                 autoClose: 1000,
//                 transition: Bounce,
//             });
//             navigate("/");
//         } catch (error) {

//             console.log(error, "register");

//             toast.error(error.response?.data?.message || error.message, {
//                 position: "bottom-right",
//                 autoClose: 1000,
//                 transition: Bounce,
//             });
//         }
//     };

//     return (
//         <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-7 lg:px-8 bg-slate-50">
//             <div className="sm:mx-auto sm:w-full sm:max-w-sm">
//                 <h2 className="mt-2 text-center text-2xl font-bold tracking-tight text-gray-900">
//                     Sign up to your account
//                 </h2>
//             </div>

//             <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
//                 <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
//                     {[
//                         { name: "name", label: "Full Name", type: "text" },
//                         { name: "username", label: "Username", type: "text" },
//                         { name: "email", label: "Email Address", type: "text" },
//                         { name: "phone", label: "Phone Number", type: "text" },
//                         { name: "password", label: "Password", type: "password" },
//                         { name: "profile", label: "Profile Photo URL", type: "text" },
//                     ].map((field) => (
//                         <div key={field.name}>
//                             <label htmlFor={field.name} className="block text-sm font-medium text-gray-900">
//                                 {field.label}
//                             </label>
//                             <div className="mt-1">
//                                 <input
//                                     {...register(field.name)}
//                                     id={field.name}
//                                     type={field.type}
//                                     className={`block w-full rounded-sm bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1
//                     ${errors[field.name] ? 'outline-red-500' : 'outline-gray-500'}
//                     placeholder:text-gray-400 sm:text-sm`}
//                                     placeholder={errors[field.name]?.message || field.label}
//                                 />
//                             </div>
//                         </div>
//                     ))}


//                     <div>
//                         <button
//                             type="submit"
//                             className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none"
//                         >
//                             Sign up
//                         </button>
//                     </div>
//                 </form>

//                 <p className="mt-5 text-center text-sm text-gray-500">
//                     Already have an account?{" "}
//                     <Link to="/" className="font-semibold text-indigo-600 hover:text-indigo-500">
//                         Login
//                     </Link>
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default Register;