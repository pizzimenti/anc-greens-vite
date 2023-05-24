// path: src/components/Modals.tsx

import React from "react";
import { Planting } from "../services/api";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  planting: Planting;
}

export const SeedModal: React.FC<ModalProps> = ({ isOpen, onClose, planting }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <h2>Seeding Details for {planting.crop}</h2>
      {/* Show the seed details */}
      <button onClick={onClose}>Mark Seeded</button>
    </div>
  );
};

export const TrayModal: React.FC<ModalProps> = ({ isOpen, onClose, planting }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <h2>Tray Details for {planting.crop}</h2>
      {/* Show the tray details */}
      <button onClick={onClose}>Mark Trayed</button>
    </div>
  );
};

export const TransplantModal: React.FC<ModalProps> = ({ isOpen, onClose, planting }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <h2>Transplant Details for {planting.crop}</h2>
      {/* Show the transplant details */}
      <button onClick={onClose}>Mark Transplanted</button>
    </div>
  );
};

export const HarvestModal: React.FC<ModalProps> = ({ isOpen, onClose, planting }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <h2>Harvest Details for {planting.crop}</h2>
      {/* Show the harvest details */}
      <button onClick={onClose}>Mark Harvested</button>
    </div>
  );
};
