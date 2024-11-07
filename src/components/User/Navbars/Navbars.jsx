import React, { useEffect, useRef, useState } from "react";
import "bootstrap-icons/font/bootstrap-icons";
import farmer from "../usersimage/farmer.png";
import group from "../usersimage/group.png";
import clipboard from "../usersimage/ClipboardMinus.png";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Navbars.css";
import { Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import axios from "axios";
import addgif from "../usersimage/Added.gif";
import deletesuccess from "../usersimage/deleteanimation.gif";
import CalendarComponent from "../CalendarComponent ";
import loadingprofile from "../usersimage/loading.gif";
import mqtt from "mqtt";
import { NavLink } from "react-router-dom";
import warning from "../usersimage/warning.gif";
const Navbars = ({
  handleToggle,
  useraccount,
  updateCoordinates,
  setdevice,
  update,
  toggleStates,
}) => {
  const mobileno = localStorage.getItem("usermob");

  //for showing logout popup on click of user logo on top navbar
  const [logout, setLogout] = useState(false);
  //Variable visible and hide of account button of sidenavbar
  const [accountvisible, setaccountvisible] = useState(false);
  //all details of user
  const [userdetails, setUserdetails] = useState([""]);
  // variable for visible and hide of analatic button of sidenavbar
  const [analyticvisible, setAnalyticVisible] = useState(false);
  // variable for  input field open and close of topnavbar
  const [showInput, setShowInput] = useState(false);
  //variable for delete-> lable choose show
  const [showdelete, setShowdelete] = useState(false);
  //DEVICE DETAILS STORE FOR NAVBAR
  const [devicedetails, setdevicedetails] = useState([]);
  //Label add animation
  const [addanimation, setAddanimation] = useState(false);
  // DELETE OPTION FOR LABELS
  const [deleteoption, setDeleteoption] = useState(false);
  const [deleteanimation, setDeleteAnimation] = useState(false);
  const [warnanimation, setwarnanimation] = useState(false);
  // Variable for temporary divice id  on each device click
  const [accid, setaccid] = useState();
  //TOTAL LABELS PRESENT TO A ACCOUNT
  const [devicelabels, setdevicelabels] = useState([]);
  // SET FOR TEMPORARY STORE ALL DEVICE LABELS
  const uniqueValues = new Set();
  //total device type
  const [devicetypes, setDevicetypes] = useState([]);
  //filter device according to select option
  const [selectedDevice, setSelectedDevice] = useState('All');
  //store selected levels
  const [labels, setLabels] = useState([])

  const [deviceStates, setDeviceStates] = useState(() => {
    const storedDeviceStates = localStorage.getItem("deviceStates");
    return storedDeviceStates ? JSON.parse(storedDeviceStates) : {};
  });
  const [showDropdown, setShowDropdown] = useState(false);
  //  check pulses
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("lastDataPoint"))
  );
  //logout
  const handleLogout = () => {
    localStorage.removeItem("usermob");
  };
  const mqttClientRef = useRef(null);

  useEffect(() => {
    // Function to handle changes in local storage
    const handleStorageChange = () => {
      // Update the userData state with the new data from local storage
      setUserData(JSON.parse(localStorage.getItem("lastDataPoint")));
    };

    // Subscribe to changes in local storage
    window.addEventListener("storage", handleStorageChange);

    // Clean up function to unsubscribe from changes in local storage
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  // Function to initialize device states
  const initializeDeviceStates = () => {
    // Check if deviceStates is already initialized
    if (Object.keys(deviceStates).length === 0) {
      const updatedDeviceStates = {};
      devicedetails.forEach((devicedata) => {
        const deviceId = devicedata[1];
        if (deviceStates[deviceId] === undefined) {
          updatedDeviceStates[deviceId] = {
            checked: false,
            virtualPin: devicedata[2],
          };
        } else {
          updatedDeviceStates[deviceId] = {
            ...deviceStates[deviceId],
            virtualPin: devicedata[2],
          };
        }
      });
      setDeviceStates(updatedDeviceStates);
      localStorage.setItem("deviceStates", JSON.stringify(updatedDeviceStates));
    }
  };

  // Initialize device states when component mounts
  useEffect(() => {
    initializeDeviceStates();
    //eslint-disable-next-line
  }, []);

  const handleCheckboxChange = (deviceId, isChecked, virtualPin, access) => {
    if (access) {
      if (virtualPin == null) {
        virtualPin = 0;
      }
      console.log(deviceId, isChecked, virtualPin);
      const updatedDeviceStates = {
        ...deviceStates,
        [deviceId]: { checked: isChecked, virtualPin },
      };
      // console.log(deviceId, isChecked,virtualPin);

      mqttClientRef.current = mqtt.connect({
        hostname: "newmqtt.bc-pl.com",
        port: 443,
        protocol: "wss",
        path: "/mqtt",
        username: "Vertoxlabs",
        password: "Vertoxlabs@123",
      });

      setDeviceStates(updatedDeviceStates);
      localStorage.setItem("deviceStates", JSON.stringify(updatedDeviceStates));

      mqttClientRef.current.on("connect", () => {
        // console.log("hi");

        const statusSend = {
          display_id: parseInt(deviceId),
          virtual_pin: virtualPin,
          status: isChecked, // Assuming 'on' when checked, 'off' when unchecked
        };

        const topic = deviceId.toString();
        const message = JSON.stringify(statusSend);
        console.log(topic, message);

        mqttClientRef.current.publish(topic, message, (err) => {
          if (err) {
            // console.error("Failed to publish message", err);
          } else {
            console.log("Message sent successfully");

            // Unsubscribe from the topic
            mqttClientRef.current.unsubscribe(topic, (err) => {
              if (err) {
                console.error("Failed to unsubscribe", err);
              } else {
                //  console.log(`Unsubscribed from topic ${topic}`);

                // Disconnect the MQTT client after successful message send and unsubscribe
                mqttClientRef.current.end(false, () => {
                  // console.log("MQTT client disconnected");
                });
              }
            });
          }
        });
      });

      mqttClientRef.current.on("error", (err) => {
        console.error("Failed to connect to MQTT broker", err);
      });
    }

  };

  useEffect(() => { }, [handleCheckboxChange]);

  //user detaikls cal kali
  const userdatas = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_App_Ip}/userside_user_view/${mobileno}/`
      );
      console.log(response);
      setUserdetails(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };
  // temporary labelname
  const [templabel, setTemplebel] = useState("");
  //show calender variable
  const [calendershow, setCalendershow] = useState(false);
  const showcalender = () => {
    setCalendershow(!calendershow);
  };

  //variable for profile picture upload
  const [selectedImage, setSelectedImage] = useState("");
  const handleImageChange = () => {
    const file = photo.current.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      setSelectedImage(e.target.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const [profilepicaddmodal, setProfilepicaddmodal] = useState(false);

  const dpUpload = () => {
    setProfilepicaddmodal(!profilepicaddmodal);
  };

  const dpRef = useRef(null);
  useEffect(() => {
    // Handler to call onClick outside of calendar component
    const handleClickOutside = (event) => {
      if (dpRef.current && !dpRef.current.contains(event.target)) {
        dpUpload();
      }
    };

    // Add event listener when calendar is shown
    if (profilepicaddmodal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line
  }, [dpUpload]);
  const [profilepicaddanimation, setProfilepicaddanimation] = useState(false);

  const photo = useRef(null);

  const profileadd = async () => {
    if (!photo.current.files[0]) {
      alert("Please select a file.");
      return;
    }
    const formData = new FormData();
    formData.append("Mobno", mobileno);
    formData.append("user_pic", photo.current.files[0]);
    formData.append("user_docs", null);
    console.log(formData);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_App_Ip}/user_pic_docs/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      if (response) {
        setProfilepicaddanimation(true);
        setTimeout(() => {
          setProfilepicaddanimation(false);
          fetchProfilepicture();
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [profileImage, setProfileImage] = useState(farmer);

  const fetchProfilepicture = async () => {
    try {
      //add api here by  mobileno
      const response = await axios.get(
        `${process.env.REACT_APP_App_Ip}/imageview/${mobileno}/`
      );
      console.log(response);
      if (response.data.image)
        setProfileImage(
          `${process.env.REACT_APP_App_Ip}${response.data.image}/`
        );
    } catch (error) {
      console.error("Error fetching profile image:", error);
    }
  };

  //number of device types per user
  async function seedevicetype() {
    try {
      if (accid) {
        const response = await axios.get(
          `${process.env.REACT_APP_App_Ip}/userside_devicetype/${accid}/`
        );

        setDevicetypes(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (!showInput) {
      seedevicetype();
    }
    // eslint-disable-next-line
  }, [showInput]);

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

  //  delete  labels
  const deletedevicetype = useRef(null);

  const labeldelete = async () => {
    const deletedata = {
      Mobno: mobileno,
      device_type: deletedevicetype.current.value,
      param: templabel,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_App_Ip}/param_delete/`,
        deletedata
      );
      console.log(response);
      if (response) {
        setDeleteAnimation(!deleteanimation);
        setTimeout(() => {
          setDeleteAnimation(false);
        }, 2500);
      }
    } catch (error) {
      console.log("Error:", error);
      setwarnanimation(!warnanimation);
      setTimeout(() => {
        setwarnanimation(false);
      }, 2500);
    }
  };
  //delete modal for delete
  const [labeltodelete, Setlabeltodelete] = useState(false);

  //Add labels to device
  const devicetype = useRef(null);
  const labelname = useRef(null);
  const labeladd = async () => {
    const newData = {
      Mobno: mobileno,
      device_type: devicetype.current.value,
      param: labelname.current.value,
    };

    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_App_Ip}/param_update/`,
        newData
      );
      console.log("Response:", response);
      if (response) {
        setAddanimation(true);
        setTimeout(() => {
          setAddanimation(false);
        }, 2500);
      }
    } catch (error) {
      console.log("Error:", error);
      setwarnanimation(!warnanimation);
      setTimeout(() => {
        setwarnanimation(false);
      }, 2500);
    }
  };

  // API CALL TO SEE HOW MANY DEVICE PRESENT IN A ACCOUNT
  async function devicefetch(Accid) {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_App_Ip}/userside_device_view/${Accid}/`
      );

      setdevice(response.data);
      setdevicedetails(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  // BY THIS FUNCTION CORDEINATE AND ADDRESS UPDATE ON USERMAIN PAGE  AND USERMAIN PAGE PASS THAT TO CONTENT TO SHOW ON MAP
  const handleClickAccountDetails = (latitude, longitude, address) => {
    updateCoordinates(latitude, longitude, address);
  };

  // HOW MANY LABELS PRESENT IN A DEVICE
  async function devicelabelFetch(Accid) {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_App_Ip}/userside_graph_view/${Accid}/`
      );
      for (const key in response.data) {
        response.data[key].forEach((value) => uniqueValues.add(value));
      }
      const uniqueArray = Array.from(uniqueValues);
      setdevicelabels(uniqueArray); // Update state with unique labels
    } catch (error) {
      console.log(error);
    }
  }
  // WHEN PAGE OPEN FIRST TIME IT CALL FOR DEVICE FETCH AND LABEL FETCH OF FIRST ACCOUNT OF  user
  useEffect(() => {
    if (useraccount.items && useraccount.items.length > 0) {
      devicefetch(useraccount.items[0][1]);
      setaccid(useraccount.items[0][1]);
      // console.log(useraccount.items[0][1]);
      devicelabelFetch(useraccount.items[0][1]);
      fetchProfilepicture();
      userdatas();
    }
    // eslint-disable-next-line
  }, [useraccount]);
  const userMetricsData = localStorage.getItem("userMetrics");
  const userMetrics = userMetricsData && JSON.parse(userMetricsData);
  const deviceMetrics = userMetrics && userMetrics[mobileno];

  const handleDeviceChange = (event) => {
    setSelectedDevice(event.target.value);
  };

  useEffect(() => {
    seedevicetype();
    filterLevels(accid, selectedDevice)
  }, [selectedDevice, accid])

  const filterLevels = async (Accid, selectedDevice) => {
    console.log(Accid);
    console.log(selectedDevice);
    if (selectedDevice == "All") {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_App_Ip}/userside_graph_view/${Accid}/`
        );
        for (const key in response.data) {
          response.data[key].forEach((value) => uniqueValues.add(value));
        }
        const uniqueArray = Array.from(uniqueValues);
        setLabels(uniqueArray)
      } catch (error) {
        console.log(error);
      }
    }
    else {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_App_Ip}/devicetype_sensor_view/`,
          {
            params: {
              account_id: Accid,
              device_type: selectedDevice
            }
          }
        );
        for (const key in response.data) {
          response.data[key].forEach((value) => uniqueValues.add(value));
        }
        const uniqueArray = Array.from(uniqueValues);
        setLabels(uniqueArray)
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <>
      {/* Top Navbar start */}

      <div className=" shadow-lg topnavbar h-auto d-none d-md-block ">
        <div className=" d-flex  justify-content-end align-items-center bg-white ">

          <Dropdown>
            <Dropdown.Toggle variant="transparent" style={{ border: "none" }}>
              <i
                className=" img1 fa-solid fa-chart-line "
                style={{ fontSize: 20 }}
              ></i>
            </Dropdown.Toggle>

            <Dropdown.Menu
              style={{
                borderRadius: "10px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                width: "270px",
                marginTop: "20px",
              }}
            >
              <>
                {/* START Logic  for adding input by buttotn click field  */}
                <div className="d-flex gap-1 px-1 ">
                  <button
                    style={{
                      width: "70%",
                      borderRadius: "5px",
                      backgroundColor: "#E9EEF6",
                      fontSize: "15px",
                    }}
                    onClick={() => {
                      setShowInput(!showInput);
                      setDeleteoption(false);
                      seedevicetype();
                      setShowdelete(false);
                    }}
                  >
                    Add Labels
                  </button>
                  <button
                    style={{
                      width: "30%",
                      borderRadius: "5px",
                      padding: "5px 8px",
                      backgroundColor: "#FF0000",
                      fontSize: "15px",
                      color: "white",
                    }}
                    onClick={() => {
                      seedevicetype();
                      setDeleteoption(!deleteoption);
                      setShowdelete(!showdelete);
                      setShowInput(false);
                    }}
                  >
                    Delete
                  </button>
                </div>

                {showdelete && (
                  <Form.Select
                    style={{
                      marginTop: "8px",
                      marginLeft: "8px",
                      width: "93%",
                      height: "34px",
                    }}
                    ref={deletedevicetype}
                  >
                    <option>Select Your device .....</option>
                    {devicetypes.map((device, index) => (
                      <option key={index} value={device}>
                        {device}
                      </option>
                    ))}
                  </Form.Select>
                )}
                {showInput && (
                  <div style={{ zIndex: "10" }}>
                    <Form.Select
                      style={{
                        marginTop: "8px",
                        marginLeft: "8px",
                        width: "93%",
                        height: "34px",
                      }}
                      ref={devicetype}
                    >
                      <option>Select Your device .....</option>
                      {devicetypes.map((device, index) => (
                        <option key={index} value={device} >
                          {device}
                        </option>
                      ))}
                    </Form.Select>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        labeladd();
                        setShowInput(false);
                        setTimeout(() => {
                          devicelabelFetch(accid);
                        }, 400);
                      }}
                    >
                      <div className="p-2 d-flex justify-content-between">
                        <input
                          type="text"
                          className="form-control"
                          id="inlineFormInput"
                          placeholder="Add Your Labels....."
                          style={{
                            width: "80%",
                            height: "34px",
                          }}
                          ref={labelname}
                          required
                          onInvalid={(e) =>
                            e.target.setCustomValidity(
                              "Please Enter Your Label Name"
                            )
                          }
                          onChange={(e) => e.target.setCustomValidity("")}
                        />

                        <button
                          type="submit"
                          className="btn btn-success px-0 py-0 text-center"
                          style={{
                            textAlign: "center",
                            height: "34px",
                            width: "45px",
                          }}
                        >
                          <i
                            className="bi bi-plus fw-bold"
                            style={{
                              cursor: "pointer",
                              display: "contents",
                            }}
                          ></i>
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                {/* END Logic  for adding input field  */}

                <Form.Select
                  style={{
                    marginTop: "8px",
                    marginLeft: "8px",
                    width: "93%",
                    height: "34px",
                  }}
                  onChange={handleDeviceChange}
                  value={selectedDevice}
                >
                  <option>All</option>
                  {devicetypes.map((device, index) => (
                    <option key={index} value={device}>
                      {device}
                    </option>
                  ))}
                </Form.Select>


                <div className="d-flex flex-column justify-content-between p-2 py-0 pt-1">

                  <p style={{ marginTop: '10px' }}>
                    Selected Device: {selectedDevice}
                  </p>

                  {/* Toggle switches for metrics */}
                  {labels.map((metric) => {
                    console.log(metric)
                    const isChecked =
                      deviceMetrics &&
                        deviceMetrics[metric] !== undefined &&
                        deviceMetrics[metric] !== null
                        ? deviceMetrics[metric]
                        : false;
                    return (
                      <div
                        key={metric}
                        className="d-flex justify-content-between p-2 py-0 pt-1"
                        style={{ height: "39px" }}
                      >
                        {/* Wrap the elements in data div */}
                        <p style={{ fontSize: "16px", fontWeight: "500" }}>
                          {metric}
                        </p>
                        {deleteoption ? (
                          <i
                            className="bi bi-trash"
                            style={{
                              color: "red",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              setTemplebel(metric);
                              Setlabeltodelete(!labeltodelete);
                            }}
                          ></i>
                        ) : (
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              style={{ fontSize: "20px" }}
                              checked={isChecked}
                              onChange={(e) =>
                                handleToggle(metric, e.target.checked)
                              }
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown>
            <Dropdown.Toggle variant="transparent" style={{ border: "none" }}>
              <i
                className="img1 bi bi-diagram-3-fill "
                style={{ fontSize: 20 }}
              ></i>
            </Dropdown.Toggle>

            <Dropdown.Menu
              style={{
                borderRadius: "10px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                width: "max-width",
                marginTop: "10px",
                maxHeight: "450px",
                overflowY: "auto",
              }}
            >
              {devicedetails.map((devicedata) => (
                <>
                  <div
                    className="d-flex justify-content-between p-2 "
                    style={{
                      gap: "60px",
                      maxHeight: "450px",
                      overflowY: "auto",
                    }}
                  >
                    <div style={{ width: "max-content" }}>
                      <p className="mb-0">
                        <span style={{ fontWeight: 500 }}>ID:</span>{" "}
                        {devicedata[1]}
                      </p>
                      <p className="mb-0">
                        <span style={{ fontWeight: 500 }}>Dev_Name:</span>{" "}
                        {devicedata[0]}
                      </p>
                      <p style={{ margin: 0 }}>
                        Pulse
                        {devicedata[1] === Number(userData?.deviceId) &&
                          userData.paramType == "cpu_temp" &&
                          userData.status === true ? (
                          <i
                            className="fa-solid fa-heart"
                            style={{ fontSize: 12, color: "green" }}
                          ></i>
                        ) : (
                          <i
                            className="fa-solid fa-heart"
                            style={{ fontSize: 12, color: "red" }}
                          ></i>
                        )}
                      </p>
                    </div>

                    <div
                      className=" form-check form-switch"
                      style={{ fontSize: "x-large" }}
                    >
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        checked={
                          deviceStates[devicedata[1]]
                            ? deviceStates[devicedata[1]].checked
                            : false
                        }
                        onChange={(e) => {
                          handleCheckboxChange(
                            devicedata[1],
                            e.target.checked,
                            devicedata[3],
                            devicedata[4]
                          );
                          update();
                        }}
                        disabled={!devicedata[4]}
                      />
                    </div>
                  </div>
                  <hr className="my-0 text-secondary" />
                </>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          <i
            className="img1 bi bi-brightness-high-fill m-3"
            style={{ fontSize: 20 }}
          ></i>

          <i
            className="img2 bi bi-calendar-week m-3"
            style={{ fontSize: 20 }}
            onClick={() => {
              showcalender();
            }}
          ></i>

          <i className="img3 bi bi-bell-fill m-3" style={{ fontSize: 20 }}></i>

          <i
            className="img4 bi bi-question-circle m-3 "
            style={{ fontSize: 20 }}
          ></i>

          <i
            className="img5 bi bi-box-arrow-right m-3 "
            style={{ fontSize: 20 }}
            onClick={islogout}
          ></i>
        </div>
      </div>
      <div className="d-flex d-md-none flex-column position-absolute top-0 end-0 justify-content-end p-4 ">
        <span
          className="text-light p-2 px-4 fs-2 rounded cursor-pointer"
          style={{ backgroundColor: "#00216E" }}
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <i className="fa-solid fa-bars"></i>
        </span>
        {showDropdown && (
          <div
            className=" d-flex flex-column align-items-center bg-white shadow pt-2"
            style={{ zIndex: 2 }}
          >
            <Dropdown>
              <Dropdown.Toggle variant="transparent" style={{ border: "none" }}>
                <i
                  className=" img1 fa-solid fa-chart-line "
                  style={{ fontSize: 20 }}
                ></i>
              </Dropdown.Toggle>
              <Dropdown.Menu
                style={{
                  borderRadius: "10px",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                  width: "270px",
                  marginTop: "20px",
                }}
              >
                <>
                  {/* START Logic  for adding input by buttotn click field  */}
                  <div className="d-flex gap-1 px-1 ">
                    <button
                      style={{
                        width: "70%",
                        borderRadius: "5px",
                        backgroundColor: "#E9EEF6",
                        fontSize: "15px",
                      }}
                      onClick={() => {
                        setShowInput(!showInput);
                        setDeleteoption(false);
                        seedevicetype();
                        setShowdelete(false);
                      }}
                    >
                      Add Labels
                    </button>
                    <button
                      style={{
                        width: "30%",
                        borderRadius: "5px",
                        padding: "5px 8px",
                        backgroundColor: "#FF0000",
                        fontSize: "15px",
                      }}
                      onClick={() => {
                        seedevicetype();
                        setDeleteoption(!deleteoption);
                        setShowdelete(!showdelete);
                        setShowInput(false);
                      }}
                    >
                      Delete
                    </button>
                  </div>

                  {showdelete && (
                    <Form.Select
                      style={{
                        marginTop: "8px",
                        marginLeft: "8px",
                        width: "93%",
                        height: "34px",
                      }}
                      ref={deletedevicetype}
                    >
                      <option>Select Your device .....</option>
                      {devicetypes.map((device, index) => (
                        <option key={index} value={device}>
                          {device}
                        </option>
                      ))}
                    </Form.Select>
                  )}
                  {showInput && (
                    <div style={{ zIndex: "10" }}>
                      <Form.Select
                        style={{
                          marginTop: "8px",
                          marginLeft: "8px",
                          width: "93%",
                          height: "34px",
                        }}
                        ref={devicetype}
                      >
                        <option>Select Your device .....</option>
                        {devicetypes.map((device, index) => (
                          <option key={index} value={device}>
                            {device}
                          </option>
                        ))}
                      </Form.Select>

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          labeladd();
                          setShowInput(false);
                          setTimeout(() => {
                            devicelabelFetch(accid);
                          }, 400);
                        }}
                      >
                        <div className="p-2 d-flex justify-content-between">
                          <input
                            type="text"
                            className="form-control"
                            id="inlineFormInput"
                            placeholder="Add Your Labels....."
                            style={{
                              width: "80%",
                              height: "34px",
                            }}
                            ref={labelname}
                            required
                            onInvalid={(e) =>
                              e.target.setCustomValidity(
                                "Please Enter Your Label Name"
                              )
                            }
                            onChange={(e) => e.target.setCustomValidity("")}
                          />

                          <button
                            type="submit"
                            className="btn btn-success px-0 py-0 text-center"
                            style={{
                              textAlign: "center",
                              height: "34px",
                              width: "45px",
                            }}
                          >
                            <i
                              className="bi bi-plus fw-bold"
                              style={{
                                cursor: "pointer",
                                display: "contents",
                              }}
                            ></i>
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                  {/* END Logic  for adding input field  */}

                  <div className="d-flex flex-column justify-content-between p-2 py-0 pt-1">
                    {/* Toggle switches for metrics */}
                    {devicelabels.map((metric) => {
                      const isChecked =
                        deviceMetrics &&
                          deviceMetrics[metric] !== undefined &&
                          deviceMetrics[metric] !== null
                          ? deviceMetrics[metric]
                          : false;
                      return (
                        <div
                          key={metric}
                          className="d-flex justify-content-between p-2 py-0 pt-1"
                          style={{ height: "39px" }}
                        >
                          {/* Wrap the elements in data div */}
                          <p style={{ fontSize: "16px", fontWeight: "500" }}>
                            {metric}
                          </p>
                          {deleteoption ? (
                            <i
                              className="bi bi-trash"
                              style={{
                                color: "red",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                setTemplebel(metric);
                                Setlabeltodelete(!labeltodelete);
                              }}
                            ></i>
                          ) : (
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                checked={isChecked}
                                onChange={(e) =>
                                  handleToggle(metric, e.target.checked)
                                }
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown>
              <Dropdown.Toggle variant="transparent" style={{ border: "none" }}>
                <i
                  className="img1 bi bi-diagram-3-fill "
                  style={{ fontSize: 20 }}
                ></i>
              </Dropdown.Toggle>

              <Dropdown.Menu
                style={{
                  borderRadius: "10px",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                  width: "max-width",
                  marginTop: "10px",
                  marginRight: "-25px",
                  maxHeight: "450px",
                  overflowY: "auto",
                }}
              >
                {devicedetails.map((devicedata) => (
                  <>
                    <div
                      className="d-flex justify-content-between p-2 "
                      style={{ gap: "40px" }}
                    >
                      <div style={{ width: "max-content" }}>
                        <p className="mb-0">
                          <span style={{ fontWeight: 500 }}>ID:</span>{" "}
                          {devicedata[1]}
                        </p>
                        <p className="mb-0">
                          <span style={{ fontWeight: 500 }}>Dev_Name:</span>{" "}
                          {devicedata[0]}
                        </p>
                      </div>

                      <div
                        className=" form-check form-switch"
                        style={{ fontSize: "x-large" }}
                      >
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          checked={
                            deviceStates[devicedata[1]]
                              ? deviceStates[devicedata[1]].checked
                              : false
                          }
                          onChange={(e) => {
                            handleCheckboxChange(
                              devicedata[1],
                              e.target.checked,
                              devicedata[3]
                            );
                            update();
                          }}
                        />
                      </div>
                    </div>
                    <hr className="my-0 text-secondary" />
                  </>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            <i
              className="img1 bi bi-brightness-high-fill m-3"
              style={{ fontSize: 20 }}
            ></i>

            <i
              className="img2 bi bi-calendar-week m-3"
              style={{ fontSize: 20 }}
              onClick={() => {
                showcalender();
              }}
            ></i>

            <i
              className="img3 bi bi-bell-fill m-3"
              style={{ fontSize: 20 }}
            ></i>

            <i
              className="img4 bi bi-question-circle m-3 "
              style={{ fontSize: 20 }}
            ></i>

            <i
              className="img5 bi bi-box-arrow-right m-3 "
              style={{ fontSize: 20 }}
              onClick={islogout}
            ></i>
          </div>
        )}
      </div>

      {/* TopNavbar End */}

      {/* SideNavbar Start */}

      <div className="side d-flex  flex-column">
        <Dropdown drop="end">
          <Dropdown.Toggle
            variant="transparent"
            style={{ border: "none", height: "40px" }}
          >
            <img
              src={profileImage}
              alt="farmer"
              style={{
                backgroundColor: "white",
                width: "39px",
                marginTop: 20,
                borderRadius: "50%",
                padding: "2px",
                height: "45px",
                cursor: "pointer",
                display: "flex",
              }}
            //
            />
          </Dropdown.Toggle>
          <Dropdown.Menu
            className="dropclass"
            style={{
              fontSize: "15px",
              fontWeight: "500",
              width: "max-width",
              marginTop: "10px",
              marginLeft: "10px",
            }}
          >
            <div className="ml-2 p-2" style={{ width: "max-width" }}>
              <div className="d-flex flex-row justify-content-between">
                <p>Name :</p>
                <p>{userdetails[0][2]}</p>
              </div>
              <div className="d-flex flex-row justify-content-between">
                <p>Mob : </p>
                <p>{userdetails[0][0]}</p>
              </div>
              <div className="d-flex flex-row justify-content-between">
                <p className="d-flex" style={{ width: "55px" }}>
                  E-Mail:
                </p>
                <p>{userdetails[0][1]}</p>
              </div>
              <div className="d-flex flex-row justify-content-between">
                <p>Aadhar-No.:</p>
                <p>{userdetails[0][3]}</p>
              </div>
              <div className="d-flex flex-row justify-content-between">
                <p style={{ cursor: "pointer" }} onClick={dpUpload}>
                  Update Your Profile Photo HERE!{" "}
                </p>
              </div>
            </div>
          </Dropdown.Menu>
        </Dropdown>

        <div className="logos">
          <img
            className="sideimg"
            src={group}
            alt="group"
            style={{ padding: "7px", borderRadius: "4px", height: "38px" }}
          />

          <i
            className="sideimg bi  bi-person-lines-fill"
            onClick={() => {
              setaccountvisible(!accountvisible);
            }}
            style={{
              color: "white",
              fontSize: 20,
              padding: "5px",
              borderRadius: "4px",
              height: "45px",
            }}
          ></i>
          {accountvisible && (
            <>
              {useraccount &&
                useraccount.items &&
                useraccount.items.map((data) => {
                  return (
                    <Dropdown drop="end" key={data[1]}>
                      <Dropdown.Toggle
                        variant="transparent"
                        style={{ border: "none", height: "50px" }}
                      >
                        <i
                          className="sideimg bi bi-person-gear"
                          style={{
                            color: "white",
                            fontSize: 20,
                            padding: "5px",
                            borderRadius: "4px",
                            display: "flex",
                            height: "45px",
                          }}
                        ></i>
                      </Dropdown.Toggle>
                      <Dropdown.Menu
                        className="dropclass"
                        style={{
                          fontSize: "15px",
                          fontWeight: "500",
                          width: "370px",
                          cursor: "pointer",
                          margin: "0px 0px 0px 10px",
                        }}
                        onClick={(e) => {
                          const newAccountid = data[1];
                          devicefetch(newAccountid);
                          handleClickAccountDetails(data[2], data[3], data[4]);
                          devicelabelFetch(newAccountid);
                          setaccid(data[1]);
                        }}
                      >
                        <div>
                          <div className="d-flex flex-row justify-content-between px-2">
                            <p>ID :</p>
                            <p>{data[1]}</p>
                          </div>
                          <div className="d-flex flex-row justify-content-between px-2">
                            <p>Name :</p>
                            <p>{data[0]}</p>
                          </div>
                          <div className="d-flex flex-row justify-content-between px-2">
                            <p style={{ width: "71px" }}>Address :</p>
                            <p style={{ width: "300px" }}>{data[4]}</p>
                          </div>
                          <div className="d-flex flex-row justify-content-between px-2 ">
                            <p>No Of Devices :</p>
                            <p>{data[5]}</p>
                          </div>
                          <div className="d-flex flex-row justify-content-between px-2">
                            <p>Opex :</p>
                            <p>{data.opex}</p>
                          </div>
                          <div className="d-flex flex-row justify-content-between p-2">
                            <p>Capex :</p>
                            <p>{data.capex}</p>
                          </div>
                        </div>
                      </Dropdown.Menu>
                    </Dropdown>
                  );
                })}
            </>
          )}

          <i
            className=" sideimg bi bi-wallet "
            style={{
              color: "white",
              fontSize: 20,
              padding: "5px",
              borderRadius: "4px",
              height: "45px",
            }}
          ></i>
          <i
            className=" sideimg bi bi-cart4 "
            style={{
              color: "white",
              fontSize: 20,
              padding: "5px",
              borderRadius: "4px",
              height: "45px",
            }}
          ></i>
          <img
            className="sideimg"
            src={clipboard}
            alt="clipboard"
            style={{ padding: "7px", borderRadius: "4px", height: "37px" }}
            onClick={() => {
              setAnalyticVisible(!analyticvisible);
            }}
          />
          {analyticvisible && (
            <>
              <Dropdown drop="end">
                <Dropdown.Toggle
                  variant="transparent"
                  style={{ border: "none", height: "45px" }}
                >
                  <i
                    className=" sideimg bi bi-file-earmark-plus "
                    style={{
                      color: "white",
                      fontSize: 27,
                      padding: "5px",
                      borderRadius: "4px",
                      display: "flex",
                    }}
                  ></i>
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropclass">
                  <Dropdown.Item
                    className="d-flex justify-content-between"
                    style={{ fontWeight: "500" }}
                  >
                    <i
                      className=" sideimg fa-solid fa-fish-fins"
                      style={{ alignSelf: "center" }}
                    ></i>
                    Fish/Shrimp{" "}
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="d-flex justify-content-between"
                    style={{ fontWeight: "500" }}
                  >
                    <i
                      className="sideimg bi bi-droplet-half"
                      style={{ alignSelf: "center" }}
                    >
                      {" "}
                    </i>
                    Waterbody{" "}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <i
                className=" sideimg fa-solid fa-user-doctor "
                style={{
                  color: "white",
                  fontSize: 25,
                  padding: "5px",
                  borderRadius: "4px",
                  height: "37px",
                }}
              ></i>
              <i
                className=" sideimg bi bi-capsule-pill "
                style={{
                  color: "white",
                  fontSize: 25,
                  padding: "5px",
                  borderRadius: "4px",
                  height: "40px",
                }}
              ></i>
            </>
          )}
        </div>
      </div>

      {/* SideNavbar End */}

      {/* Logout Modal Start */}

      {logout ? (
        <div
          className="check-model d-flex justify-content-center align-items-center"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1050,
          }}
        >
          <div
            className="model accedit"
            ref={logoutRef}
            style={{
              width: "400px",
              boxShadow: "0 5px 15px rgba(0, 0, 0, 0.5)",
            }}
          >
            {/* Modal Heading */}
            <div
              className="heading d-flex justify-content-between "
              style={{ backgroundColor: "#00216e", marginTop: "0px" }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "1.25rem",
                  color: "white",
                }}
              >
                Logout
              </p>
              <i
                className="bi bi-x-octagon cancel-button-modal"
                style={{
                  fontSize: "1.5rem",
                  color: "#df010d",
                  cursor: "pointer",
                }}
                onClick={islogout}
              ></i>
            </div>
            {/* Modal Content */}
            <div style={{ marginTop: "20px" }}>
              <p>Are you sure you want to logout?</p>

              <div className="d-flex justify-content-end mt-3 p-2">
                <NavLink to="https://login.bc-pl.com">
                  <button
                    type="button"
                    className="btn btn-danger px-3 py-2 text-center fs-sm fw-bold rounded-pill"
                    style={{ marginRight: "10px" }}
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

      {/* START ADD aNIMATION */}
      {addanimation ? (
        <div
          className="check-model"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <div>
            <img
              src={addgif}
              alt="successful"
              style={{ width: "120px", transform: "scale(2)" }}
            />
          </div>
        </div>
      ) : null}
      {/* END ADD aNIMATION */}

      {/* START wrong aNIMATION */}
      {warnanimation ? (
        <div
          className="check-model "
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <div className="accedit">
            <img
              src={warning}
              alt="successful"
              style={{ width: "50px", transform: "scale(3)" }}
            />
          </div>
        </div>
      ) : null}
      {/* END wrong aNIMATION */}

      {/* START Delete Label Modal  */}
      {labeltodelete ? (
        <div className="check-model ">
          <div
            className="model accedit"
            style={{
              fontSize: "16px",
              width: "600px",
            }}
          >
            {/* Modal Heading */}
            <div
              className="heading d-flex justify-content-between  "
              style={{ backgroundColor: "#00216e" }}
            >
              <p
                style={{
                  marginTop: "8px",
                  marginLeft: "30px",
                  fontSize: 20,
                  color: "white",
                }}
              >
                Delete Parameter
              </p>
              <i
                className="bi bi-x-octagon cancel-button-modal "
                style={{
                  fontSize: 30,
                  color: "red",
                  alignItems: "center",
                  display: "flex",
                }}
                onClick={() => {
                  Setlabeltodelete(false);
                }}
              ></i>
            </div>
            {/* Modal Content */}
            <div className="accounteditmodaldv" style={{ marginLeft: "20px" }}>
              <div style={{ marginLeft: "25px" }}>
                <p> Hey ! Are you sure to Delete This Parameter ?</p>
              </div>

              <div className="d-flex justify-content-end  ">
                <button
                  type="button"
                  className="btn btn-danger px-3 py-2 text-center fs-sm fw-bold rounded-pill"
                  style={{
                    textAlign: "cenetr",

                    margin: "0 15px 10px 0",
                  }}
                  onClick={() => {
                    Setlabeltodelete(!labeltodelete);
                    labeldelete();
                    setTimeout(() => {
                      devicelabelFetch(accid);
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
                    margin: "0 15px 10px 0",
                  }}
                  onClick={() => {
                    Setlabeltodelete(!labeltodelete);
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

      {/* START dELETE aNIMATION */}
      {deleteanimation ? (
        <div
          className="check-model "
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <div className="accedit">
            <img
              src={deletesuccess}
              alt="successful"
              style={{ width: "100px", transform: "scale(3)" }}
            />
          </div>
        </div>
      ) : null}
      {/* END dELETE aNIMATION */}

      {/* START calender Modal  */}
      {calendershow ? (
        <div className="check-model ">
          <div
            className="model calendermodel"
            style={{
              width: "850px",
              top: "10px",
              padding: "10px",
              marginTop: "20px",
            }}
          >
            {/* Modal Heading */}
            <div
              className="heading d-flex justify-content-between  "
              style={{ backgroundColor: "#00216e" }}
            >
              <p
                style={{
                  marginTop: "8px",
                  marginLeft: "30px",
                  fontSize: 25,
                  color: "white",
                }}
              >
                Calender
              </p>
              <i
                className="bi bi-x-octagon cancel-button-modal "
                style={{
                  fontSize: 30,
                  color: "red",
                  alignItems: "center",
                  display: "flex",
                }}
                onClick={() => {
                  showcalender();
                }}
              ></i>
            </div>
            {/* Modal Content */}
            <div style={{ marginTop: "30px" }}>
              <CalendarComponent />
            </div>
          </div>
        </div>
      ) : null}
      {/* calender Modal End */}

      {/* Start Profile picture Input Label Modal  */}
      {profilepicaddmodal ? (
        <div className="check-model ">
          <div
            ref={dpRef}
            className="model accedit"
            style={{
              fontSize: "16px",
              width: "600px",
            }}
          >
            {/* Modal Heading */}
            <div
              className="heading d-flex justify-content-between  "
              style={{ backgroundColor: "#00216e" }}
            >
              <p
                style={{
                  marginTop: "8px",
                  marginLeft: "30px",
                  fontSize: 25,
                  color: "white",
                }}
              >
                Upload Your Best One
              </p>
              <i
                className="bi bi-x-octagon cancel-button-modal "
                style={{
                  fontSize: 30,
                  color: "red",
                  alignItems: "center",
                  display: "flex",
                }}
                onClick={() => {
                  dpUpload();
                }}
              ></i>
            </div>
            {/* Modal Content */}
            <div style={{ marginLeft: "20px", marginTop: "30px" }}>
              <div>
                <i
                  className="bi bi-person-bounding-box d-flex"
                  style={{ justifyContent: "center", fontSize: 90 }}
                ></i>
                <br />
                <input
                  ref={photo}
                  type="file"
                  onChange={handleImageChange}
                  accept=".jpg , .png"
                />

                {selectedImage && (
                  <img
                    src={selectedImage}
                    alt="Selected"
                    style={{ maxWidth: "50%", margin: "5px 0 0 3px" }}
                  />
                )}
              </div>

              <div className="d-flex justify-content-end mt-3 p-2">
                <button
                  type="button"
                  className="btn btn-danger px-3 py-2 text-center fs-sm fw-bold rounded-pill"
                  style={{
                    textAlign: "cenetr",
                    marginRight: "15px",
                  }}
                  onClick={() => {
                    dpUpload();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-success px-3 py-2 text-center fs-sm fw-bold rounded-pill"
                  style={{
                    textAlign: "cenetr",
                    marginRight: "15px",
                  }}
                  onClick={() => {
                    dpUpload();
                    profileadd();
                  }}
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {/* End Profile picture Input Label Modal*/}

      {/* START profile pic Added aNIMATION */}
      {profilepicaddanimation ? (
        <div
          className="check-model"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <div>
            <img
              src={loadingprofile}
              alt="successful"
              className="transparent-background"
              style={{ width: "200px", transform: "scale(2)" }}
            />
          </div>
        </div>
      ) : null}
      {/* END profilepic upload aNIMATION */}
    </>
  );
};

export default Navbars;