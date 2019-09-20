<template>
    <div class="users-list">
        <form class="details-container grid-color">
            <div v-for="(field, index) in this.details.fields" :key="index" class="details-row" style="display: grid;">
                <div class="details-item field-title">{{field.title}}</div>
                <input v-model="details.fields[index].value" class="details-item grid-input grid-color" />
            </div>
            <div v-if="this.status == 'admin'" class="details-row">
                <div class="details-item field-title">Status</div>
                <select v-model="userUpdate.claims.status" class="details-item grid-input grid-color">
                    <option selected disabled>{{this.user.customClaims.status}}</option>
                    <option>user</option>
                    <option>admin</option>
                </select>
            </div>
            <div class="details-row" :style="{ 'grid-row-end': 'span ' + (2 + Math.round(this.services.length / 2)) + '', 'grid-template-columns': '100%'}">
                <div style="border: solid 1px #d8d8d8;">
                    <div class="field-title" style="margin: 15px 0 15px 35px">Services</div>
                    <div class="checkbox-bloc">
                        <div v-for="(service, index) in this.services" :key="index" style="display: flex; justify-content: flex-start; align-items: center">
                            <label class="checkbox-container">
                                <input type="checkbox" v-model="service.value">
                                <span class="checkmark"></span>
                                <div style="margin-left: 32px">{{service.name}}</div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="details-row" :style="{ 'grid-row-end': 'span ' + (this.vendorsLength + this.details.vendors.length) + '', 'grid-template-columns': '100%'}">
                <div style="border: solid 1px #d8d8d8;">
                    <div class="field-title" style="margin: 15px 0 15px 35px">Vendors</div>
                    <div class="vendors-bloc">
                        <div class="vendors-list">
                            <div class="grid-item field-title">Id</div>
                            <div class="grid-item field-title">Name</div>
                            <div v-for="(vendor, index) in this.details.vendors" :key="index" class="details-row" style="grid-column-end: span 2">
                                <div class="grid-item">
                                    <div @click="removeVendor(index)" class="btn-red pointer grid-btn" :class="{'open-slot': deleteMode[index], 'closed-slot': !deleteMode[index]}">Confirm</div>
                                    <div class="grid-slot" style="justify-content: center;" :class="{'open-slot': !deleteMode[index], 'closed-slot': deleteMode[index]}">
                                        {{vendor.id}}
                                    </div>
                                </div>
                                <div class="grid-item" style="justify-content: space-between;">
                                    <div class="grid-slot" :class="{'open-slot': !deleteMode[index], 'closed-slot': deleteMode[index]}">
                                        <div style="width: 20px"></div>{{vendor.name}}<div @click="toggleDelete(index)" class="delete-cross pointer">&times;</div>
                                    </div>
                                    <div @click="toggleDelete(index)" class="btn-orange pointer grid-btn" :class="{'open-slot': deleteMode[index], 'closed-slot': !deleteMode[index]}">Cancel</div>
                                </div>
                            </div>
                            <form @submit="addVendor" v-if="this.addMode" class="details-row" style="grid-column-end: span 2">
                                <button type="submit" class="grid-item btn-blue pointer" style="border: none; font-size: 16px;">Ajouter</button>
                                <input v-model="newVendor" placeholder="Saisir Nom" class="grid-input grid-color" required>
                            </form>
                        </div>
                        <div v-if="!this.addMode" @click="addModeOn()" class="grid-item btn-blue pointer" style="grid-area: 2 / 1 / 3 / 1; border: none; font-weight: bold; font-size: 22px">+</div>
                        <div v-if="this.addMode" @click="addModeOff()" class="grid-item btn-red pointer" style="grid-area: 2 / 1 / 3 / 1; border: none; font-weight: bold; font-size: 22px">&times;</div>
                    </div>
                </div>
            </div>
            <div v-if="this.errorMode" class="grid-item grid-error" style="grid-row-end: span 3;">
                {{this.error}}
                <span @click="closeError()" class="error-cross pointer">&times;</span>
            </div>
            <div v-if="!this.errorMode" @click="saveContent()" class="grid-item btn-green pointer" style="border: none;">Save</div>
        </form>
    </div>
</template>

<script>
import { firebaseapp, db } from '../plugins/firebaseapp.js'

