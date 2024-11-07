import React, { useState, useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../Adminpage.css";
import { AdminContext } from "../../../App";
import axios from "axios";


const Devicetypecreate = () => {
  const [openModel, setOpenModel] = useState(false);
  const [deletebutton, setDeleteButton] = useState(false);
  const [devicetoadd, setDeviceToAdd] = useState(false);
  const [totaldevicetype, setTotaldevicetype] = useState(0);
  const [alldevice, setAlldevice] = useState([]);


  //START creatye device type
  const devicename = useRef(null);
  const deviceversion = useRef(null);
  async function newdeviceadd(dataofnewdevice) {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_App_Ip}/devicetype_create/`,
        dataofnewdevice
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }
  //END creatye device type

  //START Edit Device type
  const [devicedata, setDevicedata] = useState("");
  const devicetypename = useRef(null);
  const devicetypeversion = useRef(null);

  async function editdevice(deviceinfo) {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_App_Ip}/devicetype_edit/`,
        deviceinfo
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  //END Edit Device type

  // START Delete DEVICE type

  async function deletedevicetype(devicedata) {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_App_Ip}/devicetype_delete/`,
        devicedata
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  // END Delete DEVICE type

  //context
  const { isSidebarOpen } = useContext(AdminContext);

  const openModels = () => {
    setOpenModel(!openModel);
  };
  const openmodalRef = useRef(null);
  useEffect(() => {
    // Handler to call onClick outside of calendar component
    const handleClickOutside = (event) => {
      if (openmodalRef.current && !openmodalRef.current.contains(event.target)) {
        openModels();
      }
    };

    // Add event listener when calendar is shown
    if (openModel) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
    // eslint-disable-next-line
  }, [openModels]);

  const deviceadd = () => {
    setDeviceToAdd(!devicetoadd);
  };
  const divcreateref = useRef(null);
  useEffect(() => {
    // Handler to call onClick outside of calendar component
    const handleClickOutside = (event) => {
      if (divcreateref.current && !divcreateref.current.contains(event.target)) {
        deviceadd();
      }
    };

    // Add event listener when calendar is shown
    if (devicetoadd) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
    // eslint-disable-next-line
  }, [deviceadd]);

  const openDeleteModels = () => {
    setDeleteButton(!deletebutton);
  };

 const delref = useRef(null);
  useEffect(() => {
    // Handler to call onClick outside of calendar component
    const handleClickOutside = (event) => {
      if (delref.current && !delref.current.contains(event.target)) {
        openDeleteModels();
      }
    };

    // Add event listener when calendar is shown
    if (deletebutton) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
    // eslint-disable-next-line
  }, [openDeleteModels]);
  
  const Devicetype = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_App_Ip}/devicetype_view/`);
      setTotaldevicetype(response.data.results.length);
      setAlldevice(response.data.results);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    Devicetype(); 
  }, []);

  return (
    <>
      {/* Page Start */}
      <div className={`createdusercontent  ${isSidebarOpen ? "open" : "closed"}`}
      >
        {/* Total User Count Start */}
        <div className="userCount shadow">
          <div>
            <p
              style={{
                display: "flex",
                justifyContent: "center",
            
                padding: "10px",
                margin: "2px 2px 4px 2px",
                backgroundColor: "#E9EEF6",
                borderRadius: "20px",
              }}
            >
              Device Types
            </p>
          </div>
          <p
            style={{
              display: "flex",
              justifyContent: "center",
      
              padding: "10px",
              margin: "2px 2px 4px 2px",
            }}
          >
            {totaldevicetype}
          </p>
        </div>

        {/* Total User Count End */}

        {/* CreateDeviceType start */}
        <button
          type="button"
          className="btn btn-primary"
          style={{
            borderRadius: "16px",
            
            verticalAlign: "cenetr",
            marginTop: "20px",
          }}
          onClick={deviceadd}
        >
          Create Device Type
        </button>

        {/* CreateDeviceType End */}

        {/* Table start */}

        <div className="parent-div-of-table overflow-scroll">
          <table className="table table-bordered table-striped table-hover table-design">
            <thead style={{ backgroundColor: "#7DE1AF" }}>
              <tr>
                <th
                  className=""
                  scope="col"
                  style={{
                    backgroundColor: "#E9EEF6",
                    borderTopLeftRadius: "7px",
                    textAlign: "center",
                  }}
                >
                  Sl.No
                </th>
                <th
                  scope="col"
                  style={{ backgroundColor: "#E9EEF6", textAlign: "center" }}
                >
                  Name
                </th>
                <th
                  scope="col"
                  style={{ backgroundColor: "#E9EEF6", textAlign: "center" }}
                >
                  Version
                </th>
                <th
                  scope="col"
                  style={{ backgroundColor: "#E9EEF6", textAlign: "center" }}
                >
                  Status
                </th>
                <th
                  scope="col"
                  style={{
                    backgroundColor: "#E9EEF6",
                    borderTopRightRadius: "7px",
                    textAlign: "center",
                  }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {alldevice.map((data, index) => (
                <tr key={index + 1}>
                  <td className="text-center">{index + 1}</td>
                  <td className="text-center">{data[0]}</td>
                  <td className="text-center">{data[1]}</td>
                  <td className="text-center">enabled</td>
                  <td className="text-center d-flex justify-content-center">
                    <button
                      type="button"
                      className="btn btn-warning"
                      style={{
                        borderRadius: "16px",
                        
                        verticalAlign: "cenetr",
                      }}
                      onClick={() => {
                        const thisdevicedata = {
                          devicename: data[0],
                          deviceversion: data[1],
                        };
                        openModels();

                        setDevicedata(thisdevicedata);
                      }}
                    >
                      Edit
                    </button>

                    <Link
                      to={`/adminside/devicetypecreate/deviceassignctrls/${data[0]}/${data[1]}`}
                    >
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{
                          borderRadius: "16px",
                          
                          verticalAlign: "cenetr",
                          marginLeft: "8px",
                        }}
                      >
                        View
                      </button>
                    </Link>
                    <button
                      type="button"
                      className="btn btn-danger"
                      style={{
                        borderRadius: "16px",
                        
                        verticalAlign: "cenetr",
                        marginLeft: "8px",
                      }}
                      onClick={() => {
                        const thisdevicedata = {
                          devicename: data[0],
                          deviceversion: data[1],
                        };
                        openDeleteModels();

                        setDevicedata(thisdevicedata);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Table End */}

        {/* Redirect Start */}
        <div className="redirects" style={{marginTop:'10px'}}>
          <button
            type="button"
            className="btn "
            style={{
              borderRadius: "16px",
              fontSize: "17px",
              verticalAlign: "cenetr",
              marginRight: "10px",
              height: "43px",
              backgroundColor: "#5F9EFB",
              color: "white",
            }}
          >
            Previous
          </button>{" "}
          <p style={{ marginTop: "09px" }}>Page 1 of 1 </p>
          <button
            type="button"
            className="btn btn-success"
            style={{
              borderRadius: "19px",
              fontSize: "17px",
              verticalAlign: "cenetr",
              height: "43px",
              marginLeft: "4px",
            }}
          >
            Next
          </button>
        </div>
        {/* Redirect End */}
      </div>
      {/* Page End */}

      {/* Modal Start */}

      {openModel ? (
        <div className="check-model ">
          <div
            className="model accedit"
            ref={openmodalRef}
            style={{ fontSize: "16px", height: "370px" }}
          >
            {/* Modal Heading */}
            <div className="heading d-flex justify-content-between  ">
              <p style={{ marginTop: "8px", marginLeft: "30px", fontSize: 20 }}>
                 Edit Device Type
              </p>
              <i
                className="bi bi-x-octagon cancel-button-modal "
                style={{ fontSize: 30,color:'#df010d' ,alignItems:'center',display:'flex'}}
                onClick={openModels}
              ></i>
            </div>
            {/* Modal Content */}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const devicedatas = {
                  olddevicetypename: devicedata.devicename,
                  olddevicetypeversion: devicedata.deviceversion,
                  newtypeversion: devicetypeversion.current.value,
                  newtypename: devicetypename.current.value,
                };

                editdevice(devicedatas);
                openModels();
                setTimeout(() => {
                  Devicetype();
                }, 400);
              }}
            >
              <div className="accounteditmodaldv" style={{ marginLeft: "20px", marginTop: "30px" }}>
                <div style={{ marginLeft: "25px" }}>
                  <label htmlFor="formGroupExampleInput">Name</label>
                  <input
                    type="text"
                    ref={devicetypename}
                    className="form-control"
                    id="formGroupExampleInput"
                    placeholder="Enter DeviceType Name"
                    style={{ width: "90%" }}
                    required
                    onInvalid={(e) =>
                      e.target.setCustomValidity(
                        "Please Enter Device Type Name"
                      )
                    }
                    onChange={(e) => e.target.setCustomValidity("")}
                  ></input>

                  <label htmlFor="formGroupExampleInput">Version</label>
                  <input
                    type="text"
                    ref={devicetypeversion}
                    className="form-control"
                    id="formGroupExampleInput"
                    placeholder="Enter Device Version"
                    style={{ width: "90%" }}
                    required
                    onInvalid={(e) =>
                      e.target.setCustomValidity("Please Enter Version")
                    }
                    onChange={(e) => e.target.setCustomValidity("")}
                  ></input>

                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="defaultCheck1"
                    style={{  marginTop: "20px" }}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="defaultCheck1"
                    style={{
                      
                      marginLeft: "10px",
                      marginTop: "14px",
                    }}
                  >
                    Enable
                  </label>
                </div>

                <div className="d-flex justify-content-end mt-3">
                  <button
                    type="submit"
                    className="btn btn-success px-3 py-2 text-center fs-sm fw-bold rounded-pill"
                    style={{
                      textAlign: "cenetr",
                      marginRight: "15px",
                    }}
                  >
                    Update Device
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* Modal End */}

      {/* Add device modal start */}
      {devicetoadd ? (
        <div className="check-model ">
          <div
          ref={divcreateref}
            className="model accedit"
            style={{ fontSize: "16px",}}
          >
            {/* Modal Heading */}
            <div className="heading d-flex justify-content-between  ">
              <p style={{ marginTop: "8px", marginLeft: "30px", fontSize: 20 }}>
                Create Device Type
              </p>
              <i
                className="bi bi-x-octagon cancel-button-modal "
                style={{ fontSize: 30 ,color:'#df010d',alignItems:'center',display:'flex'}}
                onClick={deviceadd}
              ></i>
            </div>
            {/* Modal Content */}
            <div style={{ marginLeft: "20px", marginTop: "30px" }}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const newdevicedata = {
                    typeversion: deviceversion.current.value,
                    typename: devicename.current.value,
                  };

                  newdeviceadd(newdevicedata);
                  deviceadd();
                  setTimeout(() => {
                    Devicetype();
                  }, 400);
                }}
              >
                <div style={{ marginLeft: "25px" }}>
                  <label htmlFor="formGroupExampleInput">Name</label>
                  <input
                    ref={devicename}
                    type="text"
                    className="form-control"
                    id="formGroupExampleInput"
                    placeholder="Enter Device Type"
                    style={{ width: "80%" }}
                    required
                    onInvalid={(e) =>
                      e.target.setCustomValidity(
                        "Please Enter Device Type Name"
                      )
                    }
                    onChange={(e) => e.target.setCustomValidity("")}
                  ></input>

                  <label htmlFor="formGroupExampleInput">Version</label>
                  <input
                    ref={deviceversion}
                    type="number"
                    className="form-control"
                    id="formGroupExampleInput"
                    placeholder="Enter Device Version"
                    style={{ width: "80%" }}
                    required
                    onInvalid={(e) =>
                      e.target.setCustomValidity("Please Enter Version")
                    }
                    onChange={(e) => e.target.setCustomValidity("")}
                  ></input>

                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="defaultCheck1"
                    style={{  marginTop: "20px" }}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="defaultCheck1"
                    style={{
                      
                      marginLeft: "10px",
                      marginTop: "14px",
                    }}
                  >
                    Enable
                  </label>
                </div>

                <div className="d-flex justify-content-end mt-3">
                  <button
                    type="submit"
                    className="btn btn-success px-3 py-2 text-center fs-sm fw-bold rounded-pill"
                    style={{
                      textAlign: "cenetr",
                     
                      margin:'0 15px 10px 0'
                    }}
                  >
                    Create Device
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}

      {/* Add device Modal End */}

      {/* Delete button Modal Start */}

      {deletebutton ? (
        <div className="check-model ">
          <div
          ref={delref}
            className="model"
            style={{ fontSize: "16px", width: "600px", height: "200px" }}
          >
            {/* Modal Heading */}
            <div className="heading d-flex justify-content-between  ">
              <p style={{ marginTop: "8px", marginLeft: "30px", fontSize: 20 }}>
                Delete Device Type
              </p>
              <i
                className="bi bi-x-octagon cancel-button-modal "
                style={{ fontSize: 30 ,color:'#df010d',alignItems:'center',display:'flex'}}
                onClick={openDeleteModels}
              ></i>
            </div>
            {/* Modal Content */}
            <div style={{ marginLeft: "20px", marginTop: "30px" }}>
              <div style={{ marginLeft: "25px" }}>
                <p> Are you sure to Delete the deivce-type Permanently ?</p>
              </div>

              <div className="d-flex justify-content-end mt-3">
                <button
                  type="button"
                  className="btn btn-danger px-3 py-2 text-center fs-sm fw-bold rounded-pill"
                  style={{
                    textAlign: "cenetr",
                    marginRight: "15px",
                  }}
                  onClick={() => {
                    const devicedatafordelete = {
                      devicetypename: devicedata.devicename,
                      devicetypeversion: devicedata.deviceversion,
                    };
                    deletedevicetype(devicedatafordelete);
                    openDeleteModels();
                    setTimeout(() => {
                      Devicetype();
                    }, 400);
                  }}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className="btn btn-warning px-3 py-2 text-center fs-sm fw-bold rounded-pill"
                  style={{
                    textAlign: "cenetr",
                    marginRight: "15px",
                  }}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {/* DeleteButton Modal End */}
    </>
  );
};

export default Devicetypecreate;