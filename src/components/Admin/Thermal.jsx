import React from "react";
import "./Adminpage.css";
import Dropdown from "react-bootstrap/Dropdown";
import { AdminContext } from "../../App";
import { useContext } from "react";
const Thermal = () => {
  //context
  const{isSidebarOpen}=useContext(AdminContext);
  return (
    <>
    <div className={`createdusercontent  ${isSidebarOpen ? "open" : "closed"}`}
      >
      

      {/* Start option */}
      <div className="option" style={{ marginTop:'7px' , display:'flex' }}>

      <Dropdown >
        <Dropdown.Toggle  style={{backgroundColor:'#E9EEF6',borderRadius:'13px' , color:'black', fontWeight:'bold'}}>Time period</Dropdown.Toggle>

        <Dropdown.Menu style={{width:'20px' ,backgroundColor:'#c7d6ff', fontSize:'17px'}}>
          <Dropdown.Item>Day- 1 </Dropdown.Item>
          <Dropdown.Item>Day- 2</Dropdown.Item>
          <Dropdown.Item>Day- 3</Dropdown.Item>
          <Dropdown.Item>Day- 4</Dropdown.Item>
          <Dropdown.Item>Day- 5</Dropdown.Item>
          <Dropdown.Item>Day- 6</Dropdown.Item>
          <Dropdown.Item>Day- 7</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <button type="button" className="btn btn-success" style={{ marginLeft:'10px',borderRadius:'13px', fontWeight:'bold'}}>Success</button>
</div>
      {/* End Option */}

      {/* Table start */}

      <div className="parent-div-of-table">
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
                Original
              </th>

              <th
              className="text-center"
                scope="col"
                style={{
                  backgroundColor: "#E9EEF6",
                  borderTopRightRadius: "7px",
                }}
              >
                Thermal
              </th>
            </tr>
          </thead>
        </table>
      </div>
      {/* Table End */}

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
            fontSize: "16px",
            verticalAlign: "cenetr",
            height: "43px",
            marginLeft: "4px",
          }}
        >
          Next
        </button>
      </div>
      </div>
    </>
  );
};

export default Thermal;
