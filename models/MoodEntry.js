const mongoose = require('mongoose');

const moodEntrySchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mood: { type: String, enum: ['Very Happy', 'Calm', 'Neutral', 'Stressed', 'Sad', 'Anxious'], required: true },
    note: { type: String, trim: true },
    score: { type: Number, required: true, min: 1, max: 5 }
}, { timestamps: true });

module.exports = mongoose.model('MoodEntry', moodEntrySchema);