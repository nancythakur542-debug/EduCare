const mongoose = require('mongoose');

const riskAlertSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    riskLevel: { type: Number, required: true, min: 1, max: 4 },
    reason: { type: String, required: true },
    source: { type: String, enum: ['CheckIn', 'Chat', 'Mood'], required: true },
    reviewStatus: { type: String, enum: ['Pending', 'Reviewed', 'Escalated'], default: 'Pending' },
    counsellorNotes: { type: String, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('RiskAlert', riskAlertSchema);