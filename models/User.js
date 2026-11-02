const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'counsellor', 'admin'], default: 'student' },
    department: { type: String, trim: true },
    studentId: { type: String, trim: true },
    specialization: { type: String, trim: true },
    assignedCounsellor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);