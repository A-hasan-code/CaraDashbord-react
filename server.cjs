const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Serve static files from the 'dist' folder (Vite's build output)
app.use(express.static(path.join(__dirname, 'dist')));

// For all other routes, send back the index.html (for client-side routing with React Router)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Define the port (either from environment variables or default to 3000)
const PORT = 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
