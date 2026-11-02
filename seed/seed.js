require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const MoodEntry = require('../models/MoodEntry');
const WellbeingCheckIn = require('../models/WellbeingCheckIn');
const Appointment = require('../models/Appointment');
const RiskAlert = require('../models/RiskAlert');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/educare');

        await User.deleteMany();
        await MoodEntry.deleteMany();
        await WellbeingCheckIn.deleteMany();
        await Appointment.deleteMany();
        await RiskAlert.deleteMany();

        const hashedPassword = await bcrypt.hash('password123', 10);

        const admin = await User.create({
            name: 'Dr. Administrator',
            email: 'admin@educare.in',
            password: hashedPassword,
            role: 'admin',
            department: 'Administration'
        });

        const counsellor = await User.create({
            name: 'Dr. Priya Sharma',
            email: 'counsellor@educare.in',
            password: hashedPassword,
            role: 'counsellor',
            department: 'Mental Health & Wellness',
            specialization: 'Student Counseling & Cognitive Support'
        });

        const student = await User.create({
            name: 'Aarav Patel',
            email: 'student@educare.in',
            password: hashedPassword,
            role: 'student',
            department: 'Computer Science',
            studentId: 'CS2026001',
            assignedCounsellor: counsellor._id
        });

        await MoodEntry.create({
            student: student._id,
            mood: 'Calm',
            note: 'Feeling peaceful after morning yoga session.',
            score: 4
        });

        await WellbeingCheckIn.create({
            student: student._id,
            stressLevel: 2,
            sleepQuality: 4,
            academicPressure: 3,
            emotionalWellbeing: 4,
            generalMood: 'Stable',
            riskScore: 1
        });

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        await Appointment.create({
            student: student._id,
            counsellor: counsellor._id,
            date: tomorrow,
            timeSlot: '10:00 AM',
            status: 'Scheduled',
            followUpStatus: 'Initial Consultation'
        });

        console.log('Database seeded successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedData();