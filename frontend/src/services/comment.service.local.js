
import { storageService } from './async-storage.service.js'
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
    var comments = await storageService.query(STORAGE_KEY)
    if (filterBy.txt) {
        const regex = new RegExp(filterBy.txt, 'i')
        comments = comments.filter(comment => regex.test(comment.vendor) || regex.test(comment.description))
    }
    if (filterBy.price) {
        comments = comments.filter(comment => comment.price <= filterBy.price)
    }
    return comments
}

function getById(commentId) {
    return storageService.get(STORAGE_KEY, commentId)
}

async function remove(commentId) {
    // throw new Error('Nope')
    await storageService.remove(STORAGE_KEY, commentId)
}

async function save(comment) {
    var savedComment
    if (comment._id) {
        savedComment = await storageService.put(STORAGE_KEY, comment)
    } else {
        // Later, owner is set by the backend
        comment.owner = userService.getLoggedinUser()
        savedComment = await storageService.post(STORAGE_KEY, comment)
    }
    return savedComment
}

async function addCommentMsg(commentId, txt) {
    // Later, this is all done by the backend
    const comment = await getById(commentId)
    if (!comment.msgs) comment.msgs = []

    const msg = {
        id: utilService.makeId(),
        by: userService.getLoggedinUser(),
        txt
    }
    comment.msgs.push(msg)
    await storageService.put(STORAGE_KEY, comment)

    return msg
}

function getEmptyComment() {
    return {
        vendor: 'Susita-' + (Date.now() % 1000),
        price: utilService.getRandomIntInclusive(1000, 9000),
    }
}


// TEST DATA
// storageService.post(STORAGE_KEY, {vendor: 'Subali Rahok 2', price: 980}).then(x => console.log(x))




