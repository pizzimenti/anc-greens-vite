import { useEffect, useState } from "react";
import { fetchPlantings, Planting } from "./services/api";
import logo from './logo.svg';
import { formatDate } from "./services/dateUtils";
import { filterPlantingsByDate } from "./services/dataFilters";

import "./App.css";

function App() {
  const [plantingsData, setPlantingsData] = useState<Planting[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchPlantings();
      setPlantingsData(data);
    };
    fetchData();
  }, []);

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

  const categories = {
    seedDate: "Today's Seeding",
    actualSeedDate: "Actual Seeding",
    trayDate: "Today's Tray",
    actualTrayDate: "Actual Tray Date",
    t1Date: "Today's T1",
    t2Date: "Today's T2",
    t3Date: "Today's T3",
    harvestDate: "Today's Harvest"
  };

  return (
    <div className="App">
      <div className="header">
        <img src={logo} alt="Logo" className="logo" />
        <h2>Plantings Data</h2>
      </div>
      {
        Object.entries(categories).map(([column, title]) => {
          const filteredPlantings = filterPlantingsByDate(plantingsData, column as keyof Planting);
          if (filteredPlantings.length === 0) return null;

          // Determine non-empty columns for each table
          let nonEmptyColumns = new Set<string>();
          filteredPlantings.forEach((row) => {
            Object.entries(row).forEach(([key, value]) => {
              if (value) {
                nonEmptyColumns.add(key);
              }
            });
          });

          // Convert to array for mapping
          const headers = Array.from(nonEmptyColumns);

          return (
            <div key={column}>
              <h3>{title}</h3>
              <table className="plantings-table">
                <thead>
                  <tr>
                    {headers.map((header, index) => (
                      <th key={index}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredPlantings.map((planting: Planting, index: number) => (
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
        })
      }
    </div>
  );
}

export default App;
