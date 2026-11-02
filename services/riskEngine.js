const RiskAlert = require('../models/RiskAlert');

const analyzeText = async (studentId, text, source) => {
    const lowerText = text.toLowerCase();
    const criticalKeywords = ['suicide', 'kill myself', 'end my life', 'hopeless', 'want to die', 'harm myself', 'hurt myself'];
    const severeKeywords = ['depressed', 'panic attack', 'worthless', 'cant take it', 'exhausted', 'overwhelming'];
    const moderateKeywords = ['stressed', 'anxious', 'tired', 'sad', 'worried', 'pressure'];

    let riskLevel = 1;
    let reason = 'General well-being state detected.';

    if (criticalKeywords.some(keyword => lowerText.includes(keyword))) {
        riskLevel = 4;
        reason = 'Critical crisis language detected requiring immediate intervention.';
    } else if (severeKeywords.some(keyword => lowerText.includes(keyword))) {
        riskLevel = 3;
        reason = 'Significant emotional distress language detected.';
    } else if (moderateKeywords.some(keyword => lowerText.includes(keyword))) {
        riskLevel = 2;
        reason = 'Elevated stress indicators detected.';
    }

    if (riskLevel >= 3) {
        await RiskAlert.create({
            student: studentId,
            riskLevel,
            reason,
            source
        });
    }

    return riskLevel;
};

const analyzeCheckIn = async (studentId, checkInData) => {
    let riskScore = 0;
    if (checkInData.stressLevel >= 4) riskScore += 2;
    if (checkInData.sleepQuality <= 2) riskScore += 2;
    if (checkInData.academicPressure >= 4) riskScore += 1;
    if (checkInData.emotionalWellbeing <= 2) riskScore += 2;

    let riskLevel = 1;
    let reason = 'Standard well-being check-in.';

    if (riskScore >= 6) {
        riskLevel = 4;
        reason = 'Critical multi-indicator check-in distress score.';
    } else if (riskScore >= 4) {
        riskLevel = 3;
        reason = 'High stress and low well-being check-in scores.';
    } else if (riskScore >= 2) {
        riskLevel = 2;
        reason = 'Moderate stress or fatigue indicated in check-in.';
    }

    if (riskLevel >= 3) {
        await RiskAlert.create({
            student: studentId,
            riskLevel,
            reason,
            source: 'CheckIn'
        });
    }

    return { riskLevel, riskScore };
};

module.exports = { analyzeText, analyzeCheckIn };