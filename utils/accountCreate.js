import { AccountCreateTransaction } from "@hashgraph/sdk";

async function accountCreateFcn(pvKey, iBal, client) {
	const accountCreateTx = await new AccountCreateTransaction()
		.setInitialBalance(iBal)
		.setKey(pvKey.publicKey)
		.setMaxAutomaticTokenAssociations(-1) // Unlimited associations
		.execute(client);
	const accountCreateRx = await accountCreateTx.getReceipt(client);
	return [accountCreateTx.transactionId, accountCreateRx.accountId];
}
export default accountCreateFcn;
