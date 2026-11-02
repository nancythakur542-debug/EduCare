const MoodEntry = require('../models/MoodEntry');
const WellbeingCheckIn = require('../models/WellbeingCheckIn');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const ChatConversation = require('../models/ChatConversation');
const ChatMessage = require('../models/ChatMessage');
const { analyzeText, analyzeCheckIn } = require('../services/riskEngine');
const { getAIResponse } = require('../services/chatbotService');

const renderDashboard = async (req, res) => {
    try {
        const studentId = req.session.user.id;
        const todayMood = await MoodEntry.findOne({ student: studentId }).sort({ createdAt: -1 });
        const latestCheckIn = await WellbeingCheckIn.findOne({ student: studentId }).sort({ createdAt: -1 });
        const upcomingAppointment = await Appointment.findOne({ student: studentId, status: 'Scheduled' }).populate('counsellor');
        const moodHistory = await MoodEntry.find({ student: studentId }).sort({ createdAt: -1 }).limit(7);

        res.render('student/dashboard', {
            todayMood,
            latestCheckIn,
            upcomingAppointment,
            moodHistory
        });
    } catch (error) {
        res.status(500).render('pages/error', { message: 'Error loading dashboard' });
    }
};

const renderMoodTracker = async (req, res) => {
    try {
        const studentId = req.session.user.id;
        const moodHistory = await MoodEntry.find({ student: studentId }).sort({ createdAt: -1 });
        res.render('student/mood', { moodHistory });
    } catch (error) {
        res.status(500).render('pages/error', { message: 'Error loading mood tracker' });
    }
};

const saveMood = async (req, res) => {
    try {
        const { mood, note } = req.body;
        const moodScores = { 'Very Happy': 5, 'Calm': 4, 'Neutral': 3, 'Stressed': 2, 'Sad': 1, 'Anxious': 2 };
        const score = moodScores[mood] || 3;

        await MoodEntry.create({
            student: req.session.user.id,
            mood,
            note,
            score
        });

        if (mood === 'Sad' || mood === 'Anxious') {
            await analyzeText(req.session.user.id, `Feeling ${mood}: ${note || ''}`, 'Mood');
        }

        res.redirect('/student/mood');
    } catch (error) {
        res.status(500).render('pages/error', { message: 'Error saving mood' });
    }
};

const renderCheckIn = async (req, res) => {
    try {
        const studentId = req.session.user.id;
        const checkIns = await WellbeingCheckIn.find({ student: studentId }).sort({ createdAt: -1 });
        res.render('student/checkin', { checkIns });
    } catch (error) {
        res.status(500).render('pages/error', { message: 'Error loading check-ins' });
    }
};

const saveCheckIn = async (req, res) => {
    try {
        const { stressLevel, sleepQuality, academicPressure, emotionalWellbeing, generalMood } = req.body;
        const studentId = req.session.user.id;

        const { riskLevel, riskScore } = await analyzeCheckIn(studentId, {
            stressLevel: Number(stressLevel),
            sleepQuality: Number(sleepQuality),
            academicPressure: Number(academicPressure),
            emotionalWellbeing: Number(emotionalWellbeing)
        });

        await WellbeingCheckIn.create({
            student: studentId,
            stressLevel,
            sleepQuality,
            academicPressure,
            emotionalWellbeing,
            generalMood,
            riskScore
        });

        res.redirect('/student/checkin');
    } catch (error) {
        res.status(500).render('pages/error', { message: 'Error saving check-in' });
    }
};

const renderChat = async (req, res) => {
    try {
        let conversation = await ChatConversation.findOne({ student: req.session.user.id });
        if (!conversation) {
            conversation = await ChatConversation.create({ student: req.session.user.id });
        }
        const messages = await ChatMessage.find({ conversation: conversation._id }).sort({ createdAt: 1 });
        res.render('student/chat', { messages, conversationId: conversation._id });
    } catch (error) {
        res.status(500).render('pages/error', { message: 'Error loading chat support' });
    }
};

const sendMessage = async (req, res) => {
    try {
        const { message, conversationId } = req.body;
        const studentId = req.session.user.id;

        await ChatMessage.create({
            conversation: conversationId,
            sender: 'student',
            message
        });

        const riskLevel = await analyzeText(studentId, message, 'Chat');
        const aiResult = await getAIResponse(message);

        await ChatMessage.create({
            conversation: conversationId,
            sender: 'ai',
            message: aiResult.reply,
            riskDetected: riskLevel >= 3
        });

        res.json({ reply: aiResult.reply, crisis: aiResult.crisis });
    } catch (error) {
        res.status(500).json({ error: 'Error processing message' });
    }
};

const renderAppointments = async (req, res) => {
    try {
        const studentId = req.session.user.id;
        const counsellors = await User.find({ role: 'counsellor' });
        const appointments = await Appointment.find({ student: studentId }).populate('counsellor').sort({ date: 1 });
        res.render('student/appointments', { counsellors, appointments });
    } catch (error) {
        res.status(500).render('pages/error', { message: 'Error loading appointments' });
    }
};

const bookAppointment = async (req, res) => {
    try {
        const { counsellorId, date, timeSlot } = req.body;
        const studentId = req.session.user.id;

        const existing = await Appointment.findOne({ counsellor: counsellorId, date, timeSlot, status: 'Scheduled' });
        if (existing) {
            return res.status(400).redirect('/student/appointments?error=Slot+already+booked');
        }

        await Appointment.create({
            student: studentId,
            counsellor: counsellorId,
            date,
            timeSlot
        });

        res.redirect('/student/appointments');
    } catch (error) {
        res.status(500).render('pages/error', { message: 'Error booking appointment' });
    }
};

const cancelAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        await Appointment.findOneAndUpdate({ _id: id, student: req.session.user.id }, { status: 'Cancelled' });
        res.redirect('/student/appointments');
    } catch (error) {
        res.status(500).render('pages/error', { message: 'Error cancelling appointment' });
    }
};

module.exports = {
    renderDashboard,
    renderMoodTracker,
    saveMood,
    renderCheckIn,
    saveCheckIn,
    renderChat,
    sendMessage,
    renderAppointments,
    bookAppointment,
    cancelAppointment
};