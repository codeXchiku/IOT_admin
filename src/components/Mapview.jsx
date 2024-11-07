import React, { useEffect, useState } from "react";

const GoogleMapComponent = ({
  devicesNamesList,
  latitude,
  longitude,
  address,
  localupdate,
}) => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    const initMap = () => {
      const mapInstance = new window.google.maps.Map(
        document.getElementById("map"),
        {
          center: { lat: parseFloat(latitude), lng: parseFloat(longitude) },
          zoom: 17,
          mapTypeId: "satellite",
        }
      );
      // Add pin marker at the center

      new window.google.maps.Marker({
        position: { lat: parseFloat(latitude), lng: parseFloat(longitude) },
        map: mapInstance,
        title: address,
      });

      // Add info window for center marker
      new window.google.maps.InfoWindow({
        content: `<div>
                    <p>Location: ${address}</p>
                  </div>`,
      });

      setMap(mapInstance);
    };

    if (!window.google) {
      // Google Maps API not loaded yet, handle accordingly (optional)
      console.error("Google Maps API hasn't loaded yet.");
    } else {
      initMap();
    }
  }, [latitude, longitude, address]);

  useEffect(() => {
    if (map) {
      const deviceStates = JSON.parse(localStorage.getItem("deviceStates"));

      devicesNamesList.forEach((item) => {
        const deviceId = item[1]; // Assuming item[1] contains the device ID
        const deviceData = deviceStates[deviceId];

        let markerColor = "red";

        if (deviceData && deviceData.checked) {
          markerColor = "green";
        }

        const markerPosition = new window.google.maps.LatLng(
          item[2][0],
          item[2][1]
        );
        const mapMarker = new window.google.maps.Marker({
          position: markerPosition,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: markerColor, // Set marker color
            fillOpacity: 1, 
            strokeWeight: 0,
            scale: 8, // Adjust the size as needed
          },
          map,
        });

        // Add info window with custom content
        const infoWindow = new window.google.maps.InfoWindow({
          content: `<div>
                    <p>Device Name: ${item[0]}</p>
                    <p>Latitude: ${item[2][1]}</p>
                    <p>Longitude: ${item[2][0]}</p>
                 </div>`,
        });

        // Show infoWindow on marker click
        mapMarker.addListener("click", () => {
          infoWindow.open(map, mapMarker);
        });

        // Show infoWindow on marker hover
        mapMarker.addListener("mouseover", () => {
          infoWindow.open(map, mapMarker);
        });

        // Close infoWindow on mouseout
        mapMarker.addListener("mouseout", () => {
          infoWindow.close();
        });
      });
    }
  }, [map, devicesNamesList, localupdate]);

  return <div id="map" style={{ width: "100%", height: "400px" }} />;
};

export default GoogleMapComponent;
