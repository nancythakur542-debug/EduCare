const getAIResponse = async (userMessage) => {
    const text = userMessage.toLowerCase();

    if (text.includes('suicid') || text.includes('end my life') || text.includes('kill myself') || text.includes('die')) {
        return {
            reply: "I am deeply concerned about what you are sharing right now. Please know that you are not alone and help is immediately available. Please reach out to Tele-MANAS at 14416 or 1-800-891-4416 right away, or connect with a campus counsellor through your dashboard.",
            crisis: true
        };
    }

    if (text.includes('exam') || text.includes('study') || text.includes('academic') || text.includes('grade')) {
        return {
            reply: "Academic pressure can feel overwhelming at times. Have you tried breaking your study tasks into smaller intervals, such as the Pomodoro technique? Remember your well-being comes first. Would you like to book a session with an academic counsellor?",
            crisis: false
        };
    }

    if (text.includes('sleep') || text.includes('tired') || text.includes('exhausted')) {
        return {
            reply: "Quality sleep is essential for mental clarity and emotional resilience. Try stepping away from screens 30 minutes before bed and practicing slow, deep breathing. How has your sleep routine been lately?",
            crisis: false
        };
    }

    if (text.includes('anxiety') || text.includes('anxious') || text.includes('panic') || text.includes('stress')) {
        return {
            reply: "When anxiety feels heavy, try grounding yourself with the 5-4-3-2-1 technique: identify 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste. Take a slow, deep breath. I am here with you.",
            crisis: false
        };
    }

    return {
        reply: "Thank you for sharing that with me. It takes strength to express how you are feeling. I'm listening—would you like to talk more about what's on your mind, or explore some guided relaxation tips?",
        crisis: false
    };
};

module.exports = { getAIResponse };