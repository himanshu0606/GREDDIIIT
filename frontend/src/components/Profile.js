import React, { useEffect, useState } from 'react'
import { Navigate, Link } from 'react-router-dom';
import "../style/currProfile.css";
import { CgProfile } from "react-icons/cg"
import { ImProfile } from "react-icons/im"
import Navbar from './Navbar';
import Loader from './Loader';

export default function Profile() {
    const [userdata, setuserData] = useState({
        username: "",
        firstname: "",
        lastname: "",
        email: "",
        age: "",
        contact: "",
        follower: [],
        following: [],
    })
    const [loader, setloader] = useState(false);

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

        setuserData({
            firstname: serverResJson.firstname,
            lastname: serverResJson.lastname,
            username: serverResJson.username,
            email: serverResJson.email,
            age: serverResJson.age,
            contact: serverResJson.contact,
            follower: serverResJson.follower,
            following: serverResJson.following,
        })
        setloader(false);
    }

    useEffect(() => {
        fetchProfile();
    }, []);

    if (localStorage.getItem("token")) {
        if (loader === true) {
            return (
                <Loader />
            )
        }
        else {
            return (
                <>
                    <Navbar></Navbar>
                    <div className='row ProfileBody'>
                        <div className='col-xl-6 col-sm-12' style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
                            <CgProfile size={90} style={{ margin: "30px", color: "red" }} />
                            <div className='wrapperProfile'>
                                <h2 style={{ marginBottom: "20px", marginTop: "20px" }}><ImProfile style={{ float: "left", margin: "5px" }} /><b>User Profile</b></h2>
                                <div className='userProfileItem'>
                                    <span className='ProfileTitle'>UserName:</span>
                                    <span className='ProfileKey'><b>{userdata.username}</b></span>
                                </div>
                                <div className='userProfileItem'>
                                    <span className='ProfileTitle'>FirstName:</span>
                                    <span className='ProfileKey'><b>{userdata.firstname}</b></span>
                                </div>
                                <div className='userProfileItem'>
                                    <span className='ProfileTitle'>LastName:</span>
                                    <span className='ProfileKey'><b>{userdata.lastname}</b></span>
                                </div>
                                <div className='userProfileItem'>
                                    <span className='ProfileTitle'>Email:</span>
                                    <span className='ProfileKey'><b>{userdata.email}</b></span>
                                </div>
                                <div className='userProfileItem'>
                                    <span className='ProfileTitle'>Age:</span>
                                    <span className='ProfileKey'><b>{userdata.age}</b></span>
                                </div>
                                <div className='userProfileItem'>
                                    <span className='ProfileTitle'>Contact:</span>
                                    <span className='ProfileKey'><b>{userdata.contact}</b></span>
                                </div>
                                <Link to="/editprofile"><button type='submit' className='EditButtonProfile'>Edit Profile</button></Link>
                            </div>
                        </div>
                        <div className='col-xl-3 col-sm-6' style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "30px" }}>
                            <div className='ProfileFollower'>
                                <h2>Follower</h2>
                                <Link to="/follower" className='ProfileFollowerLink'>{userdata.follower.length}</Link>
                            </div>
                        </div>
                        <div className='col-xl-3 col-sm-6' style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "30px" }}>
                            <div className='ProfileFollower'>
                                <h2>Following</h2>
                                <Link to="/following" className='ProfileFollowerLink'>{userdata.following.length}</Link>
                            </div>
                        </div>
                    </div>

                </>
            )
        }
    }
    else {
        return (
            <Navigate to="/" />
        )
    }
}
