import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create public directory
const publicDir = join(__dirname, 'public');
if (!existsSync(publicDir)) {
  mkdirSync(publicDir, { recursive: true });
}

// Simple HTML that will definitely work
const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <title>QuantumShield File Encryptor</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { 
            font-family: Arial, sans-serif;
            max-width: 600px; 
            margin: 100px auto; 
            padding: 20px; 
            text-align: center;
        }
        h1 { color: #10b981; }
        .btn {
            background: #10b981;
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 18px;
            margin: 20px;
        }
    </style>
</head>
<body>
    <h1>🔒 QuantumShield File Encryptor</h1>
    <p><strong>Status: Online and Ready</strong></p>
    <p>Military-grade quantum-resistant encryption</p>
    
    <button class="btn" onclick="testAPI()">Test Backend</button>
    
    <div id="result" style="margin: 20px; min-height: 40px;"></div>

    <script>
        async function testAPI() {
            const result = document.getElementById('result');
            result.innerHTML = 'Testing...';
            
            try {
                const response = await fetch('https://your-app.railway.app/health');
                const data = await response.json();
                result.innerHTML = '✅ Backend working: ' + JSON.stringify(data);
            } catch (error) {
                result.innerHTML = '❌ Backend error: ' + error.message;
            }
        }
        
        // Test on load
        testAPI();
    </script>
</body>
</html>`;

// Write the file
writeFileSync(join(publicDir, 'index.html'), htmlContent);
console.log('✅ Build completed! Index.html created in public folder.');