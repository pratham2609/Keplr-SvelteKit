<script lang="ts">
	import { type Coin, SigningStargateClient, StargateClient } from '@cosmjs/stargate';
	import { type OfflineSigner } from '@cosmjs/proto-signing';
	import { globalState, initialState, type State } from '../stores/walletStore';
	import { rpcUrl } from '../stores/global';
	import { onDestroy } from 'svelte';
	let state: State = initialState; // Initialize state

	const unsubscribe = globalState.subscribe((value) => {
		state = value; // Update local state when globalState changes
	});
	async function updateFaucetBalance() {
		const client = await StargateClient.connect(rpcUrl);
		const balances: readonly Coin[] = await client.getAllBalances(state.faucetAddress);
		const first = balances[0];
		globalState.update((localState) => {
			const newState = { ...localState, denom: first.denom, faucetBalance: first.amount };
			return newState;
		});
	}
	async function onSendClicked() {
		const { denom, toSend } = state;
		const offlineSigner: OfflineSigner = window.getOfflineSigner!('theta-testnet-001');
		const signingClient = await SigningStargateClient.connectWithSigner(rpcUrl, offlineSigner);
		console.log(signingClient);
		// Submit the transaction to send tokens to the faucet
		const sendResult = await signingClient.sendTokens(
			state.myAddress,
			state.faucetAddress,
			[{ denom, amount: toSend }],
			{ amount: [{ denom: 'uatom', amount: '500' }], gas: '200000' },
			state.memo
		);
		console.log(sendResult);
		// Update the balance in the user interface
		state.myBalance = (await signingClient.getBalance(state.myAddress, denom)).amount;
		state.faucetBalance = (await signingClient.getBalance(state.faucetAddress, denom)).amount;
		globalState.update(() => {
			const newState = {
				faucetAddress: '',
				denom: 'denom',
				faucetBalance: '0',
				myAddress: state.myAddress,
				myBalance: state.myBalance,
				toSend: '0',
				memo: 'Hello from the Theta Faucet!'
			};
			return newState;
		});
	}
	const handleValueChange = (e: Event) => {
		state = {
			...state,
			[(e.target as HTMLInputElement).name]: (e.target as HTMLInputElement).value
		};
	};
	onDestroy(unsubscribe);
</script>

<div class="w-full flex flex-col gap-5 items-center">
	<fieldset class="card w-full flex flex-col gap-2 px-5 py-2">
		<legend>Faucet</legend>
		<input
			name="faucetAddress"
			class="px-2 py-1 rounded-lg border-2 bg-transparent text-white"
			placeholder="Faucet Address"
			bind:value={state.faucetAddress}
			on:input={handleValueChange}
		/>
		<p>Balance: {state.faucetBalance} {state.denom}</p>
		<div class="w-full flex justify-end">
			<button
				class="bg-gray-300 rounded-lg px-2 py-1 text-black font-medium"
				on:click={updateFaucetBalance}>Fetch Faucet Details</button
			>
		</div>
	</fieldset>
	<fieldset class="card w-full flex flex-col gap-2 px-5 py-2">
		<legend>You</legend>
		<p>Address: {state.myAddress}</p>
		<p>Balance: {state.myBalance}</p>
	</fieldset>
	<fieldset class="card w-full flex flex-col gap-2 px-5 py-2">
		<legend>Send</legend>
		<p>Amount to send:</p>
		<input
			bind:value={state.toSend}
			class="rounded-md bg-transparent px-2 py-0"
			name="toSend"
			placeholder="Amount to send"
			on:input={handleValueChange}
		/>
		<input
			bind:value={state.memo}
			class="rounded-md bg-transparent px-2 py-0"
			name="memo"
			placeholder="Write a memo!"
			on:input={handleValueChange}
		/>
		<!-- {state.denom} -->
		<button class="bg-gray-300 font-medium rounded-lg px-2 py-1 text-black" on:click={onSendClicked}
			>Send to faucet</button
		>
	</fieldset>
</div>
