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

    const navigate = useNavigate();

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    const isValidPhone = (phone) => {
        return /^\+91[6-9][0-9]{9}$/.test(phone);
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

            if (!name || !username || !phone || !email || !password || !profile) {
                return toast.warn("fill the all fields.", {
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
                return toast.warn("Enter Vailid Email", {
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
                return toast.warn("Enter Vailid phone number", {
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

            navigate("/");

            return toast.success("Register Successfully", {
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

    return (
        <>
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
                                    type="email"
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
                                    type="text"
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

                        {/* <div>
                            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                                Profile Photo
                            </label>
                            <div className="mt-2">
                                <input
                                    type="file"
                                    className="block w-full rounded-sm bg-white px-3 py-1 
                                      text-base text-gray-900 outline outline-1 outline-gray-500
                                    placeholder:text-gray-400 sm:text-sm/6"
                                    // value={profile}
                                    onChange={(e) => setProfile(e.target.files[0])}
                                />
                            </div>
                        </div> */}

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
        </>
    )
}

export default Register;