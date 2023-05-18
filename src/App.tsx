// path: src/App.tsx

import { useEffect, useState } from "react";
import { fetchPlantings, Planting } from "./services/api";
import logo from './logo.svg';
import { formatDate } from "./services/dateUtils";
import { filterPlantingsByDate } from "./services/dataFilters";
import { isToday } from "date-fns";

// Import the modal components
import { SeedModal, TrayModal, TransplantModal, HarvestModal } from "./components/Modals";

import "./App.css";

function App() {
  const [plantingsData, setPlantingsData] = useState<Planting[]>([]);
  const [selectedCell, setSelectedCell] = useState(null);

  // State for modals
  const [isSeedModalOpen, setSeedModalOpen] = useState(false);
  const [isTrayModalOpen, setTrayModalOpen] = useState(false);
  const [isTransplantModalOpen, setTransplantModalOpen] = useState(false);
  const [isHarvestModalOpen, setHarvestModalOpen] = useState(false);

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
    trayDate: "Today's Tray",
    t1Date: "Today's T1",
    t2Date: "Today's T2",
    t3Date: "Today's T3",
    harvestDate: "Today's Harvest"
  };

  // Handler to open modals
  const handleOpenModal = (category: string) => {
    setSelectedCell(category);
    switch(category) {
      case "seedDate":
        setSeedModalOpen(true);
        break;
      case "trayDate":
        setTrayModalOpen(true);
        break;
      case "t1Date":
      case "t2Date":
      case "t3Date":
        setTransplantModalOpen(true);
        break;
      case "harvestDate":
        setHarvestModalOpen(true);
        break;
    }
  }

  // Handler to close modals
  const handleCloseModal = () => {
    setSelectedCell(null);
    setSeedModalOpen(false);
    setTrayModalOpen(false);
    setTransplantModalOpen(false);
    setHarvestModalOpen(false);
  }

  return (
    <div className="App">
      <div className="header">
        <img src={logo} alt="Logo" className="logo" />
        <h2>Plantings Data</h2>
      </div>
      {Object.entries(categories).map(([column, title]) => {
        // ... Same as before ...

        return (
          <div key={column}>
            <h3>{title}</h3>
            <table className="plantings-table">
              {/* ... Same as before ... */}
                  <td
                    key={headerIndex}
                    className={dateColumns.includes(header) && isToday(new Date(planting[header])) ? 'highlighted' : ''}
                    onClick={() => handleOpenModal(column)}
                  >
                    {dateColumns.includes(header) ? formatDate(planting[header]) : planting[header]}
                  </td>
              {/* ... Same as before ... */}
            </table>
          </div>
        );
      })}
      
      {isSeedModalOpen && <SeedModal onClose={handleCloseModal} />}
      {isTrayModalOpen && <TrayModal onClose={handleCloseModal} />}
      {isTransplantModalOpen && <TransplantModal onClose={handleCloseModal} />}
      {isHarvestModalOpen && <HarvestModal onClose={handleCloseModal} />}
    </div>
  );
}

export default App;
