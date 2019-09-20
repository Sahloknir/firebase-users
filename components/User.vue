<template>
    <div class="user-bloc">
        <div class="user-wrapper">
            <div class="user-container" style="grid-area: 1 / 1 / 2 / 3">
                <div class="grid-item grid-color field-title" style="grid-area: 1 / 1 / 2 / 2;">Name</div>
                <div class="grid-item grid-color field-title" style="grid-area: 2 / 1 / 3 / 2;">Email</div>
                <div class="grid-item grid-color field-title" style="grid-area: 3 / 1 / 4 / 2;">Phone</div>
                <div class="grid-item grid-color" style="grid-area: 1 / 2 / 2 / 3;">{{user.displayName}}</div>
                <div class="grid-item grid-color" style="grid-area: 2 / 2 / 3 / 3;">{{user.email}}</div>
                <div class="grid-item grid-color" style="grid-area: 3 / 2 / 4 / 3;">{{user.phoneNumber}}</div>
            </div>
            <div @click="toggleEdit()" class="grid-item btn-orange pointer" style="grid-area: 2 / 1 / 3 / 3; border: none;">Edit</div>
            <div v-if="this.errorMode" class="grid-item grid-error" style="grid-area: 1 / 1 / 3 / 3;">
                {{this.error}}
                <span @click="closeError()" class="error-cross pointer">&times;</span>
            </div>
        </div>
    </div>
</template>

<script>
import { firebaseapp } from '../plugins/firebaseapp.js'

export default {
    props: ['user'],
    data() {
        return {
            toUpdate: {
                token: '',
                uid: this.user.uid,
                content: {
                    email: '',
                    phoneNumber: '',
                    displayName: ''
                },
                claims: {
                    status: ''
                }
            },
            editMode: false,
            errorMode: false,
            error: ''
        }
    },
    methods: {
        updateUser() {
            if (firebaseapp.auth().currentUser) {
                firebaseapp.auth().currentUser.getIdToken(false).then((idToken) => {
                    (async () => {
                        this.toUpdate.token = idToken
                        const rawResponse = await fetch('/api/v1/adminusers/update', {
                            method: 'POST',
                            headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(this.toUpdate)
                        });
                        const content = await rawResponse.json();
                        if (content.success != 'true') {
                            this.setError(content.error)
                        } else {
                            this.$emit('reloadUsers')
                        }
                        this.toggleEdit()
                    })();
                }).catch((error) => {
                    this.setError('Unable to get user token')
                }
            )} else {
                this.setError('You must be logged in to have access')
                this.toggleEdit()
            }
        },
        toggleEdit() {
            this.$emit('goToEdit')
        },
        setError(error) {
            this.error = error
            this.errorMode = true
        },
        closeError() {
            this.error = ''
            this.errorMode = false
        }
    }
}
</script>