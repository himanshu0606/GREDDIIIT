import React, { useState, useEffect,useCallback } from 'react';
import Navbar from './Navbar';
import "../style/MySubgrediitProfile.css";
import bitmoji from "../images/bitmoji.png";
import { useParams, Link, Navigate ,useNavigate} from 'react-router-dom';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Loader from './Loader';

export default function MySubgrediitStat(props) {
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
        memberTime: [],
    });

    const fetchSubgreddiitDet = async () => {
        const serverRes = await fetch("http://localhost:8000/user/getdetailsMySubgreddiitStat", {
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
                memberTime: serverResJson.memberTime,
            })
        }
    }
    useEffect(() => {
        setloader(true);
        fetchSubgreddiitDet();
        setloader(false);
        document.addEventListener('keydown', handleKeyPress);

        // remove the event listener
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);

    if (localStorage.getItem("token")) {
        if (loader === true) {
            return (<Loader />)
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
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                        <p style={{ fontWeight: "500", fontSize: "20px" }}>Posts vs Date</p>
                                        <LineChart
                                            width={500}
                                            height={300}
                                            data={detailsSub.memberTime}
                                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" stroke="black" />
                                            <YAxis dataKey="posts" stroke="black" interval={1} />
                                            <Tooltip />

                                            <Line type="monotone" strokeWidth="2" dataKey="posts" stroke="#fa709a" activeDot={{ r: 8 }} />
                                        </LineChart>

                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                        <p style={{ fontWeight: "500", fontSize: "20px" }}>Users vs Date</p>
                                        <LineChart
                                            width={500}
                                            height={300}
                                            data={detailsSub.memberTime}
                                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" stroke="black" />
                                            <YAxis dataKey="users" stroke="black" interval={1} />
                                            <Tooltip />
                                            <Line type="monotone" strokeWidth="2" dataKey="users" stroke="#fa709a" activeDot={{ r: 8 }} />
                                        </LineChart>
                                    </div>
                                </div>
                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                        <p style={{ fontWeight: "500", fontSize: "20px" }}>Vistors vs Date</p>
                                        <LineChart
                                            width={500}
                                            height={300}
                                            data={detailsSub.memberTime}
                                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" stroke="black" />
                                            <YAxis dataKey="visitors" stroke="black" />
                                            <Tooltip />
                                            <Line type="monotone" strokeWidth="2" dataKey="visitors" stroke="#fa709a" activeDot={{ r: 8 }} />
                                        </LineChart>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                        <p style={{ fontWeight: "500", fontSize: "20px" }}>Reports vs Deleted Reports</p>
                                        <BarChart
                                            width={500}
                                            height={300}
                                            data={detailsSub.memberTime}
                                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" stroke="black" />
                                            <YAxis stroke='black' />
                                            <Tooltip />
                                            <Bar dataKey="reported" fill="#fa709a" barSize={30} />
                                            <Bar dataKey="deleted" fill="red" barSize={30} />
                                        </BarChart>
                                    </div>
                                </div>
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
