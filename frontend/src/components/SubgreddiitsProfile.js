import React, { useEffect, useState } from 'react'
import Navbar from './Navbar';
import { Navigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import "../style/SubgreddiitsProfile.css";
import bitmoji from "../images/bitmoji.png";
import { AiFillPlusSquare } from "react-icons/ai";
import AccordianSubgrdiitProfile from './AccordianSubgrdiitProfile';
import Loader from './Loader';

export default function SubgreddiitsProfile() {
    let params = useParams();
    const [post, setPost] = useState([]);
    const [user, setUser] = useState("");
    const [newpostData, setnewpostData] = useState("");
    const [reload, setReload] = useState(false);
    const [loader, setloader] = useState(false);
    const [detailsSub, setdetSub] = useState({
        name: "",
        tags: [],
        banned: [],
        desc: "",
        follower: [],
        moderator: "",
        imageFile: "",
        blocked: [],
    });

    const fetchSubgreddiitDet = async () => {
        setloader(true);
        const serverRes = await fetch("http://localhost:8000/user/getdetailsSubgreddiit", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer".concat(" ", localStorage.getItem("token")),
            },
            body: JSON.stringify({
                id: params.sub,
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
                blocked: serverResJson.blocked,
            })
        }
    }

    const fetchPostSubgreddiit = async () => {
        const serverRes = await fetch("http://localhost:8000/user/fetchPost", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer".concat(" ", localStorage.getItem("token")),
            },
            body: JSON.stringify({
                id: params.sub,
            }),
        }
        );

        if (serverRes.status === 201) {
            const serverResJson = await serverRes.json();
            setPost(serverResJson.post.reverse());
            setUser(serverResJson.user);
        }
        setloader(false);
    }

    useEffect(() => {
        fetchSubgreddiitDet();
        fetchPostSubgreddiit();
    }, [reload]);

    const updateNewPostData = (event) => {
        setnewpostData(event.target.value);
    }

    const newPostCreate = async (event) => {
        event.preventDefault();
        setloader(true);
        const serverRes = await fetch("http://localhost:8000/user/newpost", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer".concat(" ", localStorage.getItem("token")),
            },
            body: JSON.stringify({
                sub_id: params.sub,
                post: newpostData,
            }),
        }
        );
        if (serverRes.status === 201) {
            const serverResJson = await serverRes.json();
            //setPost([serverResJson, ...post]);
            setnewpostData("");
        }
        else if (serverRes.status === 202) {
            alert("Your post contains ban keywords");
            const serverResJson = await serverRes.json();
            //setPost((prev) => [serverResJson, ...prev]);
            setnewpostData("");
        }
        else {
            alert("Error Occured! Please try again!")
        }
        setReload(!reload);
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
                    <div className='SubProfileWrapper'>
                        <div className='row container-fluid'>
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
                                                <span style={{ width: "40px", backgroundColor: "#fa709a", borderRadius: "5px", textAlign: "center" }}>{post.length}</span>
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
                            <div className='col-xl-8 col-lg-9 col-sm-12'>
                                <div className='postWrapper'>
                                    <div className='addPost'>
                                        <AiFillPlusSquare size={50} style={{ color: "#fa709a", marginRight: "10px", cursor: "pointer" }} data-bs-toggle="modal" data-bs-target="#myModal" />
                                        <h3 style={{ color: "#fff" }}><b>Create New Post</b></h3>

                                        <div className="modal" id="myModal">
                                            <div className="modal-dialog">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h4 className="modal-title">New Post</h4>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={() => { setnewpostData(""); }} ></button>
                                                    </div>

                                                    <div className="modal-body">
                                                        <form onSubmit={newPostCreate}>
                                                            <textarea type="text" placeholder="Your post content" value={newpostData} style={{ width: "100%", height: "100px", 'wordBreak': 'break-all', padding: "5px" }} onChange={updateNewPostData} required></textarea>
                                                            <button type="submit" className='newPostsubmit' data-bs-dismiss="modal">Post</button>
                                                        </form>
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => { setnewpostData(""); }}>Close</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {post.map((element) => {
                                        if (element.liked.includes(user)) {
                                            if (element.saved.includes(user))
                                                return <AccordianSubgrdiitProfile key={element._id} setReload={setReload} reload={reload} loading={setloader} id={element._id} saved={1} post={element.post} liked={element.liked.length} postedBy={element.postedBy.username} postedByid={element.postedBy.id} likedUser={1} dislikedUser={0} disliked={element.disliked.length} comments={element.comments} />
                                            else
                                                return <AccordianSubgrdiitProfile key={element._id} id={element._id} setReload={setReload} loading={setloader} reload={reload} saved={0} post={element.post} liked={element.liked.length} postedBy={element.postedBy.username} postedByid={element.postedBy.id} likedUser={1} dislikedUser={0} disliked={element.disliked.length} comments={element.comments} />
                                        }
                                        else if (element.disliked.includes(user)) {
                                            if (element.saved.includes(user))
                                                return <AccordianSubgrdiitProfile key={element._id} setReload={setReload} reload={reload} loading={setloader} id={element._id} saved={1} post={element.post} liked={element.liked.length} postedBy={element.postedBy.username} postedByid={element.postedBy.id} likedUser={0} dislikedUser={1} disliked={element.disliked.length} comments={element.comments} />
                                            else
                                                return <AccordianSubgrdiitProfile key={element._id} setReload={setReload} reload={reload} loading={setloader} id={element._id} saved={0} post={element.post} liked={element.liked.length} postedBy={element.postedBy.username} postedByid={element.postedBy.id} likedUser={0} dislikedUser={1} disliked={element.disliked.length} comments={element.comments} />

                                        } else {
                                            if (element.saved.includes(user))
                                                return <AccordianSubgrdiitProfile key={element._id} setReload={setReload} reload={reload} loading={setloader} id={element._id} saved={1} post={element.post} liked={element.liked.length} postedBy={element.postedBy.username} postedByid={element.postedBy.id} likedUser={0} dislikedUser={0} disliked={element.disliked.length} comments={element.comments} />
                                            else
                                                return <AccordianSubgrdiitProfile key={element._id} setReload={setReload} reload={reload} loading={setloader} id={element._id} saved={0} post={element.post} liked={element.liked.length} postedBy={element.postedBy.username} postedByid={element.postedBy.id} likedUser={0} dislikedUser={0} disliked={element.disliked.length} comments={element.comments} />
                                        }
                                    })}
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

