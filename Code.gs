// Code.gs 

const devSheetId = '1JOmdZZ7AqJLhhhFL-fe3vGWprAc4by7F1IzV1liP6IY';
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

class Bed {
  constructor(rowData) {
    this.location = rowData[0];
    this.freeFloats = parseFloat(rowData[1]); // make sure to parse the number as a float
  }
}

let db = getAnchorageGreensDatabase();

function getAnchorageGreensDatabase() {
  const id = devSheetId;
  const db = SpreadsheetApp.openById(id);
  return db;
}

function getBedsData() {
  const bedsSheet = db.getSheetByName('beds');
  const lastRow = bedsSheet.getLastRow();
  const dataRange = bedsSheet.getRange(1, 1, lastRow, 2);
  const rowData = dataRange.getValues();
  const beds = rowData.map(row => new Bed(row));
  return beds;
}

function getPlantingsData() {
  const plantingsSheet = db.getSheetByName('plantings');
  const dataRange = plantingsSheet.getRange(2, 1, plantingsSheet.getLastRow() - 1, 18);
  const rowData = dataRange.getValues();
  const plantings = rowData.map(row => new Planting(row));
  return plantings;
}

function updatePlantingData(plantingId, updatedData) {
  const plantingsSheet = db.getSheetByName('plantings');
  const dataRange = plantingsSheet.getDataRange();
  const values = dataRange.getValues();

  // Find the row of the planting we want to update
  const rowIndex = values.findIndex(row => row[0] === plantingId);

  if (rowIndex !== -1) {
    // Update the "actual seed date" cell if we have a new date
    if (updatedData.actualSeedDate) {
      const seedDate = new Date(updatedData.actualSeedDate);
      plantingsSheet.getRange(rowIndex + 1, 7).setValue(seedDate);
    }

    // Update the "actual tray date" cell if we have a new date
    if (updatedData.actualTrayDate) {
      const trayDate = new Date(updatedData.actualTrayDate);
      plantingsSheet.getRange(rowIndex + 1, 9).setValue(trayDate);
    }

    // Update the "T1 date", "T2 date", "T3 date" cells if we have new dates
    if (updatedData.actualT1Date) {
      const t1Date = new Date(updatedData.actualT1Date);
      plantingsSheet.getRange(rowIndex + 1, 11).setValue(t1Date);
    }
    if (updatedData.actualT2Date) {
      const t2Date = new Date(updatedData.actualT2Date);
      plantingsSheet.getRange(rowIndex + 1, 13).setValue(t2Date);
    }
    if (updatedData.actualT3Date) {
      const t3Date = new Date(updatedData.actualT3Date);
      plantingsSheet.getRange(rowIndex + 1, 15).setValue(t3Date);
    }

    // Update the "harvest" cell if we have a new string
    if (updatedData.harvestNotes) {
      plantingsSheet.getRange(rowIndex + 1, 17).setValue(updatedData.harvestNotes);
    }
  }
}

function doGet(e) {
  let output;
  switch (e.parameter.type) {
    case 'plantings':
      const plantings = getPlantingsData();
      const jsonPlantings = JSON.stringify(plantings.map(planting => Object.assign({}, planting)));
      output = ContentService.createTextOutput(jsonPlantings);
      output.setMimeType(ContentService.MimeType.JSON);
      break;
    case 'beds':
      const beds = getBedsData();
      const jsonBeds = JSON.stringify(beds.map(bed => Object.assign({}, bed)));
      output = ContentService.createTextOutput(jsonBeds);
      output.setMimeType(ContentService.MimeType.JSON);
      break;
    case 'updatePlanting':
      const plantingId = e.parameter.plantingId;
      const updatedData = JSON.parse(e.parameter.updatedData);

      console.log(`Updating planting ID ${plantingId} with data:`, updatedData); // New

      updatePlantingData(plantingId, updatedData);
      output = ContentService.createTextOutput('Planting updated');
      break;
    default:
      output = ContentService.createTextOutput('Invalid type parameter');
  }
  return output;
}
