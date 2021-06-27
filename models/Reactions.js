
const { Schema, model, Types } = require('mongoose');

const reactionsSchema = new Schema({
    reactionId: {
        type: Types.ObjectId,
        default: new Types.ObjectId()
    },
    reactionsBody: {
        type: String,
        required: true,
        maxLength: 280
    },
    username: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (createdAtVal) => dateFormat(createdAtVal),
    }
},
{
    toJSON: {
        getters: true
    },
    id: false
});

module.exports = reactionsSchema;