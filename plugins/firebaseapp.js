import firebase from 'firebase'

const Config = {
    apiKey: "AIzaSyB8iTH0Qvpyt5Ps9gUWESt6_nN6RP70_y4",
    authDomain: "nuxt-test-f59b5.firebaseapp.com",
    databaseURL: "https://nuxt-test-f59b5.firebaseio.com",
    projectId: "nuxt-test-f59b5",
    storageBucket: "nuxt-test-f59b5.appspot.com",
    messagingSenderId: "824005065413",
    appId: "1:824005065413:web:4b1160022b607682"
};

let app = ''

if (firebase.apps.length === 0) {
    app = firebase.initializeApp(Config);
}

export const firebaseapp = app