import React, { useEffect, useState } from 'react';
import { fetchPlantings } from './services/api';

function App() {
  const [plantings, setPlantings] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await fetchPlantings();
      console.log('API response:', data); // Add this line to log the response
      setPlantings(data);
    }
    
    fetchData();
  }, []);

  return (
    <div>
      <h1>Plantings Data</h1>
      <ul>
        {plantings.map((planting: any, index: number) => (
          <li key={index}>{planting.planting} - {planting.variety}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
