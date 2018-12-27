<template>
  <div class='metamask-info'>
    <div id="title-img">
      <img src="../assets/title.png" style="margin-top:-30px;" />
    </div>
    <b-button-group class="btns">
      <b-button variant="success" class="btn" @click="attemptLogin">Log in</b-button>
      <b-button variant="info" class="btn" @click="attemptRegist">Register</b-button>
      <b-button variant="primary" class="btn" @click="attemptUpdateGoods">Update Goods</b-button>
      <b-button variant="warning" class="btn" @click="attemptHistory">My Transaction History</b-button>
      <b-button variant="outline-success" class="btn" @click="attemptRecharge"> Recharge My EI Coins </b-button>
    </b-button-group>
    <div id="address">Current Address: {{ coinbase }}</div>
    <div class="info-btn" v-on:click="checkUserInfo" ref="userimg">
      <div id="infoBox" v-if="userInfo">
        <div id="userImg" ref="head"></div>
        <p><strong> {{ username }}  </strong></p>
        <p class="balance"> {{ userbalance }} EI Coins </p>
        <br/>
        <p class="redstate" v-if="!login"> State: Not Login </p>
        <p class="greenstate" v-if="login"> State: Already Login </p>
      </div>
    </div>
    <RegisterDialog v-on:userLogin="changeUserState" ref="Dialog" />
    <div id="goods">
      <b-card ref="card" v-for="item of items" :key="item.id" :title="item.title" class="mb-2 good">
        <br/>
        <p class="card-text">
            <strong>Info</strong> : {{ item.info }}
        </p>
        <p class="card-text">
          <strong>Description</strong> : {{ item.description }}
        </p>
        <br/>
        <p class="seller"> Seller: {{ item.seller }} </p>
        <p class="price"> Price: {{ item.price }} EI Coins </p>
        <b-button variant="primary" @click="attemptBuy(item.id)"> Buy it </b-button>
      </b-card>
    </div>
    <b-modal id="UpdateGood" ref="Update" title="Create New Goods" hide-footer>
      <b-alert :show="showBox" @dismissed="showBox=false;" :dismissible="false" :variant="alertType">
            {{ alertMessage }}
      </b-alert>
      <p><strong> Current Seller: {{ username }} </strong></p>
      <b-form @submit.prevent="pendGoods">
        <b-form-input type="text" id="good_name" v-model="good_name" required placeholder="Enter your goods name" class="mb-3">
        </b-form-input>
        <b-form-input type="text" id="good_info" v-model="good_info" required placeholder="Enter your goods information" class="mb-3">
        </b-form-input>
        <b-form-input type="text" id="good_desc" v-model="good_desc" required placeholder="Enter your goods description" class="mb-3">
        </b-form-input>
        <b-form-input type="text" id="good_price" v-model="good_price" required placeholder="Enter your goods price, in EI Weis" class="mb-3">
        </b-form-input>
        <b-button type="submit" variant="primary"> Update My Goods </b-button>
      </b-form>
    </b-modal>
    <b-modal ref="errBox" hide-footer>
        <b-alert variant="danger" :dismissible="false" :show="true">
            {{ errMessage }}
        </b-alert>
    </b-modal>
    <b-modal ref="rechargeBox" title="Recharge EI Account" hide-footer>
      <b-alert :show="showBox" @dismissed="showBox=false;" :dismissible="false" :variant="alertType">
          {{ alertMessage }}
      </b-alert>
      <p class="rate"><strong> Exchange Rate: 1 EI Coin  ==  1 Mwei  ==  10^(-12) Ether </strong></p>
      <hr/>
      <b-form @submit.prevent="rechargeEI">
        <b-form-input type="text" id="EICoin" v-model="EICoin" required placeholder="Enter target EI Coins amount" class="mb-3">
        </b-form-input>
        <b-button type="submit" variant="success"> Recharge my EI Balance </b-button>
      </b-form>
    </b-modal>
    <b-modal ref="buyGoods" title="Buy New Goods" hide-footer>
      <b-alert :show="showBox" @dismissed="showBox=false;" :dismissible="false" :variant="alertType">
            {{ alertMessage }}
      </b-alert>
      <p><strong> Really want to buy this stuff ? </strong></p>
      <b-card :title="buyTarget.title" class="mb-2 detailGood">
        <br/>
        <p class="card-text">
            <strong>Info</strong> : {{ buyTarget.info }}
        </p>
        <p class="card-text">
          <strong>Description</strong> : {{ buyTarget.description }}
        </p>
        <br/>
        <p class="seller"> Seller: {{ buyTarget.seller }} </p>
        <p class="price"> Price: {{ buyTarget.price }} EI Coins </p>
        <br/><br/>
        <b-button variant="primary" @click="acceptGoods()"> Buy it </b-button>
        <b-button variant="secondary" @click="rejectGoods()"> No, thanks </b-button>
      </b-card>
    </b-modal>
    <TransactionBox ref="history"/>
  </div>
