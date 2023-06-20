import { commentService } from "../services/comment.service.local.js";
import { store } from './store.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { ADD_COMMENT, REMOVE_COMMENT, SET_COMMENTS, UNDO_REMOVE_COMMENT, UPDATE_COMMENT } from "./comment.reducer.js";

// Action Creators:
export function getActionRemoveComment(commentId) {
    return {
        type: REMOVE_COMMENT,
        commentId
    }
}
export function getActionAddComment(comment) {
    return {
        type: ADD_COMMENT,
        comment
    }
}
export function getActionUpdateComment(comment) {
    return {
        type: UPDATE_COMMENT,
        comment
    }
}

export async function loadComments() {
    try {
        const comments = await commentService.query()
        console.log('Comments from DB:', comments)
        store.dispatch({
            type: SET_COMMENTS,
            comments
        })

    } catch (err) {
        console.log('Cannot load comments', err)
        throw err
    }

}

export async function removeComment(commentId) {
    try {
        await commentService.remove(commentId)
        store.dispatch(getActionRemoveComment(commentId))
    } catch (err) {
        console.log('Cannot remove comment', err)
        throw err
    }
}

export async function addComment(comment) {
    try {
        const savedComment = await commentService.save(comment)
        console.log('Added Comment', savedComment)
        store.dispatch(getActionAddComment(savedComment))
        return savedComment
    } catch (err) {
        console.log('Cannot add comment', err)
        throw err
    }
}

export function updateComment(comment) {
    return commentService.save(comment)
        .then(savedComment => {
            console.log('Updated Comment:', savedComment)
            store.dispatch(getActionUpdateComment(savedComment))
            return savedComment
        })
        .catch(err => {
            console.log('Cannot save comment', err)
            throw err
        })
}




// Demo for Optimistic Mutation 
// (IOW - Assuming the server call will work, so updating the UI first)
export function onRemoveCommentOptimistic(commentId) {
    store.dispatch({
        type: REMOVE_COMMENT,
        commentId
    })
    showSuccessMsg('Comment removed')

    commentService.remove(commentId)
        .then(() => {
            console.log('Server Reported - Deleted Succesfully');
        })
        .catch(err => {
            showErrorMsg('Cannot remove comment')
            console.log('Cannot load comments', err)
            store.dispatch({
                type: UNDO_REMOVE_COMMENT,
            })
        })
}
