// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import QuantumShield from "./App.jsx";
import './App.css';

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<QuantumShield />);
