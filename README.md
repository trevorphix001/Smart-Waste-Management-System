<div align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="MoHUA Emblem" height="80">
  <h1>🌍 Smart City Waste Management System 2.0</h1>
  <p><i>An AI-driven, IoT-integrated platform for predictive urban sanitation.</i></p>
  
  [![Internship](https://img.shields.io/badge/Microsoft_Elevate-AICTE_Capstone-blue?style=for-the-badge&logo=microsoft)](https://github.com/trevorphix001)
  [![Node.js](https://img.shields.io/badge/Node.js-v18+-success?style=flat-square&logo=node.js)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
  [![License](https://img.shields.io/badge/License-MIT-lightgrey?style=flat-square)](LICENSE)
</div>

<br/>

## 📖 Table of Contents
- [About the Project](#-about-the-project)
- [Live Statistics](#-live-statistics)
- [Key Modules](#-key-modules)
- [Gallery & UI Previews](#-gallery--ui-previews)
- [Tech Stack](#-tech-stack)
- [Local Installation](#-local-installation)
- [API Reference](#-api-reference)
- [Author](#-author)

---

## 💡 About the Project
Developed as part of the **Microsoft Elevate AICTE Internship (Jan 2026)**, this project digitalizes and optimizes urban waste management. By replacing static garbage collection schedules with dynamic, AI-optimized routing and real-time IoT sensor data, municipalities can reduce fuel costs by up to 30%, lower their carbon footprint, and maintain a higher civic cleanliness index.

---



## ⚙️ Key Modules

### 1. 🚦 Command & Control Dashboard (`index.html`)
- Live geospatial tracking of all city dustbins using Leaflet.js.
- Visual alerts: Red pulsing nodes for "Critical" bins (>80% full), Green for "Normal".
- 1-Click AI Route Optimization using Nearest Neighbor algorithms.

### 2. 📱 Citizen Grievance Portal (`report.html`)
- Mobile-first Progressive Web App (PWA) UI.
- Direct hardware access: Captures live photos and locks GPS coordinates instantly.
- Secure, encrypted submission queue.

### 3. 👮 Admin Redressal System (`admin_complaints.html`)
- Centralized queue for incoming citizen reports.
- One-click resolution updates the live city map, turning pending issues (Black dots) into resolved success markers (Violet dots).

### 4. 📈 Predictive Analytics (`admin_reports.html`)
- AI insights visualizing historical data vs. predicted fill-levels.
- Automated generation of Monthly Operational Reports (Fuel saved, CO2 reduced).

---

## 📸 Gallery & UI Previews

| Command Centre Live Map | Mobile Citizen App | Predictive Analytics |
| :---: | :---: | :---: |
| <img src="https://via.placeholder.com/C:\Users\ghosh\OneDrive\Pictures\Screenshots\Screenshot 2026-02-22 180238.png" width="250"> | <img src="https://via.placeholder.com/C:\Users\ghosh\OneDrive\Pictures\Screenshots\Screenshot 2026-02-22 221835.png" width="250"> | <img src="https://via.placeholder.com/C:\Users\ghosh\OneDrive\Pictures\Screenshots\Screenshot 2026-02-22 223834.png" width="250"> |

> *Note: Replace the placeholder image URLs above with direct links to your actual project screenshots once uploaded.*

---

## 💻 Tech Stack

**Frontend Architecture:**
* HTML5, CSS3, Vanilla JS
* Bootstrap 5 (Responsive Layouts)
* Leaflet.js (OpenStreetMap integration)
* Chart.js (Data visualization)

**Backend Architecture:**
* Node.js & Express.js (REST API Gateway)
* MongoDB & Mongoose (NoSQL Database)
* CORS & Body-Parser middlewares

**Simulation Layer:**
* Python 3.x (IoT edge device simulation & data streaming)

*  2. Setup the Backend Environment
Make sure MongoDB is installed and running locally on port 27017.

# Install Node dependencies
npm install express mongoose cors axios dotenv

# Start the Gateway
node api-gateway/src/server.js

3. Run the IoT Hardware Simulator
Open a second terminal window to start generating simulated sensor data.

cd sensors
pip install requests
python sensor_simulator.py

4. Open the App

Navigate to http://localhost:3000 in your desktop browser.

On your mobile phone, connect to the same Wi-Fi network, and visit http://<YOUR_COMPUTER_IPV4>:3000/report.html

📡 API Reference (Core Endpoints)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/bins` | Fetches real-time status and coordinates of all IoT bins |
| `PUT` | `/api/bins/:id` | Updates specific bin fill-level (Used by Python simulator) |
| `POST` | `/api/reports` | Submits a new citizen grievance with base64 image |
| `PUT` | `/api/reports/:id/resolve`| Marks a citizen complaint as successfully resolved |
| `POST` | `/api/optimize` | Triggers the AI routing algorithm |


👨‍💻 Author
Nirupam Ghosh B.Tech in Computer Science | The Assam Royal Global University
---

"Cleanliness is not a one-time act, but a continuous automated process."

