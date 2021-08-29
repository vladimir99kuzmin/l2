import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

firebase.initializeApp({
    apiKey: "AIzaSyAHJ3cRH5doA5Vs-wDKOMtuOrsGRWbTVqI",
    authDomain: "reacttestchat-c0155.firebaseapp.com",
    projectId: "reacttestchat-c0155",
    storageBucket: "reacttestchat-c0155.appspot.com",
    messagingSenderId: "280423523087",
    appId: "1:280423523087:web:89a4da6b3ba798e5d9947a",
    measurementId: "G-20CJHTHQLG"
})

firebase.analytics();

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export {firebase};