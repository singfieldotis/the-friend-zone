const { Users, Thoughts } = require('../models');

const usersController = {

    getAllUsers(req, res) {
        Users.find({})
        .select('-__v')
        .then(dbUsersData => res.json(dbUsersData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
    },

    getUserById({ params }, res) {
        Users.findOne({ _id: params.id })
        .populate([
            { path: 'thoughts', select: "-__v" },
            { path: 'friends', select: "-__v" }
        ])
        .select('-__v')
        .then(dbUsersData => {
            if (!dbUsersData) {
                res.status(404).json({message: 'No user found with this id'});
                return;
            }
            res.json(dbUsersData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    createUser({ body }, res) {
        User.create(body)
        .then(dbUsersData => res.json(dbUsersData))
        .catch(err => res.status(400).json(err));
    },

    updateUser({ params, body }, res) {
        Users.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
        .then(dbUsersData => {
            if (!dbUsersData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUsersData);
        })
        .catch(err => res.status(400).json(err));
    },

    deleteUser({ params }, res) {
        Users.findOneAndDelete({ _id: params.id })
        .then(dbUsersData => {
            if (!dbUsersData) {
                res.status(404).json({ message: 'No user found with this id'});
                return;
            }
            Users.updateMany(
                { _id : {$in: dbUsersData.friends } },
                { $pull: { friends: params.id } }
            )
            .then(() => {
                Thoughts.deleteMany({ username : dbUserData.username })
                .then(() => {
                    res.json({message: "Successfully deleted user"});
                })
                .catch(err => res.status(400).json(err));
            })
            .catch(err => res.status(400).json(err));
        })
        .catch(err => res.status(400).json(err));
    },

    addFriend({ params }, res) {
        Users.findOneAndUpdate(
            { _id: params.userId },
            { $addToSet: { friends: params.friendId } },
            { new: true, runValidators: true }
        )
        .then(dbUsersData => {
            if (!dbUsersData) {
                res.status(404).json({ message: 'No user found with this userId' });
                return;
            }
            Users.findOneAndUpdate(
                { _id: params.friendId },
                { $addToSet: { friends: params.userId } },
                { new: true, runValidators: true }
            )
            .then(dbUsersData => {
                if(!dbUsersData) {
                    res.status(404).json({ message: 'No user found with this friendId' })
                    return;
                }
                res.json(dbUsersData);
            })
            .catch(err => res.json(err));
        })
        .catch(err => res.json(err));
    },

    deleteFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: params.friendId } },
            { new: true, runValidators: true }
        )
        .then(dbUsersData => {
            if (!dbUsersData) {
                res.status(404).json({ message: 'No user found with this userId' });
                return;
            }
            Users.findOneAndUpdate(
                { _id: params.friendId },
                { $pull: { friends: params.userId } },
                { new: true, runValidators: true }
            )
            .then(dbUsersData => {
                if(!dbUsersData) {
                    res.status(404).json({ message: 'No user found with this friendId' })
                    return;
                }
                res.json({message: 'Successfully deleted this user'});
            })
            .catch(err => res.json(err));
        })
        .catch(err => res.json(err));
    }
}

module.exports = usersController;