import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaUser } from 'react-icons/fa';

export default function Google() {
    const navigate = useNavigate();
    const [user, setuser] = useState(null);
    const [Data, setData] = useState({
        username: "",
        age: "",
        contact: "",
        password: "",
    });

    const [wrongAge, setwrongAge] = useState(0);
    const [wrongContact, setwrongContact] = useState(0);
    const [Invalidcredential, setcreddential] = useState(0);

    const updateData = (event) => {
        setData({
            ...Data,
            [event.target.name]: event.target.value,
        })
        setwrongAge(0);
        setcreddential(0);
        setwrongContact(0);
    }

    const SubmitData = async (event) => {
        event.preventDefault();
        if (Data.username === "" || Data.age === "" || Data.contact === "" || Data.password === "") {
            setcreddential(1);

            return;
        }
        let age = parseInt(Data.age);
        if (isNaN(age) || age < 1 || age > 100) {
            setwrongAge(1);

            return;
        }
        let contact = Data.contact;
        var phoneno = /^\d{10}$/;
        if (!contact.match(phoneno)) {
            setwrongContact(1);

            return;
        }
        const serverRes = await fetch("http://localhost:8000/user/googledata", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer".concat(" ", localStorage.getItem("token")),
            },
            body: JSON.stringify({
                user: user,
                data: Data,
            })
        }
        );
        if (serverRes.status === 400) {
            setcreddential(1);
        }
        else if (serverRes.status === 201) {
            const serverResJson = await serverRes.json();
            localStorage.setItem("token", serverResJson.token)
            navigate("/profile");
        }
    }


    const getUser = async () => {
        const serverRes = await fetch("http://localhost:8000/auth/login/success", {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },
        }
        );
        const serverResJson = await serverRes.json();
        if (serverRes.status === 200) {
            if (serverResJson.login) {
                localStorage.setItem("token", serverResJson.jwt);
                navigate("/profile");
            }
            else if (!serverResJson.login) {
                setuser(serverResJson.user);
            }
        }
    }

    useEffect(() => {
        getUser();
    }, []);

    return (
        <>
            <div className='container-fluid loginBody' id="register">
                <div className='wrapperRegister'>
                    <h1 style={{ color: "#fff" }}>
                        <FaUser style={{ marginRight: "10px", float: "left" }} />
                        <b>Please Fill Details</b>
                    </h1>
                    <form onSubmit={SubmitData}>
                        <div className='inputLoginboxedit'>
                            <input type="text" required id='username' name='username' value={Data.username} onChange={updateData} ></input>
                            <label><b>UserName</b></label>
                        </div>
                        <div className='inputLoginboxedit'>
                            <input type="text" required id='age' name='age' value={Data.age} onChange={updateData} ></input>
                            <label><b>Age</b></label>
                        </div>
                        {wrongAge > 0 && <div className='WrongCredentials'>
                            Enter correct age
                        </div>}
                        <div className='inputLoginboxedit'>
                            <input type="text" required id='contact' name='contact' value={Data.contact} onChange={updateData}></input>
                            <label><b>Contact</b></label>
                        </div>
                        <div className='inputLoginboxedit'>
                            <input type="password" required name='password' value={Data.password} onChange={updateData} autoComplete="off"></input>
                            <label><b>Password</b></label>
                        </div>
                        {wrongContact > 0 && <div className='WrongCredentials'>
                            Enter correct phone number
                        </div>}
                        <button type="submit" className="LoginSubmit" disabled={Data.username === "" || Data.age === "" || Data.contact === "" || Data.password === ""}><b>Submit</b></button>
                        {Invalidcredential > 0 && <div className='WrongCredentials'>
                            Username already in use.
                        </div>}
                    </form>
                </div>
            </div>
        </>
    )
}
