// path: src/components/ActivityModal.tsx

// TODO:
// 4. Implement Loading Spinner After Button Press
// 3. Adjust Bed Count When Item is Moved
// 2. Hide Completed Rows
// 1. Add Harvest Notes Text Field

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
      const requiredFloats = calculateRequiredFloats();

      if (selectedFloats < requiredFloats ||
        (selectedFloats > requiredFloats && !(requiredFloats === 0.5 && selectedFloats === 1))) {
          alert(selectedFloats < requiredFloats ? 'Too few floats selected for this transplant.' : 'Too many floats selected for this transplant.');
        return;
      }

      const locationString = selectedKeys.map(key => locationNames[key]).join(', ');
      updateData = { [`${modalType}Location`]: locationString };
    }

    if (modalData?.plantingId) {
      updatePlanting(modalData.plantingId, updateData)
        .then(() => {
          // Get a list of selected bed keys
          const selectedKeys = Object.keys(selectedBeds).filter(key => selectedBeds[key]);
          // Promise to update the bed count for all selected beds
          const updateBedsPromises = selectedKeys.map(key => {
            // Extract the bed index from the key
            const bedIndex = Number(key.split('-')[0]);
            // Determine how many floats to subtract
            const floatsToSubtract = key.includes('small') ? 0.5 : 1;
            // Get the new freeFloats count for the bed
            const newFreeFloats = beds[bedIndex].freeFloats - floatsToSubtract;
            // Call the API to update the bed
            return updateBedCount(beds[bedIndex].location, newFreeFloats);
          });
          // Wait for all bed updates to finish
          return Promise.all(updateBedsPromises);
        })
        .then(() => {
          // After updating all the beds, refetch the plantings
          return refetchPlantings();
        })
        .then(() => {
          // After refetching the plantings, close the modal
          setModalIsOpen(false);
        })
        .catch((error) => {
          console.error('Failed to update planting or bed', error);
        });
    }
  };

  useEffect(() => {
    setSelectedBeds({});
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

  const selectedFloats = calculateSelectedFloats();
  const requiredFloats = calculateRequiredFloats();
  const isSubmitButtonEnabled =
    selectedFloats >= requiredFloats &&
    (selectedFloats === requiredFloats ||
      (requiredFloats === 0.5 && selectedFloats === 1));

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={() => {
        setModalIsOpen(false);
        setModalType("");
        setModalData(null);
        setSelectedBeds({});  // reset selectedBeds when the modal closes
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

      <button
        className={`modalButton ${isSubmitButtonEnabled ? 'submitButton enabled' : 'submitButton disabled'}`}
        onClick={handleButtonClick}
        // disabled={!isSubmitButtonEnabled}
      >
        {modalType && buttonAction[modalType]}
      </button>

    </Modal>
  );
};

export default ActivityModal;
