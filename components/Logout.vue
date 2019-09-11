<template>
    <img class="logo-sign-out pointer" @click="signOut()" src="../assets/powerlogo.png">
</template>

<script>
import { firebaseapp } from '../plugins/firebaseapp.js'

export default {
    methods: {
        signOut() {
            firebaseapp.auth().signOut()
            this.$emit('userLoggedOut')
        }
    }
}
</script>

<style>
.logo-sign-out {
    width: 25px;
    height: 25px;
    margin: 0 10px;
    background-size: contain;
}
.logo-sign-out:hover {
    filter: contrast(0.6)
}
</style>