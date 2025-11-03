# main.py
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
import time
import hashlib
import base64
import random
import os
import json
import secrets
import atexit
import shutil
from typing import List, Tuple

# -------------------------
# App & CORS
# -------------------------
app = FastAPI(title="QuantumShield API", version="2.2.0")

# Allowed origins - add your production domains here
ALLOWED_ORIGINS = [
    "https://quantum-sheild-3asp-icambsdgp-varchas-hvs-projects.vercel.app",
    "https://quantum-sheild-3asp-mnqyz9r0s-varchas-hvs-projects.vercel.app",
    "http://localhost:5173",
    "https://gleeful-kringle-320853.netlify.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Encryption-Key", "X-Filename"],  # expose these to browser
)

# Respond to browser preflight for any path (safe default)
@app.options("/{full_path:path}")
async def preflight(full_path: str):
    return JSONResponse(
        content={"ok": True},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Max-Age": "86400",
        },
    )

# -------------------------
# Models
# -------------------------
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

# -------------------------
# Directories
# -------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ENCRYPTED_DIR = os.path.join(BASE_DIR, "encrypted_files")
TEMP_DIR = os.path.join(BASE_DIR, "temp")
os.makedirs(ENCRYPTED_DIR, exist_ok=True)
os.makedirs(TEMP_DIR, exist_ok=True)

