import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { Planting, Bed } from '../types';
import { fetchBeds, updatePlanting } from '../services/api';

type ActivityModalProps = {
  modalIsOpen: boolean,
  setModalIsOpen: (isOpen: boolean) => void,
  modalType: string,
  setModalType: (type: string) => void,
  modalData: Planting | null,
  setModalData: (data: Planting | null) => void,
  categories: { [key: string]: string },
  refetchPlantings: () => Promise<void>,
};

const ActivityModal: React.FC<ActivityModalProps> = ({ modalIsOpen, setModalIsOpen, modalType, setModalType, modalData, setModalData, categories, refetchPlantings }) => {
  // State
  const [beds, setBeds] = useState<Bed[]>([]);
  const [totalFreeFloats, setTotalFreeFloats] = useState<number>(0);
  const [selectedBeds, setSelectedBeds] = useState<{ [key: string]: boolean }>({});

  // Button Action
  const buttonAction: { [key: string]: string } = {
    seed: "Mark Seeded",
    tray: "Mark Trayed",
    t1: "Mark Transplanted",
    t2: "Mark Transplanted",
    t3: "Mark Transplanted",
    harvest: "Mark Harvested",
  };


  const handleButtonClick = () => {
    let updateData: Partial<Planting> = {};

    if (modalType === "seed" && modalData) {
      updateData = { actualSeedDate: new Date() };
    } else if (modalType === "tray" && modalData) {
      updateData = { actualTrayDate: new Date() };
    } // Add cases for other modalTypes as needed.
    else if (modalType === "harvest" && modalData) {
      updateData = { harvestNotes: "harvested" };
    }

    // Log the modalType and data to be updated
    console.log("Modal type: ", modalType);
    console.log("Data to update: ", updateData);

    if (modalData?.plantingId) {
      updatePlanting(modalData.plantingId, updateData)
        .then(() => {
          console.log(`Successfully updated planting with modalType: ${modalType}`);
          // Close the dialog and refetch plantings
          setModalIsOpen(false);
          refetchPlantings();
        })
        .catch(error => {
          console.error(`Failed to update planting with modalType: ${modalType}`, error)
        });
    } else {
      console.error('PlantingId is undefined');
    }
  };


  // Effects
  useEffect(() => {
    if (modalIsOpen) {
      const fetchLocations = async () => {
        const locations = await fetchBeds();
        console.log('Locations fetched:', locations);
        setBeds(locations);
        const total = locations.reduce((sum, bed) => sum + bed.freeFloats, 0);
        setTotalFreeFloats(total);
        console.log('Modal type:', modalType);
      }
      fetchLocations();
    }
  }, [modalIsOpen]);

  // Helper function
  const calculateRequiredFloats = () => {
    if (modalData && ['t1', 't2', 't3'].includes(modalType)) {
      const divider = modalType === 't1' ? 72 : modalType === 't2' ? 36 : 18;
      return modalData.number / divider;
    }
    return 0;
  }

  // Debugging
  console.log("Modal type: ", modalType);

  // Render
  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={() => {
        setModalIsOpen(false);
        setModalType("");
        setModalData(null);
        setSelectedBeds({});  // Clear selected beds
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
        </div>
      )}

      {['t1', 't2', 't3'].includes(modalType) && (
        <>
          <div className="bedButton-grid">
            {beds.map((bed, index) =>
              [...Array(Math.floor(bed.freeFloats))].map((_, i) => {
                const key = `${index}-${i}`;
                return (
                  <button
                    key={key}
                    className={`bedButton modalButton ${selectedBeds[key] ? 'selected' : ''}`}
                    onClick={() => setSelectedBeds(prevState => ({ ...prevState, [key]: !prevState[key] }))}
                  >
                    {bed.location}
                  </button>
                );
              })
            )}
            {beds.map((bed, index) =>
              bed.freeFloats % 1 !== 0 ? (
                (() => {
                  const key = `${index}-small`;
                  return (
                    <button
                      key={key}
                      className={`smallBedButton modalButton ${selectedBeds[key] ? 'selected' : ''}`}
                      onClick={() => setSelectedBeds(prevState => ({ ...prevState, [key]: !prevState[key] }))}
                    >
                      {bed.location}
                    </button>
                  );
                })()
              ) : null
            )}
          </div>

          <div>
            <p>Total Free Floats: {totalFreeFloats}</p>
            {['t1', 't2', 't3'].includes(modalType) &&
              <p>Floats required: {calculateRequiredFloats()}</p>
            }
          </div>
        </>
      )}

      {modalType in buttonAction && (
        <button onClick={handleButtonClick} className="modalButton fullWidthButton">
          {buttonAction[modalType]}
        </button>
      )}
    </Modal>
  );
}

export default ActivityModal;