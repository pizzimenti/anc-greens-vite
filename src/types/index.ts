// Path: src/types/index.ts

export interface Planting {
  planting: string;
  variety: string;
  number: number;
  seedsPerPlug: number;
  seedDate: Date;
  seedAttributes: string;
  actualSeedDate: Date;
  trayDate: Date;
  actualTrayDate: Date;
  t1Date: Date;
  t1Location: string;
  t2Date: Date;
  t2Location: string;
  t3Date: Date;
  t3Location: string;
  harvestDate: Date;
  harvestNotes: string;
  result: string;
}

export class PlantingData implements Planting {
  planting: string;
  variety: string;
  number: number;
  seedsPerPlug: number;
  seedDate: Date;
  seedAttributes: string;
  actualSeedDate: Date;
  trayDate: Date;
  actualTrayDate: Date;
  t1Date: Date;
  t1Location: string;
  t2Date: Date;
  t2Location: string;
  t3Date: Date;
  t3Location: string;
  harvestDate: Date;
  harvestNotes: string;
  result: string;

  constructor(rowData: any) {
    this.planting = rowData[0];
    this.variety = rowData[1];
    this.number = rowData[2];
    this.seedsPerPlug = rowData[3];
    this.seedDate = new Date(rowData[4]);
    this.seedAttributes = rowData[5];
    this.actualSeedDate = new Date(rowData[6]);
    this.trayDate = new Date(rowData[7]);
    this.actualTrayDate = new Date(rowData[8]);
    this.t1Date = new Date(rowData[9]);
    this.t1Location = rowData[10];
    this.t2Date = new Date(rowData[11]);
    this.t2Location = rowData[12];
    this.t3Date = new Date(rowData[13]);
    this.t3Location = rowData[14];
    this.harvestDate = new Date(rowData[15]);
    this.harvestNotes = rowData[16];
    this.result = rowData[17];
  }
}
