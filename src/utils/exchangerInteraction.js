export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function waitTransaction(web3, txHash) {
  let tx = null;
  while (tx == null) {
    tx = await web3.eth.getTransactionReceipt(txHash);
    await sleep(2000);
  }
  console.log("Transaction " + txHash + " was mined.");
  return (tx.status);
}
