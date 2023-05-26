import { useEffect, useState } from "react";
import { fetchPlantings } from "./services/api";
import { Planting } from "./types";
import logo from './logo.svg';
import { formatDate } from "./services/dateUtils";
import { checkIfPlantingHasTodayActivity } from "./services/dataFilters";
import { isToday, parseISO } from "date-fns";
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

  const categories: { [key: string]: string } = {
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
          const filteredPlantings = checkIfPlantingHasTodayActivity(plantingsData, column as keyof Planting);
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
                            className={dateColumns.includes(header) && isToday(parseISO(planting[header as keyof Planting] as string)) ? 'highlighted' : ''}
                            onClick={dateColumns.includes(header) && isToday(parseISO(planting[header as keyof Planting] as string)) ? () => handleCellClick(column, planting) : undefined}
                          >
                            {getPropertyValue(planting, header, dateColumns)}
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
        {modalType && modalData && (
          <div className="modalContent">
            <h2>{categories[modalType]}</h2>
            <table className="modal-table">
              <thead>
                <tr>
                  <th>Variety</th>
                  <th>Number</th>
                  <th>Seeds Per Plug</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{modalData.variety}</td>
                  <td>{modalData.number}</td>
                  <td>{modalData.seedsPerPlug}</td>
                </tr>
              </tbody>
            </table>
            <p>{JSON.stringify(modalData)}</p>
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

function getPropertyValue(object: any, property: string, dateColumns: string[]) {
  const value = object[property as keyof Planting];
  if (dateColumns.includes(property)) {
    return formatDate(value);
  }
  return value;
}

export default App;
