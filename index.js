// Import necessary modules
const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
require('dotenv').config();

// Create an Express app
const app = express();
app.use(cors());
app.use(express.json());

// Load OAuth 2.0 credentials from JSON file
const credentials = require('./credentials.json');

// Initialize Google Sheets API client
const auth = new google.auth.GoogleAuth({
  credentials: credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const sheets = google.sheets({
  version: 'v4',
  auth: auth
});

// API endpoint to fetch data from Google Sheets
app.get('/api/getData', async (req, res) => {
  try {
    // Specify the spreadsheet ID and range
    const spreadsheetId = '18i5nxxTU7x5y__XPYM4mjxTNUl4n8NmHdA9lpfHK7dY'; // Replace with your Google Sheets spreadsheet ID
    const range = 'Sheet1!A:F'; // Replace with the range of your data

    // Fetch data from Google Sheets
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: range,
    });

    // Extract values from the response
    const values = response.data.values;

    // Send the values as JSON response
    res.json(values);
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the Express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
