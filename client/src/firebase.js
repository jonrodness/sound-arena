import firebase from 'firebase'

let apiKey = process.env.REACT_APP_FIREBASE_API_KEY
let projectId = process.env.REACT_APP_FIREBASE_PROJECT_ID
let measurementId = process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
let appId = process.env.REACT_APP_FIREBASE_APP_ID
let messagingSenderId = process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID

var firebaseConfig = {
    apiKey: apiKey,
    authDomain: `${projectId}.firebaseapp.com`,
    projectId: projectId,
    storageBucket: `${projectId}.appspot.com`,
    messagingSenderId,
    appId,
    measurementId: `G-${measurementId}`
}

const initFirebase = () => {
    firebase.initializeApp(firebaseConfig)
    
    // init analytics
    firebase.analytics()
}

const getFirebaseApp = () => {
    if (!firebase.apps.length) {
        firebase.initFirebase()
    }
    return firebase
}

initFirebase()

export default getFirebaseApp