<template>
    <div class="content-container">
        <div class="btn-mode">
            <button class="mode-btn" v-if="this.listMode" @click="toggleMode()">Create User</button>
            <button class="mode-btn" v-if="!this.listMode" @click="toggleMode()">Users List</button>
        </div>
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
    background-color: #323c50;
    z-index: 2;
    flex-direction: column;
}
.btn-mode {
    height: 100px;
    margin-top: 50px;
    cursor: pointer;
}
.btn-red {
    background-color: #cb2431;
    color: white;
}
.btn-orange {
    background-color: #FA9C1D;
    color: white;
}
.btn-green {
    background-color: green;
    color: white;
}
.pointer {
    cursor: pointer;
}
.error-cross {
    font-size: 30px;
}
.grid-color {
    background-color: #2c3E50;
    color: white;
}
.field-title {
    background-color: #2c3E50;
    color: grey;
}
.grid-input {
    border: solid 1px black;
    text-align: center;
    font-size: 16px;
}
.mode-btn {
    padding: 8px 15px;
    background-color: #2c3E50;
    color: white;
    font-size: 18px;
    font-weight: bold;
    border-radius: 5px;
    cursor: pointer;
}
@media only screen and (max-width: 600px){
    .users-list {
        width: 100%;
    }
}
</style>