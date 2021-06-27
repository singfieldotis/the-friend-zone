const { Schema, model } = require('mongoose');

const usersSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/]
    },
    thoughts: [{ type: Schema.Types.ObjectId, ref: 'Thoughts' }],
    friends: [{ type: Schema.Types.ObjectId, ref: 'Users' }]
},
{
    toJSON: {
        virtuals: true
    },
    id: false
});

usersSchema.virtual('friendCount').get(function() {
    return this.friends.length;
});

const Users = model('Users', usersSchema);

module.exports = Users;