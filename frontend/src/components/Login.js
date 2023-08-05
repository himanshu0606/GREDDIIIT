import React from 'react';
import { useState } from 'react';
import { FaUser, FaSignInAlt, FaReddit } from "react-icons/fa";
import { AiTwotoneMail } from "react-icons/ai";
import { RiLockPasswordFill } from "react-icons/ri";
import "../style/Login.css";
import { Link } from 'react-router-dom';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import { Navigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
    const [emailExist, setEmail] = useState(0);
    const [usernameExist, setUsername] = useState(0);
    const [register,setregister]=useState(0);
    const [LoggedIn, setLogin] = useState(0); //to login after right credentials entered
    const [LoginData, setLoginData] = useState({
        email: "",
        password: "",
    })
    const [WrongCredantial, setCredantial] = useState(0); //wrong data entered
    const [wrongAge, setwrongAge] = useState(0);
    const [wrongContact, setwrongContact] = useState(0);

    const [RegisterData, setRegisterData] = useState({
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        age: "",
        contact: "",
        password: "",
    });

    const updateRegister = (event) => {
        setRegisterData({
            ...RegisterData,
            [event.target.name]: event.target.value,
        })
        setEmail(0);
        setUsername(0);
        setwrongAge(0);
        setwrongContact(0);
        setregister(0);
    }

    const updateData = (event) => {
        setCredantial(0);
        setregister(0);
        setLoginData({
            ...LoginData,
            [event.target.name]: event.target.value,
        });
    }
    //Submitting login data
    const LoginSubmit = async (event) => {
        event.preventDefault();

        const serverRes = await fetch("http://localhost:8000/user/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(LoginData),
        })
        const serverResJson = await serverRes.json();

        if (serverRes.status === 201) {
            localStorage.setItem("token", serverResJson.token)
            setLogin(1);
        }
        else if (serverRes.status === 400) {
            setregister(1);
        }
        else if(serverRes.status===401){
            setCredantial(1);
        }
    }

    const RegisterSubmit = async (event) => {
        event.preventDefault();
        let age = parseInt(RegisterData.age);
        if (isNaN(age) || age < 1 || age > 100) {
            setwrongAge(1);
            return;
        }
        let contact = RegisterData.contact;
        var phoneno = /^\d{10}$/;
        if (!contact.match(phoneno)) {
            setwrongContact(1);
            return;
        }
        const serverRes = await fetch("http://localhost:8000/user/register", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(RegisterData),
        })
        const serverResJson = await serverRes.json();
        if (serverRes.status === 400) {
            if (serverResJson.includes("email")) {
                setEmail(1);
            }
            else if (serverResJson.includes("username")) {
                setUsername(1);
            }
        }
        else if (serverRes.status === 201) {
            localStorage.setItem("token", serverResJson.token);
            setLogin(1);
        }
    }

    const google = async () => {
        window.open("http://localhost:8000/auth/google", "_self");
    }

    const CAS = async () => {
        window.open("http://localhost:8000/auth/cas", "_self");
    }

    if (!localStorage.getItem("token")) {
        if (LoggedIn === 0) {
            return (
                <>
                    <div className='container-fluid loginBody'>
                        <div className='headerLogin'>
                            <FaReddit style={{ color: "red", margin: "20px", float: "left" }} size={80} />
                            <h1>
                                <b><span style={{ color: "red", fontSize: "60px" }}>Gred</span><span style={{ fontSize: "60px" }}>IIT</span></b>
                            </h1>
                        </div>
                        <div className='wrapperLogin'>
                            <h1 id="LoginId">
                                <FaSignInAlt style={{ margin: "10px" }} /><b>Login</b>
                            </h1>
                            <form onSubmit={LoginSubmit}>
                                <div className='inputLoginbox'>
                                    <input type="email" required id='email' name='email' value={LoginData.email} onChange={updateData} autoComplete="off"></input>
                                    <label><b>Email</b></label>
                                    <AiTwotoneMail className='LoginIcon'></AiTwotoneMail>
                                </div>
                                <div className='inputLoginbox'>
                                    <input type="password" required id='password' name='password' value={LoginData.password} onChange={updateData} autoComplete="off"></input>
                                    <label><b>Password</b></label>
                                    <RiLockPasswordFill className='LoginIcon' />
                                </div>
                                <div className='remember-forgot'>
                                    <label>
                                        <input type="checkbox" style={{ margin: "5px" }} /><b>Remember me</b>
                                    </label>
                                    <Link to="/" className='LoginForgot'><b>Forgot Password?</b></Link>
                                </div>
                                <button type="submit" className="LoginSubmit" disabled={LoginData.email === "" || LoginData.password === ""}><b>Login</b></button>
                                <div className='register-link'>
                                    <p>Don't have an account?<AnchorLink href="#register">Register</AnchorLink></p>
                                </div>
                                {WrongCredantial > 0 && <div className='WrongCredentials'>
                                    Sorry, your password was incorrect.<br /> Please double-check your password.
                                </div>}
                                {register > 0 && <div className='WrongCredentials'>
                                Please Register Yourself
                            </div>}
                            </form>
                            <div style={{ display: "flex", alignItems: "center", flexDirection: "row" }}>
                                <FcGoogle size={25} style={{ cursor: "pointer", marginRight: "10px" }} onClick={google} />
                                <span style={{ color: "black", fontWeight:"600",cursor: "pointer", marginRight: "10px",border:"1px solid black",padding:"2px",borderRadius:"5px" }} onClick={CAS} >CAS</span>
                            </div>
                        </div>
                    </div>

                    <div className='container-fluid loginBody' id="register">
                        <div className='wrapperRegister'>
                            <h1 id="LoginId" style={{ color: "#fff" }}>
                                <FaUser style={{ marginRight: "10px", float: "left" }} />
                                <b>Register</b>
                            </h1>
                            <form onSubmit={RegisterSubmit}>
                                <div className='inputLoginbox'>
                                    <input type="text" required name='firstname' value={RegisterData.firstname} onChange={updateRegister} ></input>
                                    <label><b>FirstName</b></label>
                                </div>
                                <div className='inputLoginbox'>
                                    <input type="text" required name='lastname' value={RegisterData.lastname} onChange={updateRegister} ></input>
                                    <label><b>LastName</b></label>
                                </div>
                                <div className='inputLoginbox'>
                                    <input type="text" required name='username' value={RegisterData.username} onChange={updateRegister} ></input>
                                    <label><b>UserName</b></label>
                                </div>
                                <div className='inputLoginbox'>
                                    <input type="email" required name='email' value={RegisterData.email} onChange={updateRegister}></input>
                                    <label><b>Email</b></label>
                                </div>
                                <div className='inputLoginbox'>
                                    <input type="text" required name='age' value={RegisterData.age} onChange={updateRegister} ></input>
                                    <label><b>Age</b></label>
                                </div>
                                {wrongAge > 0 && <div className='WrongCredentials'>
                                    Enter correct age
                                </div>}
                                <div className='inputLoginbox'>
                                    <input type="text" required name='contact' value={RegisterData.contact} onChange={updateRegister} ></input>
                                    <label><b>Contact</b></label>
                                </div>
                                {wrongContact > 0 && <div className='WrongCredentials'>
                                    Enter correct phone number
                                </div>}
                                <div className='inputLoginbox'>
                                    <input type="password" required name='password' value={RegisterData.password} onChange={updateRegister} autoComplete="off"></input>
                                    <label><b>Password</b></label>
                                </div>
                                <button type="submit" className="LoginSubmit" disabled={RegisterData.email === "" || RegisterData.password === "" || RegisterData.age === "" || RegisterData.contact === "" || RegisterData.firstname === "" || RegisterData.lastname === "" || RegisterData.username === ""}><b>Register</b></button>
                                {emailExist > 0 && <div className='WrongCredentials'>
                                    Email Exist.<br /> Please use another Email
                                </div>}
                                {usernameExist > 0 && <div className='WrongCredentials'>
                                    UserName Exist.<br />Please use another UserName
                                </div>}
                            </form>
                        </div>
                    </div>
                </>
            )
        }
        else {
            return (
                <Navigate to="/profile" replace={true} />
            )
        }
    }
    else {
        return (
            <Navigate to="/profile" replace={true} />
        )
    }

}
