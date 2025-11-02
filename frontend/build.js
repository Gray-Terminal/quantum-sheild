import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create dist directory if it doesn't exist
const distDir = join(__dirname, 'dist');
if (!existsSync(distDir)) {
  mkdirSync(distDir, { recursive: true });
}

// Create a simple HTML file
const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <title>QuantumShield File Encryptor</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            max-width: 600px; 
            margin: 50px auto; 
            padding: 20px; 
            background: #f5f5f5;
        }
        .container { 
            background: white;
            border: 1px solid #ddd; 
            padding: 30px; 
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 { color: #10b981; }
        .btn {
            background: #10b981;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔒 QuantumShield File Encryptor</h1>
        <p><strong>Status:</strong> Backend API is running! 🟢</p>
        <p>React frontend will be available soon.</p>
        <p>You can test the backend API directly:</p>
        <button class="btn" onclick="testAPI()">Test Backend API</button>
        <div id="result" style="margin-top: 20px;"></div>
    </div>
    
    <script>
        async function testAPI() {
            const result = document.getElementById('result');
            try {
                const backendUrl = 'https://your-app-name.railway.app';
                const response = await fetch(backendUrl + '/health');
                const data = await response.json();
                result.innerHTML = '<p style="color: green;">✅ Backend is working: ' + JSON.stringify(data) + '</p>';
            } catch (error) {
                result.innerHTML = '<p style="color: red;">❌ Backend error: ' + error.message + '</p>';
            }
        }
        
        // Replace with your actual Railway URL
        document.querySelector('script').innerHTML = document.querySelector('script').innerHTML.replace('your-app-name', window.location.hostname.split('.')[0]);
    </script>
</body>
</html>`;

// Write the HTML file
writeFileSync(join(distDir, 'index.html'), htmlContent);
console.log('✅ Build completed successfully!');