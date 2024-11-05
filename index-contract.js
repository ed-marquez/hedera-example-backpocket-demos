import {
	AccountId,
	PrivateKey,
	Client,
	ContractFunctionParameters,
	ContractExecuteTransaction,
	ContractCallQuery,
	Hbar,
	ContractCreateFlow,
} from "@hashgraph/sdk";
import fs from "fs";
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

// Hedera Smart Contract Documentation - Using the Hedera SDKs
// https://docs.hedera.com/hedera/sdks-and-apis/sdks/smart-contracts

async function main() {
	console.log(`\n🟠 Hedera Smart Contract Service (HSCS) Example: Deploy & interact with a contract using the Hedera SDKs... 🟠`);

	// Import the compiled contract bytecode
	const contractBytecode = fs.readFileSync("LookupContract.bin");

	// Create (deploy) the smart contract
	// https://docs.hedera.com/hedera/sdks-and-apis/sdks/smart-contracts/create-a-smart-contract
	console.log(`\n- Creating (deploying) the smart contract...`);
	const contractCreateTx = new ContractCreateFlow()
		.setBytecode(contractBytecode)
		.setGas(400000)
		.setConstructorParameters(new ContractFunctionParameters().addString("Alice").addUint256(111111));

	const contractCreateSubmit = await contractCreateTx.execute(client);
	const contractCreateRx = await contractCreateSubmit.getReceipt(client);
	const contractId = contractCreateRx.contractId;
	const contractAddress = contractId.toSolidityAddress();

	console.log(`- Created smart contract with ID: ${contractId} ✅`);
	console.log(`- Contract EVM address: ${contractAddress}`);
	console.log(`- See contract details in network explorer: https://hashscan.io/${network}/contract/${contractId} 🔗`);
	console.log(`- See transaction details in network explorer: https://hashscan.io/${network}/tx/${contractCreateSubmit.transactionId} 🔗\n`);

	// Query the contract to check changes in state variable
	// https://docs.hedera.com/hedera/sdks-and-apis/sdks/smart-contracts/get-a-smart-contract-function
	console.log(`- Querying the contract to check changes in the state variable...`);
	let contactName = "Alice";
	const contractQueryTx = new ContractCallQuery()
		.setContractId(contractId)
		.setGas(100000)
		.setFunction("getMobileNumber", new ContractFunctionParameters().addString(contactName));
	const contractQuerySubmit = await contractQueryTx.execute(client);
	const contractQueryResult = contractQuerySubmit.getUint256(0);
	console.log(`- Queried the contract - phone number requested for ${contactName}: ${contractQueryResult} ✅\n`);

	// Execute contract function to update the state variable
	// https://docs.hedera.com/hedera/sdks-and-apis/sdks/smart-contracts/call-a-smart-contract-function
	console.log(`- Executing the contract function to update the state variable...`);
	const contractExecuteTx = new ContractExecuteTransaction()
		.setContractId(contractId)
		.setGas(100000)
		.setFunction("setMobileNumber", new ContractFunctionParameters().addString("Bob").addUint256(222222));
	const contractExecuteSubmit = await contractExecuteTx.execute(client);
	const contractExecuteRx = await contractExecuteSubmit.getReceipt(client);
	console.log(`- Contract function execution status: ${contractExecuteRx.status} ✅`);
	console.log(`- See transaction details in network explorer: https://hashscan.io/${network}/tx/${contractExecuteSubmit.transactionId} 🔗\n`);

	// Query the contract to check changes in state variable
	console.log(`- Querying the contract to check changes in the state variable...`);
	contactName = "Bob";
	const contractQueryTx1 = new ContractCallQuery()
		.setContractId(contractId)
		.setGas(100000)
		.setFunction("getMobileNumber", new ContractFunctionParameters().addString(contactName));
	const contractQuerySubmit1 = await contractQueryTx1.execute(client);
	const contractQueryResult1 = contractQuerySubmit1.getUint256(0);
	console.log(`- Queried the contract - phone number requested for ${contactName}: ${contractQueryResult1} ✅`);

	console.log(`\n- THE END ============================================================\n`);
	console.log(`👇 Go to:`);
	console.log(`🔗 www.hedera.com/discord\n`);

	client.close();
}
main();
