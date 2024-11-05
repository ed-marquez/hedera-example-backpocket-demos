import { AccountId, PrivateKey, Client, TokenCreateTransaction, TokenType, Hbar, TokenMintTransaction, TokenSupplyType } from "@hashgraph/sdk";
import CID from "./cid.js";
import accountCreateFcn from "./utils/accountCreate.js";
import dotenv from "dotenv";
dotenv.config();
console.clear();

// Configure accounts and client, and generate needed keys
const operatorId = AccountId.fromString(process.env.ACCOUNT_ID);
const operatorKey = PrivateKey.fromStringECDSA(process.env.PRIVATE_KEY_HEX);
const network = process.env.NETWORK;

const client = Client.forNetwork(network).setOperator(operatorId, operatorKey);
client.setDefaultMaxTransactionFee(new Hbar(100));
client.setDefaultMaxQueryPayment(new Hbar(50));

const supplyKey = PrivateKey.generateECDSA();

// Hedera Token Service (HTS) Documentation
//https://docs.hedera.com/hedera/sdks-and-apis/sdks/token-service

async function main() {
	console.log(`\n🟠 Hedera Token Service (HTS) Example: Create a new NFT collection and mint 5 NFT serials... 🟠`);

	// Create a new account to serve as the treasury
	console.log(`\n- Creating a new Hedera account to serve as the treasury for the token...`);
	const initBalance = new Hbar(1);
	const treasuryKey = PrivateKey.generateECDSA();
	const [treasuryCreateTxId, treasuryId] = await accountCreateFcn(treasuryKey, initBalance, client);
	console.log(`- Created Treasury with account ID: ${treasuryId} ✅`);
	console.log(`- See Treasury's account details in network explorer: https://hashscan.io/${network}/account/${treasuryId} 🔗`);
	console.log(`- See transaction details in network explorer: https://hashscan.io/${network}/tx/${treasuryCreateTxId} 🔗\n`);

	// Create a new NFT collection
	// https://docs.hedera.com/hedera/sdks-and-apis/sdks/token-service/define-a-token
	console.log(`\n- Creating a new NFT collection...`);
	let nftCreateTx = new TokenCreateTransaction()
		.setTokenName("CARBON OFFSETS") // Required
		.setTokenSymbol("CO2OFFS") // Required
		.setTreasuryAccountId(treasuryId) // Required
		.setTokenType(TokenType.NonFungibleUnique)
		.setSupplyType(TokenSupplyType.Finite)
		.setDecimals(0)
		.setInitialSupply(0) // Has to be 0 for NFTs
		.setMaxSupply(10000)
		.setCustomFees([]) // Custom fees can be added here and are enforced by the network
		// .setAdminKey(treasuryKey.publicKey)
		.setSupplyKey(supplyKey.publicKey)
		// .setPauseKey(treasuryKey.publicKey)
		// .setFreezeKey(treasuryKey.publicKey)
		// .setWipeKey(treasuryKey.publicKey)
		// .setKycKey(treasuryKey.publicKey)
		// .setFeeScheduleKey(treasuryKey.publicKey)
		// .setMetadataKey(treasuryKey.publicKey)
		.freezeWith(client);

	let nftCreateSign = await nftCreateTx.sign(treasuryKey);
	let nftCreateSubmit = await nftCreateSign.execute(client);
	let nftCreateRx = await nftCreateSubmit.getReceipt(client);
	let tokenId = nftCreateRx.tokenId;
	console.log(`- Created NFT collection with token ID: ${tokenId} ✅`);
	console.log(`- See token details in network explorer: https://hashscan.io/${network}/token/${tokenId} 🔗`);
	console.log(`- See transaction details in network explorer: https://hashscan.io/${network}/tx/${nftCreateTx.transactionId} 🔗\n`);

	// Mint NFTs
	// https://docs.hedera.com/hedera/sdks-and-apis/sdks/token-service/mint-a-token
	console.log(`\n- Minting 5 NFT serials in collection ${tokenId}...`);
	const mintTx = new TokenMintTransaction()
		.setTokenId(tokenId)
		.setMetadata(CID) //Batch minting - UP TO 10 NFTs in single tx
		.freezeWith(client);
	const mintSign = await mintTx.sign(supplyKey);
	const mintSubmit = await mintSign.execute(client);
	const mintRx = await mintSubmit.getReceipt(client);
	console.log(`- Minted NFTs: ${mintRx.status} ✅`);
	console.log(`- See transaction details in network explorer: https://hashscan.io/${network}/tx/${mintTx.transactionId} 🔗`);
	for (let i = 0; i < CID.length; i++) {
		console.log(`- See NFT serial ${i + 1} in network explorer: https://hashscan.io/${network}/token/${tokenId}/${i + 1} 🔗`);
	}

	console.log(`\n- THE END ============================================================\n`);
	console.log(`👇 Go to:`);
	console.log(`🔗 www.hedera.com/discord\n`);

	client.close();
}

main();
