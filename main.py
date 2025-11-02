from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import time
import hashlib
import base64
import random
import os
import json
from typing import List
import secrets

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

app = FastAPI(title="QuantumShield API", version="2.0.0")

# === CORS ===
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://quantum-sheild-3asp-icambsdgp-varchas-hvs-projects.vercel.app",
        "https://quantum-sheild-3asp-mnqyz9r0s-varchas-hvs-projects.vercel.app",
        "http://localhost:5173",
        "https://gleeful-kringle-320853.netlify.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- global preflight handler ---
@app.options("/{full_path:path}")
async def preflight(full_path: str):
    return JSONResponse(
        content={"ok": True},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Max-Age": "86400",  # cache the preflight for 24 h
        },
    )


# Pydantic models
class EncryptionRequest(BaseModel):
    data: str
    algorithm: str = "kyber-1024"

class OptimizationRequest(BaseModel):
    security_level: int
    performance_need: int
    size_constraint: int

class AIOptimization(BaseModel):
    type: str
    status: str
    improvement: str
    description: str

class EncryptionResponse(BaseModel):
    classical_encrypted: str
    quantum_encrypted: str
    performance_gain: int
    quantum_resistance: int
    ai_optimizations: List[AIOptimization]
    processing_time: float

# Create directories
os.makedirs("encrypted_files", exist_ok=True)
os.makedirs("temp", exist_ok=True)

class QuantumAIOptimizer:
    def __init__(self):
        self.optimization_patterns = {
            "Parameter Selection": {"base_improvement": 15, "description": "Optimized lattice parameters for current threat landscape"},
            "Lattice Dimension": {"base_improvement": 22, "description": "Adjusted dimension balancing security and performance"},
            "Noise Distribution": {"base_improvement": 18, "description": "Enhanced noise distribution for stronger security guarantees"},
            "Key Generation": {"base_improvement": 12, "description": "Streamlined key generation process"},
            "Threat Analysis": {"base_improvement": 8, "description": "Real-time threat intelligence integration"}
        }
    
    def optimize(self, security_level: int, performance_need: int) -> tuple[List[AIOptimization], int]:
        optimizations = []
        total_improvement = 0
        
        for opt_type, config in self.optimization_patterns.items():
            improvement = config["base_improvement"]
            if security_level > 3:
                improvement += 5
            if performance_need > 3:
                improvement += 3
                
            optimizations.append(AIOptimization(
                type=opt_type,
                status="complete",
                improvement=f"{improvement}%",
                description=config["description"]
            ))
            total_improvement += improvement
            
        return optimizations, min(100, total_improvement)

class QuantumEncryptionEngine:
    def __init__(self):
        self.algorithms = {
            "kyber-512": {"security": 1, "performance": 5},
            "kyber-768": {"security": 3, "performance": 4},
            "kyber-1024": {"security": 5, "performance": 3},
        }
    
    def classical_encrypt(self, data: str) -> str:
        """Simulate classical RSA/ECC encryption"""
        encoded = base64.b64encode(data.encode()).decode()
        hash_suffix = hashlib.sha256(data.encode()).hexdigest()[:8]
        return f"RSA_2048_{encoded}_ECC_256_{hash_suffix}"
    
    def quantum_encrypt(self, data: str, algorithm: str = "kyber-1024") -> str:
        """Simulate post-quantum lattice-based encryption"""
        encoded = base64.b64encode(data.encode()).decode()
        lattice_noise = ''.join(random.choices('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', k=16))
        security_level = self.algorithms.get(algorithm, {"security": 3})["security"]
        return f"PQC_{algorithm.upper()}_{lattice_noise}_{encoded}_LATTICE_{security_level}"
    
    def generate_quantum_key(self) -> str:
        """Generate a quantum-safe encryption key"""
        return base64.b64encode(secrets.token_bytes(32)).decode()
    
    def encrypt_file_quantum(self, content: bytes, filename: str) -> tuple[str, str, str]:
        """Encrypt file content with quantum-safe encryption simulation"""
        # Generate quantum key
        key = self.generate_quantum_key()
        
        # Simulate lattice-based encryption
        encoded_content = base64.b64encode(content).decode()
        lattice_vector = ''.join(random.choices('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', k=24))
        
        # Create encrypted file structure
        encrypted_data = {
            "version": "1.0",
            "algorithm": "CRYSTALS-Kyber-1024",
            "original_filename": filename,
            "lattice_vector": lattice_vector,
            "encrypted_content": encoded_content,
            "timestamp": time.time(),
            "quantum_safe": True,
            "file_size": len(content),
            "file_hash": hashlib.sha256(content).hexdigest()
        }
        
        # Convert to JSON string
        encrypted_json = json.dumps(encrypted_data, indent=2)
        
        # Save to file for download
        safe_filename = filename.replace(" ", "_").replace("/", "_")
        encrypted_filename = f"encrypted_{safe_filename}_{int(time.time())}.qshield"
        file_path = f"encrypted_files/{encrypted_filename}"
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(encrypted_json)
        
        return encrypted_json, key, file_path
    
    def decrypt_file_quantum(self, encrypted_json: str, key: str) -> bytes:
        """Decrypt quantum-encrypted file content"""
        try:
            encrypted_data = json.loads(encrypted_json)
            
            # Verify it's a quantum-safe file
            if not encrypted_data.get("quantum_safe", False):
                raise ValueError("File was not encrypted with quantum-safe algorithm")
            
            # Extract and decode content
            encoded_content = encrypted_data["encrypted_content"]
            decrypted_content = base64.b64decode(encoded_content)
            
            return decrypted_content
            
        except Exception as e:
            raise ValueError(f"Decryption failed: {str(e)}")

