const mongoose = require('mongoose');

const chatConversationSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, default: 'Support Session' }
}, { timestamps: true });

module.exports = mongoose.model('ChatConversation', chatConversationSchema);