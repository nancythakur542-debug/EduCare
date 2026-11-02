const User = require('../models/User');
const MoodEntry = require('../models/MoodEntry');
const WellbeingCheckIn = require('../models/WellbeingCheckIn');
const Appointment = require('../models/Appointment');
const RiskAlert = require('../models/RiskAlert');

const renderDashboard = async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalCounsellors = await User.countDocuments({ role: 'counsellor' });
        const totalMoodEntries = await MoodEntry.countDocuments();
        const totalCheckIns = await WellbeingCheckIn.countDocuments();
        const totalAppointments = await Appointment.countDocuments();
        const activeAlerts = await RiskAlert.countDocuments({ reviewStatus: 'Pending' });

        const moodDistribution = await MoodEntry.aggregate([
            { $group: { _id: '$mood', count: { $sum: 1 } } }
        ]);

        const avgStress = await WellbeingCheckIn.aggregate([
            { $group: { _id: null, avgStress: { $avg: '$stressLevel' }, avgSleep: { $avg: '$sleepQuality' }, avgAcademic: { $avg: '$academicPressure' } } }
        ]);

        res.render('admin/dashboard', {
            totalStudents,
            totalCounsellors,
            totalMoodEntries,
            totalCheckIns,
            totalAppointments,
            activeAlerts,
            moodDistribution,
            averages: avgStress[0] || { avgStress: 0, avgSleep: 0, avgAcademic: 0 }
        });
    } catch (error) {
        res.status(500).render('pages/error', { message: 'Error loading admin dashboard' });
    }
};

module.exports = { renderDashboard };