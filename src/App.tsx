// path: src/App.tsx

import { useEffect, useState } from "react";
import { fetchPlantings, Planting } from "./services/api";
import logo from './logo.svg';
import { formatDate } from "./services/dateUtils";
import { filterPlantingsByDate } from "./services/dataFilters";
import { isToday } from "date-fns"; 
import Modal from 'react-modal';

import "./App.css";

// Set the root for the modal
Modal.setAppElement('#root');

function App() {
  // This useState is used to hold our plantings data
  const [plantingsData, setPlantingsData] = useState<Planting[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // This useEffect is used to fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchPlantings();
      setPlantingsData(data);
    };
    fetchData();
  }, []);

  // Here we declare our date columns
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

  // Here we define our categories
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

  const handleCellClick = () => {
    setModalIsOpen(true);
  }

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
                        <td 
                          key={headerIndex}
                          // Add highlighted class if cell contains today's date and add onClick if it's today's date
                          className={dateColumns.includes(header) && isToday(new Date(planting[header])) ? 'highlighted' : ''}
                          onClick={dateColumns.includes(header) && isToday(new Date(planting[header])) ? handleCellClick : undefined}
                        >
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
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Example Modal"
        style={{
          content: {
            color: 'white',
            backgroundColor: '#1a431c',
          },
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.5)',
          }
        }}
      >
        <h2>Modal Title</h2>
        <button onClick={() => setModalIsOpen(false)} style={{backgroundColor: '#3c6e3e', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer'}}>Close</button>
      </Modal>
    </div>
  );
}

export default App;
