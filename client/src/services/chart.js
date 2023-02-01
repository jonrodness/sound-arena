import { getRequest } from './utils'

const CHART_URL = '/api/chart'

export const requestChart = query => {

    const options = {
        query
    }

    return getRequest(CHART_URL, options)
}