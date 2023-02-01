import firebase from 'firebase';

const apiKey = process.env.REACT_APP_FIREBASE_API_KEY;
const projectId = process.env.REACT_APP_FIREBASE_PROJECT_ID;
const measurementId = process.env.REACT_APP_FIREBASE_MEASUREMENT_ID;
const appId = process.env.REACT_APP_FIREBASE_APP_ID;
const messagingSenderId = process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID;

const firebaseConfig = {
  apiKey,
  authDomain: `${projectId}.firebaseapp.com`,
  projectId,
  storageBucket: `${projectId}.appspot.com`,
  messagingSenderId,
  appId,
  measurementId: `G-${measurementId}`,
};

const initFirebase = () => {
  firebase.initializeApp(firebaseConfig);

  // init analytics
  firebase.analytics();
};

const getFirebaseApp = () => {
  if (!firebase.apps.length) {
    firebase.initFirebase();
  }
  return firebase;
};

initFirebase();

export default getFirebaseApp;
