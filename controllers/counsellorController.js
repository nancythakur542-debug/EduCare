const Appointment = require('../models/Appointment');
const RiskAlert = require('../models/RiskAlert');
const WellbeingCheckIn = require('../models/WellbeingCheckIn');
const User = require('../models/User');

const renderDashboard = async (req, res) => {
    try {
        const counsellorId = req.session.user.id;
        const appointments = await Appointment.find({ counsellor: counsellorId, status: 'Scheduled' }).populate('student').sort({ date: 1 });
        const riskAlerts = await RiskAlert.find({ reviewStatus: 'Pending' }).populate('student').sort({ createdAt: -1 });
        const assignedStudents = await User.find({ assignedCounsellor: counsellorId });

        res.render('counsellor/dashboard', {
            appointments,
            riskAlerts,
            assignedStudents
        });
    } catch (error) {
        res.status(500).render('pages/error', { message: 'Error loading counsellor dashboard' });
    }
};

const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, followUpStatus, notes } = req.body;
        await Appointment.findByIdAndUpdate(id, { status, followUpStatus, notes });
        res.redirect('/counsellor/dashboard');
    } catch (error) {
        res.status(500).render('pages/error', { message: 'Error updating appointment' });
    }
};

const reviewRiskAlert = async (req, res) => {
    try {
        const { id } = req.params;
        const { reviewStatus, counsellorNotes } = req.body;
        await RiskAlert.findByIdAndUpdate(id, { reviewStatus, counsellorNotes });
        res.redirect('/counsellor/dashboard');
    } catch (error) {
        res.status(500).render('pages/error', { message: 'Error reviewing risk alert' });
    }
};

const renderStudentDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await User.findById(id);
        const checkIns = await WellbeingCheckIn.find({ student: id }).sort({ createdAt: -1 });
        const alerts = await RiskAlert.find({ student: id }).sort({ createdAt: -1 });
        res.render('counsellor/students', { student, checkIns, alerts });
    } catch (error) {
        res.status(500).render('pages/error', { message: 'Error loading student records' });
    }
};

module.exports = {
    renderDashboard,
    updateAppointmentStatus,
    reviewRiskAlert,
    renderStudentDetails
};