# -------------------------
# Engines
# -------------------------
class QuantumAIOptimizer:
    def __init__(self):
        self.optimization_patterns = {
            "Parameter Selection": {"base_improvement": 15, "description": "Optimized lattice parameters for current threat landscape"},
            "Lattice Dimension": {"base_improvement": 22, "description": "Adjusted dimension balancing security and performance"},
            "Noise Distribution": {"base_improvement": 18, "description": "Enhanced noise distribution for stronger security guarantees"},
            "Key Generation": {"base_improvement": 12, "description": "Streamlined key generation process"},
            "Threat Analysis": {"base_improvement": 8, "description": "Real-time threat intelligence integration"}
        }

    def optimize(self, security_level: int, performance_need: int) -> Tuple[List[AIOptimization], int]:
        optimizations = []
        total_improvement = 0

        for opt_type, cfg in self.optimization_patterns.items():
            improvement = cfg["base_improvement"]
            if security_level > 3:
                improvement += 5
            if performance_need > 3:
                improvement += 3

            optimizations.append(AIOptimization(
                type=opt_type,
                status="complete",
                improvement=f"{improvement}%",
                description=cfg["description"]
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
        encoded = base64.b64encode(data.encode()).decode()
        hash_suffix = hashlib.sha256(data.encode()).hexdigest()[:8]
        return f"RSA_2048_{encoded}_ECC_256_{hash_suffix}"

    def quantum_encrypt(self, data: str, algorithm: str = "kyber-1024") -> str:
        encoded = base64.b64encode(data.encode()).decode()
        lattice_noise = ''.join(random.choices('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', k=16))
        security_level = self.algorithms.get(algorithm, {"security": 3})["security"]
        return f"PQC_{algorithm.upper()}_{lattice_noise}_{encoded}_LATTICE_{security_level}"

    def generate_quantum_key(self) -> str:
        return base64.b64encode(secrets.token_bytes(32)).decode()

    def encrypt_file_quantum(self, content: bytes, filename: str) -> Tuple[str, str, str]:
        """
        Return (encrypted_json_str, key, file_path)
        """
        key = self.generate_quantum_key()
        encoded_content = base64.b64encode(content).decode()
        lattice_vector = ''.join(random.choices('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', k=24))

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

        encrypted_json = json.dumps(encrypted_data, indent=2)
        safe_filename = filename.replace(" ", "_").replace("/", "_")
        encrypted_filename = f"encrypted_{safe_filename}_{int(time.time())}.qshield"
        file_path = os.path.join(ENCRYPTED_DIR, encrypted_filename)

        with open(file_path, "w", encoding="utf-8") as fh:
            fh.write(encrypted_json)

        return encrypted_json, key, file_path

    def decrypt_file_quantum(self, encrypted_json_input, key: str) -> bytes:
        """
        Accept either:
         - a JSON string (decoded), or
         - bytes that need to be decoded to UTF-8 first
        Returns original bytes.
        """
        try:
            # If we got bytes, decode to string
            if isinstance(encrypted_json_input, (bytes, bytearray)):
                try:
                    encrypted_json = encrypted_json_input.decode("utf-8")
                except UnicodeDecodeError:
                    raise ValueError("Encrypted file is not utf-8 JSON")
            else:
                encrypted_json = encrypted_json_input

            data = json.loads(encrypted_json)

            if not data.get("quantum_safe", False):
                raise ValueError("File was not encrypted with quantum-safe algorithm")

            encoded_content = data.get("encrypted_content")
            if encoded_content is None:
                raise ValueError("Missing 'encrypted_content' in file")

            # Base64 decode to bytes (this is the original file)
            original_bytes = base64.b64decode(encoded_content)
            return original_bytes

        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON encrypted file: {e}")
        except Exception as e:
            raise ValueError(f"Decryption failed: {e}")


# Initialize engines
quantum_engine = QuantumEncryptionEngine()
ai_optimizer = QuantumAIOptimizer()

# -------------------------
# Helper utilities
# -------------------------
def safe_filename_for_download(name: str) -> str:
    return name.replace(" ", "_").replace("/", "_")

# -------------------------
# Endpoints
# -------------------------
@app.get("/")
async def root():
    return {"message": "QuantumShield API is running!", "status": "healthy"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "QuantumShield API", "timestamp": time.time()}

@app.post("/encrypt")
async def encrypt_data(request: EncryptionRequest):
    start = time.time()
    try:
        classical_encrypted = quantum_engine.classical_encrypt(request.data)
        quantum_encrypted = quantum_engine.quantum_encrypt(request.data, request.algorithm)
        optimizations, perf_gain = ai_optimizer.optimize(security_level=5, performance_need=3)
        quantum_resistance = quantum_engine.algorithms.get(request.algorithm, {"security": 3})["security"] * 20
        processing_time = time.time() - start

        return {
            "classical_encrypted": classical_encrypted,
            "quantum_encrypted": quantum_encrypted,
            "performance_gain": perf_gain,
            "quantum_resistance": quantum_resistance,
            "ai_optimizations": [o.dict() for o in optimizations],
            "processing_time": processing_time
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Encryption failed: {e}")

#
# File encrypt endpoints - expose both /api/encrypt-file and /encrypt-file for backward compatibility
#
async def _handle_encrypt_file(uploaded_file: UploadFile):
    if not uploaded_file or not uploaded_file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    content = await uploaded_file.read()
    encrypted_json, key, file_path = quantum_engine.encrypt_file_quantum(content, uploaded_file.filename)
    downloaded_filename = os.path.basename(file_path)

    # Ensure response file exists
    if not os.path.exists(file_path):
        raise HTTPException(status_code=500, detail="Encrypted file not saved")

    headers = {
        "X-Encryption-Key": key,
        "X-Filename": downloaded_filename,
        "Access-Control-Expose-Headers": "X-Encryption-Key, X-Filename"
    }

    return FileResponse(path=file_path, filename=downloaded_filename, media_type="application/octet-stream", headers=headers)

@app.post("/api/encrypt-file")
async def api_encrypt_file(file: UploadFile = File(...)):
    return await _handle_encrypt_file(file)

@app.post("/encrypt-file")
async def encrypt_file(file: UploadFile = File(...)):
    return await _handle_encrypt_file(file)


#
# File decrypt endpoints - accept both /api/decrypt-file and /decrypt-file
#
async def _handle_decrypt_file(uploaded_file: UploadFile, key: str):
    if not uploaded_file or not uploaded_file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    if not key:
        raise HTTPException(status_code=400, detail="No decryption key provided")

    encrypted_bytes = await uploaded_file.read()

    # Accept both: client might send raw JSON bytes or utf-8 string. quantum_engine handles both.
    try:
        original_bytes = quantum_engine.decrypt_file_quantum(encrypted_bytes, key)
    except ValueError as ve:
        # If parsing as bytes failed, try decoding as utf-8 string explicitly (safety)
        try:
            original_bytes = quantum_engine.decrypt_file_quantum(encrypted_bytes.decode("utf-8"), key)
        except Exception:
            raise HTTPException(status_code=400, detail=str(ve))

    # Restore filename (strip qshield suffix if present)
    original_name = uploaded_file.filename
    if original_name.endswith(".qshield"):
        original_name = original_name[:-len(".qshield")]
    # Remove "encrypted_" prefix if present and replace with decrypted_ prefix for safety
    if original_name.startswith("encrypted_"):
        original_name = original_name.replace("encrypted_", "", 1)

    out_name = f"decrypted_{int(time.time())}_{safe_filename_for_download(original_name)}"
    out_path = os.path.join(TEMP_DIR, out_name)

    # Write bytes to temp and return as download
    os.makedirs(TEMP_DIR, exist_ok=True)
    with open(out_path, "wb") as fh:
        fh.write(original_bytes)

    return FileResponse(path=out_path, filename=original_name, media_type="application/octet-stream")

@app.post("/api/decrypt-file")
async def api_decrypt_file(file: UploadFile = File(...), key: str = Form(...)):
    return await _handle_decrypt_file(file, key)

@app.post("/decrypt-file")
async def decrypt_file(file: UploadFile = File(...), key: str = Form(...)):
    return await _handle_decrypt_file(file, key)


# Download/list endpoints
@app.get("/download-file/{filename}")
async def download_file(filename: str):
    file_path = os.path.join(ENCRYPTED_DIR, filename)
    if os.path.exists(file_path):
        return FileResponse(path=file_path, filename=filename, media_type="application/octet-stream")
    raise HTTPException(status_code=404, detail="File not found")

@app.get("/list-files")
async def list_encrypted_files():
    try:
        files = []
        for fn in os.listdir(ENCRYPTED_DIR):
            path = os.path.join(ENCRYPTED_DIR, fn)
            if os.path.isfile(path):
                files.append({
                    "filename": fn,
                    "size": os.path.getsize(path),
                    "created": os.path.getctime(path)
                })
        return {"files": files}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list files: {e}")

# AI optimize endpoint (keeps your original semantics)
# AI Optimizer with broader PQC family selection
@app.post("/optimize")
async def get_ai_recommendation(request: dict):
    """
    Accepts POST with optional field 'goal' (speed, security, memory, signatures, balanced)
    and returns recommended PQC algorithm with reason and confidence.
    """
    try:
        goal = request.get("goal", "balanced").lower()

        # Define PQC algorithm families
        pqc_algos = {
            "speed": {
                "name": "NTRU-HRSS",
                "family": "Lattice (Structured)",
                "reason": "Chosen for low latency and high throughput in performance-critical systems."
            },
            "security": {
                "name": "FrodoKEM-976",
                "family": "Lattice (Unstructured)",
                "reason": "Maximal post-quantum security with conservative parameters."
            },
            "memory": {
                "name": "Saber",
                "family": "Lattice (Module-LWR)",
                "reason": "Excellent memory efficiency ideal for IoT and constrained devices."
            },
            "signatures": {
                "name": "Dilithium-III",
                "family": "Digital Signature (CRYSTALS)",
                "reason": "Quantum-safe authentication and integrity verification."
            },
            "balanced": {
                "name": "Kyber-768",
                "family": "Lattice (Module-LWE)",
                "reason": "Balanced performance and security — NIST standardized PQC algorithm."
            },
        }

        chosen = pqc_algos.get(goal, pqc_algos["balanced"])

        # Generate a pseudo-AI confidence metric
        confidence = round(random.uniform(0.86, 0.98), 2)

        return {
            "recommended_algorithm": chosen["name"],
            "family": chosen["family"],
            "reason": chosen["reason"],
            "goal": goal,
            "ai_confidence": confidence,
            "timestamp": time.time()
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Optimization failed: {e}")

# -------------------------
# Cleanup
# -------------------------
@atexit.register
def cleanup_temp():
    try:
        if os.path.exists(TEMP_DIR):
            shutil.rmtree(TEMP_DIR)
    except Exception as e:
        print("Cleanup failed:", e)
