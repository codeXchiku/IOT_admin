import React, { useContext, useState, useRef, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons";
import "bootstrap-icons/font/bootstrap-icons.css";
import { NavLink } from "react-router-dom";
import companylogo from "./companylogo.png";
import "./SideBar.css";
import { AdminContext } from "../../../App";
import { GrDocumentTest } from "react-icons/gr";


const Sidebar = () => {
  //for showing logout popup on click of user logo on top navbar
  const [logouttext, setLogouttext] = useState(false);
  const [logout, setLogout] = useState(false);

  //for on and  off of sidebar if sidebar is open show icon with corresponding name if  close only show icon
  const [sidebartoggle, setSidebarToggle] = useState(false);

  // from context api for expand and collapse of content according to sidebar
  const { isSidebarOpen, setIsSidebarOpen ,totalregisterduser } = useContext(AdminContext);




  const tologout = () => {
    setLogouttext(!logouttext);
  };
  const islogout = () => {
    setLogout(!logout);
  };
  const logoutRef = useRef(null);
  useEffect(() => {
    // Handler to call onClick outside of calendar component
    const handleClickOutside = (event) => {
      if (logoutRef.current && !logoutRef.current.contains(event.target)) {
        islogout();
      }
    };
    // Add event listener when calendar is shown
    if (logout) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line
  }, [islogout]);
  const handleLogout = () => {
    localStorage.removeItem("admin_id");
  };

  const sidebar = () => {
    console.log("click");
    setSidebarToggle(!sidebartoggle);
    setIsSidebarOpen(!isSidebarOpen);
  };


  return (
    <>
      {/* TopNavBar start */}
      <div className="topnavbarr shadow">
        <div className="d-flex justify-content-end">
          <i
            className=" userlogo  bi bi-person-circle "
            style={{
              fontSize: 30,
              height: "50px",
              alignItems: "center",
              marginRight: "50px",
            }}
            onClick={tologout}
          ></i>
        </div>
        <div className="d-flex justify-content-end ">
          {logouttext && (
            <>
              <div
                className="logoutpop"
                style={{
                  marginTop: "07px",
                  marginRight: "45px",
                  borderRadius: "10px",
                  backgroundColor: "#FFFFFF",
                  zIndex: 10,
                }}
              >
                <p
                  className="d-flex"
                  style={{
                    padding: "10px",
                    alignItems: "center",
                    marginTop: "10px",
                    justifyContent: "center",

                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                  onClick={islogout}
                >
                  <i
                    className="bi bi-box-arrow-right"
                    style={{
                      alignItems: "center",
                      marginRight: "5px",
                      fontSize: 20,
                    }}
                  ></i>
                  
                  Logout
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      {/* TopNavBar end */}

      {/* Top heading start  */}

      <div
        className="baronoff"
        style={{
          marginLeft: isSidebarOpen ? "280px" : "110px",
          marginTop: "7px",
        }}
      >
        <div className="heading">
          <p
            className=" headingText d-flex justify-content-center"
            style={{ fontSize: 20 }}
          >
            Aqua Admin
          </p>
        </div>
      </div>

      {/* Top heading End  */}

      {/* Sidebar , Logic  for toggel  */}

      {sidebartoggle ? (
        <div className="sideBar d-flex flex-column">
          <div className="d-flex justify-content-end">
            <div
              style={{
                fontSize: 30,
                backgroundColor: "white",
                borderRadius: "50%",
                margin: "7px 0 5px 5px",
                height: "30px",
                cursor: "pointer",
              }}
            >
              <i
                className="bi bi-arrow-left-short"
                style={{ top: "-7px", position: "relative" }}
                onClick={sidebar}
              ></i>
            </div>
          </div>
          <div className="logoss ">
            <img
              src={companylogo}
              alt="companylogo"
              style={{
                width: "80px",
                height: "80px",

                padding: "3px",

                margin: "10px 30px 0 77px",
              }}
            />

            {/* 1 */}
            <div className="outer">
              <NavLink
                to="/adminside/usernotification"
                className="sidemenu d-flex align-items-center userNotification "
              >
                <i
                  className="bi bi-people"
                  style={{ color: "black", fontSize: 20 }}
                ></i>{" "}
                <p
                  style={{
                    margin: "1px 0 0 15px",
                    color: "black",
                    textAlign: "center",
                  }}
                >
                  Notification
                </p>
              </NavLink>
              {totalregisterduser > 0 ? (
                  <div
                    style={{
                      position: "relative",
                      top: "-21px",
                      left:'5px',
                      width: "10px",
                      height: "10px",
                      backgroundColor: "rgb(197,34,31)",
                      borderRadius: "50%",
                    }}
                  ></div>
                ) : null}
            </div>

            {/* 2 */}

            <div className="outer">
              <NavLink
                to="/adminside/createduser"
                className="sidemenu d-flex align-items-center userNotification"
              >
                <i
                  className="bi bi-person-check"
                  style={{ color: "black", fontSize: 20 }}
                >
                  {" "}
                </i>

                <p
                  style={{
                    margin: "1px 0 0 15px",
                    color: "black",
                    textAlign: "center",
                  }}
                >
                  User
                </p>
              </NavLink>
            </div>

            {/* 3 */}
            <div className="outer">
              <NavLink
                to="/adminside/devicetypecreate"
                className="sidemenu d-flex userNotification"
              >
                <i
                  className=" bi bi-diagram-3-fill"
                  style={{ color: "black", fontSize: 20 }}
                ></i>

                <p
                  style={{
                    margin: "1px 0 0 15px",
                    color: "black",
                    textAlign: "center",
                  }}
                >
                  Device Type
                </p>
              </NavLink>
            </div>
            {/* 4 */}
            <div className="outer">
              <NavLink
                to="/adminside/ocr"
                className="sidemenu d-flex userNotification"
              >
                <i
                  className="bi bi-search"
                  style={{ color: "black", fontSize: 20 }}
                ></i>{" "}
                <p
                  style={{
                    margin: "1px 0 0 15px",
                    color: "black",
                    textAlign: "center",
                  }}
                >
                  OCR
                </p>
              </NavLink>
            </div>
            {/* 5 */}
            <div className="outer">
              <NavLink
                to="/adminside/thermal"
                className="sidemenu d-flex userNotification"
              >
                <i
                  className="bi bi-inbox"
                  style={{ color: "black", fontSize: 20 }}
                ></i>{" "}
                <p
                  style={{
                    margin: "1px 0 0 15px",
                    color: "black",
                    textAlign: "center",
                  }}
                >
                  Thermal
                </p>
              </NavLink>
            </div>

            {/* 6 */}
            <div className="outer">
              <NavLink
                to="/adminside/researchAndDev"
                className="sidemenu d-flex userNotification"
              >
                <GrDocumentTest style={{ color: "black", fontSize: 20 }}/>
                <p
                  style={{
                    margin: "1px 0 0 15px",
                    color: "black",
                    textAlign: "center",
                  }}
                >
                  R&D
                </p>
              </NavLink>
            </div>

            {/* 7 */}
            <div className="outer">
              <NavLink
                to="/adminside/maintenance"
                className="sidemenu d-flex userNotification"
              >
               <i class="bi bi-tools"
                style={{ color: "black", fontSize: 20 }}
                ></i>
                <p
                  style={{
                    margin: "1px 0 0 15px",
                    color: "black",
                    textAlign: "center",
                  }}
                >
                  Maintainance
                </p>
              </NavLink>
            </div>


          </div>
        </div>
      ) : (
        <>
          <div className="sideBar d-flex flex-column" style={{ width: "60px" }}>
            <img
              src={companylogo}
              alt="companylogo"
              style={{
                width: "50px",
                height: "50px",
                backgroundColor: "white",
                padding: "3px",
                borderRadius: "50px",
                margin: "5px",
                cursor: "pointer",
              }}
              onClick={sidebar}
            />
            <div
              className="logos"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                fontSize: 30,
              }}
            >
              {/* 1 */}

              <div style={{ marginTop: "8px" }}>
                <NavLink to="/adminside/usernotification" className="sidemenu">
                  <i
                    className="bi bi-people"
                    style={{ color: "black", fontSize: 20 }}
                  ></i>
                </NavLink>
                {totalregisterduser > 0 ? (
                  <div
                    style={{
                      position: "relative",
                      top: "-41px",
                      right: "-9px",
                      width: "10px",
                      height: "10px",
                      backgroundColor: "rgb(197,34,31)",
                      borderRadius: "50%",
                    }}
                  ></div>
                ) : null}
              </div>

              {/* 2 */}

              <div style={{ marginTop: "8px" }}>
                <NavLink to="/adminside/createduser" className="sidemenu">
                  <i
                    className="bi bi-person-check"
                    style={{ color: "black", fontSize: 20 }}
                  ></i>
                </NavLink>
              </div>

              {/* 3 */}

              <div style={{ marginTop: "8px" }}>
                <NavLink to="/adminside/devicetypecreate" className="sidemenu">
                  <i
                    className=" bi bi-diagram-3-fill"
                    style={{ color: "black", fontSize: 20 }}
                  ></i>
                </NavLink>
              </div>

              {/* 4 */}

              <div style={{ marginTop: "8px" }}>
                <NavLink to="/adminside/ocr" className="sidemenu">
                  <i
                    className="bi bi-search"
                    style={{ color: "black", fontSize: 20 }}
                  ></i>
                </NavLink>
              </div>

              {/* 5 */}

              <div style={{ marginTop: "8px" }}>
                <NavLink to="/adminside/thermal" className="sidemenu">
                  <i
                    className="bi bi-inbox"
                    style={{ color: "black", fontSize: 20 }}
                  ></i>
                </NavLink>
              </div>
                {/* 6 */}
              <div style={{ marginTop: "8px" }}>
                <NavLink to="/adminside/researchAndDev" className="sidemenu">
                <GrDocumentTest style={{ color: "black", fontSize: 20 }}/>
                </NavLink>
              </div>
                {/* 7 */}
              <div style={{ marginTop: "8px" }}>
                <NavLink to="/adminside/maintenance" className="sidemenu">
                <i class="bi bi-tools"
                style={{ color: "black", fontSize: 20 }}
                ></i>
                </NavLink>
              </div>


            </div>
          </div>
        </>
      )}

      {/* End sidebar logic */}

      {logout ? (
        <div className="check-model ">
          <div
            ref={logoutRef}
            className="model accedit"
            style={{
              fontSize: "16px",
              width: "754px",
              height: "192px",
            }}
          >
            {/* Modal Heading */}
            <div
              className="heading d-flex justify-content-between  "
              style={{ backgroundColor: "#e6e8e9" }}
            >
              <p
                style={{
                  marginTop: "8px",
                  marginLeft: "30px",
                  fontSize: 20,
                }}
              >
                Logout
              </p>
              <i
                className="bi bi-x-octagon cancel-button-modal "
                style={{
                  fontSize: 30,
                  color: "#df010d",
                  alignItems: "center",
                  display: "flex",
                }}
                onClick={islogout}
              ></i>
            </div>
            {/* Modal Content */}
            <div
              className="accounteditmodaldv"
              style={{ marginLeft: "20px", marginTop: "30px" }}
            >
              <div style={{ marginLeft: "25px" }}>
                <p> Are you sure !</p>
              </div>

              <div className="d-flex justify-content-end mt-3">
                <NavLink to="https://login.bc-pl.com/">
                  <button
                    type="button"
                    className="btn btn-danger px-3 py-2 text-center fs-sm fw-bold rounded-pill"
                    style={{
                      textAlign: "center",
                      marginRight: "15px",
                    }}
                    onClick={() => {
                      handleLogout();
                    }}
                  >
                    Yes
                  </button>
                </NavLink>
                <button
                  type="button"
                  className="btn btn-warning px-3 py-2 text-center fs-sm fw-bold rounded-pill"
                  style={{
                    textAlign: "cenetr",
                    marginRight: "15px",
                  }}
                  onClick={islogout}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {/* Logout Modal End */}
    </>
  );
};

export default Sidebar;