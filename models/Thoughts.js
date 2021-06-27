const { Schema, model } = require('mongoose');
const reactionsSchema = require('./Reactions');


const thoughtsSchema = new Schema({
    thoughtsText: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 280
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (createdAtVal) => dateFormat(createdAtVal),
    },
    username: {
        type: String,
        required: true
    },
    reactions: [reactionsSchema]
},
{
    toJSON: {
        virtuals: true,
        getters: true
    },
    id: false
});

thoughtsSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});

const Thoughts = model('Thoughts', thoughtsSchema);

module.exports = Thoughts;