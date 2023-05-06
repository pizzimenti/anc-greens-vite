import React, { useEffect, useState } from "react";
import { fetchPlantings } from "./services/api";
import logo from './logo.svg';
import { formatDate } from "./services/dateUtils";

import "./App.css";

function App() {
  const [plantingsData, setPlantingsData] = useState([]);

  const fetchData = async () => {
    const data = await fetchPlantings();
    setPlantingsData(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const headers = plantingsData.length > 0 ? Object.keys(plantingsData[0]) : [];

  const dateColumns = [
    "seedDate",
    "actualSeedDate",
    "trayDate",
    "actualTrayDate",
    "t1Date",
    "t2Date",
    "t3Date",
    "harvestDate",
  ];

  return (
    <div className="App">
      <div className="header">
        <img src={logo} alt="Logo" className="logo" />
        <h2>Plantings Data</h2>
      </div>
      <table className="plantings-table">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {plantingsData.map((planting: any, index: number) => (
            <tr key={index}>
              {headers.map((header, headerIndex) => (
                <td key={headerIndex}>
                  {dateColumns.includes(header) ? formatDate(planting[header]) : planting[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
