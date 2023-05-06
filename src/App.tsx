import React, { useEffect, useState } from "react";
import { fetchPlantings } from "./services/api";
import logo from './logo.svg';

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

  return (
    <div className="App">
      <div className="header">
        <img src={logo} alt="Logo" className="logo" />
        <h2>Plantings Data</h2>
      </div>
      {plantingsData.map((planting: any, index: number) => (
        <div key={index}>{JSON.stringify(planting)}</div>
      ))}
    </div>
  );
  
}

export default App;
