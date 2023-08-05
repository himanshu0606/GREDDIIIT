import React from 'react'
import { Link,Navigate } from 'react-router-dom';

export default function AccordianSubGreddiit(props) {
    const DeleteSub = async (event) => {
        const buttonClicked = event.target;
        let parent = buttonClicked.parentElement.parentElement.parentElement.parentElement;
        const parentId = parent.id;
        const id = parentId.replace("collapseOne", "");
        await fetch("http://localhost:8000/user/deletesubgreddiit", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer".concat(" ", localStorage.getItem("token")),
            },
            body: JSON.stringify({
                deleteSub: id,
            })
        }
        );
        // parent.parentElement.remove();
        props.setReload(!props.reload);
    }
    if (localStorage.getItem("token")) {
        return (
            <div>
                <div id="accordion">

                    <div className="card">
                        <div className="card-header" style={{ padding: "5px", textAlign: "center", backgroundColor: "#fa709a" }}>
                            <a className="btn " data-bs-toggle="collapse" href={"#" + "collapseOne" + props.id}>
                                <b className="subGreddiitName">{props.name}</b>
                            </a>
                        </div>
                        <div id={"collapseOne" + props.id} className="collapse" data-bs-parent="#accordion">
                            <div className="card-body" style={{ padding: "10px", backgroundColor: "rgb(187, 193, 240)" }}>
                                <div className='mysubGreddiitBody'>
                                    <div className='mysubGreddiitUser-Post'>
                                        <div className='UserSubgreddiit'>
                                            <span style={{ margin: "0px 10px" }}>User:</span>
                                            <span style={{ width: "40px", backgroundColor: "#fa709a", borderRadius: "5px", textAlign: "center" }}>{props.users}</span>
                                        </div>
                                        <div className='UserSubgreddiit'>
                                            <span style={{ marginRight: "5px" }}>Post:</span>
                                            <span style={{ width: "40px", backgroundColor: "#fa709a", borderRadius: "5px", textAlign: "center" }}>{props.posts}</span>
                                        </div>
                                    </div>
                                    <div className='SubGreddiitDetails'>
                                        <div className='SubGreddiitDesc'>
                                            <span>Description:</span>
                                            <span>{props.desc}</span>
                                        </div>
                                        <div className='SubGreddiitDesc'>
                                            <span>Banned Keywords:</span>
                                            <span>{props.banned.join(" , ")}</span>
                                        </div>
                                        <div className='SubGreddiitDesc'>
                                            <span>Tags:</span>
                                            <span>{props.tags.join(" , ")}</span>
                                        </div>
                                    </div>
                                    <div className='RemovesubGreddiit'>
                                        <span><Link to={`/mysubgrediits/${props.id}`} style={{ color: "white", textDecoration: "none" }}>Profile</Link></span>
                                        <span onClick={DeleteSub}>Delete</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
    else {
        return (
            <Navigate to="/" />
        )
    }
}
