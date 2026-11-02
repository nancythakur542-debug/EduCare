const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatConversation', required: true },
    sender: { type: String, enum: ['student', 'ai'], required: true },
    message: { type: String, required: true },
    riskDetected: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);