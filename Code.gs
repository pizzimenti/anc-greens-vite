// Code.gs inside google apps script 1dCBjSIrpBkftuYYPqW6E-XPjhQOxFuOb9PM-fj30OmSIlTdc2mdGxCFv

const devSheetId = '1BYDrz5ez-0kDdU-hgM4p--Xj34cYt63tdiYDqa-eVLg';
const prodSheetId = '14pwHH67iE2b3WfLrq_87W84TR_n0b3v-V13amfnmcR4';

class Planting {
  constructor(rowData) {
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

let db = getAnchorageGreensDatabase();
let today = new Date().toDateString();
let freeLocations = getFreeLocations();

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

function getDailyTasks(plantings) {
  let dailyTasks = {
    todaysHarvest: [],
    t3: [],
    t2: [],
    t1: [],
    tray: [],
    seeding: []
  };

  const taskKeys = Object.keys(dailyTasks);

  for (const planting of plantings) {
    const taskDates = {
      todaysHarvest: planting.harvestDate.toDateString(),
      t3: planting.t3Date.toDateString(),
      t2: planting.t2Date.toDateString(),
      t1: planting.t1Date.toDateString(),
      tray: planting.trayDate.toDateString(),
      seeding: planting.seedDate.toDateString()
    };

    for (const taskKey of taskKeys) {
      if (taskDates[taskKey] === today) {
        dailyTasks[taskKey].push(planting);
      }
    }
  }

  return dailyTasks;
}

function doGet(e) {
  if (e.parameter.type === 'dailyTasks') {
    return doGetDailyTasks(e);
  }

  const plantings = getPlantingsData();
  const json = JSON.stringify(plantings.map(planting => Object.assign({}, planting)));
  
  // Use JSONP to bypass CORS
  const callback = e.parameter.callback;
  const jsonp = `${callback}(${json});`;

  const output = ContentService.createTextOutput(jsonp);
  output.setMimeType(ContentService.MimeType.JAVASCRIPT);
  
  return output;
}
