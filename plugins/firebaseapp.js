import firebase from 'firebase'

const Config = {
    apiKey: "AIzaSyDC47B1mqF12EoiaDwr3dks4Yk_S1ukwyA",
    authDomain: "fir-users-29d7b.firebaseapp.com",
    databaseURL: "https://fir-users-29d7b.firebaseio.com",
    projectId: "fir-users-29d7b",
    storageBucket: "",
    messagingSenderId: "494749222995",
    appId: "1:494749222995:web:6d50d92809c0fa55645ea6"
};

let app = ''

if (firebase.apps.length === 0) {
    app = firebase.initializeApp(Config);
}

export const db = firebase.firestore();
export const firebaseapp = app