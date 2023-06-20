import express from 'express'
import { requireAuth } from '../../middlewares/requireAuth.middleware.mjs'
import { log } from '../../middlewares/logger.middleware.mjs'
import { getComments, getCommentById, addComment, updateComment, removeComment, addCommentMsg, removeCommentMsg } from './comment.controller.mjs'

const router = express.Router()

// We can add a middleware for the entire router:
// router.use(requireAuth)

router.get('/', log, getComments)
router.get('/:id', getCommentById)
router.post('/', requireAuth, addComment)
router.put('/:id', requireAuth, updateComment)
router.delete('/:id', requireAuth, removeComment)
// router.delete('/:id', requireAuth, requireAdmin, removeComment)

router.post('/:id/msg', requireAuth, addCommentMsg)
router.delete('/:id/msg/:msgId', requireAuth, removeCommentMsg)

export const commentRoutes = router
