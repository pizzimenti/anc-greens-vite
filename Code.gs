// Code.gs 

const devSheetId = '1BYDrz5ez-0kDdU-hgM4p--Xj34cYt63tdiYDqa-eVLg';
const prodSheetId = '14pwHH67iE2b3WfLrq_87W84TR_n0b3v-V13amfnmcR4';

class Planting {
  constructor(rowData) {
    this.plantingId = rowData[0];
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

let db = getAnchorageGreensDatabase();

function getAnchorageGreensDatabase() {
  const id = devSheetId;
  const db = SpreadsheetApp.openById(id);
  return db;
}

function getFreeLocations() {
  const freeLocationsSheet = db.getSheetByName('free locations');
  const lastRow = freeLocationsSheet.getLastRow();
  const dataRange = freeLocationsSheet.getRange(1, 1, lastRow, 2);
  const dataValues = dataRange.getValues();
  const freeLocations = dataValues.filter(row => row[1] > 0).map(row => row[0]);
  return freeLocations;
}

function getPlantingsData() {
  const plantingsSheet = db.getSheetByName('plantings');
  const dataRange = plantingsSheet.getRange(2, 1, plantingsSheet.getLastRow() - 1, 18);
  const rowData = dataRange.getValues();
  const plantings = rowData.map(row => new Planting(row));
  return plantings;
}

function doGet(e) {
  let output;
  switch(e.parameter.type) {
    case 'plantings':
      const plantings = getPlantingsData();
      const jsonPlantings = JSON.stringify(plantings.map(planting => Object.assign({}, planting)));
      output = ContentService.createTextOutput(jsonPlantings);
      output.setMimeType(ContentService.MimeType.JSON);
      break;
    case 'freeLocations':
      const freeLocations = getFreeLocations();
      const jsonFreeLocations = JSON.stringify(freeLocations);
      output = ContentService.createTextOutput(jsonFreeLocations);
      output.setMimeType(ContentService.MimeType.JSON);
      break;
    default:
      output = ContentService.createTextOutput('Invalid type parameter');
  }
  return output;
}
