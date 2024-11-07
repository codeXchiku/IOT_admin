import React, { useEffect } from 'react';
import Sidebar from './Admin/Sidebar/SideBar';
import { useNavigate, useParams } from 'react-router-dom';

const DeviceLocation = () => {
    let { id } = useParams();

    // Extract the coordinates from the id string
    const coordinates = id.match(/POINT\s*\(\s*([\d.-]+)\s+([\d.-]+)\s*\)/);

    // If the extraction is successful, assign the values to lat and lon
    const lat = coordinates ? parseFloat(coordinates[1]) : 0;
    const lon = coordinates ? parseFloat(coordinates[2]) : 0;

    const zoom = 16;
    const navigate = useNavigate();

    const handleClose = () => {
        navigate(-1); // This takes the user to the previous page
    }

    useEffect(() => {
        const fetchData = async () => {
            // Example of using async/await for any async operations
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating an async operation
            console.log('This simulates an async operation');
        };

        fetchData();
    }, []); // Empty dependency array to run on mount

    return (
        <>
            <Sidebar />
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                backgroundColor: "#d3d3d3",
                paddingLeft: "80px",
                position: "relative" // Make the parent div relative to position the button
            }}>
                <button
                    onClick={handleClose}
                    style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        backgroundColor: "#ff5f5f",
                        border: "none",
                        color: "white",
                        padding: "10px 15px",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontSize: "16px"
                    }}
                >
                    Close
                </button>
                <iframe
                    src={`https://maps.google.com/maps?q=${lat},${lon}&z=${zoom}&output=embed`}
                    width="1200"
                    height="550"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="google map"
                ></iframe>
            </div>
        </>
    );
}

export default DeviceLocation;
