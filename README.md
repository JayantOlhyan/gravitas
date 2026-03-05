<div align="center">
  <img src="https://raw.githubusercontent.com/JayantOlhyan/gravitas/main/gravitas/public/vite.svg" alt="GRAVITAS Logo" width="100"/>
  <h1>GRAVITAS</h1>
  <p><strong>Next-Generation Space Hazard Intelligence Platform</strong></p>
  
  [![React](https://img.shields.io/badge/React-18.2.0-blue.svg?style=flat&logo=react)](https://reactjs.org/)
  [![Three.js](https://img.shields.io/badge/Three.js-WebGL-black.svg?style=flat&logo=three.js)](https://threejs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg?style=flat&logo=node.js)](https://nodejs.org/)
  [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
  [![Live Demo](https://img.shields.io/badge/Demo-Localhost_5174-orange.svg)]()
</div>

<br/>

GRAVITAS is an advanced, real-time analytics web application designed to monitor orbital debris, track Near-Earth Objects (NEOs), display space weather anomalies, and calculate collision risks for space missions using live NASA and CelesTrak data. 

With a dark-themed, glassmorphic "mission control" UI, GRAVITAS transforms complex orbital mechanics and astronomy data into intuitive, actionable visualizations.

---

## 🌌 Core Features

### 1. **Interactive 3D Earth Globe**
- Rendered using **Three.js** (`@react-three/fiber` and `@react-three/drei`).
- Visualizes up to **27,000+ live satellite and debris objects** simultaneously using high-performance `InstancedMesh`.
- Calculates accurate object altitude mappings, orbital paths, and color-coded threat vectors instantly.

### 2. **Collision Risk Engine & Mission Window Optimizer**
- Analyzes upcoming launches against current space catalogs.
- Cross-references Target Altitude, Inclination, algorithms against background solar flare likelihood.
- Displays computed "Safe Windows" for satellite deployments using a custom heuristic risk scorer.

### 3. **Near-Earth Object (NEO) Tracking**
- Real-time fetching of NASA's `NeoWs` CNEOS database.
- Tracks asteroid approaching velocity, estimated diameters, and missed distances (in Astronomical Units) within a dynamic 7-day timeline.
- Flagging system for *Potentially Hazardous Asteroids*.

### 4. **Live Space Weather Radar**
- Live pulling from NASA `DONKI` API.
- Dynamic Recharts integrations showing GOES X-Ray Flux solar flare intensity.
- Alert monitors for Coronal Mass Ejections (CMEs) and Geomagnetic Storms (Kp Index).

### 5. **Virtualized Debris Catalog**
- Rendering massive datasets effortlessly using `react-window` for optimal 60FPS DOM scroll performance.
- Searchable by localized NORAD IDs or Object Designation.

---

## 🛠 Technology Stack

### **Frontend (`/gravitas`)**
- **Framework**: React 18, Vite
- **Styling**: Tailwind CSS, PostCSS, native Glassmorphism CSS variables
- **State Management**: Zustand, React Query (`@tanstack/react-query`)
- **3D / Visualization**: Three.js, React Three Fiber, Recharts
- **Animation**: Framer Motion

### **Backend API (`/gravitas-api`)**
- **Framework**: Node.js, Express.js
- **Middleware**: Helmet (Security), CORS, Express Rate Limit, node-cache (API quota protection)
- **Math / Astrodynamics**: `satellite.js` (TLE propagator predicting orbital coordinates)
- **Data Sources**: NASA Open APIs, CelesTrak active REST lists

---

## 🚀 Local Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.x or higher recommended)
- Git
- A [NASA API Key](https://api.nasa.gov/) (Demo limits work temporarily, but a dedicated key is recommended).

### 1. Clone the Repository
```bash
git clone https://github.com/JayantOlhyan/gravitas.git
cd gravitas
```

### 2. Configure the Backend (Express API)
```bash
cd gravitas-api
npm install
```

Create a `.env` file in the `gravitas-api` directory:
```env
NASA_API_KEY=YOUR_NASA_API_KEY_HERE
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5174
CACHE_TTL_DEBRIS=3600
CACHE_TTL_NEO=1800
CACHE_TTL_WEATHER=1800
```
Start the backend server:
```bash
npm start
# Expected output: GRAVITAS API Server running on port 3001
```

### 3. Configure the Frontend (Vite App)
In a new terminal split/window:
```bash
cd gravitas
npm install
```

Create a `.env` file in the `gravitas` directory (optional defaults provided in `api.js`):
```env
VITE_API_BASE_URL=http://localhost:3001
```

Start the Vite development server:
```bash
npm run dev
# The application will launch, usually on http://localhost:5174
```

---

## 📡 API Services Architecture

The frontend exclusively connects to the GRAVITAS Node Backend to eliminate exposing API keys directly in the client. The backend caches heavy NASA/CelesTrak arrays temporarily:

- **`GET /api/debris/list`**: Fetches active Earth-orbiting catalog parsed by `satellite.js`. (Cached for 1 hour).
- **`GET /api/neo/feed`**: Generates a fast 7-day approach mapping.
- **`GET /api/weather/current`**: Ingests active text alert logs regarding immediate Space Weather.

---

## 👨‍💻 Author

**Jayant Olhyan**
- GitHub: [@JayantOlhyan](https://github.com/JayantOlhyan)

*UI Design strictly honors a "Mission Control" paradigm—utilizing deep background canvases, sharp contrast neon typography, and minimal DOM obstructions.*
