import { React, useState } from 'react'
import { GoComment } from "react-icons/go";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs"
import { AiOutlineLike, AiFillLike, AiOutlineDislike, AiFillDislike } from "react-icons/ai";
import { TbMessageReport } from "react-icons/tb";
import bitmoji from "../images/bitmoji.png";
import "../style/SubgreddiitsProfile.css"
import { Navigate } from 'react-router-dom';
import NestingComment from './NestingComment';


export default function AccordianSubgrdiitProfile(props) {
    const [liked, setLiked] = useState(props.likedUser);
    const [disliked, setDisliked] = useState(props.dislikedUser);
    const [saved, setSaved] = useState(props.saved);
    const [comments, setComments] = useState(props.comments)
    const [commentUser, setComment] = useState("");
    const [report, setReport] = useState("");
    const [numliked, setnumliked] = useState(props.liked);
    const [loader,setloader]=useState(false);

    const likePost = async (event) => {
        
        const buttonClicked = event.target;
        let id = buttonClicked.id;
        id = id.replace("like", "");

        const serverRes = await fetch("http://localhost:8000/user/Postupvote", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer".concat(" ", localStorage.getItem("token")),
            },
            body: JSON.stringify({
                PostId: id,
            }),
        }
        );

        if (serverRes.status === 201) {
            const serverResJson = await serverRes.json();
            setnumliked(serverResJson);
            setLiked(1);
            setDisliked(0);
        }
    }

    const unlikePost = async (event) => {
        const buttonClicked = event.target;
        let id = buttonClicked.parentElement.id;
        id = id.replace("like", "");


        const serverRes = await fetch("http://localhost:8000/user/Postupvotedelete", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer".concat(" ", localStorage.getItem("token")),
            },
            body: JSON.stringify({
                PostId: id,
            }),
        }
        );

        if (serverRes.status === 201) {
            const serverResJson = await serverRes.json();
            setnumliked(serverResJson);
            setLiked(0);
        }
    }

    const dislikePost = async (event) => {
        const buttonClicked = event.target;
        let id = buttonClicked.id;
        id = id.replace("dislike", "");

        const serverRes = await fetch("http://localhost:8000/user/Postdownvote", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer".concat(" ", localStorage.getItem("token")),
            },
            body: JSON.stringify({
                PostId: id,
            }),
        }
        );

        if (serverRes.status === 201) {
            const serverResJson = await serverRes.json();
            setnumliked(serverResJson);
            setLiked(0);
            setDisliked(1);
        }
        //props.setReload(!props.reload);
    }

    const dislikePostDelete = async (event) => {
        const buttonClicked = event.target;
        let id = buttonClicked.parentElement.id;
        id = id.replace("dislike", "");

        const serverRes = await fetch("http://localhost:8000/user/Postdownvotedelete", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer".concat(" ", localStorage.getItem("token")),
            },
            body: JSON.stringify({
                PostId: id,
            }),
        }
        );

        if (serverRes.status === 201) {
            const serverResJson = await serverRes.json();
            setnumliked(serverResJson);
            setDisliked(0);
        }
        //props.setReload(!props.reload);
    }

    const savePost = async (event) => {
        const buttonClicked = event.target;
        let id = buttonClicked.id;
        id = id.replace("save", "");
        const serverRes = await fetch("http://localhost:8000/user/savePost", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer".concat(" ", localStorage.getItem("token")),
            },
            body: JSON.stringify({
                PostId: id,
            }),
        }
        );
        if (serverRes.status === 201) {
            setSaved(1);
        }
        //props.setReload(!props.reload);
    }

    const unsavePost = async (event) => {
        const buttonClicked = event.target;
        let id = buttonClicked.parentElement.id;
        id = id.replace("save", "");

        const serverRes = await fetch("http://localhost:8000/user/unsavePost", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer".concat(" ", localStorage.getItem("token")),
            },
            body: JSON.stringify({
                PostId: id,
            }),
        }
        );
        if (serverRes.status === 201) {
            setSaved(0);
        }
        //props.setReload(!props.reload);
    }

    const addComment = async (event) => {
        if (commentUser !== "") {
            const buttonClicked = event.target;
            const id = buttonClicked.parentElement.parentElement.parentElement.parentElement.parentElement.id;
            const serverRes = await fetch("http://localhost:8000/user/addComment", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "authorization": "Bearer".concat(" ", localStorage.getItem("token")),
                },
                body: JSON.stringify({
                    PostId: id,
                    comment: commentUser,
                }),
            }
            );
            if (serverRes.status === 201) {
                const serverResJson = await serverRes.json();
                setComments([...comments, serverResJson])
                setComment("");
            }
            //props.setReload(!props.reload);
        }
    }

    const changeComment = (event) => {
        setComment(event.target.value);
    }

    const FollowUser = async (event) => {
        const id = event.target.id;
        await fetch("http://localhost:8000/user/addfollower", {
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
    }

    const updateReportData = (event) => {
        setReport(event.target.value);
    }

    const submitReport = async (event) => {
        props.loading(true);
        event.preventDefault();
        const buttonClicked = event.target;
        let id = buttonClicked.parentElement.parentElement.parentElement.parentElement.id;
        id = id.replace("Report", "");
        const serverRes = await fetch("http://localhost:8000/user/addReport", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer".concat(" ", localStorage.getItem("token")),
            },
            body: JSON.stringify({
                concern: report,
                postId: id,
            }),
        }
        );

        if (serverRes.status === 201) {
            //setloader(false);
            alert("Reported Post");
            setReport("");
        }
        else {
            setReport("");
        }
        props.loading(false);
    }

    if (localStorage.getItem("token")) {
            return (
                <div>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <div className="card" style={{ minWidth: "80%", maxWidth: "90%" }} id={props.id}>
                            <div className="card-header cardHeaderPost">
                                <div className='FollowPost'>
                                    <div style={{ display: "flex", marginBottom: "10px" }}>
                                        <img src={bitmoji} alt="bit" style={{ borderRadius: "50%", border: "1px #fff solid", marginRight: "10px" }} height="40px" width="40px" />
                                        <div className='postedBy'>
                                            <span>Posted By</span>
                                            <span>{props.postedBy}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <span id={props.postedByid} className="followProfile" style={{ backgroundColor: "#fff", color: "#fa709a", borderRadius: "5px", padding: "5px", cursor: "pointer", fontWeight: "500" }} onClick={FollowUser} >Follow</span>
                                    </div>
                                </div>
                                <p>{props.post}</p>
                                <div className='LikeDislikeWrapper'>
                                    <div className='LikeDislike'>
                                        <span style={{ border: "1px solid #fff", display: "flex", padding: "5px 10px", borderTopLeftRadius: "20px", borderBottomLeftRadius: "20px" }}>
                                            {liked < 1 ? <AiOutlineLike size={20} id={"like" + props.id} style={{ marginRight: "2px", cursor: "pointer" }} onClick={likePost} /> : <AiFillLike size={20} id={"like" + props.id} style={{ marginRight: "2px", cursor: "pointer" }} onClick={unlikePost} ></AiFillLike>}
                                            <span>{numliked}</span>
                                        </span>
                                        <span style={{ border: "1px solid #fff", display: "flex", padding: "5px 10px", borderTopRightRadius: "20px", borderBottomRightRadius: "20px" }}>
                                            {disliked < 1 && <AiOutlineDislike size={22} id={"dislike" + props.id} style={{ marginRight: "2px", cursor: "pointer" }} onClick={dislikePost} />}
                                            {disliked > 0 && <AiFillDislike size={20} id={"dislike" + props.id} style={{ marginRight: "2px", cursor: "pointer" }} onClick={dislikePostDelete} />}
                                        </span>
                                    </div>
                                    <div className='CommentSave'>
                                        <a style={{ color: "#fff", textDecoration: "none", marginRight: "10px" }} data-bs-toggle="collapse" href={"#" + "collapse" + props.id} >
                                            <GoComment size={25} style={{ marginRight: "5px" }} />
                                            <span>{comments.length} Comments</span>
                                        </a>
                                        <span style={{ marginRight: "5px" }}>
                                            {saved < 1 && <BsBookmark size={25} id={"save" + props.id} style={{ marginRight: "5px", cursor: "pointer" }} onClick={savePost} />}
                                            {saved > 0 && <BsBookmarkFill size={25} id={"save" + props.id} style={{ marginRight: "5px", cursor: "pointer" }} onClick={unsavePost} />}
                                            <span>Save</span>
                                        </span>
                                        <span style={{ color: "red", fontWeight: "500", cursor: "pointer" }} data-bs-toggle="modal" data-bs-target={"#Report" + props.id} >
                                            <TbMessageReport size={30} style={{ color: "red" }} />Report
                                        </span>
                                        <div className="modal" id={"Report" + props.id}>
                                            <div className="modal-dialog">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h4 className="modal-title" style={{ color: "black" }}>Submit a Report</h4>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={() => { setReport(""); }} ></button>
                                                    </div>

                                                    <div className="modal-body">
                                                        <p style={{ color: "black" }}>
                                                            Thanks for looking out for yourself and your fellow redditors by reporting things that break the rules. Let us know what's happening, and we'll look into it.
                                                        </p>
                                                        <form onSubmit={submitReport} >
                                                            <textarea type="text" placeholder="What's your Concern?" value={report} style={{ width: "100%", height: "100px", 'wordBreak': 'break-all', padding: "5px" }} onChange={updateReportData} required></textarea>
                                                            <button type="submit" className='Reportsubmit' data-bs-dismiss="modal" >Report</button>
                                                        </form>
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => { setReport(""); }}>Close</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id={"collapse" + props.id} className="collapse" data-bs-parent="#accordion">
                                <div className="card-body" style={{ display: "flex", padding: "10px", backgroundColor: "rgb(187, 193, 240)", color: "black", flexDirection: "column" }}>
                                    <div className='addComment'>
                                        <input placeholder='Add a comment' style={{ wordBreak: "break-all" }} value={commentUser} onChange={changeComment}></input>
                                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                            <button type='submit' onClick={addComment}>Comment</button>
                                        </div>
                                    </div>
                                    {comments.filter((element) => {
                                        if (!element.parent)
                                            return true
                                        else
                                            return false
                                    }).map((element) => {
                                        return <NestingComment key={element._id} id={element._id} username={element.userName} comment_data={element.comment} />
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
    }
    else {
        return (
            <Navigate to="/" />
        )
    }
}