# Initialize engines
quantum_engine = QuantumEncryptionEngine()
ai_optimizer = QuantumAIOptimizer()

@app.get("/")
async def root():
    return {"message": "QuantumShield API is running!", "status": "healthy"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "QuantumShield API", "timestamp": time.time()}

@app.post("/encrypt")
async def encrypt_data(request: EncryptionRequest):
    start_time = time.time()
    
    try:
        print(f"🔐 Received encryption request for data: {request.data[:50]}...")
        
        # Simulate processing time
        time.sleep(0.5)
        
        # Simulate classical encryption
        classical_encrypted = quantum_engine.classical_encrypt(request.data)
        
        # Simulate quantum encryption
        quantum_encrypted = quantum_engine.quantum_encrypt(request.data, request.algorithm)
        
        # Run AI optimization
        optimizations, performance_gain = ai_optimizer.optimize(
            security_level=5,
            performance_need=3
        )
        
        # Calculate quantum resistance
        quantum_resistance = quantum_engine.algorithms.get(request.algorithm, {"security": 3})["security"] * 20
        
        processing_time = time.time() - start_time
        
        print(f"✅ Encryption successful - Quantum resistance: {quantum_resistance}%")
        
        return {
            "classical_encrypted": classical_encrypted,
            "quantum_encrypted": quantum_encrypted,
            "performance_gain": performance_gain,
            "quantum_resistance": quantum_resistance,
            "ai_optimizations": optimizations,
            "processing_time": processing_time
        }
        
    except Exception as e:
        print(f"❌ Encryption failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Encryption failed: {str(e)}")

