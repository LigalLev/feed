
import { useSelector } from 'react-redux'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'

import { UserMsg } from './user-msg.jsx'

export function AppFooter() {
    const commentt = useSelector(storeState => storeState.commentModule.commentt)
    const count = useSelector(storeState => storeState.userModule.count)
    const commenttTotal = commentt.reduce((acc, comment) => acc + comment.price, 0)


    return (
        <footer className="app-footer">
            <p>
                coffeerights - count: {count}
            </p>
    
            <UserMsg />
        </footer>
    )
}