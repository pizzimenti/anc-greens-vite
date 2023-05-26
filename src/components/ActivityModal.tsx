// path: src/components/ActivityModal.tsx

import React from 'react';
import Modal from 'react-modal';
import { Planting } from '../types';

type ActivityModalProps = {
  modalIsOpen: boolean,
  setModalIsOpen: (isOpen: boolean) => void,
  modalType: string,
  setModalType: (type: string) => void,
  modalData: Planting | null,
  setModalData: (data: Planting | null) => void,
  categories: { [key: string]: string }
};

const ActivityModal: React.FC<ActivityModalProps> = ({modalIsOpen, setModalIsOpen, modalType, setModalType, modalData, setModalData, categories}) => {
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
          <p>{JSON.stringify(modalData)}</p>
        </div>
      )}
      <button onClick={() => {
        setModalIsOpen(false);
        setModalType("");
        setModalData(null);
      }} className="modalButton">Close</button>
    </Modal>
  );
}

export default ActivityModal;
