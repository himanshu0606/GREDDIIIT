import React, { useEffect, useState } from 'react'
import "../style/conversation.css"
import { BsPersonCircle } from "react-icons/bs";

export default function Conversation(props) {

    const [user, setUser] = useState(null);
    const getDetUser = async (id) => {
        const serverRes = await fetch("http://localhost:8000/user/getDetuser", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer".concat(" ", localStorage.getItem("token")),
            },
            body: JSON.stringify({
                userid: id,
            }),
        }
        );
        if (serverRes.status === 201) {
            const serverResJson = await serverRes.json();
            setUser(serverResJson.userInfo)
        }

    }

    useEffect(() => {
        let friend = "";
        if (props.ele.members[0].toString() === props.user.toString())
            friend = props.ele.members[1].toString();
        else
            friend = props.ele.members[0].toString();
        getDetUser(friend);
    }, [props])
    return (
        <div className='conversation'>
            <BsPersonCircle size={40} style={{ marginRight: "10px" }} />
            <span style={{ cursor: "pointer", fontWeight: "500", fontSize: "20px" }}>{user?.username}</span>
        </div>
    )
}
