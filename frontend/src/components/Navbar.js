import React from 'react'
import { Link } from 'react-router-dom';
import { FaReddit } from 'react-icons/fa'
import { MdLogout } from "react-icons/md";
import { BsFillChatDotsFill, BsFillBookmarkFill } from "react-icons/bs"
import { CgProfile } from "react-icons/cg";
import { HiBeaker } from "react-icons/hi";
import { IoIosBeer } from "react-icons/io";

export default function Navbar() {
    const Logoutclicked = () => {
        const mode = localStorage.getItem("mode");
        localStorage.removeItem("mode");
        localStorage.removeItem("token");
        if (mode === "cas") {
            window.open("http://localhost:8000/auth/logoutcas", "_self");
        }
        // else {
        //     window.sessionStorage.clear();
        // }
    }
    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid" style={{ padding: "0px 20px" }}>
                    <FaReddit style={{ color: "red", marginRight: "10px" }} size={50} /><b><h1 style={{ fontWeight: "600" }}><span style={{ color: "red", }}>Gredd</span ><span style={{ marginRight: "30px" }}>IIT</span></h1></b>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item " style={{ display: "flex", alignItems: "center" }}>
                                <CgProfile size={20} />
                                <Link className="nav-link ProfileNavLink" to="/profile">Profile</Link>
                            </li>
                            <li className="nav-item " style={{ display: "flex", alignItems: "center" }}>
                                <HiBeaker size={20} />
                                <Link className="nav-link ProfileNavLink" to="/mysubgreddiit">My SubGreddiits</Link>
                            </li>
                            <li className="nav-item " style={{ display: "flex", alignItems: "center" }}>
                                <IoIosBeer size={20} />
                                <Link className="nav-link ProfileNavLink" to="/subgreddiits">SubGreddiits</Link>
                            </li>
                            <li className="nav-item " style={{ display: "flex", alignItems: "center" }}>
                                <BsFillBookmarkFill size={20} />
                                <Link className="nav-link ProfileNavLink" to="/savedPost">Saved Posts</Link>
                            </li>
                            <li className="nav-item " style={{ display: "flex", alignItems: "center" }}>
                                <BsFillChatDotsFill size={20} />
                                <Link className="nav-link ProfileNavLink" to="/chat">Chats</Link>
                            </li>
                        </ul>
                        <button type="submit" className='profileLogout' onClick={Logoutclicked}>
                            <Link to="/" className='LogoutLinkProfile'><MdLogout />Logout</Link>
                        </button>
                    </div>
                </div>
            </nav>
        </div>
    )
}
