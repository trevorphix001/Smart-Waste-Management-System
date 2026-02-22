const mongoose = require('mongoose');

const BinSchema = new mongoose.Schema({
    serialNumber: { type: String, required: true, unique: true },
    location: {
        type: { type: String, default: 'Point' },
        coordinates: [Number] // [Longitude, Latitude]
    },
    fillLevel: { type: Number, default: 0 },
    status: { type: String, enum: ['Active', 'Critical', 'Maintenance'], default: 'Active' },
    lastCollection: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Bin', BinSchema);