<template>
    <div class="content-container">
        <div class="content-container" style="position: fixed;">
            <div class="background-bloc yellow-bloc"></div>
            <div class="background-bloc blue-bloc"></div>
            <img class="logo-bloc" src="../assets/firebase.svg">
        </div>
        <div class="content-container" style="z-index: 1;">
            <button class="mode-btn" v-if="this.listMode" @click="toggleMode()">Create User</button>
            <button class="mode-btn" v-if="!this.listMode" @click="toggleMode()">Users List</button>
            <br>
            <div v-if="this.listMode" class="users-list">
                <div v-for="(user, index) in this.users[0]" :key="index" style="width: 100%;">
                    <User
                        :user="user"
                        v-on:reloadUsers="reloadUsers"
                    />
                </div>
            </div>
            <CreateUser
                v-if="!this.listMode"
                v-on:reloadUsers="reloadUsers"
            />
        </div>
    </div>
</template>

<script>
import User from '../components/User.vue'
import CreateUser from '../components/CreateUser.vue'

export default {
    data() {
        return {
            users: [],
            listMode: true
        }
    },
    methods: {
        getUsers() {
            let res = []
            fetch('/api/v1/adminusers')
                .then(response => response.json())
                .then((json) => {
                    res.push(json)
                    // console.log(json)
                })
                .catch((error) => {
                    console.error(error);
                })
            return res;
        },
        reloadUsers() {
            this.users = this.getUsers()
            this.listMode = true
        },
        toggleMode() {
            this.listMode = !this.listMode
        }
    },
    mounted() {
        this.users = this.getUsers()
        //console.log('on mounted', this.$store.state.users.userList);
    },
    components: {
        User,
        CreateUser
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
    margin-top: 50px;
    padding: 10px 50px;
    cursor: pointer;
    background-color: white;
    color: #379be5;
    border-radius: 8px;
    cursor: pointer;
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