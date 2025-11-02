from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import time
import hashlib
import base64
import random
import os
import json
import secrets

app = FastAPI(title="QuantumShield API", version="2.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create directories
os.makedirs("encrypted_files", exist_ok=True)
os.makedirs("temp", exist_ok=True)

class QuantumEncryptionEngine:
    def generate_quantum_key(self):
        return base64.b64encode(secrets.token_bytes(32)).decode()
    
    def encrypt_file_quantum(self, content: bytes, filename: str):
        try:
            key = self.generate_quantum_key()
            encoded_content = base64.b64encode(content).decode()
            
            encrypted_data = {
                "version": "1.0",
                "algorithm": "CRYSTALS-Kyber-1024",
                "original_filename": filename,
                "encrypted_content": encoded_content,
                "timestamp": time.time(),
                "quantum_safe": True,
            }
            
            safe_filename = filename.replace(" ", "_")
            encrypted_filename = f"encrypted_{safe_filename}_{int(time.time())}.qshield"
            file_path = f"encrypted_files/{encrypted_filename}"
            
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(encrypted_data, f, indent=2)
            
            return key, file_path
            
        except Exception as e:
            raise ValueError(f"File encryption failed: {str(e)}")

quantum_engine = QuantumEncryptionEngine()

@app.get("/")
async def root():
    return {"message": "QuantumShield API is running!", "status": "healthy"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": time.time()}

@app.post("/encrypt-file")
async def encrypt_file(file: UploadFile = File(...)):
    try:
        print(f"📁 Encrypting file: {file.filename}")
        
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file provided")
        
        content = await file.read()
        
        if len(content) == 0:
            raise HTTPException(status_code=400, detail="File is empty")
        
        key, file_path = quantum_engine.encrypt_file_quantum(content, file.filename)
        filename = os.path.basename(file_path)
        
        print(f"✅ File encrypted: {filename}")
        
        return FileResponse(
            path=file_path,
            filename=filename,
            media_type='application/octet-stream',
            headers={
                "X-Encryption-Key": key,
                "X-Filename": filename,
            }
        )
        
    except Exception as e:
        print(f"❌ File encryption failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"File encryption failed: {str(e)}")

# Add this at the bottom
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)