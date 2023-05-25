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
  const [modalData, setModalData] = useState<Planting | null>(null);


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

  const handleCellClick = (type: string, data: Planting) => {
    setModalType(type);
    setModalData(data);
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
                  {filteredPlantings.map((planting: Planting, index: number): JSX.Element => {
                    return (
                      <tr key={index}>
                        {headers.map((header, headerIndex) => (
                          <td
                            key={headerIndex}
                            className={dateColumns.includes(header) && isToday(new Date(planting[header])) ? 'highlighted' : ''}
                            onClick={dateColumns.includes(header) && isToday(new Date(planting[header])) ? () => handleCellClick(column, planting) : undefined}
                          >
                            {dateColumns.includes(header) ? formatDate(planting[header]) : planting[header]}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
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
          setModalData(null);
        }}
        contentLabel="Example Modal"
        className="content"
        overlayClassName="overlay"
      >
        {modalType === "seedDate" && (
          <div className="modalContent">
            <h2>Seed Item</h2>
            <p>{modalData ? JSON.stringify(modalData) : 'No data'}</p>
          </div>
        )}
        {modalType === "trayDate" && (
          <div className="modalContent">
            <h2>Tray Item</h2>
            <p>{modalData ? JSON.stringify(modalData) : 'No data'}</p>
          </div>
        )}
        {modalType === "t1Date" && (
          <div className="modalContent">
            <h2>T1 Item</h2>
            <p>{modalData ? JSON.stringify(modalData) : 'No data'}</p>
          </div>
        )}
        {modalType === "t2Date" && (
          <div className="modalContent">
            <h2>T2 Item</h2>
            <p>{modalData ? JSON.stringify(modalData) : 'No data'}</p>
          </div>
        )}
        {modalType === "t3Date" && (
          <div className="modalContent">
            <h2>T3 Item</h2>
            <p>{modalData ? JSON.stringify(modalData) : 'No data'}</p>
          </div>
        )}
        {modalType === "harvestDate" && (
          <div className="modalContent">
            <h2>Harvest Item</h2>
            <p>{modalData ? JSON.stringify(modalData) : 'No data'}</p>
          </div>
        )}
        <button onClick={() => {
          setModalIsOpen(false);
          setModalType("");
          setModalData(null);
        }} className="modalButton">Close</button>
      </Modal>
    </div>
  );
}

export default App;
