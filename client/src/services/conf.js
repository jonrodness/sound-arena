import { getRequest } from './utils'

const LINK_TYPES_URL = `/api/conf/linkTypes`

export const fetchLinkTypes = () => {
    return getRequest(LINK_TYPES_URL)
}