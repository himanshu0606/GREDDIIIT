import React, { useEffect, useState } from 'react';
import { BsPersonCircle } from "react-icons/bs";
import bitmoji from "../images/bitmoji.png";
import { useNavigate } from 'react-router-dom';

export default function FollowerItems(props) {
    const navigate = useNavigate();
    const [chat, setchat] = useState(false);
    const removeFol = async (event) => {
        const buttonClicked = event.target;
        let parent = buttonClicked.parentElement.parentElement;
        const parentId = parent.id;
        console.log(parentId)
        props.setloader(true);
        const serverRes = await fetch("http://localhost:8000/user/removefollower", {
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
            props.setReload(!props.reload);
        }
        props.setloader(false);
    }

    const chatable = async () => {
        const serverRes = await fetch("http://localhost:8000/user/chatable", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer".concat(" ", localStorage.getItem("token")),
            },
            body: JSON.stringify({
                id: props.element._id,
            }),
        }
        );

        await serverRes.json();
        if (serverRes.status === 201) {
            setchat(1);
        }
        else if (serverRes.status === 202) {
            setchat(0);
        }
    }

    useEffect(() => {
        chatable();
    }, []);

    const chatstart = async (event) => {
        let id = event.target.id;
        id=id.replace("chat","");
        console.log(id);

        const serverRes = await fetch("http://localhost:8000/user/conversation", {
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
            navigate("/chat");
        }
    }

    return (
        <>
            <div key={props.element._id}>
                <div className='tableRow' id={props.element._id} style={{ margin: "20px" }}>
                    <div className='FollowerName'>
                        <BsPersonCircle size={30} style={{ margin: "7px" }} />
                        <a data-bs-toggle="offcanvas" href={"#offcanvas" + props.element._id} role="button" aria-controls="offcanvasExample" className="FollowerLink">{props.element.username}</a>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <button type='submit' onClick={removeFol} className='followerRemove'>Remove</button>
                        {chat ? <button type='submit' id={"chat" + props.element._id} onClick={chatstart} className='followerRemove'>Chat</button> : null}
                    </div>
                </div>
                <div className="offcanvas offcanvas-start" tabIndex="-1" id={"offcanvas" + props.element._id} aria-labelledby="offcanvasExampleLabel" style={{ backgroundColor: "rgb(187, 193, 240)", color: "#fff" }}>
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
                                        <span style={{ padding: "5px", borderRadius: "5px", textAlign: "center" }}>{props.element.username}</span>
                                    </div>
                                </div>
                                <div className='subGreddiitUser-Post'>
                                    <div className='UserSubgreddiit'>
                                        <span style={{ margin: "0px 10px" }}>Follower:</span>
                                        <span style={{ width: "40px", backgroundColor: "#fa709a", borderRadius: "5px", textAlign: "center" }}>{props.element.follower.length}</span>
                                    </div>
                                    <div className='UserSubgreddiit'>
                                        <span style={{ marginRight: "5px" }}>Following:</span>
                                        <span style={{ width: "40px", backgroundColor: "#fa709a", borderRadius: "5px", textAlign: "center" }}>{props.element.following.length}</span>
                                    </div>
                                </div>
                                <div className='SubgreddiitDet'>
                                    <span style={{ marginRight: "10px" }}>Name:</span>
                                    <span style={{ color: "#fa709a", 'wordBreak': 'break-all' }}>{props.element.firstname + " " + props.element.lastname}</span>
                                </div>
                                <div className='SubgreddiitDet'>
                                    <span style={{ marginRight: "10px" }}>Age:</span>
                                    <span style={{ color: "#fa709a", 'wordBreak': 'break-all' }}>{props.element.age}</span>
                                </div>
                                <div className='SubgreddiitDet'>
                                    <span style={{ marginRight: "10px" }}>Email:</span>
                                    <span style={{ color: "#fa709a", 'wordBreak': 'break-all' }}>{props.element.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
