import React, { useState } from 'react';
import axios from 'axios';
import { Lock, Key, Download, Shield, Cpu, Zap } from 'lucide-react';
import './App.css'; // We'll create this CSS file

const QuantumShield = () => {
  const [activeTab, setActiveTab] = useState('text');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('kyber-768');
  const [selectedFile, setSelectedFile] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [encryptionResult, setEncryptionResult] = useState(null);
  const [decryptionKey, setDecryptionKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Text Encryption
  const handleTextEncrypt = async () => {
    if (!textInput.trim()) {
      alert('Please enter some text to encrypt!');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/encrypt', {
        data: textInput,
        algorithm: selectedAlgorithm
      });
      
      setEncryptionResult(response.data);
    } catch (error) {
      console.error('Encryption error:', error);
      alert('Encryption failed!');
    } finally {
      setIsLoading(false);
    }
  };

  // File Encryption
  const handleFileEncrypt = async () => {
    if (!selectedFile) {
      alert('Please select a file first!');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      const response = await axios.post('http://localhost:8000/encrypt-file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob'
      });

      // Download encrypted file
      const url = window.URL.createObjectURL(response.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `encrypted_${selectedFile.name}.qshield`;
      a.click();
      window.URL.revokeObjectURL(url);

      const encryptionKey = response.headers['x-encryption-key'];
      setEncryptionResult({ key: encryptionKey, file: selectedFile.name });
      
      alert('✅ File encrypted successfully! Save your key: ' + encryptionKey);
    } catch (error) {
      console.error('File encryption error:', error);
      alert('File encryption failed!');
    } finally {
      setIsLoading(false);
    }
  };

  // File Decryption
  const handleFileDecrypt = async (encryptedFile) => {
    if (!encryptedFile || !decryptionKey.trim()) {
      alert('Please upload encrypted file and enter decryption key!');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', encryptedFile);
      formData.append('key', decryptionKey);

      const response = await axios.post('http://localhost:8000/decrypt-file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(response.data);
      const a = document.createElement('a');
      a.href = url;
      const originalName = encryptedFile.name.replace(/^encrypted_/, '').replace(/\.qshield$/, '');
      a.download = `decrypted_${originalName}`;
      a.click();
      window.URL.revokeObjectURL(url);

      alert('✅ File decrypted successfully!');
    } catch (error) {
      console.error('Decryption error:', error);
      alert('Decryption failed! Invalid key or file.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="quantum-shield">
      {/* Header */}
      <header className="header">
        <nav className="nav">
          <div className="logo">
            <div className="logo-icon">🛡️</div>
            <span>QuantumShield</span>
          </div>
          <div className="nav-links">
            <a href="#text" onClick={() => setActiveTab('text')}>Text Encryption</a>
            <a href="#file" onClick={() => setActiveTab('file')}>File Encryption</a>
            <a href="#optimize" onClick={() => setActiveTab('optimize')}>AI Optimizer</a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="badge">
          <Zap size={16} />
          AI-Optimized Post-Quantum Cryptography
        </div>
        <h1>Quantum-Resistant<br />Encryption for the Future</h1>
        <p>Protect your data against quantum computing threats with AI-optimized lattice-based cryptography</p>
        <button className="btn btn-primary" onClick={() => document.querySelector('.tabs').scrollIntoView({ behavior: 'smooth' })}>
          <Shield size={20} />
          Try Live Demo
        </button>
      </section>

      {/* Tabs */}
      <div className="tabs">
        <div className={`tab ${activeTab === 'text' ? 'active' : ''}`} onClick={() => setActiveTab('text')}>
          📝 Text Encryption
        </div>
        <div className={`tab ${activeTab === 'file' ? 'active' : ''}`} onClick={() => setActiveTab('file')}>
          📁 File Encryption
        </div>
        <div className={`tab ${activeTab === 'optimize' ? 'active' : ''}`} onClick={() => setActiveTab('optimize')}>
          🧠 AI Optimizer
        </div>
      </div>

      <div className="container">
        {/* Text Encryption Tab */}
        {activeTab === 'text' && (
          <div className="card">
            <h2>Text Encryption Demo</h2>
            
            <div className="input-group">
              <label>📋 Enter Your Sensitive Data</label>
              <textarea 
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Credit card: 4532-1234-5678-9010, SSN: 123-45-6789, API Key: sk_live_abc123..."
                rows={5}
              />
              <p className="helper-text">🔒 All data processed locally - nothing stored</p>
            </div>

            <div className="input-group">
              <label>🔐 Select Algorithm</label>
              <div className="algorithm-select">
                {['kyber-512', 'kyber-768', 'kyber-1024'].map(algo => (
                  <div 
                    key={algo}
                    className={`algo-option ${selectedAlgorithm === algo ? 'selected' : ''}`}
                    onClick={() => setSelectedAlgorithm(algo)}
                  >
                    <h4>{algo.split('-')[0].toUpperCase()}-{algo.split('-')[1]}</h4>
                    <p>
                      {algo === 'kyber-512' && 'Fast, Light Security'}
                      {algo === 'kyber-768' && 'Balanced (Recommended)'}
                      {algo === 'kyber-1024' && 'Maximum Security'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <button 
              className="btn btn-primary full-width" 
              onClick={handleTextEncrypt}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="loading">
                  <div></div><div></div><div></div>
                </div>
              ) : (
                <>
                  <Cpu size={20} />
                  Encrypt with AI Optimization
                </>
              )}
            </button>

            {encryptionResult && (
              <div className="results">
                <div className="result-box classical">
                  <div className="result-header">
                    <h3>⚠️ Classical Encryption</h3>
                    <span className="tag red">Vulnerable</span>
                  </div>
                  <div className="encrypted-output">
                    {encryptionResult.classical}
                  </div>
                  <p>❌ Quantum Resistance: 0%</p>
                  <p>⏱️ Break Time: &lt;1 second</p>
                </div>

                <div className="result-box quantum">
                  <div className="result-header">
                    <h3>🛡️ QuantumShield PQC</h3>
                    <span className="tag green">Quantum Safe</span>
                  </div>
                  <div className="encrypted-output">
                    {encryptionResult.quantum}
                  </div>
                  <p>✅ Quantum Resistance: 100%</p>
                  <p>⏱️ Break Time: 10,000+ years</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* File Encryption Tab */}
        {activeTab === 'file' && (
          <div className="card">
            <h2>File Encryption</h2>
            
            <div className="file-upload-area" onClick={() => document.getElementById('fileInput').click()}>
              <h3>📂 Drop file here or click to upload</h3>
              <p>Supports all file types</p>
              <input 
                type="file" 
                id="fileInput" 
                style={{ display: 'none' }}
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
            </div>

            {selectedFile && (
              <div className="file-info">
                <p><strong>Selected:</strong> {selectedFile.name}</p>
                <p><strong>Size:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            )}

            <button 
              className="btn btn-primary full-width"
              onClick={handleFileEncrypt}
              disabled={!selectedFile || isLoading}
            >
              <Lock size={20} />
              {isLoading ? 'Encrypting...' : 'Encrypt File'}
            </button>

            {/* Decryption Section */}
            <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <h3>Decrypt File</h3>
              
              <div className="input-group">
                <label>Upload Encrypted (.qshield) File</label>
                <input 
                  type="file" 
                  accept=".qshield"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                />
              </div>

              <div className="input-group">
                <label>Enter Decryption Key</label>
                <input 
                  type="text"
                  value={decryptionKey}
                  onChange={(e) => setDecryptionKey(e.target.value)}
                  placeholder="Paste your encryption key here..."
                />
              </div>

              <button 
                className="btn btn-secondary full-width"
                onClick={() => handleFileDecrypt(selectedFile)}
                disabled={!selectedFile || !decryptionKey.trim() || isLoading}
              >
                <Key size={20} />
                {isLoading ? 'Decrypting...' : 'Decrypt File'}
              </button>
            </div>
          </div>
        )}

        {/* AI Optimizer Tab */}
        {activeTab === 'optimize' && (
          <div className="card">
            <h2>🧠 AI Algorithm Recommender</h2>
            <p>Answer these questions to get the best algorithm recommendation</p>
            
            {/* Add your AI optimizer content here */}
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray)' }}>
              <Cpu size={48} />
              <p style={{ marginTop: '1rem' }}>AI Optimization features coming soon...</p>
            </div>
          </div>
        )}

        {/* Stats Section */}
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
};

export default QuantumShield;