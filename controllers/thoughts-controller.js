const { Users, Thoughts, Reactions } = require('../models');

const thoughtsController = {

    getAllThoughts(req, res) {
        Thoughts.find({})
        .populate({ path: 'reactions', select: '-__v' })
        .select('-__v')
        .then(dbThoughtsData => res.json(dbThoughtsData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
    },

    getThoughtById({ params }, res) {
        Thoughts.findOne({ _id: params.id })
        .populate({ path: 'reactions', select: '-__v' })
        .select('-__v')
        .then(dbThoughtsData => {
            if (!dbThoughtsData) {
                res.status(404).json({message: 'No thought found with this id'});
                return;
            }
            res.json(dbThoughtsData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    createThought({ body }, res) {
        Thoughts.create(body)
        .then(dbThoughtsData => {
            Users.findOneAndUpdate(
                { _id: body.userId },
                { $push: { thoughts: dbThoughtsData._id } },
                { new: true }
            )
            .then(dbUsersData => {
                if (!dbUsersData) {
                    res.status(404).json({ message: 'No users found with this id' });
                    return;
                }
                res.json(dbUsersData);
            })
            .catch(err => res.json(err));
        })
        .catch(err => res.status(400).json(err));
    },

    updateThoughts({ params, body }, res) {
        Thoughts.findOneAndUpdate(
            { _id: params.id },
            body,
            { new: true }
        )
        .then(dbThoughtsData => {
            if (!dbThoughtsData) {
                res.status(404).json({ message: 'No thoughts found with this id' });
                return;
            }
            res.json(dbThoughtsData);
        })
        .catch(err => res.status(400).json(err));
    },

    deleteThought({ params }, res) {
        Thoughts.findOneAndDelete({ _id: params.id })
        .then(dbThoughtsData => {
            if (!dbThoughtsData) {
                res.status(404).json({ message: 'No thoughts found with this id'});
                return;
            }
            Users.findOneAndUpdate(
                { username: dbThoughtsData.username },
                { $pull: { thoughts: params.id } }
            )
            .then(() => {
                res.json({message: 'Successfully deleted this thought'});
            })
            .catch(err => res.status(500).json(err));
        })
        .catch(err => res.status(500).json(err));
    },

    addReaction({ params, body }, res) {
        Thoughts.findOneAndUpdate(
            { _id: params.thoughtsId },
            { $addToSet: { reactions: body } },
            { new: true, runValidators: true }
        )
        .then(dbThoughtsData => {
            if (!dbThoughtsData) {
                res.status(404).json({ message: 'No thoughts found with this id' });
                return;
            }
            res.json(dbThoughtsData);
        })
        .catch(err => res.status(500).json(err));
    },

    deleteReaction({ params, body }, res) {
        Thoughts.findOneAndUpdate(
            { _id: params.thoughtsId },
            { $pull: { reactions: { reactionId: body.reactionId } } },
            { new: true, runValidators: true }
        )
        .then(dbThoughtsData => {
            if (!dbThoughtsData) {
                res.status(404).json({ message: 'No thoughts found with this id' });
                return;
            }
            res.json({message: 'Successfully deleted the reaction'});
        })
        .catch(err => res.status(500).json(err));
    },
}

module.exports = thoughtsController;