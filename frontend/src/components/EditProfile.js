import React, { useState, useEffect } from 'react'
import Navbar from './Navbar'
import { FaUser } from "react-icons/fa"
import { Navigate, useNavigate } from 'react-router-dom'
import Loader from './Loader';

export default function EditProfile() {
    const navigate = useNavigate();
    const [Invalidcredential, setcreddential] = useState(0);
    const [loggedIn, setLogin] = useState(0);
    const [loader, setloader] = useState(false);
    const [RegisterData, setRegisterData] = useState({
        firstname: "",
        lastname: "",
        username: localStorage.getItem("username") ? localStorage.getItem("username") : "",
        email: "",
        age: localStorage.getItem("age") ? localStorage.getItem("age") : "",
        contact: localStorage.getItem("contact") ? localStorage.getItem("contact") : "",
    });

    const [RegisterDataCopy, setRegisterDataCopy] = useState({
        username: "",
        age: "",
        contact: "",
    });

    const [editState, setEditState] = useState(window.location.pathname === "/editprofile" ? 1 : 0);

    const [wrongAge, setwrongAge] = useState(0);
    const [wrongContact, setwrongContact] = useState(0);

    const updateRegister = (event) => {
        setRegisterData({
            ...RegisterData,
            [event.target.name]: event.target.value,
        })
        localStorage.setItem([event.target.name], event.target.value);
        setcreddential(0);
        setwrongAge(0);
        setwrongContact(0);
    }

    window.onpopstate = (e) => {
        if (editState === 1 && e.target.location.href === "http://localhost:3000/profile" && (RegisterData.username !== RegisterDataCopy.username || RegisterData.age !== RegisterDataCopy.age || RegisterData.contact !== RegisterDataCopy.contact)) {
            setEditState(0);
            let answer = prompt("Do you Want to Go Back.(Y/N)")
            if (answer === 'Y' || answer === 'y') {
                localStorage.removeItem("age")
                localStorage.removeItem("contact")
                localStorage.removeItem("username");
                navigate(0)
            }
            else {
                navigate(1)
            }
        }
        else if (e.target.location.href === "http://localhost:3000/profile/edit") {
            ;
        }
        else if (editState === 1) {
            setEditState(0);
            localStorage.removeItem("username")
            localStorage.removeItem("age")
            localStorage.removeItem("contact")
        }
    }

    const fetchProfile = async () => {
        setloader(true);
        const serverRes = await fetch("http://localhost:8000/user/profile", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer".concat(" ", localStorage.getItem("token")),
            },
        }
        );
        const serverResJson = await serverRes.json();

        setRegisterData({
            firstname: serverResJson.firstname,
            lastname: serverResJson.lastname,
            email: serverResJson.email,
            username: RegisterData.username !== "" ? RegisterData.username : serverResJson.username,
            age: RegisterData.age !== "" ? RegisterData.age : serverResJson.age,
            contact: RegisterData.contact !== "" ? RegisterData.contact : serverResJson.contact,
        });

        setRegisterDataCopy({
            age: serverResJson.age,
            contact: serverResJson.contact,
            username: serverResJson.username,
        });

        setloader(false);
    }

    const editSubmit = async (event) => {
        event.preventDefault();
        setloader(true);
        if (RegisterData.username === "" || RegisterData.age === "" || RegisterData.contact === "") {
            setcreddential(1);
            setloader(false);
            return;
        }
        let age = parseInt(RegisterData.age);
        if (isNaN(age) || age < 1 || age > 100) {
            setwrongAge(1);
            setloader(false);
            return;
        }
        let contact = RegisterData.contact;
        var phoneno = /^\d{10}$/;
        if (!contact.match(phoneno)) {
            setwrongContact(1);
            setloader(false);
            return;
        }
        const serverRes = await fetch("http://localhost:8000/user/editprofile", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer".concat(" ", localStorage.getItem("token")),
            },
            body: JSON.stringify(RegisterData)
        }
        );
        if (serverRes.status === 400) {
            setcreddential(1);
        }
        else if (serverRes.status === 201) {
            setLogin(1);
        }
        setloader(false);
    }

    useEffect(() => {
        fetchProfile();
    }, [])

    if (localStorage.getItem("token") && !loggedIn) {
        if (loader === true) {
            return (
                <Loader />
            )
        }
        else {
            return (
                <div>
                    <Navbar />
                    <div className='container-fluid loginBody' id="register">
                        <div className='wrapperRegister'>
                            <h1 style={{ color: "#fff" }}>
                                <FaUser style={{ marginRight: "10px", float: "left" }} />
                                <b>EditProfile</b>
                            </h1>
                            <form onSubmit={editSubmit}>
                                <div className='inputLoginboxedit'>
                                    <input type="text" required id='firstname' name='firstname' value={RegisterData.firstname} readOnly style={{ color: "#fd8fb0" }}></input>
                                    <label><b>FirstName</b></label>
                                </div>
                                <div className='inputLoginboxedit'>
                                    <input type="text" required id='lastname' name='lastname' value={RegisterData.lastname} readOnly style={{ color: "#fd8fb0" }}></input>
                                    <label><b>LastName</b></label>
                                </div>
                                <div className='inputLoginboxedit'>
                                    <input type="text" required id='username' name='username' value={RegisterData.username} onChange={updateRegister} ></input>
                                    <label><b>UserName</b></label>
                                </div>
                                <div className='inputLoginboxedit'>
                                    <input type="email" required id='email' name='email' value={RegisterData.email} readOnly style={{ color: "#fd8fb0" }}></input>
                                    <label><b>Email</b></label>
                                </div>
                                <div className='inputLoginboxedit'>
                                    <input type="text" required id='age' name='age' value={RegisterData.age} onChange={updateRegister} ></input>
                                    <label><b>Age</b></label>
                                </div>
                                {wrongAge > 0 && <div className='WrongCredentials'>
                                    Enter correct age
                                </div>}
                                <div className='inputLoginboxedit'>
                                    <input type="text" required id='contact' name='contact' value={RegisterData.contact} onChange={updateRegister}></input>
                                    <label><b>Contact</b></label>
                                </div>
                                {wrongContact > 0 && <div className='WrongCredentials'>
                                    Enter correct phone number
                                </div>}
                                <button type="submit" className="LoginSubmit" disabled={RegisterData.username === "" || RegisterData.age === "" || RegisterData.contact === ""}><b>Submit</b></button>
                                {Invalidcredential > 0 && <div className='WrongCredentials'>
                                    Username already in use.
                                </div>}
                            </form>
                        </div>
                    </div>
                </div>
            )
        }
    }
    else if (localStorage.getItem("token") && loggedIn) {
        return (
            <Navigate to="/profile" replace={true} />
        )
    }
    else {
        return (
            <Navigate to="/" replace={true} />
        )
    }
}
