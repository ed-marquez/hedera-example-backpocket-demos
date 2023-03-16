import { AccountId, PrivateKey, Client, TokenCreateTransaction, TokenType, Hbar, TokenMintTransaction, TokenSupplyType } from "@hashgraph/sdk";
import CID from "./cid.js";
import accountCreateFcn from "./utils/accountCreate.js";
import dotenv from "dotenv";
dotenv.config();
console.clear();

// Configure accounts and client, and generate needed keys
const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorKey = PrivateKey.fromString(process.env.OPERATOR_PVKEY);
const network = process.env.HEDERA_NETWORK;

const client = Client.forNetwork(network).setOperator(operatorId, operatorKey);
client.setDefaultMaxTransactionFee(new Hbar(100));
client.setMaxQueryPayment(new Hbar(50));

const supplyKey = PrivateKey.generateED25519();
//

async function main() {
	// CREATE A NEW HEDERA ACCOUNT PROGRAMMATICALLY
	const initBalance = new Hbar(10);
	const treasuryKey = PrivateKey.generateED25519();
	const [treasurySt, treasuryId] = await accountCreateFcn(treasuryKey, initBalance, client);
	console.log(`- Treasury's account: https://hashscan.io/${network}/account/${treasuryId} \n`);

	// CREATE FUNGIBLE TOKEN
	let nftCreateTx = new TokenCreateTransaction()
		.setTokenName("CARBON OFFSETS")
		.setTokenSymbol("CO2OFFS")
		.setTokenType(TokenType.NonFungibleUnique)
		.setTreasuryAccountId(treasuryId)
		.setInitialSupply(0)
		.setMaxSupply(10000)
		.setSupplyType(TokenSupplyType.Finite)
		.setSupplyKey(supplyKey)
		.freezeWith(client);

	let nftCreateSign = await nftCreateTx.sign(treasuryKey);
	let nftCreateSubmit = await nftCreateSign.execute(client);
	let nftCreateRx = await nftCreateSubmit.getReceipt(client);
	let tokenId = nftCreateRx.tokenId;
	console.log(`- Created NFT collection of Token ID: ${tokenId} \n`);

	// MINT NEW BATCH OF NFTs
	const mintTx = new TokenMintTransaction()
		.setTokenId(tokenId)
		.setMetadata(CID) //Batch minting - UP TO 10 NFTs in single tx
		.freezeWith(client);
	const mintSign = await mintTx.sign(supplyKey);
	const mintSubmit = await mintSign.execute(client);
	const mintRx = await mintSubmit.getReceipt(client);
	console.log(`- Minted NFTs under ID ${tokenId}: ${mintRx.status} \n`);

	console.log(`- See detalles in network explorer: https://hashscan.io/${network}/token/${tokenId} \n`);
}

main();
