const mongoose = require('mongoose');

const wellbeingCheckInSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    stressLevel: { type: Number, required: true, min: 1, max: 5 },
    sleepQuality: { type: Number, required: true, min: 1, max: 5 },
    academicPressure: { type: Number, required: true, min: 1, max: 5 },
    emotionalWellbeing: { type: Number, required: true, min: 1, max: 5 },
    generalMood: { type: String, required: true },
    riskScore: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('WellbeingCheckIn', wellbeingCheckInSchema);