</template>

<script>
import {NETWORKS} from '../utils/constant/Networks'
import {mapState} from 'vuex'
import Dialog from '@/components/Dialog'
import TransactionBox from '@/components/TransactionBox'
import blockies from '../../build/blockies.js'
import crypto from 'crypto'

export default {
  name: 'Index',
  data() {
    return {
        userInfo: false,
        username: '',
        userbalance: 0,
        items: [
            
        ],
        login: false,
        userRequest: 0,
        // Store current goods length
        goods_length: 0,
        total_length: 0,
        // For temp goods info
        good_name: '',
        good_info: '',
        good_desc: '',
        good_price: '',
        // For showing error alert
        showBox: false,
        alertDismissable: false,
        alertMessage: '',
        errMessage: '',
        // For buying behavior variables
        buyTarget: {},
        // Gneral timeout, force behavior to be done in thirty seconds
        timeout: 0,
        // EI Recharge
        EICoin: ''
    }
  },
  mounted() {
    // Create user blockies head image
    setTimeout(() => {
        this.$refs.userimg.appendChild(blockies.create({
            seed: this.$store.state.web3.coinbase.toLowerCase(),
            size: 10,
            scale: 4
        }))
        if(this.$store.state.web3.coinbase !== null)
        return;
    }, 200)
    // Set Interval to listen to goods appending
    setInterval(() => {
        let goodsContract = this.$store.state.GoodsInstance()
        goodsContract.methods.getLength().call().then((result, err) => {
            if(result != this.total_length){
                let length = result - this.goods_length
                // Invoke pending
                for(var i=0; i<length; i++){
                    setTimeout(() => {
                      goodsContract.methods.getTargetGoods(this.goods_length++).call().then((result, err) => {
                        if(result[1] == ""){
                          return;
                        }
                        let newEntity = {
                            id: this.total_length++,
                            title: result[1],
                            info: result[2],
                            description: result[3],
                            price: result[4],
                            trueID: result[5]
                        }
                        // Get seller real name
                        let userContract = this.$store.state.UserInstance()
                        userContract.methods.getUserInfo(result[0]).call().then((res, err) => {
                            if(res[0]){
                                newEntity.seller = res[1]
                            }
                            this.items.unshift(newEntity)
                    })
                    }), 1000})
                }
                setTimeout(() => {
                  let cards = this.$refs.card
                  if(cards == undefined) return;
                  // Compute Goods Info's md5 hash to create unique image
                  for(var i=0; i<cards.length; i++){
                    if(cards[i].children.length == 2){
                      continue;
                    }
                    let md5 = crypto.createHash('md5')
                    let str = JSON.stringify(this.items[i])
                    md5.update(str)
                    let key = md5.digest('hex')
                    cards[i].insertBefore(blockies.create({
                        seed: key,
                        size: 18,
                        scale: 10
                    }), cards[i].childNodes[0])
                  }
                }, 1200)
            }
        })
    }, 1000)
  },
  components: {
    'RegisterDialog': Dialog,
    'TransactionBox': TransactionBox
  },
  computed: mapState({
      isInjected: state => state.web3.isInjected,
      network: state => NETWORKS[state.web3.networkId],
      coinbase: state => state.web3.coinbase,
      balance: state => state.web3.balance,
      ethBalance: state => {
        if (state.web3.web3Instance !== null && !isNaN(state.web3.balance)){
          return state.web3.web3Instance().utils.fromWei(state.web3.balance.toString(), 'ether')
        }
      },
      alertType() {
        return (this.alertDismissable ? 'danger' : 'info')
    }
    }),
  methods: {
    checkUserInfo(event) {
      this.userInfo = !this.userInfo
      if(this.userInfo){
        let coinbase = this.$store.state.web3.coinbase
        let userContract = this.$store.state.UserInstance()
        userContract.methods.getUserInfo(coinbase).call().then((result, err) => {
          this.username = result[1]
          userContract.methods.getBalanceByAddr(coinbase).call().then((result, err) => {
            this.userbalance = result
          })
        })
        setTimeout(() => {
          this.$refs.head.appendChild(blockies.create({
            seed: this.$store.state.web3.coinbase.toLowerCase(),
            size: 10,
            scale: 8
          }))
        }, 200)
      }
    },
    changeUserState(event) {
      this.login = true
      console.log(event)
      this.username = event
    },
    attemptLogin(event) {
        this.$refs.Dialog.initDialog(true)
    },
    attemptRegist(event) {
        this.$refs.Dialog.initDialog(false)
    },
    attemptUpdateGoods(event) {
        // Check user login or not
        if(!this.$store.state.user.username){
            this.errMessage = 'Please Sign in your account first !'
            this.$refs.errBox.show()
        }else {
            // Update goods to contract
            this.$refs.Update.show()
        }
    },
    attemptHistory(){
      if(!this.$store.state.user.username){
        this.errMessage = 'Please Sign in your account first !'
        this.$refs.errBox.show()
      }else {
        this.$refs.history.showHistory()
      }
    },
    attemptBuy(index) {
        if(index < 0 || index > this.items.length){
          this.errMessage = 'Click target error !'
          this.$refs.errBox.show()
          return;
        }else if(!this.$store.state.user.username){
          this.errMessage = 'Please sign in your account first !'
          this.$refs.errBox.show()
          return;
        }
        // Check user balance enough or not
        let userContract = this.$store.state.UserInstance()
        let coinbase = this.$store.state.web3.coinbase
        userContract.methods.getBalanceByAddr(coinbase).call().then((result, err) => {
          // Get target goods informations
          let target = this.items[this.items.length - 1 - index]
          if(target.seller == this.$store.state.user.username){
            this.errMessage = 'Do not try to buy goods created by yourself ~'
            this.$refs.errBox.show()
            return;
          }
          if(Number(result) < target.price){
            this.errMessage = 'You do not have enough EI Coins to buy this stuff!'
            this.$refs.errBox.show()
            return;
          }else {
            this.buyTarget = target
            this.$refs.buyGoods.show()
          }
        })
    },
    attemptRecharge() {
      if(!this.$store.state.user.username){
        this.errMessage = 'Please Sign in your account first !'
        this.$refs.errBox.show()
      }else {
        this.$refs.rechargeBox.show()
      }
    },
    acceptGoods() {
      this.showBox = true
      this.alertMessage = "Pending buy request, please finish all pending behaviors in one minute..."
      // Send transaction request
      let targetID = this.buyTarget.trueID
      let coinbase = this.$store.state.web3.coinbase
      let userContract = this.$store.state.UserInstance()
      let goodsContract = this.$store.state.GoodsInstance()
      let eiContract = this.$store.state.EiInstance()
      goodsContract.methods.acceptGoods(targetID).send({from:coinbase}).then((result, err) => {
        if(result){
          this.alertMessage = "Buying target goods successfully! \n Now please finish pending transaction to your personal history!"
          this.items.splice(this.items.length - 1 - this.buyTarget.id, 1)
          userContract.methods.getAddrByName(this.buyTarget.seller).call().then((result, err) => {
            let buyername = this.$store.state.user.username
            eiContract.methods.addPendingTrans(result, coinbase, this.buyTarget.title, this.buyTarget.seller, buyername, this.buyTarget.price)
            .send({from:coinbase}).then((res, err) => {
              this.alertMessage = "All buying works done~ Thank you for using Ether-Idle~"
              setTimeout(() => {
                this.$refs.buyGoods.hide()
              }, 2000)
            })
          })
        }else {
          this.alertMessage = "Error with buying goods!"
          this.alertDismissable = true
        }
      })
    },
    rejectGoods() {
      this.$refs.buyGoods.hide()
      setTimeout(() => {
        this.buyTarget = {}
      }, 1000)
    },
    pendGoods() {
        let coinbase = this.$store.state.web3.coinbase
        let goodsContract = this.$store.state.GoodsInstance()
        this.showBox = true
        this.alertMessage = "Pending new good, please wait several seconds until all things done~"
        goodsContract.methods.createNewGoods(coinbase, this.good_name, this.good_price, this.good_info, this.good_desc)
        .send({from:coinbase}).then((result, err) => {
            console.log(result)
            if(result){
                this.alertMessage = 'Creating New Goods:' + this.good_name + ' Successfully~'
            }else {
                this.alertDismissable = true
                this.alertMessage = 'Error with new goods pending !'
            }
            setTimeout(() => {
              this.$refs.Update.hide()
              this.showBox = false
            }, 2000)
        })
    },
    rechargeEI() {
      let EIRoot = "0x53fb7dc367adc0995be0a8186893eac88aba457e"
      let web3 = this.$store.state.web3.web3Instance()
      let coinbase = this.$store.state.web3.coinbase
      let wei = Number(this.EICoin) * Math.pow(10, 6)
      let userContract = this.$store.state.UserInstance()
      // Showing transaction infos
      this.showBox = true
      this.alertMessage = "Recharging your EI Account, please wait for several seconds..."
      web3.eth.sendTransaction({from:coinbase, to:EIRoot, value:wei}, (err, result) => {
        if(result){
          userContract.methods.increaseBalance(coinbase, this.EICoin).send({from:coinbase}).then((res, err) => {
            if(res){
              this.alertMessage = "Recharge EI Balance finish~ Thank you for using Ether-Idle~"
            }else {
              this.alertMessage = "Recharge failed !"
              this.alertDismissable = true
            }
            setTimeout(() => {
              this.$refs.rechargeBox.hide()
              this.showBox = false
              this.alertDismissable = false
            }, 2000)
          })
        }else {
          this.alertMessage = "Recharge failed !"
          this.alertDismissable = true
          setTimeout(() => {
              this.$refs.rechargeBox.hide()
              this.showBox = false
              this.alertDismissable = false
            }, 2000)
        }
      })
    }
  }
}
</script>

