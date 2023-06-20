import {dbService} from '../../services/db.service.mjs'
import {logger} from '../../services/logger.service.mjs'
import {utilService} from '../../services/util.service.mjs'
import mongodb from 'mongodb'
const {ObjectId} = mongodb

const PAGE_SIZE = 3


async function query(filterBy={txt:''}) {
    try {
        const criteria = {
            vendor: { $regex: filterBy.txt, $options: 'i' }
        }
        const collection = await dbService.getCollection('comment')
        var commentCursor = await collection.find(criteria)

        if (filterBy.pageIdx !== undefined) {
            commentCursor.skip(filterBy.pageIdx * PAGE_SIZE).limit(PAGE_SIZE)     
        }

        const comments = commentCursor.toArray()
        return comments
    } catch (err) {
        logger.error('cannot find comments', err)
        throw err
    }
}

async function getById(commentId) {
    try {
        const collection = await dbService.getCollection('comment')
        const comment = collection.findOne({ _id: ObjectId(commentId) })
        return comment
    } catch (err) {
        logger.error(`while finding comment ${commentId}`, err)
        throw err
    }
}

async function remove(commentId) {
    try {
        const collection = await dbService.getCollection('comment')
        await collection.deleteOne({ _id: ObjectId(commentId) })
        return commentId
    } catch (err) {
        logger.error(`cannot remove comment ${commentId}`, err)
        throw err
    }
}

async function add(comment) {
    try {
        const collection = await dbService.getCollection('comment')
        await collection.insertOne(comment)
        return comment
    } catch (err) {
        logger.error('cannot insert comment', err)
        throw err
    }
}

async function update(comment) {
    try {
        const commentToSave = {
            vendor: comment.vendor,
            price: comment.price
        }
        const collection = await dbService.getCollection('comment')
        await collection.updateOne({ _id: ObjectId(comment._id) }, { $set: commentToSave })
        return comment
    } catch (err) {
        logger.error(`cannot update comment ${commentId}`, err)
        throw err
    }
}

async function addCommentMsg(commentId, msg) {
    try {
        msg.id = utilService.makeId()
        const collection = await dbService.getCollection('comment')
        await collection.updateOne({ _id: ObjectId(commentId) }, { $push: { msgs: msg } })
        return msg
    } catch (err) {
        logger.error(`cannot add comment msg ${commentId}`, err)
        throw err
    }
}

async function removeCommentMsg(commentId, msgId) {
    try {
        const collection = await dbService.getCollection('comment')
        await collection.updateOne({ _id: ObjectId(commentId) }, { $pull: { msgs: {id: msgId} } })
        return msgId
    } catch (err) {
        logger.error(`cannot add comment msg ${commentId}`, err)
        throw err
    }
}

export const commentService = {
    remove,
    query,
    getById,
    add,
    update,
    addCommentMsg,
    removeCommentMsg
}
