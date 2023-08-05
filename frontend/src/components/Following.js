import React, { useEffect, useState } from 'react';
import { Navigate } from "react-router-dom";
import Navbar from './Navbar';
import { BsPersonCircle } from "react-icons/bs"
import bitmoji from "../images/bitmoji.png";
import Loader from './Loader';

export default function Following() {
    const [following, setuserData] = useState([])
    const [loader, setloader] = useState(false);
    const [reload, setReload] = useState(false);
    const fetchProfile = async () => {
        setloader(true);
        const serverRes = await fetch("http://localhost:8000/user/profilefollowing", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer".concat(" ", localStorage.getItem("token")),
            },
        }
        );
        if (serverRes.status === 201) {
            const serverResJson = await serverRes.json();
            setuserData(serverResJson)
        }
        setloader(false);
    }

    useEffect(() => {
        fetchProfile();
    }, [reload])

    const removeFol = async (event) => {
        setloader(true);
        const buttonClicked = event.target;
        let parent = buttonClicked.parentElement;
        const parentId = parent.id;

        const serverRes = await fetch("http://localhost:8000/user/removefollowing", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer".concat(" ", localStorage.getItem("token")),
            },
            body: JSON.stringify({
                id: parentId,
            }),
        }
        );
        if (serverRes.status === 201) {
            //parent.remove();
            setReload(!reload);
        }
        setloader(false);
    }

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
                        <h1>Following</h1>
                        <div className='tableFollower'>
                            {following.map((element) => {
                                return <div key={element._id}>
                                    <div className='tableRow' id={element._id} style={{ margin: "20px" }}>
                                        <div className='FollowerName'>
                                            <BsPersonCircle size={30} style={{ margin: "7px" }} />
                                            <a data-bs-toggle="offcanvas" href={"#offcanvas" + element._id} role="button" aria-controls="offcanvasExample" className="FollowerLink">{element.username}</a>
                                        </div>
                                        <button type='submit' onClick={removeFol} className='followerRemove'>Unfollow</button>
                                    </div>
                                    <div className="offcanvas offcanvas-start" tabIndex="-1" id={"offcanvas" + element._id} aria-labelledby="offcanvasExampleLabel" style={{ backgroundColor: "rgb(187, 193, 240)", color: "#fff" }}>
                                        <div className="offcanvas-header">
                                            <h2 className="offcanvas-title">Details</h2>
                                            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                                        </div>
                                        <div className="offcanvas-body">
                                            <div className='displayOwnerDetails'>
                                                <img src={bitmoji} alt="logo" height={300} style={{ border: "3px solid #fff", width: "100%", marginBottom: "10px", borderRadius: "10px" }} />
                                                <div className='displayData'>
                                                    <div className='subGreddiitUser-PostProfile'>
                                                        <div className='SubgreddiitName' style={{ width: "100%", backgroundColor: "#fa709a", display: "flex", justifyContent: "center" }}>
                                                            <span style={{ padding: "5px", borderRadius: "5px", textAlign: "center" }}>{element.username}</span>
                                                        </div>
                                                    </div>
                                                    <div className='subGreddiitUser-Post'>
                                                        <div className='UserSubgreddiit'>
                                                            <span style={{ margin: "0px 10px" }}>Follower:</span>
                                                            <span style={{ width: "40px", backgroundColor: "#fa709a", borderRadius: "5px", textAlign: "center" }}>{element.follower.length}</span>
                                                        </div>
                                                        <div className='UserSubgreddiit'>
                                                            <span style={{ marginRight: "5px" }}>Following:</span>
                                                            <span style={{ width: "40px", backgroundColor: "#fa709a", borderRadius: "5px", textAlign: "center" }}>{element.following.length}</span>
                                                        </div>
                                                    </div>
                                                    <div className='SubgreddiitDet'>
                                                        <span style={{ marginRight: "10px" }}>Name:</span>
                                                        <span style={{ color: "#fa709a", 'wordBreak': 'break-all' }}>{element.firstname + " " + element.lastname}</span>
                                                    </div>
                                                    <div className='SubgreddiitDet'>
                                                        <span style={{ marginRight: "10px" }}>Age:</span>
                                                        <span style={{ color: "#fa709a", 'wordBreak': 'break-all' }}>{element.age}</span>
                                                    </div>
                                                    <div className='SubgreddiitDet'>
                                                        <span style={{ marginRight: "10px" }}>Email:</span>
                                                        <span style={{ color: "#fa709a", 'wordBreak': 'break-all' }}>{element.email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
