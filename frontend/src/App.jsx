/* QuantumShield.css */
:root {
  --primary: #10b981;
  --primary-dark: #059669;
  --success: #34d399;
  --danger: #ef4444;
  --dark: #0f172a;
  --darker: #020617;
  --light: #f8fafc;
  --gray: #64748b;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.quantum-shield {
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, var(--darker) 0%, #064e3b 50%, var(--darker) 100%);
  color: var(--light);
  min-height: 100vh;
  position: relative;
}

/* Animated Background */
.quantum-shield::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(16, 185, 129, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(16, 185, 129, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: gridMove 20s linear infinite;
  pointer-events: none;
  z-index: 0;
}

@keyframes gridMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

/* Header */
.header {
  position: fixed;
  top: 0;
  width: 100%;
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(16, 185, 129, 0.2);
  z-index: 1000;
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--light);
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--primary), var(--success));
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
}

.nav-links a {
  color: var(--gray);
  text-decoration: none;
  font-weight: 600;
  margin: 0 1rem;
  transition: color 0.3s;
  position: relative;
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--primary);
  transition: width 0.3s;
}

.nav-links a:hover {
  color: var(--primary);
}

.nav-links a:hover::after {
  width: 100%;
}

/* Hero Section */
.hero {
  padding: 180px 0 100px;
  text-align: center;
  position: relative;
  z-index: 1;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(16, 185, 129, 0.15);
  color: var(--primary);
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 700;
  margin-bottom: 2rem;
  border: 1px solid rgba(16, 185, 129, 0.3);
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
  animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
  50% { box-shadow: 0 0 40px rgba(16, 185, 129, 0.5); }
}

.hero h1 {
  font-size: 4.5rem;
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, var(--light) 0%, var(--primary) 50%, var(--success) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero p {
  font-size: 1.3rem;
  color: var(--gray);
  margin-bottom: 3rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, var(--primary), var(--success));
  color: white;
  border: none;
  padding: 1.25rem 2.5rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s;
  box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4);
  text-decoration: none;
}

.btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(16, 185, 129, 0.6);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background: linear-gradient(135deg, #6b7280, #9ca3af);
}

.btn-secondary:hover:not(:disabled) {
  box-shadow: 0 15px 40px rgba(107, 114, 128, 0.6);
}

.full-width {
  width: 100%;
  justify-content: center;
}

/* Tabs */
.tabs {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 4rem 0 3rem;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
}

.tab {
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: var(--gray);
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
}

.tab.active {
  background: rgba(16, 185, 129, 0.2);
  border-color: var(--primary);
  color: var(--primary);
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
}

.tab:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
}

/* Container */
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
}

/* Cards */
.card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 3rem;
  backdrop-filter: blur(20px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  transition: all 0.4s;
  margin-bottom: 2rem;
}

.card:hover {
  transform: translateY(-5px);
  border-color: rgba(16, 185, 129, 0.3);
  box-shadow: 0 30px 80px rgba(16, 185, 129, 0.2);
}

.card h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: var(--light);
}

/* Input Groups */
.input-group {
  margin-bottom: 2rem;
}

label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 700;
  color: var(--light);
  font-size: 1.1rem;
}

textarea, input[type="text"], input[type="file"] {
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.25rem;
  color: var(--light);
  font-size: 1rem;
  font-family: 'Inter', sans-serif;
  transition: all 0.3s;
}

textarea {
  min-height: 150px;
  resize: vertical;
}

textarea:focus, input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2);
}

.helper-text {
  color: var(--success);
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

/* Algorithm Select */
.algorithm-select {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.algo-option {
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
}

.algo-option.selected {
  border-color: var(--primary);
  background: rgba(16, 185, 129, 0.1);
}

.algo-option:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
}

.algo-option h4 {
  color: var(--light);
  margin-bottom: 0.5rem;
}

.algo-option p {
  font-size: 0.85rem;
  color: var(--gray);
}

/* File Upload */
.file-upload-area {
  border: 3px dashed rgba(16, 185, 129, 0.3);
  border-radius: 16px;
  padding: 3rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 2rem;
}

.file-upload-area:hover {
  border-color: var(--primary);
  background: rgba(16, 185, 129, 0.05);
}

.file-info {
  background: rgba(0, 0, 0, 0.3);
  padding: 1.5rem;
  border-radius: 12px;
  margin: 2rem 0;
}

/* Results */
.results {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin: 3rem 0;
}

.result-box {
  padding: 2rem;
  background: rgba(0, 0, 0, 0.3);
  border: 2px solid;
  border-radius: 16px;
  position: relative;
  overflow: hidden;
}

.result-box.classical {
  border-color: rgba(239, 68, 68, 0.4);
}

.result-box.quantum {
  border-color: rgba(16, 185, 129, 0.4);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.tag {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.tag.red {
  background: rgba(239, 68, 68, 0.2);
  color: var(--danger);
}

.tag.green {
  background: rgba(16, 185, 129, 0.2);
  color: var(--primary);
}

.encrypted-output {
  background: rgba(0, 0, 0, 0.5);
  padding: 1rem;
  border-radius: 8px;
  font-family: 'Monaco', monospace;
  font-size: 0.85rem;
  word-break: break-all;
  margin: 1rem 0;
  max-height: 200px;
  overflow-y: auto;
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin: 4rem 0;
}

.stat-card {
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  border-color: var(--primary);
}

.stat-value {
  font-size: 3rem;
  font-weight: 900;
  color: var(--primary);
  margin-bottom: 0.5rem;
}

.stat-card p {
  color: var(--gray);
}

/* Loading Animation */
.loading {
  display: inline-flex;
  gap: 0.5rem;
}

.loading div {
  width: 10px;
  height: 10px;
  background: white;
  border-radius: 50%;
  animation: bounce 1.4s ease-in-out infinite both;
}

.loading div:nth