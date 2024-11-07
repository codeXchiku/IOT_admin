import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is imported
import { AdminContext } from '../../App';

const Maintenance = () => {
  const [maintenanceData, setMaintenanceData] = useState([]);

  const getMaintenanceData = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_App_Ip}/get_maintainance_history/`);
      console.log('API Response:', res.data);
      setMaintenanceData(res.data);
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  };

  useEffect(() => {
    getMaintenanceData();
  }, []);

  const { isSidebarOpen } = useContext(AdminContext);

  return (
    <div className={`createdusercontent  ${isSidebarOpen ? "open" : "closed"}`}
    >
    <div className="bg-light pt-4 px-3">

      {/* Add Maintenance Page title */}
      <div className="mb-5"
      style={{
        backgroundColor: "#E9EEF6",
        padding: "4px",
        borderRadius: "15px",
        cursor: "pointer",
        fontSize: "16px",
      }}
      >
        <h4 className="font-weight-bold">Maintenance Page</h4>
      </div>

      {/* Add marginLeft to move the table away from the left edge */}
      <div
        className="table-responsive"
        style={{
          width: '95%', // Set to 95% width to allow some space on the right as well
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <table className="table table-striped table-hover table-bordered mb-0 w-100">
          {/* w-100 class to make the table take full width */}
          <thead >
            {/* Use inline styles to set background color and text color */}
            <tr>
              <th scope="col">Sl. No</th>
              <th scope="col">Name</th>
              <th scope="col">Username</th>
              <th scope="col">IP</th>
              <th scope="col">Component</th>
              <th scope="col">Test</th>
              <th scope="col">Result</th>
            </tr>
          </thead>
          <tbody>
            {maintenanceData.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td> {/* Assuming `index + 1` for Sl. No */}
                <td>{item.name}</td>
                <td>{item.username}</td>
                <td>{item.ip}</td>
                <td>{item.component}</td>
                <td>{item.test}</td>
                <td className={`font-weight-bold ${item.result === 'pass' ? 'text-success' : 'text-danger'}`}>
                  {item.result}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};

export default Maintenance;
