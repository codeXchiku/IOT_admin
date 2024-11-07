

import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';


const ExportDropdown = ({ onExport }) => {
  const handleExport = (event) => {
    const exportRange = event.target.value;
    if (exportRange) {
      onExport(exportRange);
    }
  };

  return (
    <select id="exportDropdown" onChange={handleExport} style={{ fontSize: '12px', padding: '2px 6px', margin: '10px',position: "absolute",
    top: "-8px",
    right: "136px" }}>
      <option value="">Export</option>
      <option value="1">1 Day</option>
      <option value="7">7 Days</option>
      <option value="15">15 Days</option>
      <option value="30">30 Days</option>
    </select>
  );
};


const Chartbox = ({ metric, data }) => {
  const [seriesData, setSeriesData] = useState({});
  // eslint-disable-next-line
  const [options, setOptions] = useState({
    chart: {
      id: 'realtime',
      height: 350,
      type: 'line',
      animations: {
        enabled: true,
        easing: 'linear',
        dynamicAnimation: {
          speed: 1000,
        },
      },
      toolbar: {
        show: true,
        tools: {
          customIcons: []
        }
      },
      zoom: {
        enabled: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 2,
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 4,
          opacityFrom: 0.7,
          opacityTo: 0.3,
          stops: [0, 90, 100],
        },
      },
    },
    title: {
      text: ` ${metric}`,
      align: 'left',
      style: {
        fontSize: '30px',
        fontWeight: 'bold',
      },
    },
    markers: {
      size: 0,
    },
    xaxis: {
      type: 'category',
      categories: [],
    },
    legend: {
      show: true,
    },
    grid: {
      show: false,
    },
  });

  useEffect(() => {
    try {
      //console.log('Raw data:', data); // Log raw data
  
      if (data.paramType === metric) {
        setSeriesData(prevSeriesData => {
          // Check if data.paramValue is a number and set it to NaN if it's not
          const paramValue = parseFloat(data.paramValue);
          const newData = {
            x: data.dataPoint.split(' ')[1], // Extract time portion
            y: isNaN(paramValue) ? NaN: paramValue.toFixed(2), // Check if paramValue is a number, otherwise set to NaN
          };
  
          const deviceId = data.deviceId;
          const existingSeries = prevSeriesData[deviceId] || [];
  
          // Maintain only the last 20 data points for each deviceId
          const newSeries = [...existingSeries.slice(-19), newData];
  
          return { ...prevSeriesData, [deviceId]: newSeries };
        });
      }
    } catch (error) {
      console.error('Error processing data:', error);
    }
  }, [data, metric]);
  
  

  const chartSeries = Object.keys(seriesData).map(deviceId => ({
    name: `Device ${deviceId}`,
    data: seriesData[deviceId]
  }));

  const dummyChartData = [
    { x: '0', y: 20 },
    { x: '0', y: 25 },
    { x: '0', y: 30 },
    { x: '0', y: 35 },
    { x: '0', y: 40 },
  ];

  const exportChartData = (days) => {
    const exportData = {}; // Initialize an empty object to hold the export data
    // Filter and prepare the export data based on the selected range (days)
    Object.keys(seriesData).forEach(deviceId => {
      exportData[deviceId] = seriesData[deviceId].slice(-days);
    });
    // Convert exportData to CSV or the desired format and trigger download
    const csvContent = "data:text/csv;charset=utf-8," + Object.entries(exportData).map(([deviceId, dataPoints]) => {
      const rows = dataPoints.map(point => `${deviceId},${point.x},${point.y}`).join("\n");
      return `Device ${deviceId}\n${rows}`;
    }).join("\n\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${metric}_data_${days}_days.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className='col-12 col-md-6'>
      <div className="chart-container" style={{position: "relative"}}>
        <Chart options={options} series={Object.keys(chartSeries).length ? chartSeries : [{ data: dummyChartData }]} type="line" height={350} />
        <ExportDropdown onExport={exportChartData}/>
      </div>
    </div>
  );
};

export default Chartbox;