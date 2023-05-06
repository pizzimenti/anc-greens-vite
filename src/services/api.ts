const API_URL = 
'https://script.google.com/macros/s/AKfycbxY6NxQvv_LVvaQdMK4nSqcMVM4cpHLxidhvbD4NRPT6dzDyy10HmImaXB-GG8EosLKlg/exec'

export async function fetchPlantings() {
  const response = await fetch(`${API_URL}?callback=processData`);
  const text = await response.text();
  const processData = (data: any) => data;
  const data = eval(text);
  return data;
}

