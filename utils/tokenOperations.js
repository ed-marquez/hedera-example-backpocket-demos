import { TokenCreateTransaction, TransferTransaction, TokenMintTransaction } from "@hashgraph/sdk";
import * as queries from "./queries.js";

export async function createHtsTokenFcn(tkName, tkSymbol, trId, tkType, sType, iSupply, maxSupply, customFees, listOfKeys, trPvKey, client) {
	const tokenCreateTx = await new TokenCreateTransaction()
		.setTokenName(tkName)
		.setTokenSymbol(tkSymbol)
		.setTreasuryAccountId(trId)
		.setTokenType(tkType)
		.setSupplyType(sType)
		.setDecimals(0)
		.setInitialSupply(iSupply)
		.setMaxSupply(maxSupply)
		.setCustomFees(customFees)
		.setAdminKey(listOfKeys[0].publicKey)
		.setSupplyKey(listOfKeys[1].publicKey)
		.setPauseKey(listOfKeys[2].publicKey)
		.setFreezeKey(listOfKeys[3].publicKey)
		.setWipeKey(listOfKeys[4].publicKey)
		// .setKycKey(listOfKeys[5].publicKey)
		.setFeeScheduleKey(listOfKeys[6].publicKey)
		.setMetadataKey(listOfKeys[7].publicKey)
		.freezeWith(client)
		.sign(trPvKey);
	const tokenCreateSign = await tokenCreateTx.sign(listOfKeys[0]);
	const tokenCreateSubmit = await tokenCreateSign.execute(client);
	const tokenCreateRx = await tokenCreateSubmit.getReceipt(client);
	const tokenId = tokenCreateRx.tokenId;

	const tokenInfo = await queries.tokenQueryFcn(tokenId, client);

	return [tokenId, tokenInfo, tokenCreateSubmit.transactionId];
}

export async function mintNftSerialsFcn(tokenId, supplyKey, client) {
	// // MINT NEW BATCH OF NFTs
	// Replace IPFS CID with your own
	const CID = [
		Buffer.from("ipfs://bafkreibr7cyxmy4iyckmlyzige4ywccyygomwrcn4ldcldacw3nxe3ikgq"),
		Buffer.from("ipfs://bafkreig73xgqp7wy7qvjwz33rp3nkxaxqlsb7v3id24poe2dath7pj5dhe"),
		Buffer.from("ipfs://bafkreigltq4oaoifxll3o2cc3e3q3ofqzu6puennmambpulxexo5sryc6e"),
		Buffer.from("ipfs://bafkreiaoswszev3uoukkepctzpnzw56ey6w3xscokvsvmfrqdzmyhas6fu"),
		Buffer.from("ipfs://bafkreih6cajqynaqwbrmiabk2jxpy56rpf25zvg5lbien73p5ysnpehyjm"),
	];
	const mintTx = new TokenMintTransaction()
		.setTokenId(tokenId)
		.setMetadata(CID) //Batch minting - UP TO 10 NFTs in single tx
		.freezeWith(client);
	const mintTxSign = await mintTx.sign(supplyKey);
	const mintTxSubmit = await mintTxSign.execute(client);
	const mintRx = await mintTxSubmit.getReceipt(client);
	const tokenInfo = await queries.tokenQueryFcn(tokenId, client);

	return [mintRx, tokenInfo, mintTxSubmit.transactionId];
}

export async function transferFtFcn(tId, senderId, receiverId, amount, senderKey, client) {
	const tokenTransferTx = new TransferTransaction()
		.addTokenTransfer(tId, senderId, amount * -1)
		.addTokenTransfer(tId, receiverId, amount)
		.freezeWith(client);
	const tokenTransferSign = await tokenTransferTx.sign(senderKey);
	const tokenTransferSubmit = await tokenTransferSign.execute(client);
	const tokenTransferRx = await tokenTransferSubmit.getReceipt(client);

	return [tokenTransferRx, tokenTransferTx];
}
