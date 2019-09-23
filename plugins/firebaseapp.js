import firebase from 'firebase'

const Config = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
};

let app = ''

if (firebase.apps.length === 0) {
    app = firebase.initializeApp(Config);
}

export const db = firebase.firestore();
export const firebaseapp = app