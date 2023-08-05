import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom';
import Navbar from './Navbar'
import "../style/savedPost.css"
import AccordianSubgrdiitSaved from './AccordianSubgrdiitSaved.js';
import Loader from './Loader';

export default function SavedPost(props) {
    const [savedpost, setSavedPost] = useState([]);
    const [user, setUser] = useState("");
    const [reload, setReload] = useState(false);
    const [loader, setloader] = useState(false);
    const fetchSaved = async () => {
        setloader(true);
        const serverRes = await fetch("http://localhost:8000/user/getSavedpost", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer".concat(" ", localStorage.getItem("token")),
            },
        }
        );

        if (serverRes.status === 201) {
            const serverResJson = await serverRes.json();
            setSavedPost(serverResJson.saved);
            setUser(serverResJson.user);
        }
        setloader(false);
    }

    useEffect(() => {
        fetchSaved();
    }, [reload]);

    if (localStorage.getItem("token")) {
        if (loader === true) {
            return <Loader />
        }
        else {
            return (
                <div>
                    <Navbar />
                    <div className='savePostWrapper'>
                        <div style={{ marginTop: "20px" }}>
                            {savedpost.map((element) => {
                                if (element.liked.includes(user)) {
                                    return <AccordianSubgrdiitSaved key={element._id} id={element._id} reload={reload} setReload={setReload} saved={1} post={element.post} liked={element.liked.length} postedBy={element.postedBy.username} postedByid={element.postedBy.id} likedUser={1} dislikedUser={0} disliked={element.disliked.length} comments={element.comments} sub={element.sub} />
                                }
                                else if (element.disliked.includes(user)) {
                                    return <AccordianSubgrdiitSaved key={element._id} id={element._id} reload={reload} setReload={setReload} saved={1} post={element.post} liked={element.liked.length} postedBy={element.postedBy.username} postedByid={element.postedBy.id} likedUser={0} dislikedUser={1} disliked={element.disliked.length} comments={element.comments} sub={element.sub} />
                                } else {
                                    return <AccordianSubgrdiitSaved key={element._id} id={element._id} reload={reload} setReload={setReload} saved={1} post={element.post} liked={element.liked.length} postedBy={element.postedBy.username} postedByid={element.postedBy.id} likedUser={0} dislikedUser={0} disliked={element.disliked.length} comments={element.comments} sub={element.sub} />
                                }
                            })}
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
