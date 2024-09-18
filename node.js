const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Load client secrets from a local file
const keyPath = path.join(__dirname, 'credentials.json'); // Đọc file credentials.json từ thư mục gốc
const keys = JSON.parse(fs.readFileSync(keyPath));

// Tạo đối tượng xác thực
const auth = new google.auth.JWT(
  keys.client_email,
  null,
  keys.private_key,
  ['https://www.googleapis.com/auth/spreadsheets'],
  null
);

// Khai báo thông tin của Google Sheet
const sheets = google.sheets({ version: 'v4', auth });
const spreadsheetId = '1p9p8h9v-mQLL4MHm4PC1ofDFlUFxCIm4qm82_h_Vl4s'; // ID của Google Sheet

async function deleteRow(rowIndex) {
  try {
    // Cập nhật phạm vi để xóa dòng
    const request = {
      spreadsheetId: spreadsheetId,
      range: `Sheet1!${rowIndex}:${rowIndex}`, // Chỉ định dòng để xóa
      valueInputOption: 'RAW',
      resource: {
        values: [] // Gửi yêu cầu xóa dòng
      }
    };

    // Gọi API để xóa dòng
    await sheets.spreadsheets.values.clear(request);
    console.log(`Row ${rowIndex} deleted successfully.`);
  } catch (error) {
    console.error('Error deleting row:', error);
  }
}

// Ví dụ sử dụng
deleteRow(3); // Xóa dòng thứ ba (cập nhật theo nhu cầu)
