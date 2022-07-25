require("dotenv").config();
const API_URL = process.env.API_URL;

const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);

const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json");

// console.log(JSON.stringify(contract.abi));

const contractAddress = "0xa4eB50cd47aA60135b7f443486Df1677CcEa3C8c";
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

//create Transaction
async function mintNFT(tokenURI){
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest"); //get latest nonce
    //transaction

    const tnx = {
        from: PUBLIC_KEY,
        to: contractAddress,
        nonce: nonce,
        gas: 500000,
        data: nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI(),
    };

    const signPromise = web3.eth.accounts.signTransaction(tnx, PRIVATE_KEY);
    signPromise.then((signedTx)=>{
        web3.eth.sendSignedTransaction(
            signedTx.rawTransaction,
            function(err, hash){
                if(!err){
                    console.log(
                        "The hash of your transaction is: ",
                        hash,
                        "\n Check Alchemy's Mempool to view the status of your transaction!"
                    );
                }else{
                    console.log(
                        "Something went wrong while submitting your transaction: ",
                        err
                    )
                }
            }
        )
    })
    .catch((error)=>{
        console.log(error);
    });
}

mintNFT("https://gateway.pinata.cloud/ipfs/QmTMNMxkbxZLQaz4cSdSTen5h1k6ZJNy9gmy2Jz6cErieb")
