import { AccountId, PrivateKey, Client, Hbar, TopicCreateTransaction, TopicMessageQuery, TopicMessageSubmitTransaction } from "@hashgraph/sdk";
import dotenv from "dotenv";
dotenv.config();
console.clear();

// Configure accounts and client
const operatorId = AccountId.fromString(process.env.ACCOUNT_ID);
const operatorKey = PrivateKey.fromStringECDSA(process.env.PRIVATE_KEY_HEX);
const network = process.env.NETWORK;

const client = Client.forNetwork(network).setOperator(operatorId, operatorKey);
client.setDefaultMaxTransactionFee(new Hbar(100));
client.setDefaultMaxQueryPayment(new Hbar(50));

// Hedera Consensus Service (HCS) Documentation
//https://docs.hedera.com/hedera/sdks-and-apis/sdks/consensus-service

async function main() {
	console.log(`\n🟠 Hedera Consensus Service (HCS) Example: Create a new topic, subscribe, and submit a message... 🟠`);

	// Create a new topic
	// https://docs.hedera.com/hedera/sdks-and-apis/sdks/consensus-service/create-a-topic
	console.log(`\n- Creating a new consensus topic...`);
	let topicCreateTx = await new TopicCreateTransaction().execute(client);
	let topicCreateRx = await topicCreateTx.getReceipt(client); // this is the topic ID
	let topicId = topicCreateRx.topicId;
	console.log(`- Created topic with ID: ${topicId} ✅`);
	console.log(`- See topic details in network explorer: https://hashscan.io/${network}/topic/${topicId} 🔗`);
	console.log(`- See transaction details in network explorer: https://hashscan.io/${network}/tx/${topicCreateTx.transactionId} 🔗\n`);

	// Wait a few seconds between consensus topic creation and subscription creation
	// This ensures information is propagated to mirror nodes
	let numSeconds = 5;
	console.log(`- Waiting ${numSeconds} seconds to propagate the topic info to mirror nodes...`);
	await new Promise((resolve) => setTimeout(resolve, numSeconds * 1000));

	// Create the topic subscription
	// https://docs.hedera.com/hedera/sdks-and-apis/sdks/consensus-service/get-topic-message
	console.log(`- Subscribing to the topic...`);
	new TopicMessageQuery().setTopicId(topicId).subscribe(client, null, (message) => {
		let messageAsString = Buffer.from(message.contents, "utf8").toString();
		console.log(`\n- New message received via gRPC subscription:`);
		console.log(`- 📨 ${message.consensusTimestamp.toDate()} Received: ${messageAsString} ✅`);
	});
	console.log(`- Subscribed ✅`);

	// Send a message to the topic
	// https://docs.hedera.com/hedera/sdks-and-apis/sdks/consensus-service/submit-a-message
	console.log(`\n- Sending a message to the topic...`);
	let messageSendTx = await new TopicMessageSubmitTransaction({
		topicId: topicId,
		message: "Hello, HCS!",
	}).execute(client);
	const messageRx = await messageSendTx.getReceipt(client);
	const messageStatus = messageRx.status;
	console.log(`- Message send transaction status: ${messageStatus.toString()} ✅`);
	console.log(`- See transaction details in network explorer: https://hashscan.io/${network}/tx/${messageSendTx.transactionId} 🔗`);

	// Wait a few seconds before closing the client
	numSeconds = 15;
	console.log(`\n- Waiting ${numSeconds} seconds before closing the client...`);
	await new Promise((resolve) => setTimeout(resolve, numSeconds * 1000));

	console.log(`\n- THE END ============================================================\n`);
	console.log(`👇 Go to:`);
	console.log(`🔗 www.hedera.com/discord\n`);

	client.close();
}
main();
