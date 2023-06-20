export const SET_COMMENTS = 'SET_COMMENTS'
export const REMOVE_COMMENT = 'REMOVE_COMMENT'
export const ADD_COMMENT = 'ADD_COMMENT'
export const UPDATE_COMMENT = 'UPDATE_COMMENT'
export const UNDO_REMOVE_COMMENT = 'UNDO_REMOVE_COMMENT'

const initialState = {
    comments: [],
    lastRemovedComment: null
}

export function commentReducer(state = initialState, action) {
    var newState = state
    var comments
    var commentt
    switch (action.type) {
        case SET_COMMENTS:
            newState = { ...state, comments: action.comments }
            break
        case REMOVE_COMMENT:
            const lastRemovedComment = state.comments.find(comment => comment._id === action.commentId)
            comments = state.comments.filter(comment => comment._id !== action.commentId)
            newState = { ...state, comments, lastRemovedComment }
            break
        case ADD_COMMENT:
            newState = { ...state, comments: [...state.comments, action.comment] }
            break
        case UPDATE_COMMENT:
            comments = state.comments.map(comment => (comment._id === action.comment._id) ? action.comment : comment)
            newState = { ...state, comments }
            break
        case UNDO_REMOVE_COMMENT:
            if (state.lastRemovedComment) {
                newState = { ...state, comments: [...state.comments, state.lastRemovedComment], lastRemovedComment: null }
            }
            break
        default:
    }
    return newState
}
