import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { loadComments, addComment, updateComment, removeComment } from '../store/comment.actions.js'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { carService } from '../services/comment.service.js'

export function CommentIndex() {

    const cars = useSelector(storeState => storeState.carModule.cars)

    useEffect(() => {
        loadComments()
    }, [])

    async function onRemoveComment(carId) {
        try {
            await removeComment(carId)
            showSuccessMsg('Comment removed')            
        } catch (err) {
            showErrorMsg('Cannot remove car')
        }
    }

    async function onAddComment() {
        const car = carService.getEmptyComment()
        car.vendor = prompt('Vendor?')
        try {
            const savedComment = await addComment(car)
            showSuccessMsg(`Comment added (id: ${savedComment._id})`)
        } catch (err) {
            showErrorMsg('Cannot add car')
        }        
    }

    async function onUpdateComment(car) {
        const price = +prompt('New price?')
        const carToSave = { ...car, price }
        try {
            const savedComment = await updateComment(carToSave)
            showSuccessMsg(`Comment updated, new price: ${savedComment.price}`)
        } catch (err) {
            showErrorMsg('Cannot update car')
        }        
    }

    

    function onAddCommentMsg(car) {
        console.log(`TODO Adding msg to car`)
    }

    return (
        <div>
            <h3>Comments App</h3>
            <main>
                <button onClick={onAddComment}>Add Comment ⛐</button>
                <ul className="car-list">
                    {cars.map(car =>
                        <li className="car-preview" key={car._id}>
                            <h4>{car.vendor}</h4>
                            <h1>⛐</h1>
                            <p>Price: <span>${car.price.toLocaleString()}</span></p>
                            <p>Owner: <span>{car.owner && car.owner.fullname}</span></p>
                            <div>
                                <button onClick={() => { onRemoveComment(car._id) }}>x</button>
                                <button onClick={() => { onUpdateComment(car) }}>Edit</button>
                            </div>

                            <button onClick={() => { onAddCommentMsg(car) }}>Add car msg</button>
                        </li>)
                    }
                </ul>
            </main>
        </div>
    )
}