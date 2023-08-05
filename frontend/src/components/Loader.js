import React from 'react'
export default function Loader() {
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "rgb(149, 158, 236)", height: "100vh" }}>
            <div className="spinner-grow" role="status" style={{ width: "100px", height: "100px", color: "red" }}>
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    )
}
