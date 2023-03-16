import { AccountId, PrivateKey, Client, Hbar, TopicCreateTransaction, TopicMessageQuery, TopicMessageSubmitTransaction } from "@hashgraph/sdk";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
console.clear();

// Configure accounts and client
const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorKey = PrivateKey.fromString(process.env.OPERATOR_PVKEY);
const network = process.env.HEDERA_NETWORK;

const client = Client.forNetwork(network).setOperator(operatorId, operatorKey);
client.setDefaultMaxTransactionFee(new Hbar(100));
client.setMaxQueryPayment(new Hbar(50));
//

async function main() {
	// Create a new topic
	let txResponse = await new TopicCreateTransaction().execute(client);

	// Grab the newly generated topic ID
	let receipt = await txResponse.getReceipt(client);
	let topicId = receipt.topicId;
	console.log(`Your topic ID is: ${topicId}`);

	// Wait 5 seconds between consensus topic creation and subscription creation
	await new Promise((resolve) => setTimeout(resolve, 5000));

	// Create the topic
	new TopicMessageQuery().setTopicId(topicId).subscribe(client, null, (message) => {
		let messageAsString = Buffer.from(message.contents, "utf8").toString();
		console.log(`${message.consensusTimestamp.toDate()} Received: ${messageAsString}`);
	});

	// Send message to topic
	let sendResponse = await new TopicMessageSubmitTransaction({
		topicId: topicId,
		message: "Hello, HCS!",
	}).execute(client);
	const getReceipt = await sendResponse.getReceipt(client);

	// Get the status of the transaction
	const transactionStatus = getReceipt.status;
	console.log("The message transaction status: " + transactionStatus.toString());
	console.log(`See details in network explorer: https://hashscan.io/${network}/topic/${topicId}`);
}
main();
