const router = require('express').Router();
const {
    getAllThoughts,
    getThoughtById,
    createThought,
    updateThoughts,
    deleteThought,
    addReaction,
    deleteReaction
} = require('../../controllers/thoughts-controller');

router
    .route('/')
    .get(getAllThoughts)
    .post(createThought);

router
    .route('/:id')
    .get(getThoughtById)
    .put(updateThoughts)
    .delete(deleteThought);

router.route('/:thoughtsId/reactions/')
    .post(addReaction)
    .delete(deleteReaction)

module.exports = router;