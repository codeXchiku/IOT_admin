import React, { useContext, useEffect, useRef, useState } from "react";
import "../Adminpage.css";
import { Link } from "react-router-dom";
import { AdminContext } from "../../../App";
import axios from "axios";
import { GoogleMap, Marker } from "@react-google-maps/api";
import latitude from "../Constant img/latitude.png";
import longitude from "../Constant img/longitude.png";
import success from "./success.gif";
import "./Createduser.css";
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

const Createduser = () => {
  const admin_id = localStorage.getItem("admin_id");
  const [openModel, setOpenModel] = useState(false);
  const [deletebutton, setDeleteButton] = useState(false);
  const [totaluserrequested, setTotaluserrequested] = useState(0);
  const [createdusererror, setCreatedusdererror] = useState("");
  const [requesteduser, setRequesteduser] = useState([]);
  const [currentusermobilenumber, setCurrentusermobilenumber] = useState("");
  const [usermobno, setUSermobno] = useState("");
  const [address, setAddress] = useState("");
  const [completlyaccountadd, setcompletlyaccountadd] = useState(false);
  //Here Content can take lat and lng props from backend
  const [latitudes, setLatitude] = useState(20.2961); // Initial latitude
  const [longitudes, setLongitude] = useState(85.8245); // Initial longitude

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

  const openDeleteModels = () => {
    setDeleteButton(!deletebutton);
  };

  const accdelRef = useRef(null);
  useEffect(() => {
    // Handler to call onClick outside of calendar component
    const handleClickOutside = (event) => {
      if (accdelRef.current && !accdelRef.current.contains(event.target)) {
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
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = requesteduser.slice(indexOfFirstItem, indexOfLastItem);
  console.log(currentItems)

  //context
  const { isSidebarOpen } = useContext(AdminContext);

  const createduserfetch = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_App_Ip}/user_view/${admin_id}/`
      );
      setTotaluserrequested(response.data.items.length);
      setRequesteduser(response.data.items);
    } catch (error) {
      setCreatedusdererror(error);
    }
  };

  const deleteuserfetch = async (mob) => {
    try {
      console.log(mob);
      const response = await axios.post(
        `${process.env.REACT_APP_App_Ip}/user_delete/`,
        {
          mobileno: mob,
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    createduserfetch();
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
    // eslint-disable-next-line
  }, [latitudes, longitudes]);

  function searchlatlng(lats, lngs) {
    setLatitude(
      lats === null || lats === undefined || lats === "" ? "20.2961" : lats
    );
    setLongitude(
      lngs === null || lngs === undefined || lngs === "" ? "85.8245" : lngs
    );
  }

  //Height and Width for Google Map
  const containerStyle = {
    width: "97%",
    height: "100%",
  };

  //variable for add account
  const latt = useRef(null);
  const lngg = useRef(null);
  const accname = useRef(null);

  const addacount = async () => {
    const userdata = {
      lat: parseFloat(latt.current.value),
      long: parseFloat(lngg.current.value),
      accountname: accname.current.value,
      address: address,
      usermobno: usermobno,
    };

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_App_Ip}/account_create/`,
        userdata
      );
      if (res) {
        setcompletlyaccountadd(true);
        setTimeout(() => {
          setcompletlyaccountadd(false);
        }, 2500);
      }
      console.log(userdata);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {/* Page Start */}
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
              Total User Accepted
            </p>
          </div>
          <p
            style={{
              display: "flex",
              justifyContent: "center",

              padding: "10px",
              fontWeight: "bold",
              margin: "2px 2px 4px 2px",
            }}
          >
            {totaluserrequested}
          </p>
        </div>

        {/* Total User Count End */}

        {/* Table start */}

        <div className="parent-div-of-table overflow-scroll">
          <table className="table table-bordered table-striped table-hover table-design">
            <thead style={{ backgroundColor: "#7DE1AF" }}>
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
                  style={{ backgroundColor: "#E9EEF6" }}
                >
                  Password
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

                <tr key={index + 1}>
                  <td className="text-center">{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                  <td className="text-center">{data[0]}</td>
                  <td className="text-center">{data[1]}</td>
                  <td className="text-center">{data[2]}</td>
                  <td className="text-center">{data[3]}</td>

                  <td className="text-center d-flex justify-content-center">
                    <button
                      type="button"
                      className="btn  btn-success px-3 py-2 text-center fs-sm fw-bold rounded-pill"
                      style={{
                        textAlign: "cenetr",
                        width: "max-content",
                      }}
                      onClick={() => {
                        openModels();
                        setUSermobno(data[1]);
                      }}
                    >
                      Add Account
                    </button>
                    <Link to={`/adminside/createduser/useraccounts/${data[1]}`}>
                      <button
                        type="button"
                        className="btn btn-primary px-3 py-2 text-center fs-sm fw-bold rounded-pill"
                        style={{
                          textAlign: "cenetr",
                          marginLeft: "8px",
                        }}
                      >
                        View
                      </button>
                    </Link>

                    <button
                      type="button"
                      className="btn  btn-danger px-3 py-2 text-center fs-sm fw-bold rounded-pill"
                      style={{
                        textAlign: "cenetr",
                        marginLeft: "8px",
                      }}
                      onClick={() => {
                        openDeleteModels();
                        setCurrentusermobilenumber(data[1]);
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

        {/* Error Handel Message start */}
        {createdusererror ? (
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
                No User Regesterd Yet... !
              </p>
            </div>
          </>
        ) : (
          <></>
        )}
        {/* Error Handel Message END */}

        {/* Redirect Start */}
        <div className="redirects">
          <button
            type="button"
            className="btn "
            style={{
              borderRadius: "16px",
              fontSize: "16px",
              verticalAlign: "cenetr",
              marginRight: "10px",
              height: "43px",
              backgroundColor: "#2626e0",
              color: "white",
            }}
            disabled={currentPage === 1}
            onClick={handlePrevPage}
          >
            Previous
          </button>{" "}
          <p style={{ marginTop: "09px" }}>
            Page {currentPage} of{" "}
            {Math.ceil(requesteduser.length / itemsPerPage)}{" "}
          </p>
          <button
            type="button"
            className="btn btn-success"
            style={{
              borderRadius: "19px",
              fontSize: "16px",
              verticalAlign: "cenetr",
              height: "43px",
              marginLeft: "4px",
            }}
            disabled={indexOfLastItem >= requesteduser.length}
            onClick={handleNextPage}
          >
            Next
          </button>
        </div>
        {/* Redirect End */}
      </div>
      {/* Page End */}

      {/* start model for on click of next of previos model */}
      {openModel ? (
        <div className="check-model ">
          <div
            ref={openmodalRef}
            className="model newaccount"
            style={{ fontSize: "16px", marginTop: "1px", height: "auto" }}
          >
            <div className="heading d-flex justify-content-between ">
              <p
                style={{ marginTop: "10px", marginLeft: "30px", fontSize: 20 }}
              >
                New Account Details
              </p>
              <i
                className="bi bi-x-octagon cancel-button-modal "
                style={{ fontSize: 30, color: "#df010d", alignItems: 'center', display: 'flex' }}
                onClick={openModels}
              ></i>
            </div>
            <div className="addaccmodaldiv" style={{ marginLeft: "20px", marginTop: "30px" }}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  searchlatlng(latt.current.value, lngg.current.value);
                }}
              >
                <div className="d-flex" style={{ height: "49px", width: '95%' }}>
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
                      ref={latt}
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
                      ref={lngg}
                      type="text"
                      className="form-control"
                      id="formGroupExampleInput"
                      placeholder="Enter Longitude"
                      style={{ marginLeft: "3%" }}

                    ></input>
                  </div>
                  <div>
                    <label >
                      <i
                        className="bi bi-person-vcard"
                        style={{ fontSize: 17, marginRight: "2px" }}
                      ></i>
                      Account
                    </label>
                    <input
                      ref={accname}
                      type="text"
                      className="form-control"
                      id="formGroupExampleInput"
                      placeholder="Enter AccountName"
                      style={{ marginLeft: "5%" }}
                      required
                      // eslint-disable-next-line
                      onInvalid={(e) =>
                        e.target.setCustomValidity("Please Enter Account Name")
                      }
                      onChange={(e) => e.target.setCustomValidity("")}
                    ></input>
                  </div>
                </div>

                <div className=" searchbutton d-flex justify-content-end " style={{ marginRight: '5%' }}>
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

              <div className="mapaddacc" style={{ marginTop: "20px", height: "400px" }}>
                <GoogleMapdata
                  containerStyle={containerStyle}
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
                    addacount();
                    openModels();
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Account create models  of previos model */}
      {/* Delete button Modal Start */}

      {deletebutton ? (
        <div className="check-model ">
          <div
            ref={accdelRef}
            className="model"
            style={{
              fontSize: "16px",
              width: "600px",
              height: "200px",
            }}
          >
            {/* Modal Heading */}
            <div className="heading d-flex justify-content-between  ">
              <p
                style={{
                  marginTop: "8px",
                  marginLeft: "30px",
                  fontSize: '20px',
                }}
              >
                Delete Account
              </p>
              <i
                className="bi bi-x-octagon cancel-button-modal "
                style={{ fontSize: 30, color: "#df010d", alignItems: 'center', display: 'flex' }}
                onClick={openDeleteModels}
              ></i>
            </div>
            {/* Modal Content */}
            <div style={{ marginLeft: "20px", marginTop: "30px" }}>
              <div style={{ marginLeft: "25px" }}>
                <p> Are you sure to Delete this User Permanently ?</p>
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
                    deleteuserfetch(currentusermobilenumber);
                    openDeleteModels();
                    setTimeout(() => {
                      createduserfetch();
                      setCurrentusermobilenumber("");
                    }, 1500);
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

      {completlyaccountadd ? (
        <div className="check-model ">
          <div
            className="model"
            style={{ fontSize: "16px", width: "600px", height: "300px" }}
          >
            <img
              src={success}
              alt="successful"
              style={{ width: "200px", marginLeft: "30%" }}
            />
            <p style={{ marginLeft: "25%" }}>Account Added Successfully</p>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Createduser;
