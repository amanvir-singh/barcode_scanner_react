const express = require('express');
const cors = require('cors');
const XLSX = require('xlsx');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const EXCEL_FILE = path.join(__dirname, 'Shipping_Tracker.xlsx');

function saveToExcel(data) {
  let workbook;
  try {
    workbook = XLSX.readFile(EXCEL_FILE);
  } catch (err) {
    workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([['Barcode Data','Job Name','Item Number', 'Timestamp']]), 'Shipping_Tracker');
  }

  const sheet = workbook.Sheets['Shipping_Tracker'];
  const newRow = [data, new Date().toISOString()];
  XLSX.utils.sheet_add_aoa(sheet, [newRow], { origin: -1 });

  XLSX.writeFile(workbook, EXCEL_FILE);
}

app.post('/api/barcode', (req, res) => {
  const { barcodeData } = req.body;
  try {
    saveToExcel(barcodeData);
    res.status(201).json({ message: 'Barcode data saved successfully' });
  } catch (err) {
    console.error('Error saving barcode data', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});