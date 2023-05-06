const API_URL = 'https://t.ly/-qU-'; // Replace with the URL from Google Apps Script deployment

export async function fetchPlantings() {
  const response = await fetch(API_URL);
  const data = await response.json();
  return data;
}
