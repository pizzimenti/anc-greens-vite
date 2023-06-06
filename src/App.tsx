import { useEffect, useState } from "react";
import { fetchPlantings } from "./services/api";
import { Planting } from "./types";
import logo from './assets/logo.png';
import { checkIfPlantingHasTodayActivity } from "./services/dataFilters";
import { getDisplayedColumns } from "./services/tableUtils";
import Modal from 'react-modal';
import PlantingTable from './components/PlantingTable';
import ActivityModal from './components/ActivityModal';
import CircleLoader from 'react-spinners/CircleLoader'; // import the CircleLoader instead of ClimbingBoxLoader

import "./App.css";

// Set the root for the modal
Modal.setAppElement('#root');

function App() {
  const [plantingsData, setPlantingsData] = useState<Planting[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalData, setModalData] = useState<Planting | null>(null);
  const [isLoading, setIsLoading] = useState(true); // new state variable for loading

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchPlantings();
        setPlantingsData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false); // set loading to false after data is fetched
      }
    };
    fetchData();
  }, []);

  const categories: { [key: string]: string } = {
    seedDate: "Today's Seeding",
    trayDate: "Today's Tray",
    t1Date: "Today's T1",
    t2Date: "Today's T2",
    t3Date: "Today's T3",
    harvestDate: "Today's Harvest"
  };

  const refetchPlantings = async () => {
    try {
      const data = await fetchPlantings();
      setPlantingsData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
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
        isLoading ? // show CircleLoader if loading
          <div className="loader-container">
            <CircleLoader size={80} color={"#7FFF00"} />
          </div> :
          Object.entries(categories).map(([column, title]) => {
            const filteredPlantings = checkIfPlantingHasTodayActivity(plantingsData, column as keyof Planting);
            if (filteredPlantings.length === 0) return null;

            const displayedColumns = getDisplayedColumns(filteredPlantings);

            return (
              <PlantingTable key={column} title={title} plantings={filteredPlantings} headers={Array.from(displayedColumns)} handleCellClick={handleCellClick} />
            );
          })
      }
      <ActivityModal
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        modalType={modalType}
        setModalType={setModalType}
        modalData={modalData}
        setModalData={setModalData}
        categories={categories}
        refetchPlantings={refetchPlantings}
      />
    </div>
  );
}

export default App;