export default {
    props: ['user', 'status'],
    data() {
        return {
            myDoc: '',
            services: [
                {
                    id: 'DIAGADO',
                    name: 'Diagnostic à Domicile',
                    value: false
                },
                {
                    id: 'TINTMACHINE',
                    name: 'Tint Machine',
                    value: false
                },
                {
                    id: 'LOXAM',
                    name: 'Loxam',
                    value: false
                },
                {
                    id: 'DECOUPEVERREBOIS',
                    name: 'Découpe verre & bois',
                    value: false
                }
            ],
            userUpdate: {
                token: '',
                uid: this.user.uid,
                content: {
                    email: '',
                    phoneNumber: '',
                    displayName: ''
                },
                claims: {
                    status: this.user.customClaims.status
                }
            },
            details: {
                fields: [],
                services: '',
                vendors: []
            },
            newVendor: '',
            deleteMode: [],
            errorMode: false,
            error: '',
            addMode: false,
            vendorsLength: 4
        }
    },
    methods: {
        addModeOn() {
            this.newVendor = ''
            this.addMode = true
            this.vendorsLength++
        },
        addModeOff() {
            this.newVendor = ''
            this.addMode = false
            this.vendorsLength--
        },
        mapServices() {
            this.details.services.split(",").forEach((activeService) => {
                this.services.forEach((service) => {
                    if (service.id == activeService) {
                        service.value = true
                    }
                })
            })
        },
        addVendor(event) {
            event.preventDefault()
            let vendor = {
                id: Math.floor(Math.random() * (10000000000 - 999999999) + 999999999).toString(),
                name: this.newVendor
            }
            this.details.vendors.push(vendor)
            this.newVendor = ''
        },
        removeVendor(index) {
            this.details.vendors.splice(index, 1)
            this.deleteMode.splice(index, 1)
        },
        updateUser(Ref, toUpdate) {
            if (firebaseapp.auth().currentUser) {
                firebaseapp.auth().currentUser.getIdToken(false).then((idToken) => {
                    (async () => {
                        this.userUpdate.token = idToken
                        const rawResponse = await fetch('/api/v1/adminusers/update', {
                            method: 'POST',
                            headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(this.userUpdate)
                        });
                        const content = await rawResponse.json();
                        if (content.success != 'true') {
                            this.setError(content.error)
                        } else {
                            console.log('updating')
                            Ref.update(toUpdate)
                            this.$emit('reloadUsers')
                        }
                    })();
                }).catch((error) => {
                    this.setError('Unable to get user token')
                }
            )} else {
                this.setError('You must be logged in to have access')
            }
        },
        saveContent() {
            let toUpdate = {}
            this.details.fields.forEach((field) => {
                toUpdate[field.title] = field.value
            })
            let services = ''
            for (let i = 0; i < this.services.length; i++) {
                if (this.services[i].value == true) {
                    if (services.length != 0) {
                        services+= ','
                    }
                    services+= this.services[i].id
                }
            }
            toUpdate.services_available = services
            let vendors = []
            this.details.vendors.forEach((vendor) => {
                let newVendor = {
                    id: vendor.id,
                    name: vendor.name
                }
                vendors.push(newVendor)
            })
            toUpdate.vendors = vendors
            var Ref = db.collection("shops").doc(this.myDoc)
            this.userUpdate.content.email = toUpdate['email']
            this.userUpdate.content.phoneNumber = toUpdate['tel']
            this.userUpdate.content.displayName = toUpdate['name']
            this.updateUser(Ref, toUpdate)
        },
        closeError() {
            this.error = ''
            this.errorMode = false
        },
        toggleDelete(index) {
            this.$set(this.deleteMode, index, !this.deleteMode[index])
        },
        setError(error) {
            this.error = error
            this.errorMode = true
        }
    },
    mounted() {
        db.collection("shops").where("email", "==", this.user['email']).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.exists) {
                    this.myDoc = doc.id
                    let index = 0
                    Object.keys(doc.data()).forEach((title) => {
                        let newField = {
                            title: title,
                            value: Object.values(doc.data())[index]
                        }
                        if (title != 'vendors' && title != 'services_available') {
                            this.details.fields.push(newField)
                        }
                        index++
                    })
                    this.details.services = doc.data().services_available
                    this.mapServices()
                    doc.data().vendors.forEach((vendor) => {
                        this.details.vendors.push(vendor)
                        this.deleteMode.push(false)
                    })
                }
            })
        })
    }
}
</script>

<style>
.closed-slot {
    width: 0;
}
.open-slot {
    width: 100%;
}
.grid-btn{
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    transition: all 0.2s ease-in-out 0s;
}
.grid-slot {
    height: 100%;
    display: flex;
    justify-content: space-between;
    overflow: hidden;
    align-items: center;
    transition: all .2s ease-in-out;
}
.delete-cross {
    color: red;
    font-weight: bold;
    font-size: 25px;
    line-height: 0.8;
    margin: 0 5px;
}
.details-container {
    width: 98%;
    display: grid;
    grid-template-columns: 100%;
    grid-auto-rows: 40px;
    margin: 40px 0;
    border-radius: 5px;
    overflow: hidden;
}
.details-item {
    display: flex;
    justify-content: center;
    align-items: center;
    border: solid 1px #d8d8d8;
}
.vendors-bloc {
    width: 98%;
    display: grid;
    margin: 0 1%;
    border-radius: 5px;
    overflow: hidden;
    grid-template-columns: 100%;
    grid-template-rows: auto 35px;
}
.vendors-list {
    width: 100%;
    display: grid;
    border: solid 1px #d8d8d8;
    overflow: hidden;
    grid-template-columns: 50% 50%;
    grid-auto-rows: 40px;
}
.checkbox-bloc {
    width: 100%;
    display: grid;
    grid-template-columns: 50% 50%;
    grid-auto-rows: 40px;
}
.checkbox-container {
  display: block;
  position: relative;
  margin-left: 15px;
  cursor: pointer;
  font-size: 18px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}
.checkmark {
  position: absolute;
  height: 22px;
  width: 22px;
  background-color: #d8d8d8;
}
.checkbox-container:hover input ~ .checkmark {
  background-color: #ccc;
}
.checkbox-container input:checked ~ .checkmark {
  background-color: #2196F3;
}
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}
.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}
.checkbox-container .checkmark:after {
  left: 9px;
  top: 6px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
</style>