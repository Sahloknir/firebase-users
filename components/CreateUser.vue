<template>
    <div class="users-list">
        <form class="create-container grid-color">
            <div class="details-row" v-for="(field, index) in this.fields" :key="index">
                <div class="details-item field-title">{{field}}</div>
                <input class="details-item grid-input grid-color" v-model="toCreate[field]">
            </div>
            <div class="details-row">
                <div class="details-item field-title">password</div>
                <input type="password" class="details-item grid-input grid-color" v-model="secretFields.password">
            </div>
            <div class="details-row">
                <div class="details-item field-title">confirm password</div>
                <input type="password" class="details-item grid-input grid-color" v-model="secretFields.confPassword">
            </div>
            <div class="details-row">
                <div class="details-item field-title">status</div>
                <select v-model="secretFields.status" class="grid-item grid-color grid-input">
                    <option>user</option>
                    <option>admin</option>
                </select>
            </div>
            <div v-if="this.errorMode" class="grid-item grid-error" style="grid-row-end: span 3">
                {{this.error}}
                <span @click="closeError()" class="error-cross pointer">&times;</span>
            </div>
            <div v-if="!this.errorMode" @click="createContent()" class="grid-item btn-green pointer" style="border: none;">Create</div>
        </form>
    </div>
</template>

<script>
import { firebaseapp, db } from '../plugins/firebaseapp.js'

export default {
    data() {
        return {
            userCreate: {
                token: '',
                content: {
                    displayName: '',
                    phoneNumber: '',
                    email: '',
                    password: ''
                },
                claims: {
                    status: ''
                }
            },
            toCreate: {
                name: '',
                email: '',
                tel: '',
                address: '',
                calendly_url: '',
                gmap_url: '',
                opening_days: '',
                opening_hours: '',
                published: '',
                slug: ''
            },
            secretFields: {
                password: '',
                confPassword: '',
                status: ''
            },
            fields: [],
            errorMode: false,
            error: ''
        }
    },
    methods: {
        createUser(Ref) {
            if (firebaseapp.auth().currentUser) {
                firebaseapp.auth().currentUser.getIdToken(false).then((idToken) => {
                    (async () => {
                        this.userCreate.token = idToken
                        const rawResponse = await fetch('/api/v1/adminusers/create', {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(this.userCreate)
                        });
                        const content = await rawResponse.json();
                        if (content.success != 'true') {
                            this.setError(content.error)
                        } else {
                            Ref.set(this.toCreate)
                            this.$emit('reloadUsers')
                        }
                    })();
                }).catch((error) => {
                    this.setError('Unable to get user token')
                })
            } else {
                this.setError('You must be logged in')
            }
        },
        createContent() {
            var Ref = db.collection("shops").doc('test')
            this.userCreate.content.displayName = this.toCreate['name']
            this.userCreate.content.email = this.toCreate['email']
            this.userCreate.content.phoneNumber = this.toCreate['tel']
            this.userCreate.claims.status = this.secretFields.status
            if (this.secretFields.password == this.secretFields.confPassword) {
                this.userCreate.content.password = this.secretFields.password
                this.createUser(Ref)
            } else {
                this.setError('Passwords don\'t match')
            }
        },
        setError(error) {
            this.error = error
            this.errorMode = true
        },
        closeError(error) {
            this.error = ''
            this.errorMode = false
        }
    },
    mounted() {
        this.secretFields.status = 'user'
        this.fields = Object.keys(this.toCreate)
    }
}
</script>

<style>
.create-container {
    width: 98%;
    display: grid;
    grid-template-columns: 100%;
    grid-auto-rows: 40px;
    margin: 40px 0;
    border-radius: 5px;
    overflow: hidden;
}
.create-bloc {
    display: flex;
    justify-content: center;
    width: 600px;
}
@media only screen and (max-width: 600px){
    .create-bloc {
        width: 100%;
    }
}
</style>