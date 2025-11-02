import axios from "axios";
import { Download, Key, Lock } from "lucide-react";
import { useState } from "react";

export default function QuantumShieldFileEncryptor() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [encryptionResult, setEncryptionResult] = useState(null);
  const [encryptedFile, setEncryptedFile] = useState(null);
  const [decryptionKey, setDecryptionKey] = useState("");
  const [decryptedFile, setDecryptedFile] = useState(null);

  // === Encrypt file ===
const handleEncrypt = async () => {
  try {
    const blob = new Blob([fileContent], { type: "text/plain" });
    const file = new File([blob], fileName, { type: "text/plain" });

    const formData = new FormData();
    formData.append("file", file);
    
    const res = await axios.post("http://localhost:8000/encrypt-file", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      responseType: "blob", // so you can download the .qshield file directly
    });

    const encryptionKey = res.headers["x-encryption-key"];
    const downloadUrl = URL.createObjectURL(res.data);

    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `encrypted_${fileName}.qshield`;
    a.click();

    alert("✅ Encrypted successfully! Save your key:\n" + encryptionKey);
  } catch (err) {
    console.error(err);
    alert("❌ Encryption failed!");
  }
};


  // === Decrypt file ===
  const handleDecrypt = async () => {
    if (!encryptedFile || !decryptionKey.trim()) {
      alert("Please upload an encrypted .qshield file and enter your key!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", encryptedFile);
      formData.append("key", decryptionKey);

      const res = await axios.post("http://localhost:8000/decrypt-file", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        responseType: "blob", // expect binary output
      });

      // Download decrypted file
      const originalName = encryptedFile.name.replace(/^encrypted_/, "").replace(/\.qshield$/, "");
      const url = window.URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `decrypted_${originalName}`;
      a.click();
      window.URL.revokeObjectURL(url);

      setDecryptedFile(originalName);
      alert("✅ Decryption successful!");
    } catch (err) {
      console.error(err);
      alert("❌ Decryption failed. Invalid key or file.");
    }
  };

  return (
    <div className="container">
      <h2>QuantumShield File Encryptor</h2>

      {/* Upload Original File */}
      <div className="input-group">
        <label>Choose File to Encrypt</label>
        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          accept="*/*"
        />
      </div>

      <button onClick={handleEncrypt} className="btn btn-primary">
        <Lock size={18} /> Encrypt File
      </button>

      {encryptionResult && (
        <div className="result-container" style={{ marginTop: "2rem" }}>
          <h4>✅ Encrypted Successfully!</h4>
          <p>
            <strong>File:</strong> {encryptionResult.file}
          </p>
          <p>
            <strong>Encryption Key:</strong>{" "}
            <span style={{ color: "#10b981" }}>{encryptionResult.key}</span>
          </p>
          <p style={{ color: "#ef4444", fontSize: "0.9rem" }}>
            ⚠️ Save this key securely! You’ll need it to decrypt the file.
          </p>
        </div>
      )}

      <hr style={{ margin: "2rem 0", opacity: 0.2 }} />

      {/* Decryption Section */}
      <div className="decrypt-section">
        <h3>Decrypt File</h3>

        <div className="input-group">
          <label>Upload Encrypted (.qshield) File</label>
          <input
            type="file"
            accept=".qshield"
            onChange={(e) => setEncryptedFile(e.target.files[0])}
          />
        </div>

        <div className="input-group">
          <label>Enter Decryption Key</label>
          <input
            type="text"
            value={decryptionKey}
            onChange={(e) => setDecryptionKey(e.target.value)}
            placeholder="Paste your key here..."
          />
        </div>

        <button
          onClick={handleDecrypt}
          className="btn btn-secondary"
          disabled={!encryptedFile || !decryptionKey.trim()}
        >
          <Key size={18} /> Decrypt File
        </button>

        {decryptedFile && (
          <div style={{ marginTop: "1rem" }}>
            <p>
              ✅ Decrypted and downloaded as{" "}
              <strong>decrypted_{decryptedFile}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}