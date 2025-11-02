const fs = require('fs');
const path = require('path');

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Create a simple HTML file
const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <title>QuantumShield File Encryptor</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
        .container { border: 1px solid #ddd; padding: 20px; border-radius: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔒 QuantumShield File Encryptor</h1>
        <p>Backend API is running!</p>
        <p>React app build in progress...</p>
        <p>Check the backend at: <span id="apiUrl"></span></p>
    </div>
    <script>
        document.getElementById('apiUrl').textContent = window.location.origin.replace('vercel.app', 'railway.app');
    </script>
</body>
</html>`;

// Write the HTML file
fs.writeFileSync(path.join(distDir, 'index.html'), htmlContent);
console.log('Build completed successfully!');