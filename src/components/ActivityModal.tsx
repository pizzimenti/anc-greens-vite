// path: src/components/ActivityModal.tsx

import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { Planting, Bed } from '../types';
import { fetchBeds } from '../services/api';

type ActivityModalProps = {
  modalIsOpen: boolean,
  setModalIsOpen: (isOpen: boolean) => void,
  modalType: string,
  setModalType: (type: string) => void,
  modalData: Planting | null,
  setModalData: (data: Planting | null) => void,
  categories: { [key: string]: string }
};

const ActivityModal: React.FC<ActivityModalProps> = ({ modalIsOpen, setModalIsOpen, modalType, setModalType, modalData, setModalData, categories }) => {
  // State
  const [beds, setBeds] = useState<Bed[]>([]);
  const [totalFreeFloats, setTotalFreeFloats] = useState<number>(0);

  // Button Action
  const buttonAction: { [key: string]: string } = {
    seed: "Mark Seeded",
    tray: "Mark Trayed",
    t1: "Mark Transplanted",
    t2: "Mark Transplanted",
    t3: "Mark Transplanted",
    harvest: "Mark Harvested",
  };


  // Handle Button Click
  const handleButtonClick = () => {
    console.log(buttonAction[modalType]);
    // TODO: implement the actual button action here.
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
              [...Array(Math.floor(bed.freeFloats))].map((_, i) => (
                <button key={`${index}-${i}`} className="bedButton modalButton">
                  {bed.location}
                </button>
              ))
            )}
            {beds.map((bed, index) =>
              bed.freeFloats % 1 !== 0 ? (
                <button key={`${index}-small`} className="smallBedButton modalButton">
                  {bed.location}
                </button>
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
