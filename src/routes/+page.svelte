<script lang="ts">
	import { getTestnetChainInfo, rpcUrl, transactionMode } from './../stores/global';
	import { get } from 'svelte/store';
	import Send from '../components/Send.svelte';
	import Delegate from '../components/Delegate.svelte';
	import { onMount } from 'svelte';
	import { globalState, isWalletInitialised } from '../stores/walletStore';
	import { SigningStargateClient } from '@cosmjs/stargate';
	import { type AccountData, type OfflineSigner } from '@cosmjs/proto-signing';

	let mode = get(transactionMode);
	let isWallet = get(isWalletInitialised);
	let state = get(globalState);

	const changeMode = (newMode: string) => {
		transactionMode.update(() => {
			return newMode;
		});
		mode = newMode;
	};
	const connectWallet = async () => {
		// Suggest the testnet chain to Keplr
		const { keplr } = window;
		if (!keplr) {
			alert('You need to install Keplr');
			return;
		}
		// console.log('keplr hai');
		await keplr.experimentalSuggestChain(getTestnetChainInfo()); // injects non native chains
		// Create the signing client
		const offlineSigner: OfflineSigner = window.getOfflineSigner!('theta-testnet-001');
		const signingClient = await SigningStargateClient.connectWithSigner(rpcUrl, offlineSigner);

		// Get the address and balance of your user
		const account: AccountData = (await offlineSigner.getAccounts())[0];
		console.log(account)
		let myAddress = account.address;
		let myBalance = (await signingClient.getBalance(account.address, state.denom)).amount;
		console.log(myBalance)
		globalState.update((localState) => {
			const newState = { ...localState, myAddress: myAddress, myBalance: myBalance };
			return newState;
		});
		isWalletInitialised.update(() => true);
		isWallet = true;
	};

	onMount(() => {
		const { keplr } = window;
		if (!keplr) {
			alert('You need to install Keplr');
			return;
		}
		isWalletInitialised.update(() => true);
	});
</script>

<main class="w-screen h-screen flex items-center justify-center flex-col">
	{#if isWallet}
		<div
			class="max-w-[500px] w-full h-[500px] my-auto mx-auto flex flex-col gap-10 items-center justify-start"
		>
			<div class="flex w-full items-center gap-4">
				<button
					on:click={() => changeMode('Send')}
					class={`w-full rounded-md py-1 px-2 flex-1 ${mode == 'Send' ? 'bg-gray-600 font-bold' : 'opacity-85 bg-gray-800'}`}
					>Send</button
				>
				<button
					on:click={() => changeMode('Delegate')}
					class={`w-full rounded-md py-1 px-2 flex-1 ${mode == 'Delegate' ? 'bg-gray-600 font-bold' : 'opacity-85 bg-gray-800'}`}
					>Delegate</button
				>
			</div>
			{#if mode == 'Send'}
				<Send />
			{:else}
				<Delegate />
			{/if}
		</div>
	{:else}
		<button on:click={connectWallet} class="px-2 py-1 rounded-lg bg-gray-500"
			>Connect to wallet</button
		>
	{/if}
</main>
