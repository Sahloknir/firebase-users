<template>
    <div class="content-container">
        <Background />
        <div v-if="this.mode != 'login'" class="content-container" style="z-index: 1;">
            <div class="features-bloc">
                <div style="width: 45px;"></div>
                <button class="mode-btn" v-if="this.mode == 'list'" @click="setCreateMode()">Create User</button>
                <button class="mode-btn" v-if="this.mode == 'create'" @click="setListMode()">Users List</button>
                <Logout
                    v-on:userLoggedOut="userLoggedOut()"
                />
            </div>
            <div v-if="this.mode == 'list'" class="users-list">
                <div v-for="(user, index) in this.users" :key="index" style="width: 100%;">
                    <User
                        :user="user"
                        v-on:reloadUsers="reloadUsers"
                    />
                </div>
            </div>
            <CreateUser
                v-if="this.mode == 'create'"
                v-on:reloadUsers="reloadUsers"
            />
        </div>
        <div v-if="this.mode == 'login'" class="content-container" style="z-index: 1;">
            <Login
                v-on:userLoggedIn="userLoggedIn()"
            />
        </div>
    </div>
</template>

<script>
import { firebaseapp } from '../plugins/firebaseapp.js'
import User from '../components/User.vue'
import CreateUser from '../components/CreateUser.vue'
import Background from '../components/Background.vue'
import Logout from '../components/Logout.vue'
import Login from '../components/Login.vue'

export default {
    data() {
        return {
            users: '',
            currentUser: null,
            mode: 'login'
        }
    },
    methods: {
        getUsers() {
            let res = []
            if (firebaseapp.auth().currentUser) {
                firebaseapp.auth().currentUser.getIdToken(false).then((idToken) => {
                    (async () => {
                        const rawResponse = await fetch('/api/v1/adminusers', {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(idToken)
                        });
                        const content = await rawResponse.json();
                        if (content.success != 'true') {
                            console.log('failed fetching users')
                        } else {
                            for (let i = 0; i < content.content.length; i++) {
                                res.push(content.content[i])
                            }
                        }
                    })();
                })
            } else {
                console.log('you must be logged in')
            }
            return res
        },
        reloadUsers() {
            this.users = this.getUsers()
            this.mode = 'list'
        },
        userLoggedIn() {
            this.setListMode()
            this.users = this.getUsers()
        },
        userLoggedOut() {
            this.setLoginMode()
            this.users = ''
        },
        setListMode() {
            this.mode = 'list'
        },
        setCreateMode() {
            this.mode = 'create'
        },
        setLoginMode() {
            this.mode = 'login'
        }
    },
    mounted() {
        console.log('user', firebaseapp.auth().currentUser)
        this.users = this.getUsers()
        this.currentUser = firebaseapp.auth().currentUser
    },
    components: {
        User,
        CreateUser,
        Background,
        Logout,
        Login
    }
}
</script>

<style>
.content-container {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}
.features-bloc {
    margin: 50px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 98%;
    max-width: 600px;
}
.users-list {
    width: 600px;
    word-wrap: break-word;
    overflow: auto;
    min-height: 150px;
}
.grid-error {
    text-align: center;
    color: #cb2431;
    background-color: #eceff1;
    z-index: 2;
    flex-direction: column;
}
.btn-mode {
    height: 100px;
    margin-top: 50px;
    cursor: pointer;
}
.btn-red {
    border-color: #ff784f;
    background-color: #ff784f;
    color: white;
    transition: all .2s ease-in-out;
}
.btn-red:hover {
    border-color: #ee5135;
    background-color: #ee5135;
}
.btn-orange {
    border-color: #ffa000;
    background-color: #ffa000;
    color: white;
    transition: all .2s ease-in-out;
}
.btn-orange:hover {
    border-color: #f06d38;
    background-color: #f06d38;
}
.btn-green {
    border-color: #3a943d;
    background-color: #3a943d;
    color: white;
    transition: all .2s ease-in-out;
}
.btn-green:hover {
    border-color: green;
    background-color: green;
}
button {
    outline: none;
}
.logo-bloc {
    position: fixed;
    top: 25px;
    left: 40px;
    height: 100px;
    width: auto;
}
.background-bloc {
    position: fixed;
    width: 3000px;
    height: 2500px;
}
.yellow-bloc {
    background-color: #f8c045;
    z-index: -1;
    transform: rotate(10deg);
    margin-top: 500px;
}
.blue-bloc {
    background-color: #379be5;
    z-index: -2;
    transform: rotate(55deg);
    margin-top: -1800px;
    margin-left: -1000px;
}
.pointer {
    cursor: pointer;
}
.error-cross {
    font-size: 30px;
}
.grid-color {
    background-color: #eceff1;
    color: #4a4a4a;
}
.field-title {
    background-color: #eceff1;
    color: grey;
}
.grid-input {
    border: solid 1px #d8d8d8;
    text-align: center;
    font-size: 16px;
}
.mode-btn {
    font-size: 18px;
    font-weight: bold;
    padding: 10px 50px;
    cursor: pointer;
    background-color: white;
    color: #379be5;
    border-radius: 8px;
    cursor: pointer;
    white-space: nowrap;
}
.mode-btn:hover {
    background-color: #dcf0fb;
}
@media only screen and (max-width: 600px){
    .users-list {
        width: 100%;
    }
}
</style>