import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './Navbar';
import "../style/MySubgrediitProfile.css";
import bitmoji from "../images/bitmoji.png";
import { BsPersonCircle } from 'react-icons/bs';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import Loader from './Loader';

export default function MySubgrediitJoin() {
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
    const [loader, setloader] = useState(false);

    const [detailsSub, setdetSub] = useState({
        name: "",
        tags: [],
        banned: [],
        desc: "",
        follower: 1,
        reqJoin: [],
        moderator: "",
        imageFile: "",
        posts: 0,
    });

    const [reload, setReload] = useState(false);

    const fetchSubgreddiitDet = async () => {
        const serverRes = await fetch("http://localhost:8000/user/getdetailsMySubgreddiitRequestJoin", {
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
                reqJoin: serverResJson.reqJoin,
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
    }, [reload, handleKeyPress]);

    const acceptReq = async (event) => {
        setloader(true);
        const buttonClicked = event.target;
        const id = buttonClicked.parentElement.parentElement.id;

        const serverRes = await fetch("http://localhost:8000/user/acceptRequest", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer".concat(" ", localStorage.getItem("token")),
            },
            body: JSON.stringify({
                id: id,
                subId: params.mysub,
            }),
        }
        );

        if (serverRes.status === 201) {
            setReload(!reload);
        }
        setloader(false);
    }


    const rejectReq = async (event) => {
        setloader(true);
        const buttonClicked = event.target;
        const id = buttonClicked.parentElement.parentElement.id;

        const serverRes = await fetch("http://localhost:8000/user/rejectRequest", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer".concat(" ", localStorage.getItem("token")),
            },
            body: JSON.stringify({
                id: id,
                subId: params.mysub,
            }),
        }
        );

        if (serverRes.status === 201) {
            setReload(!reload);
        }
        setloader(false);
    }

    if (localStorage.getItem("token")) {
        if (loader === true) {
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
                                            <span style={{ width: "40px", backgroundColor: "#fa709a", borderRadius: "5px", textAlign: "center" }}>{detailsSub.follower}</span>
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
                            <div className='RequestJoinSub'>
                                {detailsSub.reqJoin.map((element) => {
                                    return <div>
                                        <div className='reqJoinRow' key={element._id} id={element._id}>
                                            <div className='userDetails'>
                                                <BsPersonCircle size={30} style={{ margin: "7px" }} />
                                                <a data-bs-toggle="offcanvas" href={"#offcanvas" + element._id} role="button" aria-controls="offcanvasExample" className="FollowerLink">{element.username}</a>
                                            </div>
                                            <div className='accept-rejectJoin'>
                                                <span onClick={acceptReq}>Accept</span>
                                                <span onClick={rejectReq}>Reject</span>
                                            </div>
                                        </div>
                                        <div className="offcanvas offcanvas-start" tabindex="-1" id={"offcanvas" + element._id} aria-labelledby="offcanvasExampleLabel" style={{ backgroundColor: "rgb(187, 193, 240)", color: "#fff" }}>
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
