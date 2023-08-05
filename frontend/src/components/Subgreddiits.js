import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import "../style/SubGreddiit.css";
import AccordianAllSubGreddiit from './AccordianAllSubGreddiit.js';
import Fuse from "fuse.js";

export default function Subgreddiits(props) {
    const [searchName, setSearch] = useState("");
    const [FilterName, setfilter] = useState("");
    const [FilterArr, setfilterArr] = useState("");
    const [allSubGreddiit, setAllSubGreddiit] = useState([]);
    const [nameIscheckedAsc, setNameCheckedAsc] = useState(false);
    const [nameIscheckedDesc, setNameCheckedDesc] = useState(false);
    const [followerIschecked, setFollowerChecked] = useState(false);
    const [dateIschecked, setDateChecked] = useState(false);
    const [currUser, setCurrUser] = useState("");
    const [reload, setReload] = useState(true);

    const nameOnChangeAsc = () => {
        setNameCheckedAsc(!nameIscheckedAsc);
    }
    const nameOnChangeDesc = () => {
        setNameCheckedDesc(!nameIscheckedDesc);
    }
    const followerOnChange = () => {
        setFollowerChecked(!followerIschecked);
    }
    const dateOnChange = () => {
        setDateChecked(!dateIschecked);
    }

    const SearchClicked = (event) => {
        event.preventDefault();
    }
    const FilterClicked = (event) => {
        event.preventDefault();
        const tags = FilterName.split(",");
        if (tags[tags.length - 1] === "") {
            tags.pop();
        }
        for (let i = 0; i < tags.length; i++) {
            tags[i].trim();
        }
        setfilterArr(tags);
    }

    const FilterChange = (event) => {
        event.preventDefault();
        setfilter(event.target.value);
    }

    const filterArray = () => {
        let followed = [];
        let unfollowed = [];
        let copyAllsub = [...allSubGreddiit];

        for (let i = 0; i < allSubGreddiit.length; i++) {
            if (allSubGreddiit[i].unfollowedUser.includes(currUser)) {
                allSubGreddiit[i].unfollowed = true;
            }
            else {
                allSubGreddiit[i].unfollowed = false;
            }

            if (allSubGreddiit[i].follower.includes(currUser)) {
                allSubGreddiit[i].followed = true;
                followed.push(allSubGreddiit[i]);
            }
            else {
                allSubGreddiit[i].followed = false;
                unfollowed.push(allSubGreddiit[i]);
            }
        }

        let copy = [...followed, ...unfollowed];
        let copy2 = [];
        if (searchName !== "") {
            const options = {
                keys: ["name"],
                // matchAllOnEmptyQuery: true,
            };
            const fuse = new Fuse(copy, options);
            const result = fuse.search(searchName);
            for (let i = 0; i < result.length; i++) {
                copy2.push(result[i].item);
            }
            copy = [...copy2];
        }

        if (FilterArr.length > 0) {
            copy = copy.filter((element) => {
                if (element.tags) {
                    for (let i = 0; i < element.tags.length; i++) {
                        if (FilterArr.includes(element.tags[i])) {
                            return true;
                        }
                    }
                    return false;
                }
                else {
                    return false;
                }
            })
        }
        if (nameIscheckedAsc) {
            copy.sort((a, b) => {
                return a.name.localeCompare(b.name);
            })
        }
        if (nameIscheckedDesc) {
            copy.sort((a, b) => {
                return b.name.localeCompare(a.name);
            })
        }
        if (followerIschecked) {
            copy.sort((a, b) => {
                return b.follower.length - a.follower.length;
            })
        }
        if (dateIschecked) {
            copy = copyAllsub.reverse();
        }


        return copy;
    }

    const SearchChange = (event) => {
        event.preventDefault();
        setSearch(event.target.value);
    }

    const fetchAllSubgreddiit = async () => {
        props.setProgress(20);
        const serverRes = await fetch("http://localhost:8000/user/getAllsubgreddiit", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer".concat(" ", localStorage.getItem("token")),
            },
        }
        );
        props.setProgress(70);
        if (serverRes.status === 201) {
            const serverResJson = await serverRes.json();
            setAllSubGreddiit(serverResJson.Greddiit);
            setCurrUser(serverResJson.user);
        }
        props.setProgress(100);
    }

    useEffect(() => {
        fetchAllSubgreddiit();
    }, [reload]);

    if (localStorage.getItem("token")) {
        return (
            <div>
                <Navbar />
                <div className='subgreddiit'>
                    <div className='row container-fluid'>
                        <div className='col-xl-3'>
                            <div className='searchGreddit'>
                                <form className='filterSearchSub' onSubmit={FilterClicked}>
                                    <input placeholder='Filter Based On Tag ( , seperated)' value={FilterName} type="text" onChange={FilterChange}></input>
                                    <button type='submit' className='submitButtonSub'>Filter</button>
                                </form>
                                <div className='SortSub'>
                                    <h3 style={{ textAlign: "center" }}>Sort By:</h3>
                                    <div className='checkBoxSort'>
                                        <input type="checkbox" id="nameAsc" value="subName" onChange={nameOnChangeAsc}></input>
                                        <label>Name(Ascending)</label>
                                    </div>
                                    <div className='checkBoxSort'>
                                        <input type="checkbox" id="nameDesc" value="subName" onChange={nameOnChangeDesc}></input>
                                        <label>Name(Descending)</label>
                                    </div>
                                    <div className='checkBoxSort'>
                                        <input type="checkbox" id="follower" value="subFollower" onChange={followerOnChange}></input>
                                        <label>Follower</label>
                                    </div>
                                    <div className='checkBoxSort'>
                                        <input type="checkbox" id="date" value="subDate" onChange={dateOnChange}></input>
                                        <label>Creation Date</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-xl-6 col-sm-12'>
                            <div className='searchGreddit'>
                                <form className='formSearchSub' onSubmit={SearchClicked}>
                                    <input placeholder='Search SubGreddiit' value={searchName} type="text" onChange={SearchChange}></input>
                                    <button type="submit" className='submitButtonSub'>Search</button>
                                </form>
                            </div>
                            {filterArray().map((element) => {
                                return <AccordianAllSubGreddiit key={element._id} setreload={setReload} reload={reload} id={element._id} name={element.name} desc={element.desc} users={element.follower.length} posts={element.posts.length} tags={element.tags} banned={element.banned} currUser={currUser} owner={element.owner} followed={element.followed} unfollowed={element.unfollowed} />
                            })}
                        </div>
                        <div className='col-xl-3'>
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
