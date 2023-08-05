import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import "../style/Follower.css";
import { Navigate } from "react-router-dom";
import Loader from './Loader';
import FollowerItems from './FollowerItems';

export default function Follower() {
    const [follower, setuserData] = useState([]);
    const [reload, setReload] = useState(false);
    const [loader, setloader] = useState(false);

    const fetchProfile = async () => {
        setloader(true);

        const serverRes = await fetch("http://localhost:8000/user/profilefollower", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer".concat(" ", localStorage.getItem("token")),
            },
        }
        );
        const serverResJson = await serverRes.json();

        setuserData(serverResJson)
        setloader(false);
    }

    useEffect(() => {
        fetchProfile();
    }, [reload])

    if (localStorage.getItem("token")) {
        if (loader === true) {
            return (
                <Loader />
            )
        } else {
            return (
                <div>
                    <Navbar />
                    <div className='followerPage'>
                        <h1>Follower</h1>
                        <div className='tableFollower'>
                            {follower.map((element) => {
                                return <FollowerItems key={element._id} element={element} setReload={setReload} reload={reload} setloader={setloader}/>
                            })}
                        </div>
                    </div>
                </div>
            )
        }
    }
    else {
        return (
            <Navigate to="/" />
        )
    }
}
