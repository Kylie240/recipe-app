import axios from "axios";
import { useState } from "react"
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export const Auth = () => {
    return (
        <div className="flex flex-col justify-center mt-12 md:mt-0 items-center h-screen">
            <h1 className="w-3/4 uppercase text-center text-blue-950 font-bold text-4xl mt-20">Start saving and creating recipes!</h1>
            <div className="mt-12 grid md:grid-cols-2 gap-8 mx-20">
                <Login />
                <Register />
            </div>
        </div>
    )
}

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const [_, setCookies] = useCookies(['access_token']);

    const nav = useNavigate();

    const loginUser = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post("http://localhost:3000/login", {email, password});
            if (res.data.message === "Error logging in") {
                return alert(res.data.message)
            }
            if (res.data.message === "Username or password is incorrect") {
                return alert(res.data.message)
            }
            if (!res.data.message) {
                setCookies("access_token", res.data.token)
                window.localStorage.setItem("userID", res.data.userID)
                console.log(res.data);
                window.localStorage.setItem("username", res.data.username)
                nav("/") 
                window.scrollTo(0,0)
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="">
            <form onSubmit={loginUser}>
                <h2 className="text-lg">Login</h2>
                <div>
                    <input 
                        type="email" 
                        id="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password" 
                        id="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button  className="rounded-lg" type="submit">Login</button>
            </form>
        </div>
    )
}
const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const registerUser = async (e) => {
        e.preventDefault()
        try{ 
            const res = await axios.post("http://localhost:3000/register", {username, email, password});
            if (res.data.message !== "User already exists") {
                alert('Registration complete! You can now login.')
            } else {
                alert('User already exists. Please try a different username.')
            }
            setUsername("");
            setEmail("");
            setPassword("");
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="">
            <form onSubmit={registerUser}>
                <h2 className="text-lg">Register</h2>
                <div>
                    <input 
                        type="text" 
                        id="username"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input 
                        type="email" 
                        id="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input 
                        type="password" 
                        id="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button className="rounded-lg" type="submit">Register</button>
            </form>
        </div>
    )
}