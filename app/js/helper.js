
function get_etherscan_base() {
  if (network == 1) return "www.etherscan.io";
  if (network == 3) return "ropsten.etherscan.io";
  return "";
}

function tx_url(_addr,_text) {
  return "<a href=https://"+get_etherscan_base()+"/tx/"+_addr+" target="+_addr+">"+_text+"</a>";
}

function addr_url(_addr,_text) {
  return "<a href=https://"+get_etherscan_base()+"/address/"+_addr+" target="+_addr+">"+_text+"</a>";
}

// Metamask fiendly getTransactionReceiptMined
function getTransactionReceiptMined(txnHash, interval) {
    var transactionReceiptAsync;
    interval = interval ? interval : 500;
    transactionReceiptAsync = function(txnHash, resolve, reject) {
        try {
            web3.eth.getTransactionReceipt(txnHash, (_,receipt) => {
                if (receipt == null || receipt.blockNumber == null ) {
                    setTimeout(function () {
                        transactionReceiptAsync(txnHash, resolve, reject);
                    }, interval);
                } else {
                    console.log(receipt);
                    resolve(receipt);
                }
            });
        } catch(e) {
            reject(e);
        }
    };

    if (Array.isArray(txnHash)) {
        var promises = [];
        txnHash.forEach(function (oneTxHash) {
            promises.push(getTransactionReceiptMined(oneTxHash, interval));
        });
        return Promise.all(promises);
    } else {
        return new Promise(function (resolve, reject) {
                transactionReceiptAsync(txnHash, resolve, reject);
            });
    }
};
