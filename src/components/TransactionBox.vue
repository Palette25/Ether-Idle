<template>
    <div id="transHistory">
        <b-modal ref="history" hide-footer title="Your buying / selling history">
            <p class="header"><strong> Pending Goods Transactions  </strong></p>
            <hr/>
            <b-card ref="pend" v-for="item of pendingItems" :key="item.id" :title="item.goodsName" class="mb-2 box">
                <p class="card-text">
                    <strong> Seller: {{ item.sellerName }} </strong>
                </p>
                <p class="card-text">
                    <strong> Buyer: {{ item.buyerName }} </strong>
                </p>
                <p class="card-text">
                    <strong> Price: {{ item.price }} </strong>
                </p>
                <p class="card-text"> Transaction time: {{ item.time }}</p>
                <b-button v-if="item.available" variant="primary" @click="attemptConfirm(item.id)"> Confirm It </b-button>
            </b-card>
            <br/>
            <p class="header"><strong> Confirmed Goods Transactions  </strong></p>
            <hr/>
            <b-card ref="confirm" v-for="item of confirmedItems" :key="item.id" :title="item.goodsName" class="mb-2 box">
                <p class="card-text">
                    <strong> Seller: {{ item.sellerName }} </strong>
                </p>
                <p class="card-text">
                    <strong> Buyer: {{ item.buyerName }} </strong>
                </p>
                <p class="card-text">
                    <strong> Price: {{ item.price }} </strong>
                </p>
                <p class="card-text"> Transaction time: {{ item.time }} </p>
            </b-card>
        </b-modal>
        <b-modal ref="question" hide-footer>
            <b-alert :show="showBox" :dismissible="false" :variant="alertType">
                {{ alertMessage }}
            </b-alert>
            <h3><strong> Attention </strong></h3>
            <hr/>
            <h6 class="card-text ques">
                <strong> Target confirm Goods </strong>
            </h6>
            <h3> {{ confirmTarget.goodsName }} </h3>
            <br/>
            <h6 class="card-text ques">
                <strong> Price </strong>
            </h6>
            <h3> {{ confirmTarget.price }} EI Coins </h3>
            <br/>
            <p class="card-text warning">
                <strong> Really want to confirm this pending transaction? <br/> Make sure you have receive the goods~ </strong>
            </p>
            <br/>
            <b-button variant="success" @click="confirm()">
                Yes, confirm it
            </b-button>
            <b-button variant="danger" @click="reject()">
                No, exit
            </b-button>
        </b-modal>
    </div>
</template>

<script>
export default {
    name: 'TransactionBox',
    data() {
        return {
            pendingItems: [],
            confirmedItems: [],
            confirmTarget: {},
            // About confirm state
            showBox: false,
            alertType: 'info',
            alertMessage: ''
        }
    },
    mounted() {
        // Set interval to get history transactions
        setInterval(() => {
            let eiContract = this.$store.state.EiInstance()
            let coinbase = this.$store.state.web3.coinbase
            // Get pending transactions
            eiContract.methods.getPendingLength(coinbase).call().then((length, err) => {
                if(length == this.pendingItems.length){
                    return;
                }
                for(var i=0; i<length; i++){
                    eiContract.methods.getPendingTrans(coinbase, i).call().then((result, err) => {
                        let newEntity = {
                            id: this.pendingItems.length,
                            sellerAddr: result[0],
                            buyerAddr: result[1],
                            goodsName: result[2],
                            sellerName: result[3],
                            buyerName: result[4],
                            price: result[5],
                        }
                        let unixTimeStamp = new Date(Number(result[6]) * 1000)
                        newEntity.time = unixTimeStamp.toLocaleString()
                        if(coinbase == result[1].toLowerCase()){
                            newEntity.available = true
                        }else {
                            newEntity.available = false
                        }
                        this.pendingItems.unshift(newEntity)
                    })
                }
            })
            // Get confirmed transactions
            eiContract.methods.getConfirmedLength(coinbase).call().then((length, err) => {
                if(length == this.confirmedItems.length){
                    return;
                }
                for(var i=0; i<length; i++){
                    eiContract.methods.getConfirmedTrans(coinbase, i).call().then((result, err) => {
                        let newEntity = {
                            id: this.confirmedItems.length + this.pendingItems.length,
                            goodsName: result[2],
                            sellerName: result[3],
                            buyerName: result[4],
                            price: result[5],
                        }
                        let unixTimeStamp = new Date(Number(result[6]) * 1000)
                        newEntity.time = unixTimeStamp.toLocaleString()
                        this.confirmedItems.unshift(newEntity)
                    })
                }
            })
        }, 2000)
    },
    methods: {
        showHistory() {
            this.$refs.history.show()
        },
        attemptConfirm(index) {
            this.confirmTarget = this.pendingItems[index]
            this.$refs.question.show()
        },
        confirm() {
            let target = this.confirmTarget
            let coinbase = this.$store.state.web3.coinbase
            let eiContract = this.$store.state.EiInstance()
            let userContract = this.$store.state.UserInstance()
            this.showBox = true
            this.alertMessage = "Confirming transaction, please finish behaviors in one minute~"
            eiContract.methods.confirmPendingTrans(target.sellerAddr, target.buyerAddr, target.goodsName).send({from:coinbase})
            .then((result, err) => {
                if(result){
                    this.alertMessage = "Confirm finish~, calculating seller and buyer balance account..."
                    userContract.methods.increaseBalance(target.sellerAddr, target.price).send({from:coinbase})
                    .then((result, err) => {
                        if(result){
                            userContract.methods.decreaseBalance(target.buyerAddr, target.price).send({from:coinbase})
                            .then((result, err) => {
                                if(result){
                                    this.alertMessage = "All things done~ Thank you for using Ether-Idle~"
                                    setTimeout(() => {
                                        this.showBox = false
                                        this.alertType = 'info'
                                        this.$refs.question.hide()
                                    }, 2500)
                                }else confirmError()
                            })
                        }else confirmError()
                    })
                }else confirmError()
            })
        },
        reject() {
            this.$refs.question.hide()
        },
        confirmError() {
            this.alertMessage = "Confirm error, maybe you close the metamask request!"
            this.alertType = 'danger'
            setTimeout(() => {
                this.showBox = false
                this.alertType = 'info'
                this.$refs.question.hide()
            }, 2500)
        }
    }
}


</script>

<style scoped>
.box {
    border-radius: 10%;
    height: 70%;
}

.ques {
    color: #4682B4;
}

.warning {
    color: red;
    font-size: 18px;
}

</style>