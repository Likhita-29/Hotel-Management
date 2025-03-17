import React from "react";
import Header from "../Component/Header/Header";
import Sidebar from "../Component/Sidebar/Sidebar";
import Room from "../Room/Room";

const LayoutRoom=()=>
{
    return (
        <>
          <div className="layout">
        <div className="main-container">
            <Sidebar/>
            <div className="content">
            <Header className="header" />
            <Room className="dashboard" />
            </div>
        </div>
        </div>


        </>
    )
}

export default LayoutRoom