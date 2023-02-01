import {  
    getRequest
} from './utils'

const NEW_ACCOUNT_URL = '/api/auth/register'

export const registerUser = () => {
    return getRequest(NEW_ACCOUNT_URL, {
        authenticate: true
    })
}