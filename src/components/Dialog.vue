<template>
    <b-modal id="Box" ref="Box" hide-footer>
        <b-alert ref="headAlert" :show="showBox" @dismissed="showBox=false;" :dismissible="alertDismissable" :variant="alertType" class="dialog">
            {{ alertMessage }}
        </b-alert>
        <div id="registerBox" v-if="register">
            <p><strong> Welcome to Ether-Idle~ </strong></p>
            <p> Please sign up your EI Account below... </p>
            <b-form @submit.prevent="onRegister">
                <b-form-input type="text" id="register-username" v-model="reg_username" required placeholder="Enter your username">
                </b-form-input>
                <br/>
                <b-form-group description="You should remember your password all the time, to keep your account's safety~">
                    <b-form-input type="text" id="register-password" v-model="reg_password" require placeholder="Enter your password">
                    </b-form-input>
                </b-form-group>
                <b-button type="submit" variant="primary"> Regist Account </b-button>
            </b-form>
            <br/>
        </div>
        <div id="loginBox" v-if="login">
            <p><strong> Welcome Back, {{ username }}~ </strong></p>
            <p> Enter your password to unlock Account: </p>
            <b-form @submit.prevent="onLogin">
                <b-form-group>  
                    <b-form-input type="text" id="login-password" v-model="login_password" require placeholder="Enter your password">
                    </b-form-input>
                </b-form-group>
                <b-button type="submit" variant="primary"> Login Account </b-button>
            </b-form>
            <br/>
        </div>
        <div id="errBox" v-if="error">
            <p><strong>{{ errMessage }} ! </strong></p>
        </div>
    </b-modal>
</template>

<script>
import Vue from 'vue'
import Vuex from 'vuex'
import crypto from 'crypto'

export default {
    name: 'Dialog',
    data() {
        return {
            register: false,
            login: false,
            username: "",
            reg_username: "",
            reg_password: "",
            login_password: "",
            showBox: false,
            showDialog: true,
            alertDismissable: false,
            alertMessage: "",
            coinbase: '',
            error: false,
            errMessage: ''
        }
    },
    mounted(){
        this.initDialog()
    },
    computed: {
        alertType() {
            return this.error ? 'danger' : (this.alertDismissable ? 'danger' : 'info')
        }
    },
    methods: {
        initDialog(para) {
            if(this.$store.state.user.username && para){
                this.$refs.Box.show()
                this.showBox = true
                this.error = true
                this.errMessage = "Already Login, don't try to sign in anymore~"
                this.alertDismissable = false
                this.alertMessage = "Error"
                return;
            }else if(this.username !== '' && !para){
                this.$refs.Box.show()
                this.showBox = true
                this.error = true
                this.login = false
                this.alertDismissable = false
                this.alertMessage = "Error"
                if(this.$store.state.user.username){
                    this.errMessage = "Already Login, don't try to regist anymore~"
                }else {
                    this.errMessage = "Already have registed username, Please try login ethod~"
                }
                return;
            }
            this.alertMessage = ''
            this.showBox = false
            this.error = false
            if(this.$store.state.UserInstance){
                this.coinbase = this.$store.state.web3.coinbase
                // Search whether user address registered or not
                let userContract = this.$store.state.UserInstance()
                userContract.methods.checkUserAddressExist(this.coinbase).call().then((result, err) => {
                    if(result && this.$store.state.user.username !== null){
                        console.log(this.$store.state.user.username)
                    }else {
                        this.$refs.Box.show()
                        if(result){
                            this.login = true
                            userContract.methods.getUserInfo(this.coinbase).call().then((result, err) => {
                                if(!err && result[0]){
                                    this.username = result[1]
                                }
                            })
                        }else{
                            this.register = true
                        }
                    }
                })
            }else {
                setTimeout(this.initDialog, 1000)
            }
        },
        onRegister() {
            this.showBox = true
            this.alertMessage = "Logging up...."
            let userContract = this.$store.state.UserInstance()
            // Use md5 hashing password, keeping safety
            let md5 = crypto.createHash('md5')
            md5.update(this.reg_password)
            let pass = md5.digest('hex')
            // Send contract create user request
            userContract.methods.createNewUser(this.coinbase, this.reg_username, pass).send({from:this.coinbase}).then((result, err) => {
                this.alertMessage = "User creation Pending, please several seconds..."
                setTimeout(() => {
                    userContract.methods.getUserInfo(this.coinbase).call().then((result, err) => {
                        if(result){
                            this.alertMessage = "Regist Success !"
                            setTimeout(() => {
                                this.showDialog = false
                                this.register = false
                                this.$store.state.user.username = this.reg_username
                                this.$refs.Box.hide()
                                this.$emit("userLogin", this.reg_username)
                            }, 200)
                        }else {
                            this.alertMessage = "Regist Error! Please Check whether user exists or not!"
                            this.alertDismissable = true
                        }
                    })
                }, 10000)
            })
        },
        onLogin() {
            this.showBox = true
            this.alertMessage = "Logging in...."
            let userContract = this.$store.state.UserInstance()
            // Use md5 hashing password, keeping safety
            let md5 = crypto.createHash('md5')
            md5.update(this.login_password)
            let pass = md5.digest('hex')
            userContract.methods.loginUser(this.coinbase, this.username, pass).call().then((result, err) => {
                if(result[0]){
                     this.alertMessage = "Login Success !"
                    setTimeout(() => {
                        this.showDialog = false
                        this.login = false
                        this.$store.state.user.username = Object.assign(this.username).toString()
                        this.$refs.Box.hide()
                        this.$emit("userLogin", this.username)
                    }, 200)
                }else {
                    this.alertMessage = "Password Error! Fail to login"
                    this.alertDismissable = true
                    this.login_password = ''
                }
            })
        }
    }
}

</script>

<style scoped>
#Box {
    height: 400px;
    vertical-align: middle;
    width: 380px;
    position: absolute;
    background-color: #ffffff;
    box-shadow: 0 4px 10px #999;
    border-radius: 10px;
    overflow: auto;
    margin: auto;
    bottom: 0;
    left: 0;
    right: 0;
    color: #000;
    transition: all 0.5s;
}

#registerBox, #loginBox {
    width: 80%;
    word-break: break-all; 
    margin: auto;
}

.dialog{
    word-break: normal;
}

</style>
