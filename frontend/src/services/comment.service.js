
// import { storageService } from './async-storage.service.js'
import { httpService } from './http.service.js'
import { utilService } from './util.service.js'
import { userService } from './user.service.js'


const STORAGE_KEY = 'comment'

export const commentService = {
    query,
    getById,
    save,
    remove,
    getEmptyComment,
    addCommentMsg
}
window.cs = commentService


async function query(filterBy = { txt: '', price: 0 }) {
    return httpService.get(STORAGE_KEY, filterBy)
}

function getById(commentId) {
    return httpService.get(`comment/${commentId}`)
}

async function remove(commentId) {
    return httpService.delete(`comment/${commentId}`)
}
async function save(comment) {
    var savedComment
    if (comment._id) {
        savedComment = await httpService.put(`comment/${comment._id}`, comment)

    } else {
        savedComment = await httpService.post('comment', comment)
    }
    return savedComment
}

async function addCommentMsg(commentId, txt) {
    const savedMsg = await httpService.post(`comment/${commentId}/msg`, {txt})
    return savedMsg
}


function getEmptyComment() {
    return {
        vendor: 'Susita-' + (Date.now() % 1000),
        price: utilService.getRandomIntInclusive(1000, 9000),
    }
}





