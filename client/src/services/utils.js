
import firebase from 'firebase'

export const MULTIPART = 'MULTIPART'
export const NETWORK_STATUS = {
  PENDING: 'PENDING',
  COMPLETE: 'COMPLETE',
  ERROR: 'ERROR'
}

const PUT = 'PUT'
const GET = 'GET'
const POST = 'POST'
const DELETE ='DELETE'

const setHeader = (options, key, val) => {
  options = options || {}
  options.headers = options.headers || {}
  options.headers[key] = val
  return options
}

const withQueryParams = (url, options) => {
  const queryKeys = Object.keys(options.query)
  for (let i = 0; i < queryKeys.length; i++) {
    const prepend = i === 0 ? '?' : '&' 
    const key = encodeURIComponent(queryKeys[i])
    const val = encodeURIComponent(options.query[key])
    url += `${prepend}${key}=${val}`
  }
  return url
}

const parseJsonBody = response => {
  return new Promise((resolve, reject) => {
    response.json()
      .then(json => {
        if (!response.ok) {
          reject(json)
        } else {
          resolve(json)
        }
      })
      .catch(err => {
        // if no json in body
        reject({
          error: {
            code: 1
          }
        })
      })
  })
}

const makeRequest = (url, options) => {
  options = setHeader(options, 'Accept', 'application/json')

  if (options.query) {
    url = withQueryParams(url, options)
    delete options.query
  }

  if (options.authenticate) {
    return authRequest(url, options)
  } else {
    return fetch(url, options)
      .then(parseJsonBody)
  }
}

const authRequest = (url, options) => {
  delete options.authenticate
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        user.getIdToken(/* forceRefresh */ true)
          .then(userIdToken => {
            const authToken = `Bearer ${ userIdToken }`
            options = setHeader(options, 'Authorization', authToken)
            return fetch(url, options)
          })
          .then(parseJsonBody)
          .then(payload => {
            resolve(payload)
          })
          .catch(err => {
            reject(err)
          })
      }
    });
  })
}

const getRequestBodyOptions = (options, data) => {
  let body = data
  if (options.contentType == MULTIPART) {
    delete options.contentType
  } else {
    body = JSON.stringify(body)
    options = setHeader(options, 'Content-Type', 'application/json')
  }
  options.body = body
  return options
}

export const putRequest = (url, data, options) => {
  options = getRequestBodyOptions(options, data)
  options.method = PUT
  return makeRequest(url, options)
}

export const postRequest = (url, data, options) => {
  options = getRequestBodyOptions(options, data)
  options.method = POST
  return makeRequest(url, options)  
}

export const getRequest = (url, options) => {
  options = options || {}
  options.method = GET
  return makeRequest(url, options)
}

export const deleteRequest = (url, data, options) => {
  if (data) {
    options = getRequestBodyOptions(options, data)
  } else {
    options = options || {}
  }
  options.method = DELETE
  return makeRequest(url, options)
}