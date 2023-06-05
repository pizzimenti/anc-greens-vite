// path: src/components/ActivityModal.tsx

import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { Planting, Bed } from '../types';
import { fetchBeds } from '../services/api';  // make sure to replace fetchFreeLocations with fetchBeds

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
  const [beds, setBeds] = useState<Bed[]>([]);
  const [totalFreeFloats, setTotalFreeFloats] = useState<number>(0);

  useEffect(() => {
    if (modalIsOpen) {
      const fetchLocations = async () => {
        const locations = await fetchBeds();
        console.log('Locations fetched:', locations);
        setBeds(locations);
        const total = locations.reduce((sum, bed) => sum + bed.freeFloats, 0);
        setTotalFreeFloats(total);
      }
      fetchLocations();
    }
  }, [modalIsOpen]);

  // Rest of your code...

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


      <p>Total Free Floats: {totalFreeFloats}</p>
      <button onClick={() => {
        setModalIsOpen(false);
        setModalType("");
        setModalData(null);
      }} className="modalButton">Close</button>
    </Modal>
  );
}

export default ActivityModal;
