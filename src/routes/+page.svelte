<script lang="ts">
	import { transactionMode } from '../lib/stores/global';
	import { get } from 'svelte/store';
	import Send from '../components/Send.svelte';
	import { onMount } from 'svelte';
	import { chainDataState, globalState, isWalletInitialised } from '../lib/stores/walletStore';
	import { SigningStargateClient } from '@cosmjs/stargate';
	import { type AccountData, type OfflineSigner } from '@cosmjs/proto-signing';
	import Stake from '../components/Stake.svelte';
	import Select from '../components/Select.svelte';
	$: mode = get(transactionMode);
	$: chainData = get(chainDataState);
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
		await keplr.experimentalSuggestChain(chainData); // injects non native chains
		// Create the signing client
		const offlineSigner: OfflineSigner = window.getOfflineSigner!(chainData.chainId);
		const signingClient = await SigningStargateClient.connectWithSigner(
			chainData.rpc,
			offlineSigner
		);
		// Get the address and balance of your user
		const account: AccountData = (await offlineSigner.getAccounts())[0];
		let myAddress = account.address;
		let myBalance = (
			await signingClient.getBalance(
				account.address,
				$chainDataState.currencies[0].coinMinimalDenom
			)
		).amount;
		globalState.update((localState) => {
			const newState = {
				...localState,
				denom: $chainDataState.currencies[0].coinMinimalDenom,
				myAddress: myAddress,
				myBalance: myBalance
			};
			return newState;
		});
		isWalletInitialised.update(() => 'connected');
	};

	onMount(() => {
		const { keplr } = window;
		if (!keplr) {
			alert('You need to install Keplr');
			return;
		}
		$globalState.denom = $chainDataState.currencies[0].coinMinimalDenom;
		if ($isWalletInitialised == 'connected') {
			connectWallet();
		}
	});
</script>

<main class="w-screen h-screen flex flex-col items-center py-20">
	{#if $isWalletInitialised == 'connected'}
		<div
			class="max-w-[500px] w-full h-full my-auto mx-auto flex flex-col gap-10 items-center justify-start"
		>
			<Select />
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
				<Stake />
			{/if}
		</div>
	{:else}
		<button on:click={() => connectWallet()} class="px-2 py-1 rounded-lg bg-gray-500"
			>Connect to wallet</button
		>
	{/if}
</main>
