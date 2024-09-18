const { google } = require('googleapis');
const sheets = google.sheets('v4');
const fs = require('fs');
const path = require('path');

// Load client secrets from a local file
const keyPath = path.join(__dirname, 'credentials.json'); // Path to your credentials file
const keys = JSON.parse(fs.readFileSync(keyPath));
const auth = new google.auth.JWT(
  keys.client_email,
  null,
  keys.private_key,
  ['https://www.googleapis.com/auth/spreadsheets'],
  null
);

// Google Sheet ID and range
const spreadsheetId = '1p9p8h9v-mQLL4MHm4PC1ofDFlUFxCIm4qm82_h_Vl4s';
const range = 'Sheet1'; // Replace with your actual sheet name

async function deleteRow(rowIndex) {
  try {
    await auth.authorize();
    const request = {
      spreadsheetId: spreadsheetId,
      range: `${range}!${rowIndex}:${rowIndex}`, // Range specifying the row to delete
      auth: auth,
      resource: {
        range: `${range}!${rowIndex}:${rowIndex}`,
        majorDimension: 'ROWS',
        values: []
      }
    };

    // Delete the row
    await sheets.spreadsheets.values.clear(request);
    console.log(`Row ${rowIndex} deleted successfully.`);
  } catch (error) {
    console.error('Error deleting row:', error);
  }
}

// Example usage
deleteRow(3); // Delete the third row (adjust as needed)
