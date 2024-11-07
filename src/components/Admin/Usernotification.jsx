import React, { useContext, useEffect, useRef, useState } from "react";
import "bootstrap-icons/font/bootstrap-icons";
import "bootstrap-icons/font/bootstrap-icons.css";
import latitude from "./Constant img/latitude.png";
import longitude from "./Constant img/longitude.png";
import "./Adminpage.css";
import { GoogleMap, Marker } from "@react-google-maps/api";

import success from "./Constant img/success.gif";
import { AdminContext } from "../../App";
import axios from "axios";

const Usernotification = () => {
  const admin_id = localStorage.getItem("admin_id");

  const [openModel, setOpenModel] = useState(false);

  const [nextmodel, setNextModel] = useState(false);
  const [devicetype, setDeviceType] = useState(false);
  const [deviceadd, setDeviceAdd] = useState(false);
  const [showmap, setShowmap] = useState(false);
  const [completedeviceadd, setCompliteDeviceAdd] = useState(false);

  //context
  const { isSidebarOpen } = useContext(AdminContext);
  const { settotalRegestereduser } = useContext(AdminContext);
  const [totaluser, setTotalUser] = useState(0);
  const [regestereduser, setRegestereduser] = useState([]);
  const [usernotificationerror, setUserNotificationerror] = useState("");
  const [userindex, setUserindex] = useState("");
  const [address, setAddress] = useState("");
  const [latitudes, setLatitude] = useState(20.2961); // Initial latitude FOR ADD USER
  const [longitudes, setLongitude] = useState(85.8245); // Initial longitude FOR ADD USER
  const [latitudesdevice, setlatitudesdevice] = useState(20.2961); // Initial latitude FOR ADD USER
  const [longitudesdevice, setlongitudesdevice] = useState(85.8245); // Initial longitude FOR ADD USER

  // variable for next and previous button
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  

  const indexOfLastItem = currentPage * itemsPerPage;
  console.log(indexOfLastItem);

  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  console.log(indexOfFirstItem);

  const currentItems = regestereduser.slice(indexOfFirstItem, indexOfLastItem);
  console.log(currentItems);

  const startingSerialNumber = (currentPage - 1) * itemsPerPage + 1;

//Google Map 
  const GoogleMapdata = ({ containerStyle, lat, lng }) => {
    const [map, setMap] = useState(null);

    const handleMapLoad = (mapInstance) => {
      setMap(mapInstance);
    };

    return (
      <GoogleMap
        onLoad={handleMapLoad}
        mapContainerStyle={containerStyle}
        center={{ lat: parseFloat(lat), lng: parseFloat(lng) }}
        zoom={15}
        mapTypeId="satellite"
        onClick={handleMapClick}
      >
        {map && (
          <Marker
            position={{ lat: parseFloat(lat), lng: parseFloat(lng) }}
            map={map}
          />
        )}
      </GoogleMap>
    );
  };

  const [data, setData] = useState({
    userpic: null,
    userdocs: null,
    sensors: null,
  });

  // all variable fkor account create of a user
  const Password = useRef(null);
  const passwordenterrd = () => {
    setData({ ...data, password: Password.current.value });
  };

  const userLatitude = useRef(null);
  const userLongitude = useRef(null);
  const AccName = useRef(null);

  const latlngaccentered = () => {
    setData({
      ...data,
      mobno: regestereduser[userindex][1],
      address: address,
      account_nm: AccName.current.value,
      lat: parseFloat(userLatitude.current.value),
      long: parseFloat(userLongitude.current.value),
    });
  };

  //  varible for add device for a user
  const cityname = useRef(null);
  const handleSearch = async () => {
    const city = cityname.current.value;
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=AIzaSyC-d-7RR_MQ45QLQXKSzOxviR2l11kN3wk`
      );
      const data = await response.json();
      const { lat, lng } = data.results[0].geometry.location;
      setlatitudesdevice(lat);
      setlongitudesdevice(lng);
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  const [devicecordinate, setdevicecordinate] = useState("");

  const handleMapClick = (e) => {
    const clickedLat = e.latLng.lat();
    const clickedLng = e.latLng.lng();
    const coordinates = `${clickedLat},${clickedLng}`;
    setdevicecordinate(coordinates);
  };

  const devicename = useRef(null);
  const device = useRef(null);
  const devicelocation = useRef(null);

  const devinametypelocentered = () => {
    setData({
      ...data,
      devicename: devicename.current.value,
      devicetype: device.current.value,
      location_data: devicelocation.current.value
        .split(",")
        .map((value) => parseFloat(value.trim())),
    });
  };

  const addNweUser = async () => {
    try {
      console.log(data);
      const response = await axios.post(
        `${process.env.REACT_APP_App_Ip}/user_create/`,
        data
      );
      console.log(response);
      if (response) {
        setCompliteDeviceAdd(!completedeviceadd);
        setTimeout(() => {
          setCompliteDeviceAdd(false);
        }, 400);
        const res = await axios.get(
          `${process.env.REACT_APP_App_Ip}/email_send/${data.mobno}/`
        );
        console.log(res);
        userNotificationfetch();
      }
    } catch (error) {
      console.log(error);
    }
    console.log(data);
  };

  const userNotificationfetch = async () => {
    try {
      const responce = await axios.get(
        `${process.env.REACT_APP_App_Ip}/register_view/${admin_id}/`
      );
      console.log(responce.data.items);
      setTotalUser(responce.data.items.length);
      setRegestereduser(responce.data.items);


    } catch (error) {
      console.log(error);
      setUserNotificationerror(error);
    }
  };

  useEffect(() => {
    userNotificationfetch();
    // eslint-disable-next-line
    settotalRegestereduser(totaluser);
    // eslint-disable-next-line                                 
  }, [totaluser]);

  const openModels = () => {
    setOpenModel(!openModel);
  };
  const openmodalRef = useRef(null);
  useEffect(() => {
    // Handler to call onClick outside of calendar component
    const handleClickOutside = (event) => {
      if (
        openmodalRef.current &&
        !openmodalRef.current.contains(event.target)
      ) {
        openModels();
      }
    };

    // Add event listener when calendar is shown
    if (openModel) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line
  }, [openModels]);

  const opennextmodel = () => {
    setNextModel(!nextmodel);
  };
  const opennextmodalRef = useRef(null);
  useEffect(() => {
    // Handler to call onClick outside of calendar component
    const handleClickOutside = (event) => {
      if (
        opennextmodalRef.current &&
        !opennextmodalRef.current.contains(event.target)
      ) {
        opennextmodel();
      }
    };

    // Add event listener when calendar is shown
    if (nextmodel) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line
  }, [opennextmodel]);

  const opendevicetypemodel = () => {
    setDeviceType(!devicetype);
  };
  
  const adddevice = () => {
    setDeviceAdd(!deviceadd);
  };
  const opendeviceaddmodalRef = useRef(null);
  useEffect(() => {
    // Handler to call onClick outside of calendar component
    const handleClickOutside = (event) => {
      if (
        opendeviceaddmodalRef.current &&
        !opendeviceaddmodalRef.current.contains(event.target)
      ) {
        adddevice();
      }
    };

    // Add event listener when calendar is shown
    if (deviceadd) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line
  }, [adddevice]);
  const mapshow = () => {
    setShowmap(!showmap);
  };

  const [devicetypes, setDevicetypes] = useState([]);

  async function seedevicetype() {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_App_Ip}/devicetype_view/`
      );
      setDevicetypes(response.data.results);
    } catch (error) {
      console.log(error);
    }
  }

  //Here Content can take lat and lng props from backend

  function searchlatlng(lats, lngs) {
    setLatitude(
      lats === null || lats === undefined || lats === ""
        ? parseFloat(20.2961)
        : lats
    );
    setLongitude(
      lngs === null || lngs === undefined || lngs === ""
        ? parseFloat(85.8245)
        : lngs
    );
  }

  //Height and Width for Google Map
  const containerStyleforaccontadd = {
    width: "98%",
    height: "100%",
  };
  const containerStylefordeviceadd = {
    width: "610px",
    height: "98%",
  };

  useEffect(() => {
    const geocoder = new window.google.maps.Geocoder();
    const location = {
      lat: parseFloat(latitudes),
      lng: parseFloat(longitudes),
    };

    geocoder.geocode({ location }, (results, status) => {
      if (status === "OK") {
        if (results[0]) {
          console.log(results[0].formatted_address);
          setAddress(results[0].formatted_address);
        } else {
          setAddress("Address not found");
        }
      } else {
        setAddress("Geocoder failed due to: " + status);
      }
    });
  }, [latitudes, longitudes]);

  return (
    <>
      <div
        className={`createdusercontent  ${isSidebarOpen ? "open" : "closed"}`}
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
              Total User Requested
            </p>
          </div>
          <p
            style={{
              display: "flex",
              justifyContent: "center",
              fontSize: "16px",
              padding: "10px",
              fontWeight: "bold",
              margin: "2px 2px 4px 2px",
            }}
          >
            {totaluser}
          </p>
        </div>

        {/* Total User Count End */}

        {/* Table start */}

        <div className="parent-div-of-table overflow-scroll">
          <table className="table table-bordered table-striped table-hover table-design">
            <thead style={{ backgroundColor: "#E9EEF6" }}>
              <tr>
                <th
                  className="text-center"
                  scope="col"
                  style={{
                    backgroundColor: "#E9EEF6",
                    borderTopLeftRadius: "7px",
                  }}
                >
                  Sl.No
                </th>
                <th
                  className="text-center"
                  scope="col"
                  style={{ backgroundColor: "#E9EEF6" }}
                >
                  Name
                </th>
                <th
                  className="text-center"
                  scope="col"
                  style={{ backgroundColor: "#E9EEF6" }}
                >
                  Mobile No
                </th>
                <th
                  className="text-center"
                  scope="col"
                  style={{ backgroundColor: "#E9EEF6" }}
                >
                  E-mail Id
                </th>
                <th
                  className="text-center"
                  scope="col"
                  style={{
                    backgroundColor: "#E9EEF6",
                    borderTopRightRadius: "7px",
                  }}
                >
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {currentItems.map((data, index) => (
                <tr key={index}>
                  <td className="text-center">{startingSerialNumber+index}</td>
                  <td className="text-center">{data[0]}</td>
                  <td className="text-center">{data[1]}</td>
                  <td className="text-center">{data[2]}</td>
                  <td className="text-center">
                    <button
                      type="button"
                      className="btn btn-primary px-3 py-2 text-center fs-sm fw-bold rounded-pill"
                      style={{
                        textAlign: "cenetr",
                      }}
                      onClick={() => {
                        setUserindex(startingSerialNumber+index-1);
                        openModels();
                      }}
                    >
                      Check
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Table End */}
        {/* Error Handel  Message*/}
        {usernotificationerror ? (
          <>
            {" "}
            <div>
              <p
                style={{
               
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {`Some Error Occured , Please Stay Tuned ! ${usernotificationerror}`}
              </p>
            </div>
          </>
        ) : (
          <></>
        )}
        {/* Error Handel Message END */}

        {/* Rdirect Start */}
        <div className="redirects">
          <button
            type="button"
            className="btn "
            style={{
              borderRadius: "16px",
            
              verticalAlign: "cenetr",
              marginRight: "10px",
              height: "43px",
              backgroundColor: "#5F9EFB",
              color: "white",
            }}
            disabled={currentPage === 1}
            onClick={handlePrevPage}
          >
            Previous
          </button>{" "}
          <p style={{ marginTop: "09px" }}>
            Page {currentPage} of{" "}
            {Math.ceil(regestereduser.length / itemsPerPage)}{" "}
          </p>
          <button
            type="button"
            className="btn btn-success"
            style={{
              borderRadius: "19px",
        
              verticalAlign: "cenetr",
              height: "43px",
              marginLeft: "4px",
            }}
            disabled={indexOfLastItem >= regestereduser.length}
            onClick={handleNextPage}
          >
            Next
          </button>
        </div>
        {/* Redirect End */}
      </div>

      {/* regestereduser[userindex] */}
      {/* model Start */}
      {openModel ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            openModels();
            opennextmodel();
            passwordenterrd();
          }}
        >
          <div className="check-model ">
            <div
            ref={openmodalRef}
              className="model accedit"
              style={{ marginTop: "10%", width: "600px" }}
            >
              <div className="heading d-flex justify-content-between ">
                <p
                  style={{
                    marginTop: "10px",
                    marginLeft: "30px",
                    fontSize:20
                  }}
                >
                  New User Details
                </p>
                <i
                  className="bi bi-x-octagon cancel-button-modal "
                  style={{ fontSize: 30, color: "#df010d" ,alignItems:'center',display:'flex'}}
                  onClick={openModels}
                ></i>
              </div>
              <div style={{ marginLeft: "20px", marginTop: "30px" }}>
                <div className="name d-flex">
                  <p>Name </p>
                  <p >
                    :- {regestereduser[userindex][0]}
                  </p>
                </div>
                <div className="mobile d-flex">
                  <p>Mobile No </p>{" "}
                  <p >
                    :-{regestereduser[userindex][1]}
                  </p>
                </div>
                <div className="adhar d-flex">
                  <p>Aadhaar No</p>
                  <p >
                    :-{regestereduser[userindex][4]}
                  </p>
                </div>
                <div className="email d-flex">
                  <p>Email Id</p>{" "}
                  <p >
                    :- {regestereduser[userindex][2]}
                  </p>
                </div>
                <div className="password ">
                  <p>
                    <div className="form-group d-flex">
                      <label >Password</label>
                      <input
                        ref={Password}
                        type="password"
                        className="form-control"
                        id="exampleInputPassword1"
                        placeholder="Password"
                        style={{ marginLeft: "25px", width: "60%" }}
                        required
                        onInvalid={(e) =>
                          e.target.setCustomValidity(
                            "Please Enter Your Password For User"
                          )
                        }
                        onChange={(e) => e.target.setCustomValidity("")}
                      />
                    </div>
                  </p>
                </div>

                <div className="d-flex justify-content-end mt-5 p-2">
                  <button
                    type="submit"
                    className="btn btn-success px-3 py-2 text-center fs-sm fw-bold rounded-pill"
                    style={{
                      textAlign: "center",
                      marginRight: "15px",
                    }}
                  >
                    Next
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger px-3 py-2 text-center fs-sm fw-bold rounded-pill"
                    style={{
                      textAlign: "cenetr",
                      marginRight: "25px",
                    }}
                    onClick={openModels}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      ) : null}

      {/* Model Close */}

      {/* start model for on click of next of previos model */}
      {nextmodel ? (
        <div className="check-model ">
          <div
          ref={opennextmodalRef}
            className="model newaccount"
            style={{  marginTop: "1px", height: "auto" }}
          >
            <div className="heading d-flex justify-content-between ">
              <p
                style={{ marginTop: "10px", marginLeft: "30px", fontSize:20 }}
              >
                New User Details
              </p>
              <i
                className="bi bi-x-octagon cancel-button-modal "
                style={{ fontSize: 30, color: "#df010d",alignItems:'center',display:'flex' }}
                onClick={opennextmodel}
              ></i>
            </div>
            <div
              className="addaccmodaldiv"
              style={{ marginLeft: "20px", marginTop: "30px" }}
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  searchlatlng(
                    userLatitude.current.value,
                    userLongitude.current.value
                  );
                }}
              >
                <div
                  className=" d-flex"
                  style={{ height: "49px", width: "95%" }}
                >
                  <div>
                    <label>
                      {" "}
                      <img
                        src={latitude}
                        style={{ width: "20px", marginBottom: "5px" }}
                        alt="Latitude logo"
                      ></img>{" "}
                      Latitude
                    </label>
                    <input
                      ref={userLatitude}
                      type="text"
                      className="form-control"
                      id="formGroupExampleInput"
                      placeholder="Enter Latitude"
                    ></input>
                  </div>
                  <div>
                    <label>
                      <img
                        src={longitude}
                        style={{
                          width: "20px",
                          marginBottom: "5px",
                          marginRight: "2px",
                        }}
                        alt="Longitude logo"
                      ></img>
                      Longitude
                    </label>

                    <input
                      ref={userLongitude}
                      type="text"
                      className="form-control"
                      id="formGroupExampleInput"
                      placeholder="Enter Longitude"
                      style={{ marginLeft: "3%" }}
                    ></input>
                  </div>
                  <div>
                    <label>
                      <i
                        className="bi bi-person-vcard"
                        style={{ fontSize: 17, marginRight: "2px" }}
                      ></i>
                      Account
                    </label>

                    <input
                      ref={AccName}
                      type="text"
                      className="form-control"
                      id="formGroupExampleInput"
                      placeholder="Enter AccountName"
                      style={{ marginLeft: "5%" }}
                      required
                      onInvalid={(e) =>
                        e.target.setCustomValidity("Please Enter Account Name")
                      }
                      onChange={(e) => e.target.setCustomValidity("")}
                    ></input>
                  </div>
                </div>
                <div
                  className=" searchbutton d-flex justify-content-end "
                  style={{ marginRight: "5%" }}
                >
                  <button
                    type="submit"
                    className="btn btn-primary px-3 py-2 text-center fs-sm fw-bold rounded-pill"
                    style={{
                      textAlign: "center",
                      marginLeft: "50px",
                    }}
                  >
                    <i
                      className="bi bi-search"
                      style={{ marginRight: "3px" }}
                    ></i>
                    Search
                  </button>
                </div>
              </form>

              <div
                className="mapaddacc"
                style={{ marginTop: "20px", height: "400px" }}
              >
                <GoogleMapdata
                  containerStyle={containerStyleforaccontadd}
                  lat={latitudes}
                  lng={longitudes}
                />
              </div>

              <div
                className="d-flex justify-content-end mt-2 "
                style={{ padding: "5px" }}
              >
                <button
                  type="button"
                  className="btn btn-success px-3 py-2 text-center fs-sm fw-bold rounded-pill"
                  style={{
                    textAlign: "cenetr",
                    marginRight: "15px",
                  }}
                  onClick={() => {
                    latlngaccentered();

                    latlngaccentered();

                    opennextmodel();
                    opendevicetypemodel();
                  }}
                >
                  Next
                </button>
                <button
                  type="button"
                  className="btn btn-danger px-3 py-2 text-center fs-sm fw-bold rounded-pill"
                  style={{
                    textAlign: "cenetr",
                    marginRight: "25px",
                  }}
                  onClick={opennextmodel}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* End model for on click of "next" of previos model */}

      {/* start Modal  on click of "next" of previos modal */}

      {devicetype ? (
        <div className="check-model ">
          <div
          
            className="model accedit"
            style={{
           
              marginTop: "1px",
              width: "650px",
              height: "auto",
            }}
          >
            {/* Modal Heading */}
            <div className="heading d-flex justify-content-between  ">
              <p style={{ marginTop: "8px", marginLeft: "30px", fontSize: 20 }}>
                New User Device
              </p>
              <i
                className="bi bi-x-octagon cancel-button-modal "
                style={{ fontSize: 30, color: "#df010d" ,alignItems:'center',display:'flex'}}
                onClick={opendevicetypemodel}
              ></i>
            </div>
            {/* Modal Content */}
            <div
              style={{
                marginLeft: "20px",
                marginTop: "30px",
                marginRight: "10px",
              }}
            >
              <table className="table table-hover table-bordered">
                <thead>
                  <tr>
                    <th scope="col">Device Type</th>
                    <th scope="col">No. of Device</th>
                  </tr>
                </thead>
                <tbody>
                  {regestereduser[userindex][3]?.devicesList.length>0 &&
                    regestereduser[userindex][3]?.devicesList?.map(
                      (data, index) => (
                        <tr key={index}>
                          <td>{data?.value}</td>
                          <td>{data?.count}</td>
                        </tr>
                      )
                    )}
                </tbody>
              </table>

              <button
                type="button"
                className="btn btn-primary px-3 py-2 text-center fs-sm fw-bold rounded-pill"
                style={{
                  textAlign: "cenetr",
                  marginRight: "15px",
                }}
                onClick={() => {
                  adddevice();
                  seedevicetype();
                }}
              >
                Add Device
              </button>

              <div className="d-flex justify-content-end ">
                <button
                  type="button"
                  className="btn btn-success px-3 py-2 text-center fs-sm fw-bold rounded-pill"
                  style={{
                    textAlign: "cenetr",
                    marginRight: "15px",
                    margin: "10px 15px 10px 0",
                  }}
                  onClick={() => {
                    addNweUser();
                    opendevicetypemodel();
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {/* End Modal  on click of "next" of previos modal */}

      {/* start Modal  on click of "Add Device" of previos modal */}

      {deviceadd ? (
        <div className="check-model ">
          <div
          ref={opendeviceaddmodalRef}
            className="model accedit"
            style={{
              
              marginTop: "1px",
              width: "650px",
              height: "auto",
            }}
          >
            {/* Modal Heading */}
            <div className="heading d-flex justify-content-between  ">
              <p style={{ marginLeft: "30px",fontSize:20 }}>Device Add</p>
              <i
                className="bi bi-x-octagon cancel-button-modal "
                style={{ fontSize: 30, color: "#df010d" ,alignItems:'center',display:'flex'}}
                onClick={adddevice}
              ></i>
            </div>
            {/* Modal Content */}
            <div
              className="accounteditmodaldv "
              style={{
                marginLeft: "20px",
                marginTop: "30px",
                marginRight: "10px",
              }}
            >
              <label>Device Name</label>
              <input
                ref={devicename}
                type="text"
                className="form-control"
                id="formGroupExampleInput"
                placeholder="Device Name"
                style={{ width: "90%" }}
                required
                onInvalid={(e) =>
                  e.target.setCustomValidity("Please Enter Your Device Name")
                }
                onChange={(e) => e.target.setCustomValidity("")}
              ></input>

              <div className="d-flex gap-1">
                <div>
                  <label> Device Type </label>
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    style={{ width: "90%" }}
                    ref={device}
                  >
                    <option selected>select Device Type</option>
                    {devicetypes.map((device, index) => (
                      <option key={index} value={device[0]}>
                        {device[0]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Device Location</label>
                  <input
                    ref={devicelocation}
                    value={devicecordinate}
                    type="text"
                    className="form-control"
                    placeholder="Device Location...."
                    style={{ width: "90%" }}
                    required
                    onInvalid={(e) =>
                      e.target.setCustomValidity(
                        "Please  select Your Device LAT,LNG"
                      )
                    }
                    onChange={(e) => e.target.setCustomValidity("")}
                  ></input>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-primary px-3 py-2 text-center fs-sm fw-bold rounded-pill"
                style={{
                  textAlign: "cenetr",
                  marginRight: "15px",
                }}
                onClick={mapshow}
              >
                Add Device Location
              </button>
              <button
                type="button"
                className="btn  btn-primary px-3 py-2 text-center fs-sm fw-bold rounded-pill"
                style={{
                  textAlign: "cenetr",
                  marginRight: "15px",
                  margin: "10px 15px 10px 0",
                }}
                onClick={() => {
                  adddevice();
                  devinametypelocentered();
                }}
              >
                Add Device
              </button>

              {showmap ? (
                <>
                  <div className="d-flex" style={{ width: "50%" }}>
                    <input
                      ref={cityname}
                      className="form-control mr-sm-2"
                      type="search"
                      placeholder="Search"
                      aria-label="Search"
                    />
                    <button
                      className="btn btn-outline-success my-2 my-sm-0"
                      type="submit"
                      style={{ marginLeft: "10px" }}
                      onClick={() => {
                        handleSearch();
                      }}
                    >
                      Search
                    </button>
                  </div>

                  <div
                    className="deviceaddmap d-flex justify-content-center"
                    style={{
                      marginTop: "2px",
                      height: "400px",
                      width: "620px",
                    }}
                  >
                    <GoogleMapdata
                      containerStyle={containerStylefordeviceadd}
                      lat={latitudesdevice}
                      lng={longitudesdevice}
                    />
                  </div>
                </>
              ) : null}
            </div>

            {/* Modal Content End */}
          </div>
        </div>
      ) : null}
      {/* End Modal  on click of "Add Device" of previos modal */}

      {/* device complete add Modal Start */}

      {completedeviceadd ? (
        <div className="check-model ">
          <div
            className="model accedit"
            style={{  width: "600px", height: "300px" }}
          >
            <img
              src={success}
              alt="successful"
              style={{ width: "200px", marginLeft: "30%" }}
            />
            <p style={{ marginLeft: "25%" }}>Device Added Successfully</p>
          </div>
        </div>
      ) : null}
      {/*device complete add Modal End */}
    </>
  );
};

export default Usernotification;
