<template>
    <div class="form-container">
        <form v-on:submit="signIn" class="login-form form-container" style="height: fit-content;">
            <input id="email" type="email" class="login-input" placeholder="email" autocomplete="username" v-model="email" required>
            <input id="password" type="password" class="login-input" placeholder="password" autocomplete="current-password" v-model="password" required>
            <button type="submit" class="mode-btn" style="margin-top: 20px;">Log In</button>
        </form>
        <div class="login-error">{{error.message}}</div>
    </div>
</template>

<script>
import { firebaseapp } from '../plugins/firebaseapp.js'

export default {
    data() {
        return {
            status: false,
            email: '',
            password: '',
            error: {
                message: ''
            }
        }
    },
    methods: {
        signIn(event) {
            event.preventDefault()
            firebaseapp.auth().signInWithEmailAndPassword(this.email, this.password)
            .catch(error => {
                this.error = error
            })
            firebaseapp.auth().onAuthStateChanged(user => {
                if (user) {
                    this.status = true
                } else {
                    this.status = false
                }
            })
        }
    },
    mounted() {
        firebaseapp.auth().onAuthStateChanged(user => {
            if (user) {
                this.status = true
            } else {
                this.status = false
            }
        })
    },
    watch: {
        status: function(value) {
            if (value) {
                this.$emit('userLoggedIn')
            }
        }
    }
}
</script>

<style>
.form-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.login-error {
    height: 20px;
    margin: 20px;
    font-weight: bold;
}
.login-input {
    width: 98%;
    margin: 10px;
    padding: 10px 30px;
    border-radius: 5px;
    border: none;
    outline: none;
    color: #4a4a4a;
    max-width: 400px;
    font-size: 20px;
}
</style>