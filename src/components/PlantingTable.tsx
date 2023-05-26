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

const PlantingTable: React.FC<PlantingTableProps> = ({ title, plantings, headers, handleCellClick }) => {
    return (
        <div>
            <h3>{title}</h3>
            <table className="plantings-table">
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index}>{header}</th>
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