<style scoped>
#title-img {
  margin-top: 80px;
}

#address {
  position: absolute;
  color:#4682B4;
  font-weight: bold;
  right: 10px;
  top: 250px;
}

.metamask-info {
  text-align:center;
  float: left;
  width: 100%;
  height: 250px;
  background-color: #ADD8E6;
  margin-top: -5px;
  padding-top: 5px;
}

.info-btn {
  cursor: pointer;
  float: right;
  width: 65px;
  height: 65px;
  padding: 10px;
  border: solid white 3px;
  border-radius: 50%;
  margin-right: 30px;
  margin-top: -150px;
  transition: all 0.3s;
}

.info-btn:hover {
  transform: scale(1.1);
}

#infoBox{
  position: fixed;
  float: right;
  height: 300px;
  width: 200px;
  border-radius: 10px;
  margin: auto;
  margin-top: 30px;
  right: 70px;
  background-color: white;
  transition: all 0.3s;
  color: gray;
  z-index: 9999;
}

#userImg {
  height: 80px;
  width: 80px;
  border-radius: 50%;
  background-size: 80px 80px;
  border: solid #FEFEFE 3px;
  margin: auto;
  margin-bottom: 50px;
  margin-top: 20px;
}

.balance {
  font-size: 22px;
  font-weight: bold;
  margin: auto;
}

.redstate {
  color: red;
}

.greenstate {
  color: green;
}

#goods {
  width: 90%;
  height: 250%;
  margin: 50px;
  margin-right: 0px;
  margin-top: 50px;
  margin-bottom: 100px;
}

.good {
  float: left;
  margin-top: 50px;
  border-radius: 10%;
  min-height: 580px;
  max-height: 700px;
  width: 320px;
  margin-right: 59px;
}

.detailGood {
  margin-left: 15%;
  margin-top: 50px;
  border-radius: 10%;
  min-height: 500px;
  max-height: 700px;
  width: 320px;
}

.seller {
  font-weight: bold;
  font-size: 18px;
  color: #228B22;
}

.price {
  font-weight: bold;
  font-size: 18px;
  color: #DB7093;
}

.btns {
  margin-top: 30px;
}

.btn {
  margin-right: 10px;
}

.rate {
  color:cadetblue;
  font-size: 17px;
}

canvas{
  z-index: -1;
}

</style>
