<script lang="ts">
	import {
		type Coin,
		SigningStargateClient,
		StargateClient,
		assertIsDeliverTxSuccess,
		type MsgSendEncodeObject
	} from '@cosmjs/stargate';
	import { type OfflineSigner } from '@cosmjs/proto-signing';
	import { chainDataState, globalState, initialState, type State } from '../lib/stores/walletStore';
	import { onDestroy } from 'svelte';
	import toast, { Toaster } from 'svelte-french-toast';
	import { get } from 'svelte/store';
	$: state = get(globalState); // Initialize state
	$: chainData = get(chainDataState);

	const unsubscribe = () => {
		chainDataState.subscribe((value) => {
			chainData = value; // Update local state when chainData changes
		});

		globalState.subscribe((value) => {
			state = value; // Update local state when globalState changes
		});
	};
	async function updateFaucetBalance() {
		const client = await StargateClient.connect(chainData.rpc);
		const balances: readonly Coin[] = await client.getAllBalances(state.faucetAddress);
		const first = balances[0];
		globalState.update((localState) => {
			const newState = { ...localState, denom: first.denom, faucetBalance: first.amount };
			return newState;
		});
		toast.success('Fetched Details');
	}
	async function onSendClicked() {
		const { denom, toSend } = state;
		const offlineSigner: OfflineSigner = window.getOfflineSigner!(chainData.chainId);
		const signingClient = await SigningStargateClient.connectWithSigner(
			chainData.rpc,
			offlineSigner
		);
		toast.loading('Sending', { duration: 1 });
		// Submit the transaction to send tokens to the faucet
		// const sendResult = await signingClient.sendTokens(
		// 	state.myAddress,
		// 	state.faucetAddress,
		// 	[{ denom, amount: toSend }],
		// 	{ amount: [{ denom: 'uatom', amount: '500' }], gas: '200000' },
		// 	state.memo
		// );
		const sendMsg: MsgSendEncodeObject = {
			typeUrl: '/cosmos.bank.v1beta1.MsgSend',
			value: {
				fromAddress: state.myAddress,
				toAddress: state.faucetAddress,
				amount: [{ denom, amount: toSend }]
			}
		};

		assertIsDeliverTxSuccess(
			await signingClient.signAndBroadcast(
				state.myAddress,
				[sendMsg],
				{ amount: [{ denom: 'uatom', amount: '500' }], gas: '200000' },
				state.memo
			)
		);
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
		toast.success('Send Successfully');
	}
	const handleValueChange = (e: Event) => {
		state = {
			...state,
			[(e.target as HTMLInputElement).name]: (e.target as HTMLInputElement).value
		};
	};
	
	onDestroy(unsubscribe);
</script>

<Toaster />
<div class="w-full flex flex-col items-center gap-10">
	<div class="w-full flex flex-col gap-5 items-center">
		<fieldset class="card w-full flex flex-col gap-2 px-5 py-2">
			<legend>Faucet</legend>
			<input
				name="faucetAddress"
				class="px-2 py-1 rounded-lg border-2 bg-transparent text-white"
				placeholder="Faucet Address"
				bind:value={$globalState.faucetAddress}
				on:input={handleValueChange}
			/>
			<p>
				Balance: {(Number($globalState.faucetBalance) / 1000000).toFixed(6)}
				{state.denom}
			</p>
			<div class="w-full flex justify-end">
				<button
					class="bg-gray-300 rounded-lg px-2 py-1 text-black font-medium"
					on:click={updateFaucetBalance}>Fetch Faucet Details</button
				>
			</div>
		</fieldset>
		<fieldset class="card w-full flex flex-col gap-2 px-5 py-2">
			<legend>You</legend>
			<p>Address: {$globalState.myAddress}</p>
			<p>Balance: {(Number($globalState.myBalance) / 1000000).toFixed(6)}</p>
		</fieldset>
		<fieldset class="card w-full flex flex-col gap-3 px-5 py-2">
			<legend>Send</legend>
			<p>Amount to send:</p>
			<input
				bind:value={$globalState.toSend}
				class="rounded-md bg-transparent px-2 py-0"
				name="toSend"
				placeholder="Amount to send"
				on:input={handleValueChange}
			/>
			<input
				bind:value={$globalState.memo}
				class="rounded-md bg-transparent px-2 py-0"
				name="memo"
				placeholder="Write a memo!"
				on:input={handleValueChange}
			/>
			<!-- {state.denom} -->
			<button
				class="bg-gray-300 font-medium rounded-lg px-2 py-1 text-black"
				on:click={onSendClicked}>Send to faucet</button
			>
		</fieldset>
	</div>
</div>
