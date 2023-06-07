// path: src/components/ActivityModal.tsx

import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { Planting, Bed } from '../types';
import { fetchBeds, updatePlanting, updateBedCount } from '../services/api';

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
  const [locationNames, setLocationNames] = useState<{ [key: string]: string }>({});

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
    } else if (modalType === "harvest" && modalData) {
      updateData = { harvestNotes: "harvested" };
    } else if (["t1", "t2", "t3"].includes(modalType) && modalData) {
      const selectedKeys = Object.keys(selectedBeds).filter(key => selectedBeds[key]);
      const selectedFloats = selectedKeys.reduce((acc, key) => acc + (key.includes('small') ? 0.5 : 1), 0);
      if (selectedFloats < calculateRequiredFloats()) {
        alert('You have not selected enough bed buttons.');
        return;
      }
      const locationString = selectedKeys.map(key => locationNames[key]).join(', ');
      updateData = { [`${modalType}Location`]: locationString };
    }

    console.log("Modal type: ", modalType);
    console.log("Data to update: ", updateData);

    if (modalData?.plantingId) {
      updatePlanting(modalData.plantingId, updateData)
        .then(() => {
          console.log(`Successfully updated planting with modalType: ${modalType}`);
          // After successful update of the planting, update each bed
          if (["t1", "t2", "t3"].includes(modalType)) {
            Object.keys(selectedBeds).forEach(key => {
              const decrementAmount = key.includes('small') ? 0.5 : 1;
              const bedId = beds[parseInt(key.split('-')[0])].location;
              updateBedCount(bedId, decrementAmount);  // You'll need to implement this function on your backend
            });
          }
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

  useEffect(() => {
    if (modalIsOpen) {
      const fetchLocations = async () => {
        const locations = await fetchBeds();
        console.log('Locations fetched:', locations);
        setBeds(locations);
        const total = locations.reduce((sum, bed) => sum + bed.freeFloats, 0);
        setTotalFreeFloats(total);
        console.log('Modal type:', modalType);

        let newLocationNames: { [key: string]: string } = {};
        locations.forEach((bed, index) => {
          [...Array(Math.floor(bed.freeFloats))].forEach((_, i) => {
            const key = `${index}-${i}`;
            newLocationNames[key] = bed.location;
          });
          if (bed.freeFloats % 1 !== 0) {
            const key = `${index}-small`;
            newLocationNames[key] = bed.location;
          }
        });
        setLocationNames(newLocationNames);
      }
      fetchLocations();
    }
  }, [modalIsOpen]);

  const calculateRequiredFloats = () => {
    if (modalData && ['t1', 't2', 't3'].includes(modalType)) {
      const divider = modalType === 't1' ? 72 : modalType === 't2' ? 36 : 18;
      return modalData.number / divider;
    }
    return 0;
  }

  const calculateSelectedFloats = () => {
    const selectedKeys = Object.keys(selectedBeds).filter(key => selectedBeds[key]);
    return selectedKeys.reduce((acc, key) => acc + (key.includes('small') ? 0.5 : 1), 0);
  }

  const isSubmitButtonEnabled = calculateSelectedFloats() >= calculateRequiredFloats();


  console.log("Modal type: ", modalType);

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
            <p>Required Floats: {calculateRequiredFloats()}</p>
            <p>Selected Floats: {calculateSelectedFloats()}</p>
          </div>
        </>
      )}

      <button className={`modalButton ${isSubmitButtonEnabled ? 'submitButtonEnabled' : 'submitButtonDisabled'}`} onClick={handleButtonClick}>
        {modalType && buttonAction[modalType]}
      </button>
    </Modal>
  );
};

export default ActivityModal;