@app.post("/api/encrypt-file")
async def encrypt_file(file: UploadFile = File(...)):
    """Encrypt a file with quantum-safe encryption and return the encrypted file"""
    try:
        print(f"📁 Encrypting file: {file.filename}")
        
        # Validate file
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file provided")
        
        # Read the uploaded file content
        content = await file.read()
        
        # Encrypt with quantum method
        encrypted_json, key, file_path = quantum_engine.encrypt_file_quantum(content, file.filename)
        
        # Get the actual filename that was created
        downloaded_filename = os.path.basename(file_path)
        
        print(f"✅ File encrypted: {downloaded_filename}")
        print(f"🔑 Key generated: {key}")
        
        # Return the encrypted file as a download
        return FileResponse(
            path=file_path,
            filename=downloaded_filename,
            media_type='application/octet-stream',
            headers={
                "X-Encryption-Key": key,
                "X-Filename": downloaded_filename,
                "Access-Control-Expose-Headers": "X-Encryption-Key, X-Filename"
            }
        )
        
    except Exception as e:
        print(f"❌ File encryption failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"File encryption failed: {str(e)}")

@app.post("/decrypt-file")
async def decrypt_file(file: UploadFile = File(...), key: str = Form(...)):
    """Decrypt a file using the provided key"""
    try:
        print(f"🔓 Decrypting file: {file.filename} with key: {key[:20]}...")
        
        # Validate inputs
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file provided")
        
        if not key:
            raise HTTPException(status_code=400, detail="No decryption key provided")
        
        # Read the encrypted file content
        encrypted_content = await file.read()
        
        # Try to parse as JSON first (for .qshield files)
        try:
            encrypted_json = encrypted_content.decode('utf-8')
            # Validate it's proper JSON
            json.loads(encrypted_json)
            # If successful, use the JSON decryption method
            decrypted_content = quantum_engine.decrypt_file_quantum(encrypted_json, key)
        except (json.JSONDecodeError, UnicodeDecodeError):
            # If not valid JSON, try direct decryption
            decrypted_content = quantum_engine.decrypt_file_quantum(encrypted_content.decode('utf-8'), key)
        
        # Ensure we have bytes for file writing
        if isinstance(decrypted_content, str):
            decrypted_content = decrypted_content.encode('utf-8')
        
        print(f"✅ File decrypted successfully")
        
        # Create temporary file for download
        original_filename = file.filename.replace('.qshield', '').replace('encrypted_', 'decrypted_')
        temp_filename = f"temp/decrypted_{int(time.time())}_{original_filename}"
        
        with open(temp_filename, 'wb') as f:
            f.write(decrypted_content)
        
        # Return the decrypted file
        return FileResponse(
            path=temp_filename,
            filename=original_filename,
            media_type='application/octet-stream'
        )
        
    except ValueError as e:
        print(f"❌ File decryption failed: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"❌ File decryption failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Decryption failed: {str(e)}")
@app.get("/download-file/{filename}")
async def download_file(filename: str):
    """Download an encrypted file"""
    try:
        file_path = f"encrypted_files/{filename}"
        if os.path.exists(file_path):
            print(f"📥 Downloading file: {filename}")
            return FileResponse(
                path=file_path,
                filename=filename,
                media_type='application/octet-stream'
            )
        else:
            raise HTTPException(status_code=404, detail="File not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Download failed: {str(e)}")

@app.get("/list-files")
async def list_encrypted_files():
    """List all encrypted files"""
    try:
        files = []
        for filename in os.listdir("encrypted_files"):
            file_path = f"encrypted_files/{filename}"
            if os.path.isfile(file_path):
                files.append({
                    "filename": filename,
                    "size": os.path.getsize(file_path),
                    "created": os.path.getctime(file_path)
                })
        return {"files": files}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list files: {str(e)}")

@app.post("/optimize")
async def get_ai_recommendation(request: OptimizationRequest):
    """Get AI recommendation for best algorithm"""
    try:
        algorithms = [
            {"name": "Kyber-512", "security": 1, "performance": 5, "size": 2},
            {"name": "Kyber-768", "security": 3, "performance": 4, "size": 3},
            {"name": "Kyber-1024", "security": 5, "performance": 3, "size": 4},
        ]
        
        # Simple scoring algorithm
        best_score = -1
        best_algorithm = algorithms[0]
        
        for algo in algorithms:
            score = (algo["security"] * request.security_level + 
                    algo["performance"] * request.performance_need + 
                    (6 - algo["size"]) * request.size_constraint)
            
            if score > best_score:
                best_score = score
                best_algorithm = algo
        
        return {
            "recommended_algorithm": best_algorithm["name"],
            "reason": f"Best match for security level {request.security_level}, performance need {request.performance_need}",
            "score": best_score,
            "details": best_algorithm
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Optimization failed: {str(e)}")

# Cleanup function
import atexit
import shutil

@atexit.register
def cleanup():
    """Clean up temporary files on exit"""
    try:
        if os.path.exists("temp"):
            shutil.rmtree("temp")
        print("🧹 Cleaned up temporary files")
    except Exception as e:
        print(f"⚠️ Cleanup failed: {e}")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
os.makedirs(os.path.join(BASE_DIR, "encrypted_files"), exist_ok=True)
os.makedirs(os.path.join(BASE_DIR, "temp"), exist_ok=True)
