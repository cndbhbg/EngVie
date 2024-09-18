const express = require('express');
const fs = require('fs');
const { google } = require('googleapis');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware để parse JSON
app.use(express.json());
app.use(express.static('public')); // Thư mục chứa index.html

// Đọc thông tin từ tệp credentials.js
const credentials = JSON.parse(fs.readFileSync('credentials.js', 'utf8'));
const privateKey = credentials.private_key.replace(/\\n/g, '\n');
const clientEmail = credentials.client_email;

// Hàm xóa dòng trong Google Sheets
async function deleteRow(sheetId, rowIndex) {
    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: clientEmail,
            private_key: privateKey,
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    try {
        const res = await sheets.spreadsheets.values.clear({
            spreadsheetId: sheetId,
            range: `Sheet1!A${rowIndex}:Z${rowIndex}`,
        });
        return res.data;
    } catch (error) {
        throw new Error('Lỗi khi xóa dòng: ' + error.message);
    }
}

// Endpoint để xóa dòng
app.post('/delete-row', async (req, res) => {
    const { rowIndex } = req.body;
    const sheetId = '1p9p8h9v-mQLL4MHm4PC1ofDFlUFxCIm4qm82_h_Vl4s'; // Thay thế bằng ID của sheet của bạn

    try {
        await deleteRow(sheetId, rowIndex + 1); // Google Sheets API yêu cầu số dòng bắt đầu từ 1
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
