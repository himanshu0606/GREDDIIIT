import React, { useEffect, useState } from 'react'
import bitmoji from "../images/bitmoji.png";
import { GoComment } from 'react-icons/go';

export default function NestingComment(props) {
    const [nestComment, setnestComment] = useState([]);
    const [clicked, setClicked] = useState(false);
    const [commentUser, setComment] = useState("");
    const [num_reply, setnum_reply] = useState(0);
    const [call_num_reply, setcallnum_reply] = useState(false);

    const changeComment = (event) => {
        setComment(event.target.value);
    }

    const fetchnest = async (event) => {
        if (clicked) {
            setClicked(false);
            return;
        }
        setClicked(true);
        const buttonClicked = event.target;
        const id = buttonClicked.id;

        const serverRes = await fetch("http://localhost:8000/user/nestComment", {
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
            const serverResJson = await serverRes.json();
            setnestComment(serverResJson.nestComment);
        }
    }

    const submitComment = async (event) => {
        event.preventDefault();
        if (commentUser) {
            const button = event.target;
            let id = button.id;
            id = id.replace("nest", "");
            const serverRes = await fetch("http://localhost:8000/user/addnestComment", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "authorization": "Bearer".concat(" ", localStorage.getItem("token")),
                },
                body: JSON.stringify({
                    Id: id,
                    reply: commentUser,
                }),
            }
            );

            if (serverRes.status === 201) {
                const serverResJson = await serverRes.json();
                console.log(serverResJson);
                setnestComment(serverResJson)
                setcallnum_reply(!call_num_reply);
                setComment("");
            }
        }
    }

    useEffect(() => {
        const fetch_num = async () => {
            const serverRes = await fetch("http://localhost:8000/user/fetchCommentNum", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "authorization": "Bearer".concat(" ", localStorage.getItem("token")),
                },
                body: JSON.stringify({
                    id: props.id,
                }),
            }
            );

            if (serverRes.status === 201) {
                const serverResJson = await serverRes.json();
                setnum_reply(serverResJson);
            }
        }
        fetch_num();
    }, [call_num_reply])

    return (
        <div style={{ marginLeft: "20px" }}>
            <div className='postComment'>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                    <img src={bitmoji} alt="bit" style={{ borderRadius: "50%", border: "1px #fff solid", marginRight: "10px" }} height="30px" width="30px" />
                    <span>{props.username}</span>
                </div>
                <div style={{ borderLeft: "1px solid grey", padding: "10px", marginLeft: "10px" }}>
                    {props.comment_data}
                </div>
                <div style={{ borderLeft: "1px solid grey", display: "flex", flexDirection: "row", padding: "10px", marginLeft: "10px", alignItems: "end" }}>
                    <div>
                        <GoComment id={props.id} onClick={fetchnest} size={20} style={{ marginRight: "5px", cursor: "pointer" }} />
                        <span style={{ opacity: "0.6" }}>{num_reply} Reply</span>
                    </div>
                </div>
                {clicked ? <>
                    <div className='addComment'>
                        <input placeholder='Add a comment' style={{ wordBreak: "break-all" }} value={commentUser} onChange={changeComment}></input>
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <button type='submit' id={"nest" + props.id} onClick={submitComment} >Comment</button>
                        </div>
                    </div>
                    {nestComment.map((element) => {
                        return <NestingComment key={element._id} id={element._id} username={element.username} comment_data={element.comment} />
                    })}</> : null}
            </div>
        </div>
    )
}
