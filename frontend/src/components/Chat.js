import React, { useEffect, useState, useRef } from 'react'
import Navbar from './Navbar'
import "../style/conversation.css"
import Conversation from './Conversation'
import Message from './Message'
import { io } from "socket.io-client"
import { Navigate } from "react-router-dom"

export default function Chat() {
    const [conversation, setconversation] = useState([]);
    const [currChat, setcurrchat] = useState(null);
    const [message, setMessage] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [chat, setchat] = useState("");
    const [user, setUser] = useState(null);
    const socket = useRef();
    const scrollRef = useRef();

    useEffect(() => {
        socket.current = io("http://localhost:8000");
        console.log(socket);
        socket.current.on("getMessage", data => {
            setArrivalMessage({
                senderId: data.senderId,
                text: data.text,
                createdAt: Date.now(),
            });
        });
        console.log(arrivalMessage);
    }, []);

    useEffect(() => {
        if (user) {
            socket.current.emit("addUser", user);
        }
    }, [user])


    useEffect(() => {
        if (currChat) {
            const getMessage = async () => {
                const serverRes = await fetch(`http://localhost:8000/user/chat/fetchMessage`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": "Bearer".concat(" ", localStorage.getItem("token")),
                    },
                    body: JSON.stringify({
                        conversationId: currChat._id
                    }),
                }
                );
                if (serverRes.status === 201) {
                    const serverResJson = await serverRes.json();
                    setMessage(serverResJson);
                }
            }
            getMessage();
        }
    }, [currChat]);

    useEffect(() => {
        console.log(arrivalMessage);
        arrivalMessage && currChat?.members.includes(arrivalMessage.senderId) && setMessage((prev) => [...prev, arrivalMessage])
    }, [arrivalMessage, currChat]);

    useEffect(() => {
        const getConverstaion = async () => {
            const serverRes = await fetch("http://localhost:8000/user/getconversation", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "authorization": "Bearer".concat(" ", localStorage.getItem("token")),
                },
            }
            );
            if (serverRes.status === 201) {
                const serverResJson = await serverRes.json();
                setconversation(serverResJson.convos);
                setUser(serverResJson.user)
            }
        }

        getConverstaion();
    }, []);

    const receiverId = currChat?.members.find(element => element !== user);

    const sendMessage = async (event) => {
        event.preventDefault()
        socket.current.emit("sendMessage", {
            senderId: user,
            receiverId: receiverId,
            text: chat,
        })
        const serverRes = await fetch("http://localhost:8000/user/message", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer".concat(" ", localStorage.getItem("token")),
            },
            body: JSON.stringify({
                conversationId: currChat,
                senderId: user,
                text: chat
            })
        }
        );
        if (serverRes.status === 201) {
            const serverResJson = await serverRes.json();
            setMessage([...message, serverResJson])
            setchat("");
        }
    }

    useEffect(() => {
        scrollRef.current?.scrollIntoView()
    }, [message])

    if (localStorage.getItem("token")) {
        return (
            <div>
                <Navbar />
                <div className='wrapperChat'>
                    <div className='chatMenu'>
                        <div className='chatMenuWrapper'>
                            <input placeholder='Seacrh freinds' className='inputChatMenu'></input>
                            {
                                conversation.map((element) => {
                                    return <div key={element._id}>
                                        <div onClick={() => {
                                            setcurrchat(element)
                                        }}>
                                            <Conversation ele={element} user={user} />
                                        </div>
                                    </div>
                                })
                            }
                        </div>
                    </div>
                    <div className='chatBox'>
                        <div className='chatBoxWrapper'>
                            {
                                currChat ?
                                    <>
                                        <div className='chatBoxTop'>
                                            {
                                                message.map((element) => {
                                                    return <div key={element._id} ref={scrollRef}><Message msg={element} own={element.senderId.toString() === user.toString() ? true : false} /></div>
                                                })
                                            }
                                        </div>
                                        <div>
                                            <form onSubmit={sendMessage} className='chatBoxBottom'>
                                                <textarea className='chatMessageInput' placeholder='Write Something...' value={chat} onChange={(event) => {
                                                    setchat(event.target.value)
                                                }}></textarea>
                                                <button type='submit' className='chatMessageSubmit'>Send</button>
                                            </form>
                                        </div>
                                    </> : <span className="Nochat">Open a Conversation to start chat</span>}
                        </div>
                    </div>
                    <div className='chatOnline'>
                        <div className='chatOnlineWrapper'></div>
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
