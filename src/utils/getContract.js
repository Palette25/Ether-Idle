import Web3 from 'web3'
import {UserAddress, UserAbi, GoodsAddress, GoodsAbi, EIAddress, EIAbi} from './constant/Contract_Info'
import {store} from '../store/'

let getUserContract = new Promise(function(resolve, reject) {
  let web3 = new Web3(window.web3.currentProvider);
  let UserInstance =  new web3.eth.Contract(UserAbi, UserAddress);
  if (!UserInstance) {
    reject("no contract instance build")
  }
  resolve(UserInstance);
});

let getGoodsContract = new Promise(function(resolve, reject){
    let web3 = new Web3(window.web3.currentProvider);
    let GoodsInstance =  new web3.eth.Contract(GoodsAbi, GoodsAddress);
    if (!GoodsInstance) {
      reject("no contract instance build")
    }
    resolve(GoodsInstance);
});

let getEIContract = new Promise(function(resolve, reject){
    let web3 = new Web3(window.web3.currentProvider);
    let EiInstance =  new web3.eth.Contract(EIAbi, EIAddress);
    if (!EiInstance) {
      reject("no contract instance build")
    }
    resolve(EiInstance);
});

export {getUserContract, getGoodsContract, getEIContract}
