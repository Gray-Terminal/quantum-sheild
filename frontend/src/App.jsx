import axios from "axios";
import { Download, Key, Lock, Upload, Shield, AlertCircle } from "lucide-react";
import { useState, useRef } from "react";
import config from './config';

export default function QuantumShieldFileEncryptor() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [encryptionResult, setEncryptionResult] = useState(null);
  const [encryptedFile, setEncryptedFile] = useState(null);
  const [decryptionKey, setDecryptionKey] = useState("");
  const [decryptedFile, setDecryptedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fileInputRef = useRef();
  const encryptedFileInputRef = useRef();

  // Clear messages after 5 seconds
  const clearMessages = () => {
    setTimeout(() => {
      setError("");
      setSuccess("");
    }, 5000);
  };

  // Handle file selection for encryption
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError("");
      setEncryptionResult(null);
    }
  };

  // Handle encrypted file selection for decryption
  const handleEncryptedFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Basic validation for .qshield files
      if (!file.name.endsWith('.qshield')) {
        setError("Please select a valid .qshield encrypted file");
        return;
      }
      setEncryptedFile(file);
      setError("");
      setDecryptedFile(null);
    }
  };

  // Encrypt file
  const handleEncrypt = async () => {
    if (!selectedFile) {
      setError("Please select a file to encrypt");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      
      console.log("📤 Sending file for encryption:", selectedFile.name);
      
      const response = await fetch(`${config.API_BASE_URL}/encrypt-file`, {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      // Get encryption key from response headers
      const encryptionKey = response.headers.get("x-encryption-key");
      const filename = response.headers.get("x-filename");
      
      console.log("Encryption key:", encryptionKey);
      console.log("Filename:", filename);

      if (!encryptionKey) {
        throw new Error("No encryption key received from server");
      }

      // Download the encrypted file
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = filename || `encrypted_${selectedFile.name}.qshield`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Clean up URL
      URL.revokeObjectURL(downloadUrl);

      // Set encryption result
      setEncryptionResult({
        file: selectedFile.name,
        key: encryptionKey,
        encryptedFilename: filename || `encrypted_${selectedFile.name}.qshield`
      });

      setSuccess("File encrypted successfully! Save your encryption key securely.");
      clearMessages();
      
    } catch (err) {
      console.error("Encryption error:", err);
      if (err.message?.includes('422')) {
        setError("Invalid file format. Please try with a different file.");
      } else if (err.message?.includes('400')) {
        setError("Invalid request. Please check your file.");
      } else {
        setError(err.message || "Encryption failed. Please try again.");
      }
      clearMessages();
    } finally {
      setLoading(false);
    }
  };

  // Decrypt file
  const handleDecrypt = async () => {
    if (!encryptedFile) {
      setError("Please upload an encrypted .qshield file");
      clearMessages();
      return;
    }

    if (!decryptionKey.trim()) {
      setError("Please enter your decryption key");
      clearMessages();
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("file", encryptedFile);
      formData.append("key", decryptionKey.trim());

      console.log("🔓 Starting decryption...");

      const response = await fetch(`${config.API_BASE_URL}/decrypt-file`, {
        method: "POST",
        body: formData,
      });

      console.log("Decryption response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      // Download the decrypted file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Extract original filename
      const originalName = encryptedFile.name
        .replace(/^encrypted_/, "")
        .replace(/\.qshield$/, "");
      
      const a = document.createElement("a");
      a.href = url;
      a.download = `decrypted_${originalName}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setDecryptedFile(originalName);
      setSuccess("File decrypted successfully!");
      clearMessages();

      // Clear form
      setDecryptionKey("");
      setEncryptedFile(null);
      if (encryptedFileInputRef.current) {
        encryptedFileInputRef.current.value = "";
      }

    } catch (err) {
      console.error("Decryption error:", err);
      setError(err.message || "Decryption failed. Invalid key or file.");
      clearMessages();
    } finally {
      setLoading(false);
    }
  };

  // Copy key to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setSuccess("Key copied to clipboard!");
      clearMessages();
    }).catch(() => {
      setError("Failed to copy key to clipboard");
      clearMessages();
    });
  };

  // Reset form
  const resetForm = () => {
    setSelectedFile(null);
    setEncryptionResult(null);
    setEncryptedFile(null);
    setDecryptionKey("");
    setDecryptedFile(null);
    setError("");
    setSuccess("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (encryptedFileInputRef.current) encryptedFileInputRef.current.value = "";
  };

  return (
    <div className="quantum-shield-container">
      <div className="quantum-shield-header">
        <Shield className="quantum-shield-icon" size={32} />
        <h2>QuantumShield File Encryptor</h2>
        <p>Military-grade quantum-resistant file encryption</p>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="quantum-shield-alert quantum-shield-alert-error">
          <AlertCircle size={18} />
          {error}
        </div>
      )}
      
      {success && (
        <div className="quantum-shield-alert quantum-shield-alert-success">
          <Shield size={18} />
          {success}
        </div>
      )}

      {/* Encryption Section */}
      <div className="quantum-shield-section">
        <h3>🔒 Encrypt File</h3>
        
        <div className="quantum-shield-input-group">
          <label>
            <Upload size={16} />
            Choose File to Encrypt
          </label>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            accept="*/*"
            className="quantum-shield-file-input"
          />
          {selectedFile && (
            <div className="quantum-shield-file-info">
              Selected: <strong>{selectedFile.name}</strong> 
              ({(selectedFile.size / 1024).toFixed(2)} KB)
            </div>
          )}
        </div>

        <button 
          onClick={handleEncrypt} 
          className="quantum-shield-btn quantum-shield-btn-primary"
          disabled={!selectedFile || loading}
        >
          {loading ? (
            "⏳ Encrypting..."
          ) : (
            <>
              <Lock size={18} /> Encrypt File
            </>
          )}
        </button>

        {encryptionResult && (
          <div className="quantum-shield-result">
            <h4>✅ Encryption Successful!</h4>
            <div className="quantum-shield-result-details">
              <p><strong>Original File:</strong> {encryptionResult.file}</p>
              <p><strong>Encrypted File:</strong> {encryptionResult.encryptedFilename}</p>
              <div className="quantum-shield-key-section">
                <strong>Encryption Key:</strong>
                <div className="quantum-shield-key-display">
                  <code>{encryptionResult.key}</code>
                  <button 
                    onClick={() => copyToClipboard(encryptionResult.key)}
                    className="quantum-shield-btn-copy"
                    type="button"
                  >
                    Copy
                  </button>
                </div>
              </div>
              <div className="quantum-shield-warning">
                <AlertCircle size={16} />
                ⚠️ Save this key securely! You'll need it to decrypt the file.
              </div>
            </div>
          </div>
        )}
      </div>

      <hr className="quantum-shield-divider" />

      {/* Decryption Section */}
      <div className="quantum-shield-section">
        <h3>🔓 Decrypt File</h3>

        <div className="quantum-shield-input-group">
          <label>
            <Download size={16} />
            Upload Encrypted (.qshield) File
          </label>
          <input
            ref={encryptedFileInputRef}
            type="file"
            accept=".qshield"
            onChange={handleEncryptedFileSelect}
            className="quantum-shield-file-input"
          />
          {encryptedFile && (
            <div className="quantum-shield-file-info">
              Selected: <strong>{encryptedFile.name}</strong>
            </div>
          )}
        </div>

        <div className="quantum-shield-input-group">
          <label>
            <Key size={16} />
            Enter Decryption Key
          </label>
          <input
            type="text"
            value={decryptionKey}
            onChange={(e) => setDecryptionKey(e.target.value)}
            placeholder="Paste your encryption key here..."
            className="quantum-shield-key-input"
          />
        </div>

        <button
          onClick={handleDecrypt}
          className="quantum-shield-btn quantum-shield-btn-secondary"
          disabled={!encryptedFile || !decryptionKey.trim() || loading}
          type="button"
        >
          {loading ? (
            "⏳ Decrypting..."
          ) : (
            <>
              <Key size={18} /> Decrypt File
            </>
          )}
        </button>

        {decryptedFile && (
          <div className="quantum-shield-result">
            <h4>✅ Decryption Successful!</h4>
            <p>
              File downloaded as <strong>decrypted_{decryptedFile}</strong>
            </p>
          </div>
        )}
      </div>

      {/* Reset Button */}
      <div className="quantum-shield-footer">
        <button onClick={resetForm} className="quantum-shield-btn quantum-shield-btn-outline" type="button">
          Reset All
        </button>
      </div>

      <style>{`
        .quantum-shield-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        .quantum-shield-header {
          text-align: center;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .quantum-shield-icon {
          color: #10b981;
          margin-bottom: 1rem;
        }
        
        .quantum-shield-header h2 {
          color: #1f2937;
          margin-bottom: 0.5rem;
          font-size: 1.5rem;
          font-weight: 700;
        }
        
        .quantum-shield-header p {
          color: #6b7280;
          margin: 0;
          font-size: 0.95rem;
        }
        
        .quantum-shield-section {
          margin-bottom: 2rem;
        }
        
        .quantum-shield-section h3 {
          color: #374151;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.25rem;
          font-weight: 600;
        }
        
        .quantum-shield-input-group {
          margin-bottom: 1.5rem;
        }
        
        .quantum-shield-input-group label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
          font-size: 0.95rem;
        }
        
        .quantum-shield-file-input,
        .quantum-shield-key-input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 1rem;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }
        
        .quantum-shield-file-input:focus,
        .quantum-shield-key-input:focus {
          outline: none;
          border-color: #10b981;
        }
        
        .quantum-shield-key-input {
          font-family: 'Courier New', monospace;
        }
        
        .quantum-shield-file-info {
          margin-top: 0.5rem;
          padding: 0.5rem;
          background: #f8fafc;
          border-radius: 0.25rem;
          font-size: 0.9rem;
          color: #64748b;
        }
        
        .quantum-shield-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.5rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .quantum-shield-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .quantum-shield-btn-primary {
          background: #10b981;
          color: white;
        }
        
        .quantum-shield-btn-primary:hover:not(:disabled) {
          background: #059669;
          transform: translateY(-1px);
        }
        
        .quantum-shield-btn-secondary {
          background: #3b82f6;
          color: white;
        }
        
        .quantum-shield-btn-secondary:hover:not(:disabled) {
          background: #2563eb;
          transform: translateY(-1px);
        }
        
        .quantum-shield-btn-outline {
          background: transparent;
          border: 2px solid #e5e7eb;
          color: #6b7280;
        }
        
        .quantum-shield-btn-outline:hover {
          border-color: #d1d5db;
          background: #f9fafb;
        }
        
        .quantum-shield-btn-copy {
          padding: 0.25rem 0.75rem;
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          border-radius: 0.25rem;
          font-size: 0.8rem;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.2s;
        }
        
        .quantum-shield-btn-copy:hover {
          background: #e2e8f0;
        }
        
        .quantum-shield-result {
          margin-top: 1.5rem;
          padding: 1.5rem;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 0.5rem;
        }
        
        .quantum-shield-result h4 {
          color: #065f46;
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }
        
        .quantum-shield-result-details p {
          margin: 0.5rem 0;
          color: #374151;
        }
        
        .quantum-shield-key-section {
          margin: 1rem 0;
        }
        
        .quantum-shield-key-display {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }
        
        .quantum-shield-key-display code {
          flex: 1;
          padding: 0.5rem;
          background: #1e293b;
          color: #f1f5f9;
          border-radius: 0.25rem;
          font-family: 'Courier New', monospace;
          font-size: 0.9rem;
          word-break: break-all;
          overflow-x: auto;
        }
        
        .quantum-shield-warning {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1rem;
          padding: 0.75rem;
          background: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 0.25rem;
          color: #92400e;
          font-size: 0.9rem;
        }
        
        .quantum-shield-alert {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          border-radius: 0.5rem;
          margin-bottom: 1.5rem;
          font-weight: 500;
        }
        
        .quantum-shield-alert-error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
        }
        
        .quantum-shield-alert-success {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #16a34a;
        }
        
        .quantum-shield-divider {
          margin: 2rem 0;
          border: none;
          border-top: 1px solid #e5e7eb;
        }
        
        .quantum-shield-footer {
          text-align: center;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e5e7eb;
        }
      `}</style>
    </div>
  );
}