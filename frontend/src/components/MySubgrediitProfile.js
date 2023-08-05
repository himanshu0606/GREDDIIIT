import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './Navbar';
import "../style/MySubgrediitProfile.css";
import bitmoji from "../images/bitmoji.png";
import { BsPersonCircle } from 'react-icons/bs';
import { useParams, Link, useNavigate, Navigate } from 'react-router-dom';
import Loader from './Loader';

export default function MySubgrediitProfile() {
    const navigate = useNavigate();
    const handleKeyPress = useCallback((event) => {
        if (event.key === 'j') {
            navigate(`/mysubgrediits/${params.mysub}/joinrequest`);
        }
        else if (event.key === 'r') {
            navigate(`/mysubgrediits/${params.mysub}/reports`);
        }
        else if (event.key === 's') {
            navigate(`/mysubgrediits/${params.mysub}/stats`);
        }
        else if (event.key === 'u') {
            navigate(`/mysubgrediits/${params.mysub}`);

        }
    }, []);

    let params = useParams();
    const [detailsSub, setdetSub] = useState({
        name: "",
        tags: [],
        banned: [],
        desc: "",
        follower: [],
        block: [],
        moderator: "",
        imageFile: "",
        posts: 0,
    });

    const [loader, setloader] = useState(false);

    const fetchSubgreddiitDet = async () => {
        const serverRes = await fetch("http://localhost:8000/user/getdetailsMySubgreddiit", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer".concat(" ", localStorage.getItem("token")),
            },
            body: JSON.stringify({
                id: params.mysub,
            }),
        }
        );

        if (serverRes.status === 201) {
            const serverResJson = await serverRes.json();
            setdetSub({
                name: serverResJson.name,
                tags: serverResJson.tags,
                banned: serverResJson.banned,
                desc: serverResJson.desc,
                follower: serverResJson.follower,
                moderator: serverResJson.moderator,
                imageFile: serverResJson.imageFile,
                posts: serverResJson.posts,
                block: serverResJson.blocked
            })
        }
    }
    useEffect(() => {
        setloader(true);
        fetchSubgreddiitDet();
        document.addEventListener('keydown', handleKeyPress);
        setloader(false);
        // remove the event listener
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);

    if (localStorage.getItem("token")) {
        if (loader === "true") {
            return (
                <Loader />
            )
        }
        else {
            return (
                <div>
                    <Navbar />
                    <div className='wrapperMySub row container-fluid'>
                        <div className='col-xl-4 col-lg-3 col-sm-12'>
                            <div className='displayOwnerDetails'>
                                <img src={detailsSub.imageFile || bitmoji} alt="logo" height={300} style={{ border: "3px solid #fff", width: "100%", marginBottom: "10px", borderRadius: "10px" }} />
                                <div className='displayData'>
                                    <div className='subGreddiitUser-PostProfile'>
                                        <div className='SubgreddiitName' style={{ width: "100%", backgroundColor: "#fa709a", display: "flex", justifyContent: "center" }}>
                                            <span style={{ padding: "5px", borderRadius: "5px", textAlign: "center" }}>{detailsSub.name}</span>
                                        </div>
                                        <div className='SubgreddiitName'>
                                            <span style={{ margin: "0px 10px" }}>Moderator:</span>
                                            <span style={{ padding: "5px", backgroundColor: "#fa709a", borderRadius: "5px", textAlign: "center" }}>{detailsSub.moderator}</span>
                                        </div>
                                    </div>
                                    <div className='subGreddiitUser-Post'>
                                        <div className='UserSubgreddiit'>
                                            <span style={{ margin: "0px 10px" }}>User:</span>
                                            <span style={{ width: "40px", backgroundColor: "#fa709a", borderRadius: "5px", textAlign: "center" }}>{detailsSub.follower.length}</span>
                                        </div>
                                        <div className='UserSubgreddiit'>
                                            <span style={{ marginRight: "5px" }}>Post:</span>
                                            <span style={{ width: "40px", backgroundColor: "#fa709a", borderRadius: "5px", textAlign: "center" }}>{detailsSub.posts}</span>
                                        </div>
                                    </div>
                                    <div className='SubgreddiitDet'>
                                        <span style={{ marginRight: "10px" }}>Banned Keywords:</span>
                                        <span style={{ color: "#fa709a", 'wordBreak': 'break-all' }}>{detailsSub.banned.join(" , ")}</span>
                                    </div>
                                    <div className='SubgreddiitDet'>
                                        <span style={{ marginRight: "10px" }}>Tags:</span>
                                        <span style={{ color: "#fa709a", 'wordBreak': 'break-all' }}>{detailsSub.tags.join(" , ")}</span>
                                    </div>
                                    <div className='SubgreddiitDet'>
                                        <span style={{ marginRight: "10px" }}>Description:</span>
                                        <span style={{ color: "#fa709a", 'wordBreak': 'break-all' }}>{detailsSub.desc}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-xl-8 col-lg-9 col-sm-12' style={{ padding: "10px" }}>
                            <div className='tabMysubgrediit'>
                                <div className='tabItem'>
                                    <Link to={`/mysubgrediits/${params.mysub}`} style={{ color: "#fff", textDecoration: "none" }}>Users</Link>
                                </div>
                                <div className='tabItem'>
                                    <Link to={`/mysubgrediits/${params.mysub}/joinrequest`} style={{ color: "#fff", textDecoration: "none" }}>Joining Request</Link>
                                </div>
                                <div className='tabItem'>
                                    <Link to={`/mysubgrediits/${params.mysub}/stats`} style={{ color: "#fff", textDecoration: "none" }}>Stats</Link>
                                </div>
                                <div className='tabItem'>
                                    <Link to={`/mysubgrediits/${params.mysub}/reports`} style={{ color: "#fff", textDecoration: "none" }}>Reports</Link>
                                </div>
                            </div>

                            <div className='usersMySubProfile'>
                                <div className='unblock-block'>
                                    <div className='titleofUser'><h4>Regular</h4></div>
                                    <div className='tableFollower'>
                                        {
                                            detailsSub.follower.map((element) => {
                                                return <div key={element._id}>
                                                    <div className='tableRow' id={element._id} style={{ margin: "20px", justifyContent: "center" }}>
                                                        <div className='FollowerName'>
                                                            <BsPersonCircle size={30} style={{ margin: "7px" }} />
                                                            <a data-bs-toggle="offcanvas" href={"#offcanvasProfile" + element._id} role="button" aria-controls="offcanvasExample" className="FollowerLink">{element.username}</a>
                                                        </div>
                                                    </div>
                                                    <div className="offcanvas offcanvas-start" tabIndex="-1" id={"offcanvasProfile" + element._id} aria-labelledby="offcanvasExampleLabel" style={{ backgroundColor: "rgb(187, 193, 240)", color: "#fff" }}>
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
                                            })
                                        }
                                    </div>
                                </div>
                                <div className='unblock-block'>
                                    <div className='titleofUser'><h4>Blocked</h4></div>
                                    <div className='tableFollower'>
                                        {
                                            detailsSub.block.map((element) => {
                                                return <div key={element._id}>
                                                    <div className='tableRow' id={element._id} style={{ margin: "20px", justifyContent: "center" }}>
                                                        <div className='FollowerName'>
                                                            <BsPersonCircle size={30} style={{ margin: "7px" }} />
                                                            <a data-bs-toggle="offcanvas" href={"#offcanvasProfileBlocked" + element._id} role="button" aria-controls="offcanvasExample" className="FollowerLink">{element.username}</a>
                                                        </div>
                                                        <div className="offcanvas offcanvas-start" tabIndex="-1" id={"offcanvasProfileBlocked" + element._id} aria-labelledby="offcanvasExampleLabel" style={{ backgroundColor: "rgb(187, 193, 240)", color: "#fff" }}>
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
                                                </div>
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
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
