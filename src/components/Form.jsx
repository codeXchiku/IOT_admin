import React, { useState, useEffect } from "react";
import axios from "axios";
// import 'dotenv/config'

const Form = ({ toggleForm, accountid }) => {
  const [showForm, setShowForm] = useState(true);
  //gettingform data
  const [deviceData, setDeviceData] = useState([]);
  //
  const [registeredData, setRegisteredData] = useState([]);

  const getDeviceIDApiData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_App_Ip}/device_view/${accountid}/`
      );
      console.log("API Response:", res.data.result); // Check the structure of the data
      setDeviceData(res.data.result);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  //getting registered person data:
  const getRegisteredApiData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_App_Ip}/maintenance_handler/?id=${accountid}`
      );
      console.log("API Response:", res.data); // Check the structure of the data
      setRegisteredData(res.data);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getDeviceIDApiData();
    getRegisteredApiData();
  }, []);

  // Initialize form data with account_id from props
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    area: "",
    latitude: "",
    longitude: "",
    issue: "",
    deviceid: "",
    accountid: accountid, // Initialize with the accountid prop
  });

  // Update formData when accountid prop changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      accountid: accountid,
    }));
  }, [accountid]);

  const handleBtn = (btnData) => {
    if (btnData === "new") {
      setFormData({
        name: "",
        email: "",
        phone: "",
        area: "",
        latitude: "",
        longitude: "",
        issue: "",
        deviceid: "",
        accountid: accountid, // Ensure this stays updated
      });

      setShowForm(true);
    } else if (btnData === "registered") {
      setShowForm(false);
      // setRandomNames(['John Doe', 'Jane Smith', 'Mike Johnson']);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  console.log(formData);
  

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
        try {
      const response = await axios.post(
        `${process.env.REACT_APP_App_Ip}/maintenance_handler/`,
        formData
      );

      // Log response for debugging purposes
      console.log(response.status);
      if (response.status == 200) {
        getRegisteredApiData();
      }

      // Reset the form fields after successful submission
      setFormData({
        name: "",
        email: "",
        phone: "",
        area: "",
        latitude: "",
        longitude: "",
        issue: "",
        deviceid: "",
        accountid: accountid, // Ensure this stays updated
      });

      // You can add any additional actions here, like showing a success message
      alert("Form submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting the form. Please try again.");
    }
  };

  const showUserData = (user) => {
    // Set form data based on the clicked user's data
    setFormData({
      name: user[0],
      email: user[1],
      phone: user[2],
      area: user[3],
      latitude: user[6],
      longitude: user[7],
      issue: user[8],
      deviceid: user[4],
      accountid: accountid,
    });

    // Switch to the form view
    setShowForm(true);
  };

  return (
    <>
      <div
        className="overlay"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}
      >
        <div
          className="form-popup"
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            position: "relative",
            width: "500px",
          }}
        >
          <button
            onClick={toggleForm}
            style={{
              position: "absolute",
              top: "0",
              right: "10px",
              background: "none",
              border: "none",
              fontSize: "25px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            &times;
          </button>

          <div className="d-flex justify-content-center">
            <button
              className="shadow rounded-5 px-3 py-2"
              style={{ marginRight: "10px" }}
              onClick={() => handleBtn("registered")}
            >
              Registered
            </button>
            <button
              className="shadow rounded-5 px-4 py-2"
              onClick={() => handleBtn("new")}
            >
              New
            </button>
          </div>

          {showForm ? (
            <form
              method="POST"
              style={{
                maxWidth: "500px",
                margin: "0 auto",
                paddingTop: "20px",
              }}
              onSubmit={handleFormSubmit}
            >
              {/* Your original form code remains unchanged */}
              <div
                className="mb-3"
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <label
                  htmlFor="name"
                  className="form-label"
                  style={{ width: "120px", marginRight: "10px" }}
                >
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  placeholder="Enter your name"
                  required
                  onChange={handleInputChange}
                  style={{
                    flex: "1",
                    padding: "8px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    fontSize: "14px",
                  }}
                  aria-label="Enter your name"
                />
              </div>

              <div
                className="mb-3"
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <label
                  htmlFor="email"
                  className="form-label"
                  style={{ width: "120px", marginRight: "10px" }}
                >
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  placeholder="Enter your Email"
                  required
                  onChange={handleInputChange}
                  style={{
                    flex: "1",
                    padding: "8px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    fontSize: "14px",
                  }}
                  aria-label="Enter your email"
                />
              </div>

              <div
                className="mb-3"
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <label
                  htmlFor="phone"
                  className="form-label"
                  style={{ width: "120px", marginRight: "10px" }}
                >
                  Phone
                </label>
                <input
                  type="tel"
                  className="form-control"
                  name="phone"
                  value={formData.phone}
                  placeholder="Enter your phone number"
                  required
                  onChange={handleInputChange}
                  style={{
                    flex: "1",
                    padding: "8px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    fontSize: "14px",
                  }}
                  aria-label="Enter your phone number"
                />
              </div>

              <div
                className="mb-3"
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <label
                  htmlFor="area"
                  className="form-label"
                  style={{ width: "120px", marginRight: "10px" }}
                >
                  Area
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="area"
                  value={formData.area}
                  placeholder="Enter your Area"
                  required
                  onChange={handleInputChange}
                  style={{
                    flex: "1",
                    padding: "8px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    fontSize: "14px",
                  }}
                  aria-label="Enter your Area"
                />
              </div>

              <div className="d-flex align-items-center mb-3">
                <label
                 
                  className="form-label"
                  style={{ width: "120px", marginRight: "10px" }}
                >
                  DeviceId:
                </label>
                <select
                  className="form-select "
                  name="deviceid"
                  style={{
                    width: "250px",
                  }}
                  value={formData.deviceid}
                  onChange={handleInputChange}
                  required
                >
                    <option selected hidden value={0}>Select Device</option>
                  {deviceData &&
                    deviceData.map((item, index) => (
                        
                      <option key={index} value={item[0]}>
                        {item[1]}
                      </option>
                    ))}
                </select>
              </div>

              <div
                className="mb-3"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <div
                  style={{
                    width: "48%",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <label
                    htmlFor="latitude"
                    className="form-label"
                    style={{ width: "120px", marginRight: "10px" }}
                  >
                    Latitude
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="latitude"
                    value={formData.latitude}
                    placeholder="Latitude"
                    required
                    onChange={handleInputChange}
                    style={{
                      flex: "1",
                      padding: "8px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      fontSize: "14px",
                    }}
                    aria-label="Enter Latitude"
                  />
                </div>

                <div
                  style={{
                    width: "48%",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <label
                    htmlFor="longitude"
                    className="form-label"
                    style={{ width: "120px", marginRight: "10px" }}
                  >
                    Longitude
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="longitude"
                    value={formData.longitude}
                    placeholder="Longitude"
                    required
                    onChange={handleInputChange}
                    style={{
                      flex: "1",
                      padding: "8px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      fontSize: "14px",
                    }}
                    aria-label="Enter Longitude"
                  />
                </div>
              </div>

              <div
                className="mb-3"
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <label
                  htmlFor="issue"
                  className="form-label"
                  style={{ width: "120px", marginRight: "10px" }}
                >
                  Issue
                </label>
                <textarea
                  name="issue"
                  value={formData.issue}
                  className="form-control"
                  placeholder="Describe any issues"
                  required
                  onChange={handleInputChange}
                  style={{
                    flex: "1",
                    padding: "8px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    fontSize: "14px",
                    minHeight: "80px",
                  }}
                  aria-label="Describe any issues"
                ></textarea>
              </div>

              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    padding: "10px 20px",
                    fontSize: "16px",
                    borderRadius: "5px",
                  }}
                >
                  Submit
                </button>
              </div>
            </form>
          ) : (
            <div className="card mt-4 p-3 shadow-sm">
              <div className="card-header bg-primary text-white d-flex align-items-center justify-content-between">
                <h5 className="mb-0">Registered Users</h5>
                <i className="bi bi-person-check-fill"></i>{" "}
                {/* Bootstrap icon */}
              </div>
              <div className="card-body">
                <ul className="list-unstyled">
                  {registeredData.map((user, index) => (
                    <li
                      key={index}
                      className="d-flex align-items-center p-2 mb-2 border rounded bg-light user-list-item"
                      onClick={() => showUserData(user)}
                      style={{ cursor: "pointer" }} // Change cursor to pointer to indicate clickable items
                    >
                      <i className="bi bi-person-circle me-3 text-primary fs-5"></i>
                      <span className="user-name fs-5">{user[0]}</span>{" "}
                      {/* Adjust based on your user object structure */}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Form;
