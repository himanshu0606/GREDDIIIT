import React from 'react'
import { useNavigate,Navigate } from 'react-router-dom'

export default function AccordianSubGreddiit(props) {
    const navigate = useNavigate();

    const LeaveSub = async (event) => {
        const buttonClicked = event.target;
        let parent = buttonClicked.parentElement.parentElement.parentElement.parentElement;
        const parentId = parent.id;
        const id = parentId.replace("collapseOne", "");
        const serverRes = await fetch("http://localhost:8000/user/leavesubgreddiit", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer".concat(" ", localStorage.getItem("token")),
            },
            body: JSON.stringify({
                LeaveSub: id,
            })
        }
        );
        if (serverRes.status === 201) {
            props.setreload(!props.reload);
            alert("You have left subgreddiit");
        }
    }
    const joinSub = async (event) => {
        const buttonClicked = event.target;
        let parent = buttonClicked.parentElement;

        const parentId = parent.id;

        const id = parentId.replace("#collapseOne", "");
        const serverRes = await fetch("http://localhost:8000/user/joinsubgreddiit", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer".concat(" ", localStorage.getItem("token")),
            },
            body: JSON.stringify({
                JoinSub: id,
            })
        });
        if (serverRes.status === 401) {
            alert("Your are Blocked by user");
        }
        else if (serverRes.status === 400) {
            alert("Joining Request Already Sent");
        }
        else if (serverRes.status === 201) {
            console.log("sent");
        }
        else if (serverRes.status === 202) {
            alert("You cannot join this SubGreddit");
        }
        props.setreload(!props.reload);
    }

    const WarnSub = async () => {
        alert("You cannot join this SubGreddiit");
    }

    const incVisitor = async (event) => {
        const buttonClicked = event.target;
        let parent = buttonClicked.parentElement.parentElement.parentElement.parentElement;

        const parentId = parent.id;
        const id = parentId.replace("collapseOne", "");
        const serverRes = await fetch("http://localhost:8000/user/incVisitor", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer".concat(" ", localStorage.getItem("token")),
            },
            body: JSON.stringify({
                sub_Id: id,
            })
        }
        );
        if (serverRes.status === 201)
            navigate(`/subgreddiits/${props.id}`);
    }
    if (localStorage.getItem("token")) {
        return (
            <div>
                <div id="accordion">
                    <div className="card">
                        <div className="card-header" id={props.id} style={{ padding: "5px 10px", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fa709a" }}>
                            <a className="btn " data-bs-toggle="collapse" href={"#" + "collapseOne" + props.id}>
                                <b className="subGreddiitName">{props.name}</b>
                            </a>

                            {!props.followed &&
                                <>
                                    {(!props.unfollowed) &&
                                        <span style={{ color: "#fa709a", backgroundColor: "#fff", padding: "5px", borderRadius: "5px", cursor: "pointer", fontWeight: "600" }} onClick={joinSub}>Join</span>}
                                    {(props.unfollowed) &&
                                        <span style={{ color: "#fa709a", backgroundColor: "#fff", padding: "5px", borderRadius: "5px", cursor: "pointer", fontWeight: "600" }} onClick={WarnSub}>Join</span>}
                                </>
                            }
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
                                            <span style={{ 'wordBreak': 'break-all' }}>{props.desc}</span>
                                        </div>
                                        <div className='SubGreddiitDesc'>
                                            <span>Banned Keywords:</span>
                                            <span style={{ 'wordBreak': 'break-all' }}>{props.banned.join(" , ")}</span>
                                        </div>
                                        <div className='SubGreddiitDesc'>
                                            <span>Tags:</span>
                                            <span style={{ 'wordBreak': 'break-all' }}>{props.tags.join(" , ")}</span>
                                        </div>
                                    </div>
                                    <div className='RemovesubGreddiit'>
                                        {props.followed && <>
                                            <span onClick={incVisitor}>Profile</span>
                                            {(props.owner !== props.currUser) &&
                                                <span onClick={LeaveSub}>Leave</span>}
                                            {(props.owner === props.currUser) &&
                                                <span className='disabled' style={{ cursor: "not-allowed", opacity: "0.6" }}>Leave</span>}</>
                                        }
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
