import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './Navbar';
import "../style/MySubgrediitReport.css";
import bitmoji from "../images/bitmoji.png";
import { BsPersonCircle } from 'react-icons/bs';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import Loader from './Loader';


export default function MySubgrediitReport() {
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
        moderator: "",
        imageFile: "",
        posts: 0,
    });
    const [report, setReport] = useState([]);
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
            })
        }
    }

    const fetchReport = async () => {
        setloader(true);
        const serverRes = await fetch("http://localhost:8000/user/reports", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer".concat(" ", localStorage.getItem("token")),
            },
            body: JSON.stringify({
                subId: params.mysub,
            }),
        }
        );
        if (serverRes.status === 201) {
            const serverResJson = await serverRes.json();
            setReport(serverResJson.reportSub.reverse());
        }
        setloader(false);
    }

    const deleteReport = async (event) => {
        setloader(true);
        const buttonClicked = event.target;
        const id = buttonClicked.parentElement.parentElement.parentElement.id;
        const serverRes = await fetch("http://localhost:8000/user/deleteReport", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer".concat(" ", localStorage.getItem("token")),
            },
            body: JSON.stringify({
                id: id,
            }),
        }
        );
        if (serverRes.status === 201) {
            alert("Deleted report");
            fetchReport();
        }
        setloader(false)
    }

    const ignoreReport = async (event) => {
        const buttonClicked = event.target;
        const id = buttonClicked.parentElement.parentElement.parentElement.id;

        const serverRes = await fetch("http://localhost:8000/user/ignoreReport", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer".concat(" ", localStorage.getItem("token")),
            },
            body: JSON.stringify({
                id: id,
            }),
        }
        );

        if (serverRes.status === 201) {
            alert("Ignored Report");
            fetchReport();
        }
    }

    let map = {};

    const blockReport = (id) => {
        document.getElementById(id).innerHTML = 'Cancel in 3';
        let cou = 2;
        const userId = document.getElementById(id).parentElement.parentElement.childNodes[0].childNodes[1].id;
        map['interval_id'] = setInterval(() => {
            if (cou === 0) {
                handleBlockReport(id, userId);
                clearInterval(map['interval_id']);
                //document.getElementById(id).innerHTML = `Block`;
            }
            else {
                document.getElementById(id).innerHTML = `Cancel in ${cou}`;
                cou--;
            }
        }, 1000)
    }

    const interval_end = (id) => {
        clearInterval(map['interval_id']);
        document.getElementById(id).innerHTML = `Block`;
        map = {};
    }

    const handleBlockReport = async (id, userId) => {
        setloader(true);
        let id_temp = id;
        id_temp = id_temp.replace("block", "");
        const serverRes = await fetch("http://localhost:8000/user/blockReport", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer".concat(" ", localStorage.getItem("token")),
            },
            body: JSON.stringify({
                id: id_temp,
                subId: params.mysub,
                userId: userId,
            }),
        }
        );
        setloader(false);
        if(serverRes.status===201){
            alert("Blocked");
        }
        else if (serverRes.status === 403) {
            alert("Cannot block Moderator");
        }
        else if (serverRes.status === 402) {
            alert("Already blocked");
        }
        fetchReport();
    }

    useEffect(() => {
        setloader(true);
        fetchSubgreddiitDet();
        fetchReport();
        setloader(false);
        document.addEventListener('keydown', handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [reload, handleKeyPress]);


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
                            <div className='reportSubDet'>
                                {report.map((element) => {
                                    if (element.status === "Reported") {
                                        return <div className='reportRow' key={element._id} id={element._id}>
                                            <div className='reportPostUser'>
                                                <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                    <BsPersonCircle size={35} style={{ marginRight: "10px" }}></BsPersonCircle>
                                                    <div className="ReportedpostOwner" id={element.postOwner.postedBy.id}>
                                                        <span style={{ opacity: "0.8" }}>Posted By</span>
                                                        <span style={{ fontWeight: "600" }}>{element.postOwner.postedBy.username}</span>
                                                    </div>
                                                    <BsPersonCircle size={35} style={{ marginRight: "10px" }}></BsPersonCircle>
                                                    <div className="ReportedpostOwner" id={element.reportedByname._id}>
                                                        <span style={{ opacity: "0.8" }}>Reported By</span>
                                                        <span style={{ fontWeight: "600" }}>{element.reportedByname.username}</span>
                                                    </div>
                                                </div>
                                                <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                    <span className="buttonReport" onClick={deleteReport}>Delete</span>
                                                    <span className="buttonReport" id={"block" + element._id} onClick={() => !map['interval_id'] ? blockReport(`block${element._id}`) : interval_end(`block${element._id}`)}>Block</span>
                                                    <span className="buttonReport" onClick={ignoreReport}>Ignore</span>
                                                </div>
                                            </div>
                                            <div className='reportPostDesc'>
                                                <span>{element.postOwner.post}</span>
                                            </div>
                                            <div className='concernReport'>
                                                <span style={{ textDecoration: "underline", fontSize: '20px' }}>Concern:</span>
                                                <span>{element.concern}</span>
                                            </div>
                                        </div>
                                    }
                                    else if (element.status === "ignore") {
                                        return <div className='reportRow' key={element._id} id={element._id}>
                                            <div className='reportPostUser'>
                                                <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                    <BsPersonCircle size={35} style={{ marginRight: "10px" }}></BsPersonCircle>
                                                    <div className="ReportedpostOwner" id={element.postOwner.postedBy.id}>
                                                        <span style={{ opacity: "0.8" }}>Posted By</span>
                                                        <span style={{ fontWeight: "600" }}>{element.postOwner.postedBy.username}</span>
                                                    </div>
                                                    <BsPersonCircle size={35} style={{ marginRight: "10px" }}></BsPersonCircle>
                                                    <div className="ReportedpostOwner" id={element.reportedByname._id}>
                                                        <span style={{ opacity: "0.8" }}>Reported By</span>
                                                        <span style={{ fontWeight: "600" }}>{element.reportedByname.username}</span>
                                                    </div>
                                                </div>
                                                <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                    <span className="buttonReport" style={{ cursor: "not-allowed", opacity: "0.7" }}>Delete</span>
                                                    <span className="buttonReport" style={{ cursor: "not-allowed", opacity: "0.7" }}>Block</span>
                                                    <span className="buttonReport" style={{ cursor: "not-allowed", opacity: "0.7" }}>Ignore</span>
                                                </div>
                                            </div>
                                            <div className='reportPostDesc'>
                                                <span>{element.postOwner.post}</span>
                                            </div>
                                            <div className='concernReport'>
                                                <span style={{ textDecoration: "underline", fontSize: '20px' }}>Concern:</span>
                                                <span>{element.concern}</span>
                                            </div>
                                        </div>
                                    }
                                    else if (element.status === "block") {
                                        return <div className='reportRow' key={element._id} id={element._id}>
                                            <div className='reportPostUser'>
                                                <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                    <BsPersonCircle size={35} style={{ marginRight: "10px" }}></BsPersonCircle>
                                                    <div className="ReportedpostOwner" id={element.postOwner.postedBy.id}>
                                                        <span style={{ opacity: "0.8" }}>Posted By</span>
                                                        <span style={{ fontWeight: "600" }}>{element.postOwner.postedBy.username}</span>
                                                    </div>
                                                    <BsPersonCircle size={35} style={{ marginRight: "10px" }}></BsPersonCircle>
                                                    <div className="ReportedpostOwner" id={element.reportedByname._id}>
                                                        <span style={{ opacity: "0.8" }}>Reported By</span>
                                                        <span style={{ fontWeight: "600" }}>{element.reportedByname.username}</span>
                                                    </div>
                                                </div>
                                                <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                    <span className="buttonReport" style={{ cursor: "not-allowed", opacity: "0.7" }}>Delete</span>
                                                    <span className="buttonReport">Block</span>
                                                    <span className="buttonReport" style={{ cursor: "not-allowed", opacity: "0.7" }}>Ignore</span>
                                                </div>
                                            </div>
                                            <div className='reportPostDesc'>
                                                <span>{element.postOwner.post}</span>
                                            </div>
                                            <div className='concernReport'>
                                                <span style={{ textDecoration: "underline", fontSize: '20px' }}>Concern:</span>
                                                <span>{element.concern}</span>
                                            </div>
                                        </div>
                                    }
                                })}
                            </div>
                        </div>
                    </div>
                </div >
            )
        }
    }
    else {
        return (
            <Navigate to="/" />
        )
    }
}
