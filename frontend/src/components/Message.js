import React from 'react'
import "../style/conversation.css"
import { BsPersonCircle } from "react-icons/bs";
import { format } from "timeago.js";

export default function Message({ msg, own }) {
    return (
        <div className={own ? "message own" : "message"}>
            <div className='messageTop'>
                <BsPersonCircle size={30} style={{ marginRight: "10px" }} />
                <p className='messageText'>{msg.text}</p>
            </div>
            <div className='messageBottom'>
                {format(msg.createdAt)}
            </div>
        </div>
    )
}
