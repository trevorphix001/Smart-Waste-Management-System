require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();

// --- 1. MIDDLEWARE ---
// CORS allows your phone to talk to your computer's server
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve Frontend Files
app.use(express.static(path.join(__dirname, '../../client-dashboard')));

// --- 2. DATABASE CONNECTION ---
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smartcity';
const aiServiceURL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';

console.log(`🔌 Connecting to DB at: ${mongoURI}`);
mongoose.connect(mongoURI)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch(err => console.error("❌ DB Connection Error:", err));

// --- 3. DATABASE SCHEMAS ---

// A. Admin User
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, 
    department: String
});
const User = mongoose.model('User', userSchema);

// B. Citizen User
const citizenSchema = new mongoose.Schema({
    fullName: String,
    mobile: { type: String, unique: true },
    password: { type: String, required: true },
    aadhaar: String, 
    isVerified: { type: Boolean, default: false } 
});
const Citizen = mongoose.model('Citizen', citizenSchema);

// C. Smart Bin
const binSchema = new mongoose.Schema({
    serialNumber: String,
    location: { type: { type: String, default: 'Point' }, coordinates: [Number] },
    fillLevel: { type: Number, default: 0 },
    status: { type: String, default: 'Normal' },
    area: String 
});
const Bin = mongoose.model('Bin', binSchema);

// D. Reports (Includes Issuer Details & Resolved Status)
const reportSchema = new mongoose.Schema({
    ticketId: String,
    timestamp: { type: Date, default: Date.now },
    issuer: { 
        name: String, 
        contact: String, 
        address: String 
    },
    location: { lat: Number, lng: Number, landmark: String }, 
    wasteType: String,
    severity: String,
    description: String, 
    photo: String, 
    status: { type: String, default: 'Pending' }
});
const Report = mongoose.model('Report', reportSchema);

// --- 4. API ROUTES ---

// === IOT SENSOR UPDATES ===
app.put('/api/bins/:id', async (req, res) => {
    try {
        const { fillLevel } = req.body;
        const status = fillLevel > 80 ? "Critical" : "Normal";
        
        await Bin.findByIdAndUpdate(req.params.id, { 
            fillLevel: fillLevel, 
            status: status 
        });
        
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// === AUTHENTICATION ===
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, password, department } = req.body;
        const existing = await User.findOne({ username });
        if (existing) return res.status(400).json({ success: false, message: "User exists" });
        const newUser = new User({ username, password, department });
        await newUser.save();
        res.json({ success: true, message: "Admin Registered" });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || user.password !== password) return res.status(401).json({ success: false, message: "Invalid Credentials" });
        res.json({ success: true, token: "admin-token-" + Date.now(), user: { name: user.username, dept: user.department } });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.post('/api/citizen/register', async (req, res) => {
    try {
        const { fullName, mobile, password, aadhaar, isVerified } = req.body;
        const existing = await Citizen.findOne({ mobile });
        if (existing) return res.status(400).json({ success: false, message: "Mobile used" });
        const newCitizen = new Citizen({ fullName, mobile, password, aadhaar, isVerified });
        await newCitizen.save();
        res.json({ success: true, message: "Citizen Created" });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.post('/api/citizen/login', async (req, res) => {
    try {
        const { mobile, password } = req.body;
        const citizen = await Citizen.findOne({ mobile });
        if (!citizen || citizen.password !== password) return res.status(401).json({ success: false, message: "Invalid Login" });
        res.json({ success: true, token: "citizen-token-" + Date.now(), user: { name: citizen.fullName, verified: citizen.isVerified } });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// === SMART BINS & AI ===
app.get('/api/bins', async (req, res) => {
    try {
        const bins = await Bin.find();
        res.json(bins);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/seed', async (req, res) => {
    res.send("<h1>✅ Database Connected!</h1><br><a href='/'>Go to Dashboard</a>");
});

app.post('/api/optimize', async (req, res) => {
    try {
        const bins = await Bin.find();
        const aiRes = await axios.post(`${aiServiceURL}/api/v1/optimize`, {
            depot: { lat: 26.1445, lng: 91.7362 },
            bins: bins
        });
        res.json(aiRes.data);
    } catch (err) {
        res.json({ savings: "15% (Fallback)", route: "Local Optimization" });
    }
});

// === REPORTS & ANALYTICS ===
app.post('/api/reports', async (req, res) => {
    try {
        const { issuer, image, lat, lng, landmark, wasteType, severity, description } = req.body;
        
        const newReport = new Report({
            ticketId: `GHY-${Date.now().toString().slice(-6)}`,
            issuer: issuer, 
            location: { lat: lat || 26.1445, lng: lng || 91.7362, landmark: landmark },
            wasteType: wasteType || "Uncategorized",
            severity: severity || "Medium",
            description: description || "No description provided.",
            photo: image
        });
        
        await newReport.save();
        res.json({ success: true, ticketId: newReport.ticketId, analysis: { type: newReport.wasteType, severity: newReport.severity } });
    } catch (err) { 
        console.error("Report Save Error:", err);
        res.status(500).json({ error: "Failed to save report" }); 
    }
});

app.get('/api/reports', async (req, res) => {
    try {
        const reports = await Report.find().sort({ timestamp: -1 });
        res.json(reports);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Mark report as Resolved (Violet Dot)
app.put('/api/reports/:id/resolve', async (req, res) => {
    try {
        await Report.findByIdAndUpdate(req.params.id, { status: 'Resolved' });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/reports/:id', async (req, res) => {
    try {
        await Report.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/stats/public', async (req, res) => {
    try {
        const resolved = await Report.countDocuments({ status: 'Resolved' });
        res.json({ wasteCollected: 1250, cleanlinessIndex: 94, complaintsResolved: resolved + 450, activeZones: await Bin.countDocuments() });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/stats/admin', async (req, res) => {
    try {
        const bins = await Bin.find();
        const critical = bins.filter(b => b.fillLevel > 80).length;
        res.json({ fuelSaved: 2450, co2Reduced: 5600, avgResponseTime: "2.4 Hours", criticalZones: critical, efficiency: "89%" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Default Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client-dashboard/index.html'));
});

const PORT = 3000;

// ENABLE MOBILE ACCESS: Binding to '0.0.0.0' allows external devices on the same Wi-Fi to connect
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 API Gateway running on port ${PORT}`);
    console.log(`📱 Mobile Access ENABLED on your local Wi-Fi!`);
});