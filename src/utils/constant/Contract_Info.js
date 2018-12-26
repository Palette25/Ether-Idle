const UserAbi = [
	{
		"constant":false,
		"inputs":[
			{
				"name":"addr",
				"type":"address"
			},
			{
				"name":"name",
				"type":"string"
			},
			{
				"name":"password",
				"type":"string"
			}
		],
		"name":"createNewUser",
		"outputs":[
			{
				"name":"result",
				"type":"bool"
			},
			{
				"name":"errMess",
				"type":"string"
			}
		],
		"payable":false,
		"stateMutability":"nonpayable",
		"type":"function"
	},
	{
		"constant":false,
		"inputs":[
			{
				"name":"targetAddr",
				"type":"address"
			},
			{
				"name":"count",
				"type":"uint256"
			}
		],
		"name":"decreaseBalance",
		"outputs":[
			{
				"name":"result",
				"type":"bool"
			}
		],
		"payable":true,
		"stateMutability":"payable",
		"type":"function"
	},
	{
		"constant":false,
		"inputs":[
			{
				"name":"targetAddr",
				"type":"address"
			},
			{
				"name":"count",
				"type":"uint256"
			}
		],
		"name":"increaseBalance",
		"outputs":[
			{
				"name":"result",
				"type":"bool"
			}
		],
		"payable":true,
		"stateMutability":"payable",
		"type":"function"
	},
	{
		"constant":false,
		"inputs":[
			{
				"name":"addr",
				"type":"address"
			},
			{
				"name":"name",
				"type":"string"
			},
			{
				"name":"password",
				"type":"string"
			}
		],
		"name":"loginUser",
		"outputs":[
			{
				"name":"result",
				"type":"bool"
			},
			{
				"name":"errMess",
				"type":"string"
			}
		],
		"payable":false,
		"stateMutability":"nonpayable",
		"type":"function"
	},
	{
		"constant":true,
		"inputs":[
			{
				"name":"addr",
				"type":"address"
			}
		],
		"name":"checkUserAddressExist",
		"outputs":[
			{
				"name":"isExist",
				"type":"bool"
			}
		],
		"payable":false,
		"stateMutability":"view",
		"type":"function"
	},
	{
		"constant":true,
		"inputs":[
			{
				"name":"name",
				"type":"string"
			}
		],
		"name":"getAddrByName",
		"outputs":[
			{
				"name":"addr",
				"type":"address"
			}
		],
		"payable":false,
		"stateMutability":"view",
		"type":"function"
	},
	{
		"constant":true,
		"inputs":[
			{
				"name":"addr",
				"type":"address"
			}
		],
		"name":"getBalanceByAddr",
		"outputs":[
			{
				"name":"balance",
				"type":"uint256"
			}
		],
		"payable":false,
		"stateMutability":"view",
		"type":"function"
	},
	{
		"constant":true,
		"inputs":[
			{
				"name":"addr",
				"type":"address"
			}
		],
		"name":"getUserInfo",
		"outputs":[
			{
				"name":"result",
				"type":"bool"
			},
			{
				"name":"username",
				"type":"string"
			},
			{
				"name":"userTime",
				"type":"uint256"
			},
			{
				"name":"userIndex",
				"type":"uint256"
			}
		],
		"payable":false,
		"stateMutability":"view",
		"type":"function"
	},
	{
		"constant":true,
		"inputs":[
			{
				"name":"",
				"type":"uint256"
			}
		],
		"name":"userAddresses",
		"outputs":[
			{
				"name":"",
				"type":"address"
			}
		],
		"payable":false,
		"stateMutability":"view",
		"type":"function"
	}
];
const UserAddress = "0x69334861068f48ee45f2b5eff4de59e57f666575";

const GoodsAbi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "acceptGoods",
		"outputs": [
			{
				"name": "result",
				"type": "bool"
			},
			{
				"name": "addr",
				"type": "address"
			},
			{
				"name": "price",
				"type": "uint256"
			}
		],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "addr",
				"type": "address"
			},
			{
				"name": "name",
				"type": "string"
			},
			{
				"name": "price",
				"type": "uint256"
			},
			{
				"name": "realInfos",
				"type": "string"
			},
			{
				"name": "descri",
				"type": "string"
			}
		],
		"name": "createNewGoods",
		"outputs": [
			{
				"name": "result",
				"type": "bool"
			},
			{
				"name": "mess",
				"type": "string"
			}
		],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "order",
				"type": "uint256"
			}
		],
		"name": "getTargetGoods",
		"outputs": [
			{
				"name": "addr",
				"type": "address"
			},
			{
				"name": "name",
				"type": "string"
			},
			{
				"name": "real",
				"type": "string"
			},
			{
				"name": "dest",
				"type": "string"
			},
			{
				"name": "pri",
				"type": "uint256"
			},
			{
				"name": "trueID",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getLength",
		"outputs": [
			{
				"name": "len",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
];

const GoodsAddress = "0xc5ebe19c1cf27cbeaae86c1ccea4a7ad01a5c1c0";

const EIAbi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "addr1",
				"type": "address"
			},
			{
				"name": "addr2",
				"type": "address"
			},
			{
				"name": "gname",
				"type": "string"
			},
			{
				"name": "name1",
				"type": "string"
			},
			{
				"name": "name2",
				"type": "string"
			},
			{
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "addPendingTrans",
		"outputs": [
			{
				"name": "result",
				"type": "bool"
			}
		],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "sellerAddr",
				"type": "address"
			},
			{
				"name": "buyerAddr",
				"type": "address"
			},
			{
				"name": "gname",
				"type": "string"
			}
		],
		"name": "confirmPendingTrans",
		"outputs": [
			{
				"name": "result",
				"type": "bool"
			}
		],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "addr",
				"type": "address"
			}
		],
		"name": "getConfirmedLength",
		"outputs": [
			{
				"name": "len",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "addr",
				"type": "address"
			},
			{
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "getConfirmedTrans",
		"outputs": [
			{
				"name": "addr1",
				"type": "address"
			},
			{
				"name": "addr2",
				"type": "address"
			},
			{
				"name": "gname",
				"type": "string"
			},
			{
				"name": "name1",
				"type": "string"
			},
			{
				"name": "name2",
				"type": "string"
			},
			{
				"name": "price",
				"type": "uint256"
			},
			{
				"name": "time",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "addr",
				"type": "address"
			}
		],
		"name": "getPendingLength",
		"outputs": [
			{
				"name": "len",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "addr",
				"type": "address"
			},
			{
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "getPendingTrans",
		"outputs": [
			{
				"name": "addr1",
				"type": "address"
			},
			{
				"name": "addr2",
				"type": "address"
			},
			{
				"name": "gname",
				"type": "string"
			},
			{
				"name": "name1",
				"type": "string"
			},
			{
				"name": "name2",
				"type": "string"
			},
			{
				"name": "price",
				"type": "uint256"
			},
			{
				"name": "time",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
];

const EIAddress = "0x30c2dfa92992cfeba6004b1940d1957a721111d1";

export {UserAddress, UserAbi, GoodsAddress, GoodsAbi, EIAddress, EIAbi};