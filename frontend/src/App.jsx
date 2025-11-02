// src/App.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Lock, Key, Download, Shield, Cpu, Zap, Copy, Check } from "lucide-react";
import "./App.css";
import config from "./config.js";

const QuantResult = ({ result }) => {
  if (!result) return null;
  return (
    <div className="results">
      <div className="result-box classical">
        <div className="result-header">
          <h3>⚠️ Classical Encryption</h3>
          <span className="tag red">Vulnerable</span>
        </div>
        <div className="encrypted-output">{result.classical}</div>
        <p>❌ Quantum Resistance: 0%</p>
      </div>

      <div className="result-box quantum">
        <div className="result-header">
          <h3>🛡️ QuantumShield PQC</h3>
          <span className="tag green">Quantum Safe</span>
        </div>
        <div className="encrypted-output">{result.quantum}</div>
        <p>✅ Quantum Resistance: {result.quantum_resistance ?? "100"}%</p>
        <p>⏱️ Processing time: {Math.round((result.processing_time || 0) * 1000)} ms</p>

        {result.ai_optimizations && result.ai_optimizations.length > 0 && (
          <div style={{ marginTop: "1rem" }}>
            <h4>AI Optimizations</h4>
            <ul>
              {result.ai_optimizations.map((opt, idx) => (
                <li key={idx}>
                  <strong>{opt.type}:</strong> {opt.improvement} — {opt.description}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default function QuantumShield() {
  const [activeTab, setActiveTab] = useState("text");
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("kyber-768");

  // For file encrypt vs decrypt keep separate states
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedDecryptFile, setSelectedDecryptFile] = useState(null);

  const [textInput, setTextInput] = useState("");
  const [encryptionResult, setEncryptionResult] = useState(null);
  const [decryptionKey, setDecryptionKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // store last key locally for convenience
  useEffect(() => {
    const lastKey = localStorage.getItem("qs:lastKey");
    if (lastKey) setDecryptionKey(lastKey);
  }, []);

  const saveKey = (k) => {
    if (!k) return;
    localStorage.setItem("qs:lastKey", k);
    setDecryptionKey(k);
  };

  // ---------- Text encryption (JSON) ----------
  const handleTextEncrypt = async () => {
    if (!textInput.trim()) {
      alert("Please enter some text to encrypt!");
      return;
    }
    setIsLoading(true);
    setEncryptionResult(null);
    try {
      const resp = await axios.post(
        `${config.API_BASE_URL}/encrypt`,
        { data: textInput, algorithm: selectedAlgorithm },
        { timeout: 60000 }
      );

      // Normalize backend shape into UI-friendly shape
      const data = resp.data || {};
      setEncryptionResult({
        classical: data.classical_encrypted || data.classical || "",
        quantum: data.quantum_encrypted || data.quantum || "",
        performance_gain: data.performance_gain,
        quantum_resistance: data.quantum_resistance,
        ai_optimizations: data.ai_optimizations || [],
        processing_time: data.processing_time,
      });

      // Fancy UI sparkle: briefly switch to optimize tab highlight (optional)
    } catch (err) {
      console.error("Encryption error:", err);
      alert("Encryption failed! See console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  // ---------- File encrypt (multipart to /encrypt-file) ----------
  const handleFileEncrypt = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }
    setIsLoading(true);
    setUploadProgress(0);
    try {
      const form = new FormData();
      form.append("file", selectedFile);
      form.append("algorithm", selectedAlgorithm);

      const resp = await axios.post(`${config.API_BASE_URL}/encrypt-file`, form, {
        headers: { "Content-Type": "multipart/form-data" },
        responseType: "blob",
        onUploadProgress: (evt) => {
          if (evt.total) {
            setUploadProgress(Math.round((evt.loaded / evt.total) * 100));
          }
        },
        timeout: 120000,
      });

      // Download blob
      const blobUrl = window.URL.createObjectURL(resp.data);
      const a = document.createElement("a");
      a.href = blobUrl;

      // prefer lowercase header keys but try multiple forms
      const key =
        resp.headers["x-encryption-key"] ||
        resp.headers["X-Encryption-Key"] ||
        resp.headers["x-encryption_key"] ||
        "";

      const filename =
        resp.headers["x-filename"] ||
        resp.headers["X-Filename"] ||
        `encrypted_${selectedFile.name}.qshield`;

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);

      // persist key and show it
      if (key) saveKey(key);
      setEncryptionResult({ key, file: filename });
      alert("✅ File encrypted — download started. Keep the key safe.");
    } catch (err) {
      console.error("File encryption error:", err);
      alert("File encryption failed! See console.");
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  // ---------- File decrypt (multipart to /decrypt-file) ----------
  const handleFileDecrypt = async () => {
    if (!selectedDecryptFile) {
      alert("Please select an encrypted .qshield file to decrypt!");
      return;
    }
    if (!decryptionKey.trim()) {
      alert("Please paste the decryption key!");
      return;
    }
    setIsLoading(true);
    try {
      const form = new FormData();
      form.append("file", selectedDecryptFile);
      form.append("key", decryptionKey);

      const resp = await axios.post(`${config.API_BASE_URL}/decrypt-file`, form, {
        headers: { "Content-Type": "multipart/form-data" },
        responseType: "blob",
        timeout: 120000,
      });

      // Download decrypted blob
      const blobUrl = window.URL.createObjectURL(resp.data);
      const a = document.createElement("a");
      a.href = blobUrl;

      const originalName =
        resp.headers["x-filename"] ||
        resp.headers["X-Filename"] ||
        selectedDecryptFile.name.replace(/^encrypted_/, "").replace(/\.qshield$/, "") ||
        "decrypted_file";

      a.download = originalName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);

      alert("✅ File decrypted successfully.");
    } catch (err) {
      console.error("Decryption error:", err);
      alert("Decryption failed! See console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  // ---------- AI Optimizer: interactive UI ----------
  const [optSecurity, setOptSecurity] = useState(4);
  const [optPerformance, setOptPerformance] = useState(3);
  const [optSize, setOptSize] = useState(3);
  const [optResult, setOptResult] = useState(null);
  const handleOptimize = async () => {
    setIsLoading(true);
    setOptResult(null);
    try {
      const resp = await axios.post(`${config.API_BASE_URL}/optimize`, {
        security_level: optSecurity,
        performance_need: optPerformance,
        size_constraint: optSize,
      });
      setOptResult(resp.data);
    } catch (err) {
      console.error("Optimize error:", err);
      alert("Optimization failed, see console.");
    } finally {
      setIsLoading(false);
    }
  };

  // ---------- UI helpers ----------
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard");
    } catch {
      alert("Copy failed — select and copy manually");
    }
  };

  return (
    <div className="quantum-shield">
      <header className="header">
        <nav className="nav">
          <div className="logo">
            <div className="logo-icon">🛡️</div>
            <span>QuantumShield</span>
          </div>
          <div className="nav-links">
            <a href="#text" onClick={() => setActiveTab("text")}>
              Text Encryption
            </a>
            <a href="#file" onClick={() => setActiveTab("file")}>
              File Encryption
            </a>
            <a href="#optimize" onClick={() => setActiveTab("optimize")}>
              AI Optimizer
            </a>
          </div>
        </nav>
      </header>

      <section className="hero">
        <div className="badge">
          <Zap size={16} />
          AI-Optimized Post-Quantum Cryptography
        </div>
        <h1>
          Quantum-Resistant
          <br />
          Encryption for the Future
        </h1>
        <p>Protect your data against quantum computing threats with AI-optimized lattice-based cryptography</p>
        <button
          className="btn btn-primary"
          onClick={() => document.querySelector(".tabs").scrollIntoView({ behavior: "smooth" })}
        >
          <Shield size={20} /> Try Live Demo
        </button>
      </section>

      <div className="tabs">
        <div className={`tab ${activeTab === "text" ? "active" : ""}`} onClick={() => setActiveTab("text")}>
          📝 Text Encryption
        </div>
        <div className={`tab ${activeTab === "file" ? "active" : ""}`} onClick={() => setActiveTab("file")}>
          📁 File Encryption
        </div>
        <div className={`tab ${activeTab === "optimize" ? "active" : ""}`} onClick={() => setActiveTab("optimize")}>
          🧠 AI Optimizer
        </div>
      </div>

      <div className="container">
        {/* TEXT */}
        {activeTab === "text" && (
          <div className="card">
            <h2>Text Encryption Demo</h2>

            <div className="input-group">
              <label>📋 Enter Your Sensitive Data</label>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Credit card, SSN, API key..."
                rows={5}
              />
              <p className="helper-text">🔒 Data is sent to the API you configured</p>
            </div>

            <div className="input-group">
              <label>🔐 Select Algorithm</label>
              <div className="algorithm-select">
                {["kyber-512", "kyber-768", "kyber-1024"].map((algo) => (
                  <div
                    key={algo}
                    className={`algo-option ${selectedAlgorithm === algo ? "selected" : ""}`}
                    onClick={() => setSelectedAlgorithm(algo)}
                  >
                    <h4>{algo.toUpperCase()}</h4>
                    <p>
                      {algo === "kyber-512" && "Fast, Light Security"}
                      {algo === "kyber-768" && "Balanced (Recommended)"}
                      {algo === "kyber-1024" && "Maximum Security"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <button className="btn btn-primary full-width" onClick={handleTextEncrypt} disabled={isLoading}>
              {isLoading ? (
                <div className="loading">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              ) : (
                <>
                  <Cpu size={20} /> Encrypt with AI Optimization
                </>
              )}
            </button>

            <QuantResult result={encryptionResult} />
          </div>
        )}

        {/* FILE */}
        {activeTab === "file" && (
          <div className="card">
            <h2>File Encryption</h2>

            <div className="file-upload-area" onClick={() => document.getElementById("fileInput").click()}>
              <h3>📂 Drop file here or click to upload</h3>
              <p>Supports all file types</p>
              <input
                type="file"
                id="fileInput"
                style={{ display: "none" }}
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
            </div>

            {selectedFile && (
              <div className="file-info">
                <p>
                  <strong>Selected:</strong> {selectedFile.name}
                </p>
                <p>
                  <strong>Size:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
                {uploadProgress > 0 && <p>Uploading: {uploadProgress}%</p>}
              </div>
            )}

            <button className="btn btn-primary full-width" onClick={handleFileEncrypt} disabled={!selectedFile || isLoading}>
              <Lock size={20} />
              {isLoading ? "Encrypting..." : "Encrypt File"}
            </button>

            <div style={{ marginTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1rem" }}>
              <h3>Decrypt File</h3>

              <div className="input-group">
                <label>Upload Encrypted (.qshield)</label>
                <input type="file" accept=".qshield" onChange={(e) => setSelectedDecryptFile(e.target.files[0])} />
              </div>

              <div className="input-group">
                <label>Decryption Key</label>
                <input
                  type="text"
                  value={decryptionKey}
                  onChange={(e) => setDecryptionKey(e.target.value)}
                  placeholder="Paste key"
                />
                <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
                  <button className="btn" onClick={() => copyToClipboard(decryptionKey)} disabled={!decryptionKey}>
                    <Copy size={14} /> Copy Key
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setDecryptionKey("");
                      localStorage.removeItem("qs:lastKey");
                    }}
                  >
                    Clear Key
                  </button>
                </div>
              </div>

              <button
                className="btn btn-secondary full-width"
                onClick={handleFileDecrypt}
                disabled={!selectedDecryptFile || !decryptionKey.trim() || isLoading}
              >
                <Key size={20} />
                {isLoading ? "Decrypting..." : "Decrypt File"}
              </button>
            </div>
          </div>
        )}

        {/* OPTIMIZER */}
        {activeTab === "optimize" && (
          <div className="card">
            <h2>🧠 AI Algorithm Recommender</h2>
            <p>Choose priorities and get an AI-backed recommendation</p>

            <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
              <label>
                Security priority: {optSecurity}
                <input type="range" min="1" max="5" value={optSecurity} onChange={(e) => setOptSecurity(Number(e.target.value))} />
              </label>

              <label>
                Performance priority: {optPerformance}
                <input type="range" min="1" max="5" value={optPerformance} onChange={(e) => setOptPerformance(Number(e.target.value))} />
              </label>

              <label>
                Size priority: {optSize}
                <input type="range" min="1" max="5" value={optSize} onChange={(e) => setOptSize(Number(e.target.value))} />
              </label>

              <div style={{ display: "flex", gap: "1rem" }}>
                <button className="btn" onClick={handleOptimize} disabled={isLoading}>
                  {isLoading ? "Searching..." : "Recommend Algorithm"}
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setOptSecurity(4);
                    setOptPerformance(3);
                    setOptSize(3);
                    setOptResult(null);
                  }}
                >
                  Reset
                </button>
              </div>

              {optResult && (
                <div style={{ marginTop: "1rem" }}>
                  <h3>Recommended: {optResult.recommended_algorithm}</h3>
                  <p>{optResult.reason}</p>
                  <pre style={{ whiteSpace: "pre-wrap", marginTop: "0.5rem" }}>{JSON.stringify(optResult.details, null, 2)}</pre>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">$17.7T</div>
            <p>At Risk from Quantum Attacks</p>
          </div>
          <div className="stat-card">
            <div className="stat-value">100%</div>
            <p>Quantum Resistance</p>
          </div>
          <div className="stat-card">
            <div className="stat-value">75%</div>
            <p>Performance Improvement</p>
          </div>
          <div className="stat-card">
            <div className="stat-value">5-10yrs</div>
            <p>Until Quantum Threat</p>
          </div>
        </div>
      </div>
    </div>
  );
}
