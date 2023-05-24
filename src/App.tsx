// path: src/App.tsx

import { useEffect, useState } from "react";
import { fetchPlantings } from "./services/api";
import { Planting } from "./types";
import logo from './logo.svg';
import { formatDate } from "./services/dateUtils";
import { filterPlantingsByDate } from "./services/dataFilters";
import { isToday } from "date-fns"; 
import Modal from 'react-modal';

import "./App.css";

// Set the root for the modal
Modal.setAppElement('#root');

function App() {
  const [plantingsData, setPlantingsData] = useState<Planting[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalType, setModalType] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchPlantings();
      setPlantingsData(data);
    };
    fetchData();
  }, []);

  const dateColumns = [
    "seedDate",
    "trayDate",
    "t1Date",
    "t2Date",
    "t3Date",
    "harvestDate",
  ];

  const categories = {
    seedDate: "Today's Seeding",
    trayDate: "Today's Tray",
    t1Date: "Today's T1",
    t2Date: "Today's T2",
    t3Date: "Today's T3",
    harvestDate: "Today's Harvest"
  };

  const handleCellClick = (type: string) => {
    setModalType(type);
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

          let nonEmptyColumns = new Set<string>();
          filteredPlantings.forEach((row) => {
            Object.entries(row).forEach(([key, value]) => {
              if (value) {
                nonEmptyColumns.add(key);
              }
            });
          });

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
                          className={dateColumns.includes(header) && isToday(new Date(planting[header])) ? 'highlighted' : ''}
                          onClick={dateColumns.includes(header) && isToday(new Date(planting[header])) ? () => handleCellClick(column) : undefined}
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
        onRequestClose={() => {
          setModalIsOpen(false);
          setModalType("");
        }}
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
        {modalType === "seedDate" && (
          <div>
            <h2>Today's Seeding</h2>
            {/* Add other contents specific to Seed modal */}
          </div>
        )}
        {modalType === "trayDate" && (
          <div>
            <h2>Today's Tray</h2>
            {/* Add other contents specific to Tray modal */}
          </div>
        )}
        {modalType === "t1Date" && (
          <div>
            <h2>Today's T1</h2>
            {/* Add other contents specific to T1 modal */}
          </div>
        )}
        {modalType === "t2Date" && (
          <div>
            <h2>Today's T2</h2>
            {/* Add other contents specific to T2 modal */}
          </div>
        )}
        {modalType === "t3Date" && (
          <div>
            <h2>Today's T3</h2>
            {/* Add other contents specific to T3 modal */}
          </div>
        )}
        {modalType === "harvestDate" && (
          <div>
            <h2>Today's Harvest</h2>
            {/* Add other contents specific to Harvest modal */}
          </div>
        )}
        <button onClick={() => {
          setModalIsOpen(false);
          setModalType("");
        }} style={{backgroundColor: '#3c6e3e', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer'}}>Close</button>
      </Modal>
    </div>
  );
}

export default App;
