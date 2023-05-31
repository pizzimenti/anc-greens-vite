// path: src/components/PlantingTable.tsx

import React from 'react';
import { Planting } from '../types';
import { formatDate } from "../services/dateUtils";
import { isToday, parseISO } from "date-fns";

type PlantingTableProps = {
    title: string,
    plantings: Planting[],
    headers: string[],
    handleCellClick: (type: string, data: Planting) => void
};

const headerMappings: { [key: string]: string } = {
    plantingId: 'Planting ID',
    variety: 'Variety',
    number: 'Number',
    seedsPerPlug: 'Seeds per Plug',
    seedDate: 'Seed Date',
    seedAttributes: 'Seed Attributes',
    actualSeedDate: 'Actual Seed Date',
    trayDate: 'Tray Date',
    actualTrayDate: 'Actual Tray Date',
    t1Date: 'T1 Date',
    t1Location: 'T1 Location',
    t2Date: 'T2 Date',
    t2Location: 'T2 Location',
    t3Date: 'T3 Date',
    t3Location: 'T3 Location',
    harvestDate: 'Harvest Date',
    harvestNotes: 'Harvest Notes',
    result: 'Result',
  };  

const PlantingTable: React.FC<PlantingTableProps> = ({ title, plantings, headers, handleCellClick }) => {
    return (
        <div>
            <h3>{title}</h3>
            <table className="plantings-table">
                <thead>
                    <tr>
                        {headers.map((header, index) => (
      <th key={index}>{headerMappings[header]}</th>
      ))}
                    </tr>
                </thead>
                <tbody>
                    {plantings.map((planting: Planting, index: number): JSX.Element => {
                        return (
                            <tr key={index}>
                                {headers.map((header, headerIndex) => {
                                    const cellValue = planting[header as keyof Planting];

                                    if (typeof cellValue === "string" && !isNaN(Date.parse(cellValue))) {
                                        return (
                                            <td
                                                key={headerIndex}
                                                className={isToday(parseISO(cellValue)) ? 'highlighted' : ''}
                                                onClick={() => handleCellClick(title, planting)}
                                            >
                                                {formatDate(cellValue)}
                                            </td>
                                        );
                                    } else if (cellValue instanceof Date) {
                                        return (
                                            <td
                                                key={headerIndex}
                                                className={isToday(cellValue) ? 'highlighted' : ''}
                                                onClick={() => handleCellClick(title, planting)}
                                            >
                                                {formatDate(cellValue.toISOString())}
                                            </td>
                                        );
                                    }
                                    return (
                                        <td key={headerIndex}>
                                            {typeof cellValue === "number" ? cellValue.toString() : cellValue}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default PlantingTable;
