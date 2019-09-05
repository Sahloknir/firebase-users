<template>
<div class="user-bloc">
    <div v-if="!this.editMode" class="user-container">
        <div class="grid-item grid-color field-title" style="grid-area: 1 / 1 / 2 / 2;">Name</div>
        <div class="grid-item grid-color field-title" style="grid-area: 2 / 1 / 3 / 2;">Email</div>
        <div class="grid-item grid-color field-title" style="grid-area: 3 / 1 / 4 / 2;">Phone</div>
        <div class="grid-item grid-color field-title" style="grid-area: 4 / 1 / 5 / 2;">Status</div>
        <div class="grid-item grid-color" style="grid-area: 1 / 2 / 2 / 3;">{{user.displayName}}</div>
        <div class="grid-item grid-color" style="grid-area: 2 / 2 / 3 / 3;">{{user.email}}</div>
        <div class="grid-item grid-color" style="grid-area: 3 / 2 / 4 / 3;">{{user.phoneNumber}}</div>
        <div class="grid-item grid-color" style="grid-area: 4 / 2 / 5 / 3;">{{user.customClaims.status}}</div>
        <div v-if="!this.deleteMode" @click="toggleDelete()" class="grid-item btn-red pointer" style="grid-area: 5 / 1 / 6 / 2;">Delete</div>
        <div v-if="!this.deleteMode" @click="toggleEdit()" class="grid-item btn-orange pointer" style="grid-area: 5 / 2 / 6 / 3;">Edit</div>
        <div v-if="this.deleteMode" @click="toggleDelete()" class="grid-item btn-orange pointer" style="grid-area: 5 / 1 / 6 / 2;">Cancel</div>
        <div v-if="this.deleteMode" @click="deleteUser()" class="grid-item btn-red pointer" style="grid-area: 5 / 2 / 6 / 3;">Confirm</div>
        <div v-if="this.errorMode" class="grid-item grid-error" style="grid-area: 1 / 1 / 6 / 3;">
            {{this.error}}
            <span @click="closeError()" class="error-cross pointer">&times;</span>
        </div>
    </div>
    <div v-if="this.editMode" class="user-container">
        <div class="grid-item grid-color field-title" style="grid-area: 1 / 1 / 2 / 2;">Name</div>
        <div class="grid-item grid-color field-title" style="grid-area: 2 / 1 / 3 / 2;">Email</div>
        <div class="grid-item grid-color field-title" style="grid-area: 3 / 1 / 4 / 2;">Phone</div>
        <div class="grid-item grid-color field-title" style="grid-area: 4 / 1 / 5 / 2;">Status</div>
        <input v-model="toUpdate.content.displayName" class="grid-item grid-color grid-input" style="grid-area: 1 / 2 / 2 / 3;"/>
        <input v-model="toUpdate.content.email" class="grid-item grid-color grid-input" style="grid-area: 2 / 2 / 3 / 3;"/>
        <input v-model="toUpdate.content.phoneNumber" class="grid-item grid-color grid-input" style="grid-area: 3 / 2 / 4 / 3;"/>
        <select v-model="toUpdate.claims.status" class="grid-item grid-color grid-input" style="grid-area: 4 / 2 / 5 / 3;">
            <option selected disabled>{{user.customClaims.status}}</option>
            <option>user</option>
            <option>moderator</option>
            <option>admin</option>
        </select>
        <div @click="toggleEdit()" class="grid-item btn-orange pointer" style="grid-area: 5 / 1 / 6 / 2;">Cancel</div>
        <div @click="updateUser()" class="grid-item btn-green pointer" style="grid-area: 5 / 2 / 6 / 3;">Save</div>
    </div>
</div>
</template>

<script>
export default {
    props: ['user'],
    data() {
        return {
            toUpdate: {
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
            deleteMode: false,
            editMode: false,
            errorMode: false,
            error: ''
        }
    },
    methods: {
        updateUser() {
            (async () => {
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
            })();
            this.toggleEdit()
        },
        deleteUser() {
            (async () => {
              const rawResponse = await fetch('/api/v1/adminusers/delete', {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.toUpdate.uid)
              });
              const content = await rawResponse.json();
              if (content.success != 'true') {
                  this.setError(content.error)
              } else {
                  this.$emit('reloadUsers')
              }
            })();
        },
        toggleEdit() {
            this.editMode = !this.editMode
            if (this.editMode == true) {
                this.toUpdate.content.email = this.user.email
                this.toUpdate.content.displayName = this.user.displayName
                this.toUpdate.content.phoneNumber = this.user.phoneNumber
                this.toUpdate.claims.status = this.user.customClaims.status
            }
        },
        toggleDelete() {
            this.deleteMode = !this.deleteMode
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

<style>
.user-container {
    width: 98%;
    display: grid;
    grid-template-columns: 50% 50%;
    grid-template-rows: 40px 40px 40px 40px 30px;
    border: solid 1px black;
    margin: 40px 0;
    border-radius: 5px;
    overflow: hidden;
    background-color: #2c3E50;
}
.grid-item {
    display: flex;
    justify-content: center;
    align-items: center;
    border: solid 1px black;
    overflow: hidden;
}
.user-bloc {
    width:100%;
    height:100%;
    display: flex;
    justify-content: center;
}
</style>