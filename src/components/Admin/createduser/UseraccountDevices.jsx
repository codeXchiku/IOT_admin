import React, { useContext, useEffect, useRef, useState } from "react";
import "../Adminpage.css";
import "bootstrap-icons/font/bootstrap-icons";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link, useParams } from "react-router-dom";
import "./UseraccountDevices.css";
import { GoogleMap, Marker } from "@react-google-maps/api";
import success from "./success.gif";
import { AdminContext } from "../../../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import mqtt from "mqtt";

const UseraccountDevices = () => {
  const [devicetobeadd, setDevicetobeadd] = useState(false);
  const [completedeviceadd, setCompliteDeviceAdd] = useState(false);
  const [deletebutton, setDeleteButton] = useState(false);
  const [devicetobeedit, setDeviceToBeedit] = useState(false);
  const [devicetobecontrol, setdevicetobecontrol] = useState(false);
  const [showmap, setShowmap] = useState(false);
  const { accountid } = useParams();
  const [usersdevicelist, setUserDeviceList] = useState([]);
  const [deviceStatus, setDeviceStatus] = useState({});
  const editdevicename = useRef(null);
  const editdevicetype = useRef(null);
  const [deviceid, setDeviceid] = useState("");
  //context for collapse and expand of content according sidebar on off
  const { isSidebarOpen } = useContext(AdminContext);
  const navigate = useNavigate();
  const [latitudesdevice, setlatitudesdevice] = useState(20.2961); // Initial latitude FOR ADD USER
  const [longitudesdevice, setlongitudesdevice] = useState(85.8245); // Initial longitude FOR ADD USER
  const [virtualPin, setVertualPin] = useState(null);
  const timeoutsRef = useRef({}); // To store timeouts for each device
  const lastMessageRef = useRef({}); // To store last message time for each device
  const mqttClientRef = useRef(null);
  const [onOffdevice, setOnOffDevice] = useState(false);



  useEffect(() => {
    const mqttClient = mqtt.connect({
      hostname: "newmqtt.bc-pl.com",
      port: 443,
      protocol: "wss",
      path: '/mqtt',
      username: "Vertoxlabs",
      password: "Vertoxlabs@123",

    });
  }, [])


  const adddevice = () => {
    setDevicetobeadd(!devicetobeadd);
  };
  const devaddref = useRef(null);
  useEffect(() => {
    // Handler to call onClick outside of calendar component
    const handleClickOutside = (event) => {
      if (devaddref.current && !devaddref.current.contains(event.target)) {
        adddevice();
      }
    };
    // Add event listener when calendar is shown
    if (devicetobeadd) {
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
  const completlyadddevice = () => {
    setCompliteDeviceAdd(!completedeviceadd);
    setTimeout(() => {
      setCompliteDeviceAdd(false);
    }, 3000);
  };
  const mapshow = () => {
    setShowmap(!showmap);
  };

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
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line
  }, [openDeleteModels]);

  async function userDeviceDelete() {
    await axios.post(`${process.env.REACT_APP_App_Ip}/device_delete/`, {
      deviceid: deviceid,
    });
  }

  async function deviceControlByAdmin(deviceid, status) {
    console.log("hi");

    const data = {
      deviceid: deviceid,
      status: status
    }

    const response = await axios.post(`${process.env.REACT_APP_App_Ip}/device_shutdown/`, data);
    console.log(response);
    if (response.status == 200) {
      setOnOffDevice(!onOffdevice);
      setdevicetobecontrol(false)
      setTimeout(() => {
        setOnOffDevice(false);
      }, 4000);
    }

  }

  const editdevice = () => {
    setDeviceToBeedit(!devicetobeedit);
  };
  const editRef = useRef(null);
  useEffect(() => {
    // Handler to call onClick outside of calendar component
    const handleClickOutside = (event) => {
      if (editRef.current && !editRef.current.contains(event.target)) {
        editdevice();
      }
    };

    // Add event listener when calendar is shown
    if (devicetobeedit) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line
  }, [editdevice]);

  async function userDeviceEdit() {
    const newDeviceData = {
      deviceid: deviceid,
      newdevicename: editdevicename.current.value,
      newdevicetype: editdevicetype.current.value,
    };

    try {
      await axios.post(
        `${process.env.REACT_APP_App_Ip}/device_edit/`,
        newDeviceData
      );
    } catch (error) {
      console.log(error);
    }
  }

  const devicecontrol = () => {
    setdevicetobecontrol(!devicetobecontrol);
  };

  const ctrlref = useRef(null);
  useEffect(() => {
    // Handler to call onClick outside of Device control component
    const handleClickOutside = (event) => {
      if (ctrlref.current && !ctrlref.current.contains(event.target)) {
        devicecontrol();
      }
    };

    // Add event listener when device control is shown
    if (devicetobecontrol) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line
  }, [devicecontrol]);


  //   const mqttClient = mqtt.connect({
  //     hostname: "4.240.114.7",
  //     port: 9001, // Port for secure WebSocket (WS) connections
  //     protocol: "ws", // Ensure the protocol is "wss" for secure WebSocket connections

  //     username: "BarifloLabs",
  //     password: "Bfl@123",
  // });



  // mqttClient.on("error", (err) => {
  //   if (err.message.includes("Insufficient resources")) {
  //     console.log("WebSocket connection failed: Insufficient resources (error suppressed)");
  //   } else {
  //     console.error("MQTT Client Error:", err);
  //   }
  // });


  async function usersDeviceFetch() {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_App_Ip}/device_view/${accountid}/`
      );
      console.log(response);
      console.log(accountid);

      setUserDeviceList(response.data.result);
      console.log(response.data.result);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const handleConnect = () => {
      console.log("Connected to MQTT broker");

      usersdevicelist?.forEach((data) => {
        const topic = `${data[0]}/data`;
        mqttClientRef.current.subscribe(topic, (err) => {
          if (!err) {
            console.log(`Subscribed to topic: ${topic}`);
          } else {
            console.error(`Failed to subscribe to topic: ${topic}`, err);
          }
        });
      });
    };

    if (mqttClientRef.current.connected) {
      handleConnect();
    } else {
      mqttClientRef.current.on("connect", handleConnect);
    }

    mqttClientRef.current.on("message", (topic, payload) => {
      const sanitizedPayload = payload
        .toString()
        .replace(/[\u0000-\u001F\u007F]/g, "");
      try {
        const parsedData = JSON.parse(sanitizedPayload);
        const deviceId = parsedData?.deviceId;

        if (usersdevicelist?.some((data) => data[0] == deviceId)) {
          // Set device to ON when message is received
          setDeviceStatus((prevStatus) => ({
            ...prevStatus,
            [deviceId]: "ON",
          }));

          // Record the last message time
          lastMessageRef.current[deviceId] = Date.now();

          // Clear existing timeout for the device
          if (timeoutsRef.current[deviceId]) {
            clearTimeout(timeoutsRef.current[deviceId]);
          }

          // Set a new timeout to turn off the device after 30 sec
          timeoutsRef.current[deviceId] = setTimeout(() => {
            setDeviceStatus((prevStatus) => ({
              ...prevStatus,
              [deviceId]: "OFF",
            }));
          }, 120000);
        }
        // console.log(`Received data on topic ${topic}:`, parsedData);
      } catch (err) {
        console.error("Failed to parse MQTT message payload:", err);
      }
    });

    // Set up an interval to automatically update device status every 10 seconds
    const intervalId = setInterval(() => {
      const now = Date.now();
      setDeviceStatus((prevStatus) => {
        const updatedStatus = { ...prevStatus };

        usersdevicelist?.forEach((data) => {
          const deviceId = data[0];
          if (
            lastMessageRef.current[deviceId] &&
            now - lastMessageRef.current[deviceId] > 60000
          ) {
            updatedStatus[deviceId] = "OFF";
          }
        });

        return updatedStatus;
      });
    }, 10000); // 10000 milliseconds = 10 seconds

    return () => {
      usersdevicelist.forEach((data) => {
        const topic = `${data[0]}/data`;
        mqttClientRef.current.unsubscribe(topic);
      });

      // Clear all timeouts and the interval when component unmounts
      Object.values(timeoutsRef.current).forEach((timeout) =>
        clearTimeout(timeout)
      );
      clearInterval(intervalId);
    };
  }, [usersdevicelist]);

  // Monitoring changes to deviceStatus
  // useEffect(() => {
  //   console.log("Device Status Updated:", deviceStatus);
  // }, [deviceStatus]);

  //function for publish mqtt data
  const datapublish = async (deviceid, status, pin) => {
    console.log(deviceid, status, pin);

    const statusSend = {
      display_id: parseInt(deviceid),
      virtual_pin: pin,
      status: status, // Assuming 'on' when checked, 'off' when unchecked
    };

    const topic = deviceid.toString();
    const message = JSON.stringify(statusSend);
    console.log(topic, message);

    mqttClientRef.current.publish(topic, message, (err) => {
      if (err) {
        console.error("Failed to publish message", err);
      } else {
        console.log("Message sent successfully");
        deviceControlByAdmin(deviceid, status)
      }
    });

  };

  //variabvle for add device

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

  useEffect(() => {
    usersDeviceFetch();
    seedevicetype();
    // eslint-disable-next-line
  }, [accountid]);

  const devicetype = useRef(null);
  const devicenamee = useRef(null);
  const divlocation = useRef(null);

  const deviceadd = async () => {
    const devicedata = {
      devicename: devicenamee.current.value,
      devicetype: devicetype.current.value,
      location: divlocation.current.value
        .split(",")
        .map((value) => parseFloat(value.trim())),
      accountid: accountid,
    };
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_App_Ip}/device_create/`,
        devicedata
      );
      console.log(res);
      console.log(devicedata);
      if (res) {
        completlyadddevice();
        usersDeviceFetch();
      }
    } catch (error) {
      console.log(error);
    }
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
    console.log(coordinates);
    setdevicecordinate(coordinates);
  };

  //Height and Width for Google Map
  const containerStyle = {
    width: "100%",
    height: "99%",
  };

  const showStatus = (deviceType, deviceId, accountid) => {
    navigate(
      `/adminside/createduser/useraccounts/UseraccountDevices/ngxdynamics/${accountid}/${deviceType}/${deviceId}`
    );
  };

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

  const handleClose = () => {
    navigate(-1); // This takes the user to the previous page
  };

  return (
    <>
      {/* Page Start */}
      <div
        className={`createdusercontent  ${isSidebarOpen ? "open" : "closed"}`}
      >
        {/* Total User Count Start */}
        <div
          className=" shadow"
          style={{
            width: "150px",
            backgroundColor: "#E9EEF6",
            borderRadius: "20px",
            marginTop: "5px",
          }}
        >
          <div>
            <p
              style={{
                display: "flex",
                justifyContent: "center",

                padding: "10px",

                cursor: "pointer",
              }}
              onClick={() => {
                adddevice();
              }}
            >
              New Device
            </p>
          </div>

          <div>
            <button
              className=" shadow"
              onClick={handleClose}
              style={{
                position: "absolute",
                right: "10px",
                top: "135px",
                backgroundColor: "#E9EEF6",

                padding: "8px 25px",
                borderRadius: "15px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Back
            </button>
          </div>
        </div>

        {/* Total User Count End */}

        {/* All  cards start */}
        <div
          className="cards d-flex flex-wrap"
          style={{
            marginTop: "10px",
            gap: "10px",

            overflowY: "scroll",
          }}
        >
          {usersdevicelist?.map((data, index) => (
            <div
              className="card"
              key={index + 1}
              style={{
                backgroundColor: "white",
                borderRadius: "20px",
                marginTop: "10px",

                padding: "7px",
                fontSize: 20,
                width: "48%",
                // height:"",
                marginBottom: "2%",
              }}
            >
              <div
                className="row1 d-flex justify-content-between"
                style={{ fontWeight: 500 }}
              >
                <div
                  className="col1 d-flex flex-column"
                  style={{ margin: "4px 0 0 10px" }}
                >
                  <p>Device</p>
                  <div className="d-flex">
                    {deviceStatus[data[0]] == "ON" ? (
                      <p
                        className="d-flex"
                        style={{ alignItems: "center", marginLeft: "5px" }}
                      >
                        <i
                          className="bi bi-square-fill square"
                          style={{ color: "green", fontSize: 10 }}
                        ></i>
                        <span>ON</span>
                      </p>
                    ) : (
                      <p className="d-flex" style={{ alignItems: "center" }}>
                        <i
                          className="bi bi-square-fill square"
                          style={{ color: "red", fontSize: 10 }}
                        ></i>
                        <span>OFF</span>
                      </p>
                    )}
                  </div>
                </div>
                <div
                  className="col2 control-btn-container"
                  style={{ margin: "29px 7px 0 0" }}
                >
                  <button
                    type="button"
                    className="btn  btn-warning px-3 py-2 text-center fs-sm fw-bold rounded-pill control-btn"
                    style={{
                      textAlign: "cenetr",
                    }}
                    onClick={() => {
                      setDeviceid(data[0]);
                      editdevice();
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger px-3 py-2 text-center fs-sm fw-bold rounded-pill control-btn"
                    style={{
                      textAlign: "cenetr",
                      marginLeft: "8px",
                    }}
                    onClick={() => {
                      setDeviceid(data[0]);
                      openDeleteModels();
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <hr style={{ marginTop: "-10px" }} />

              <div
                className="row1 d-flex justify-content-between"
                style={{ fontWeight: 500, margin: "5px 7px 0 10px" }}
              >
                <div className="col1 d-flex flex-column">
                  <p>Device Id</p>
                </div>
                <div className="col2">
                  <p>{data[0]}</p>
                </div>
              </div>
              <hr
                style={{ marginTop: "-7px", width: "97%", marginLeft: "10px" }}
              />

              <div
                className="row1 d-flex justify-content-between"
                style={{ fontWeight: 500, margin: "5px 7px 0 10px" }}
              >
                <div className="col1 d-flex flex-column">
                  <p>Created</p>
                </div>
                <div className="col2">
                  <p>
                    {new Date(data[4]).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      second: "numeric",
                      hour12: true,
                    })}
                  </p>
                </div>
              </div>

              <hr
                style={{ marginTop: "-7px", width: "97%", marginLeft: "10px" }}
              />

              <div
                className="row1 d-flex justify-content-between"
                style={{ fontWeight: 500, margin: "5px 7px 0 10px" }}
              >
                <div className="col1 d-flex flex-column">
                  <p>Device Name</p>
                </div>
                <div className="col2">
                  <p>{data[1]}</p>
                </div>
              </div>

              <hr
                style={{ marginTop: "-7px", width: "97%", marginLeft: "10px" }}
              />

              <div
                className="row1 d-flex justify-content-between"
                style={{ fontWeight: 500, margin: "5px 7px 0 10px" }}
              >
                <div className="col1 d-flex flex-column">
                  <p>Device Type</p>
                </div>
                <div className="col2">
                  <p> {data[2]}</p>
                </div>
              </div>
              <hr
                style={{ marginTop: "-7px", width: "97%", marginLeft: "10px" }}
              />

              <div
                className="row1 d-flex justify-content-between"
                style={{ fontWeight: 500, margin: "5px 7px 0 10px" }}
              >
                <div className="col1 d-flex flex-column">
                  <p>Device Version</p>
                </div>
                <div className="col2">
                  <p>{data[3]}</p>
                </div>
              </div>
              <hr style={{ marginTop: "-10px" }} />

              <div className="row5 d-flex">
                <Link
                  to={`/devicelocation/id=${data[5]}`}
                  style={{
                    textDecoration: "none", // Removes the underline from the link
                  }}
                >
                  <button
                    type="button"
                    className="btn btn-info px-3 py-2 text-center fs-sm fw-bold rounded-pill"
                    style={{
                      textAlign: "center",
                      marginLeft: "8px",
                      color: "white",
                    }}
                  >
                    Location
                  </button>
                </Link>

                <button
                  type="button"
                  className="btn btn-primary px-3 py-2 text-center fs-sm fw-bold rounded-pill "
                  style={{
                    marginLeft: "8px",
                  }}
                  onClick={() => {
                    //buttonControls(data[4], data[5]);
                    setDeviceid(data[0]);
                    devicecontrol();
                    setVertualPin(data[6])
                  }}
                >
                  Controls
                </button>

                <button
                  type="button"
                  className="btn  btn-success px-3 py-2 text-center fs-sm fw-bold rounded-pill"
                  style={{
                    textAlign: "cenetr",
                    marginLeft: "8px",
                  }}
                  onClick={() => {
                    showStatus(data[2], data[0], accountid);
                    const datas = [data[2], data[3]];
                    localStorage.setItem("adminSideDeviceType", datas);
                  }}
                >
                  Stats
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* All Cards End */}
      </div>

      {/*  Edit Device modal start */}
      {devicetobeadd ? (
        <div className="check-model ">
          <div
            ref={devaddref}
            className="model accedit"
            style={{
              marginTop: "1px",
              width: "650px",
              height: "auto",
            }}
          >
            {/* Modal Heading */}
            <div className="heading d-flex justify-content-between  ">
              <p style={{ marginLeft: "30px", fontSize: 20 }}>Device Add</p>
              <i
                className="bi bi-x-octagon cancel-button-modal "
                style={{
                  fontSize: 30,
                  color: "#df010d",
                  alignItems: "center",
                  display: "flex",
                }}
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
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  deviceadd();
                  adddevice();
                }}
              >
                <label>Device Name</label>
                <input
                  ref={devicenamee}
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
                    <label>Device Type</label>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      style={{ width: "90%" }}
                      ref={devicetype}
                    >
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
                      ref={divlocation}
                      value={devicecordinate}
                      type="text"
                      className="form-control"
                      placeholder="Location...."
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
                  type="submit"
                  className="btn  btn-primary px-3 py-2 text-center fs-sm fw-bold rounded-pill"
                  style={{
                    textAlign: "cenetr",
                    marginRight: "15px",
                    margin: "10px 15px 10px 0",
                  }}
                >
                  Add Device
                </button>
              </form>

              {showmap ? (
                <>
                  <div className="searchbar d-flex" style={{ width: "50%" }}>
                    <input
                      ref={cityname}
                      className="form-control mr-sm-2"
                      type="search"
                      placeholder="Search"
                      aria-label="Search"
                    />
                    <button
                      className="btn btn-outline-success my-2 my-sm-0"
                      style={{ marginLeft: "10px" }}
                      onClick={handleSearch}
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
                      containerStyle={containerStyle}
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

      {/* Add Device  Modal End */}

      {/* device complete add Modal Start */}

      {completedeviceadd ? (
        <div className="check-model ">
          <div
            className="model accedit"
            style={{ fontSize: "16px", width: "600px", height: "300px" }}
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

      {/*  ON / OFF Device modal start */}

      {onOffdevice ? (
        <div className="check-model ">
          <div
            className="model accedit"
            style={{ fontSize: "16px", width: "600px", height: "300px" }}
          >
            <img
              src={success}
              alt="successful"
              style={{ width: "200px", marginLeft: "33%" }}
            />
            <p style={{ marginLeft: "33%" }}>Device Controlled successfully</p>
          </div>
        </div>
      ) : null}

      {/*  ON / OFF Device modal END */}

      {/*  Edit Device modal start */}
      {devicetobeedit ? (
        <div className="check-model ">
          <div
            className="model accedit"
            ref={editRef}
            style={{ width: "650px", height: "auto" }}
          >
            {/* Modal Heading */}
            <div className="heading d-flex justify-content-between  ">
              <p style={{ marginLeft: "30px", fontSize: 20 }}>Edit Device</p>
              <i
                className="bi bi-x-octagon cancel-button-modal "
                style={{
                  fontSize: 30,
                  color: "#df010d",
                  alignItems: "center",
                  display: "flex",
                }}
                onClick={editdevice}
              ></i>
            </div>
            {/* Modal Content */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                userDeviceEdit();
                editdevice();
                setTimeout(() => {
                  usersDeviceFetch();
                }, 400);
              }}
            >
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
                  ref={editdevicename}
                  type="text"
                  className="form-control"
                  id="formGroupExampleInput"
                  placeholder="Device Name"
                  style={{ width: "90%" }}
                  required
                  onInvalid={(e) =>
                    e.target.setCustomValidity("Please Enter Your Label Name")
                  }
                  onChange={(e) => e.target.setCustomValidity("")}
                ></input>

                <label style={{ width: "250px", marginTop: "4px" }}>
                  Device Type
                </label>

                <div className="d-flex">
                  <select
                    ref={editdevicetype}
                    className="form-select"
                    aria-label="Default select example"
                    style={{ width: "200px" }}
                    required
                    onInvalid={(e) =>
                      e.target.setCustomValidity("Please Enter Your Label Name")
                    }
                    onChange={(e) => e.target.setCustomValidity("")}
                  >
                    {devicetypes.map((device, index) => (
                      <option key={index} value={device[0]}>
                        {device[0]}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn  btn-success px-3 py-2 text-center fs-sm fw-bold rounded-pill"
                  style={{
                    textAlign: "cenetr",
                    marginRight: "15px",
                    margin: "10px 15px 10px 0",
                  }}
                >
                  Update Device
                </button>
              </div>
            </form>

            {/* Modal Content End */}
          </div>
        </div>
      ) : null}

      {/* Edit Device  Modal End */}

      {/* Delete button Modal Start */}

      {deletebutton ? (
        <div className="check-model ">
          <div
            ref={delref}
            className="model accedit"
            style={{ fontSize: "16px" }}
          >
            {/* Modal Heading */}
            <div className="heading d-flex justify-content-between  ">
              <p style={{ marginTop: "8px", marginLeft: "30px", fontSize: 20 }}>
                Delete Account
              </p>
              <i
                className="bi bi-x-octagon cancel-button-modal "
                style={{
                  fontSize: 30,
                  color: "#df010d",
                  alignItems: "center",
                  display: "flex",
                }}
                onClick={openDeleteModels}
              ></i>
            </div>
            {/* Modal Content */}
            <div className="accounteditmodaldv" style={{ marginLeft: "20px" }}>
              <div style={{ marginLeft: "25px" }}>
                <p> Are you sure to Delete Account Permanently ?</p>
              </div>

              <div className="d-flex justify-content-end mt-3 p-1">
                <button
                  type="button"
                  className="btn btn-danger px-3 py-2 text-center fs-sm fw-bold rounded-pill"
                  style={{
                    textAlign: "cenetr",
                    marginRight: "15px",
                  }}
                  onClick={() => {
                    openDeleteModels();
                    userDeviceDelete();
                    setTimeout(() => {
                      usersDeviceFetch();
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
                  onClick={openDeleteModels}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {/* DeleteButton Modal End */}

      {/* device control modal start */}

      {devicetobecontrol ? (
        <div className="check-model ">
          <div
            ref={ctrlref}
            className="model"
            style={{ fontSize: "16px", width: "300px", height: "250px" }}
          >
            {/* Modal Heading */}
            <div className="heading d-flex justify-content-between  ">
              <p style={{ marginTop: "8px", marginLeft: "30px", fontSize: 20 }}>
                Device Controls
              </p>
              <i
                className="bi bi-x-octagon cancel-button-modal "
                style={{
                  fontSize: 30,
                  color: "#df010d",
                  alignItems: "center",
                  display: "flex",
                }}
                onClick={devicecontrol}
              ></i>
            </div>
            {/* Modal Content */}

            <div
              className="d-flex justify-content-between "
              style={{ margin: "10px 10px 0 20px" }}
            >
              {/* {buttonsofdevice.map((item, index) =>
                item.button ? (
                  <div className="d-flex justify-content-between">
                   
                    <p key={index}>{item.button.display_name}</p>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="flexSwitchCheckDefault"
                      />
                    </div>
                  </div>
                ) : null
              )} */}
              <p>Aeration On/Off</p>
              <div className="form-check form-switch">
                <div class="container mt-1">
                  <div class="d-flex gap-2">
                    <button
                      class="btn btn-success btn-3d"
                      onClick={() => {
                        datapublish(deviceid, true, virtualPin);
                      }}
                    >
                      On
                    </button>
                    <button
                      class="btn btn-danger btn-3d"
                      onClick={() => {
                        datapublish(deviceid, false, virtualPin);
                      }}
                    >
                      Off
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Content END */}
          </div>
        </div>
      ) : null}

      {/* device control modal End */}
    </>
  );
};

export default UseraccountDevices;
