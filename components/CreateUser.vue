<template>
    <div class="create-bloc">
        <div class="create-container grid-color">
            <div class="grid-item grid-color field-title" style="grid-area: 1 / 1 / 2 / 2;">Name</div>
            <div class="grid-item grid-color field-title" style="grid-area: 2 / 1 / 3 / 2;">Email</div>
            <div class="grid-item grid-color field-title" style="grid-area: 3 / 1 / 4 / 2;">Phone</div>
            <div class="grid-item grid-color field-title" style="grid-area: 4 / 1 / 5 / 2;">Password</div>
            <div class="grid-item grid-color field-title" style="grid-area: 5 / 1 / 6 / 2;">Status</div>
            <input v-model="toCreate.content.displayName" class="grid-item grid-color grid-input" style="grid-area: 1 / 2 / 2 / 3;"/>
            <input v-model="toCreate.content.email" class="grid-item grid-color grid-input" style="grid-area: 2 / 2 / 3 / 3;"/>
            <input v-model="toCreate.content.phoneNumber" class="grid-item grid-color grid-input" style="grid-area: 3 / 2 / 4 / 3;"/>
            <input v-model="toCreate.content.password" class="grid-item grid-color grid-input" style="grid-area: 4 / 2 / 5 / 3;"/>
            <select v-model="toCreate.claims.status" class="grid-item grid-color grid-input" style="grid-area: 5 / 2 / 6 / 3;">
                <option>user</option>
                <option>moderator</option>
                <option>admin</option>
            </select>
            <div @click="createUser()" class="grid-item btn-green pointer" style="grid-area: 6 / 1 / 7 / 3;">Create</div>
            <div v-if="this.errorMode" class="grid-item grid-error" style="grid-area: 1 / 1 / 7 / 3;">
                {{this.error}}
                <span @click="closeError()" class="error-cross pointer">&times;</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            toCreate: {
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
            errorMode: false,
            error: ''
        }
    },
    methods: {
        createUser() {
            // console.log('user to create: ', this.toCreate)
            (async () => {
              const rawResponse = await fetch('/api/v1/adminusers/create', {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.toCreate)
              });
              const content = await rawResponse.json();
              if (content.success != 'true') {
                  this.setError(content.error)
              } else {
                  this.$emit('reloadUsers')
              }
            })();
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
        this.toCreate.claims.status = 'user'
    }
}
</script>

<style>
.create-container {
    width: 98%;
    display: grid;
    grid-template-columns: 50% 50%;
    grid-template-rows: 40px 40px 40px 40px 40px 30px;
    border: solid 1px black;
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