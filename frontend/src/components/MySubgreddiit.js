import React, { useState, useEffect } from 'react'
import Navbar from './Navbar'
import "../style/MySubgreddiit.css";
import { AiFillPlusSquare } from "react-icons/ai";
import { MdOutlineArrowBack } from "react-icons/md";
import { Navigate } from 'react-router-dom';
import AccordianSubGreddiit from './AccordianMySubGreddiit.js';
import Loader from './Loader';

export default function MySubgreddiit(props) {
    const [userSub, setuserSub] = useState([]);
    const [newsub, setnewSub] = useState(0);
    const [loader, setloader] = useState(false);
    const [newSubData, setSubData] = useState({
        name: "",
        desc: "",
        tags: "",
        banned: "",
        imagefile: "",
    })
    const [reload, setReload] = useState(false);

    const updateSubData = (event) => {
        setSubData({
            ...newSubData,
            [event.target.name]: event.target.value,
        });
    }

    const updateImage = async (event) => {
        const file = event.target.files[0];
        const base64 = await convertTobase64(file);
        setSubData({
            ...newSubData,
            imagefile: base64,
        });
    }

    const convertTobase64 = (file) => {
        return new Promise((resolve, reject) => {
            const filereader = new FileReader();
            filereader.readAsDataURL(file);
            filereader.onload = () => {
                resolve(filereader.result);
            };
            filereader.onerror = (error) => {
                reject(error);
            }
        })
    }

    const createNewsub = () => {
        setnewSub(1);
    }
    const backButton = () => {
        setnewSub(0);
    }
    const fetchSubgreddiit = async () => {
        props.setProgress(30);
        setloader(true);
        const serverRes = await fetch("http://localhost:8000/user/getsubgreddiit", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer".concat(" ", localStorage.getItem("token")),
            },
        }
        );
        props.setProgress(70);
        const serverResJson = await serverRes.json();
        setuserSub(serverResJson.subgreddiitUser);
        props.setProgress(100);
        setloader(false);
    }

    const createNewSubSubmit = async (event) => {
        event.preventDefault();
        setloader(true);
        let tags = newSubData.tags.split(",");
        for (let i = 0; i < tags.length; i++) {
            tags[i].trim();
        }
        tags = tags.filter((element) => {
            return element !== "";
        })
        let banned = newSubData.banned.split(",");
        for (let i = 0; i < banned.length; i++) {
            banned[i].trim();
        }
        banned = banned.filter((element) => {
            return element !== "";
        })

        const serverRes = await fetch("http://localhost:8000/user/createsubgreddiit", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer".concat(" ", localStorage.getItem("token")),
            },
            body: JSON.stringify({
                name: newSubData.name,
                desc: newSubData.desc,
                tags: tags,
                banned: banned,
                file: newSubData.imagefile,
            })
        }
        );

        if (serverRes.status === 201) {
            alert("New Subgreddiit Created");
            setSubData({
                name: "",
                desc: "",
                tags: "",
                banned: "",
                file: "",
            })
            setReload(!reload);
        }
        else {
            alert("Error Occured")
            setSubData({
                name: "",
                desc: "",
                tags: "",
                banned: "",
                file: "",
            })
        }
        setnewSub(0);
        setloader(false);
    }

    useEffect(() => {
        fetchSubgreddiit();
    }, [reload]);


    if (localStorage.getItem("token")) {
        if (loader === "true") {
            return (
                <Loader />
            )
        }
        else {
            return (
                <>
                    <Navbar />
                    <div className='mySubgreddiitBody'>
                        <div className='row container-fluid'>
                            <div className='col-sm-12 col-xl-6' >
                                {!newsub && <div style={{ display: "flex", justifyContent: "center", height: "600px" }}>
                                    <div className='createSub'>
                                        <AiFillPlusSquare size={50} style={{ color: "#fa709a", marginRight: "10px", cursor: "pointer" }} onClick={createNewsub} />
                                        <h3><b>Create New Subgreddiit</b></h3>
                                    </div>
                                </div>}
                                {newsub > 0 && <div className='formNewSub'>
                                    <div style={{ display: "flex", }}>
                                        <MdOutlineArrowBack size={50} style={{ color: "white", cursor: "pointer", marginBottom: "20px" }} onClick={backButton} />
                                    </div>
                                    <form onSubmit={createNewSubSubmit}>
                                        <div className="inputNewSub">
                                            <label><b>Name</b></label>
                                            <input type="text" onChange={updateSubData} name="name" value={newSubData.name} required></input>
                                        </div>
                                        <div className="inputNewSub">
                                            <label><b>Description</b></label>
                                            <input type="text" onChange={updateSubData} name="desc" value={newSubData.desc} required></input>
                                        </div>
                                        <div className="inputNewSub">
                                            <label><b>Tags</b></label>
                                            <input type="text" placeholder=", seperated values" name="tags" onChange={updateSubData} value={newSubData.tags} required></input>
                                        </div>
                                        <div className="inputNewSub">
                                            <label><b>Banned Keywords</b></label>
                                            <input type="text" placeholder=", seperated values" name="banned" onChange={updateSubData} value={newSubData.banned} required></input>
                                        </div>
                                        <div className="inputNewSubImage">
                                            <label><b>Upload Image</b></label>
                                            <input type="file" accept=".jpeg,.png,.jpg" name="myFiles" onChange={updateImage}></input>
                                        </div>
                                        <button type="submit" className='createNewSub'>Create</button>
                                    </form>
                                </div>
                                }
                            </div>
                            <div className='col-sm-12 col-xl-6'>
                                {userSub.map((element) => {
                                    return <AccordianSubGreddiit key={element._id} reload={reload} setReload={setReload} id={element._id} name={element.name} desc={element.desc} users={element.follower.length} posts={element.posts.length} banned={element.banned} tags={element.tags} />
                                })}
                            </div>

                        </div>
                    </div>
                </>
            )
        }
    }
    else {
        return (
            <Navigate to="/" replace={true} />
        )
    }
}
