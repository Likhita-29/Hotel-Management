import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Component/Header/Header";
import Sidebar from "../Component/Sidebar/Sidebar";

const MainLayout=()=>
{
    return (
        <>
          <div className="layout">
        <div className="main-container">
            <Sidebar/>
            <div className="content">
            <Header className="header"/>
            <div className="dashboard">
                <Outlet/>
            </div>
            </div>
        </div>
        </div>
        </>
    )
}

export default MainLayout