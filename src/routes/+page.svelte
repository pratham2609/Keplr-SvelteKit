<script lang="ts">
	import { getTestnetChainInfo,transactionMode } from '../lib/stores/global';
	import { get } from 'svelte/store';
	import Send from '../components/Send.svelte';
	import { onMount } from 'svelte';
	import { chainDataState, globalState, initialState, isWalletInitialised } from '../lib/stores/walletStore';
	import { SigningStargateClient } from '@cosmjs/stargate';
	import { type AccountData, type OfflineSigner } from '@cosmjs/proto-signing';
	import Stake from '../components/Stake.svelte';
	import type { PageData } from './$types';
	import { getBalance } from '$lib/actions';
	export let data: PageData;
	let mode = get(transactionMode);
	let state = get(globalState);
	$: chainData = get(chainDataState);
	const changeMode = (newMode: string) => {
		transactionMode.update(() => {
			return newMode;
		});
		mode = newMode;
	};
	$: chainName = get(chainDataState).chainName;
	const changeChainName = (e: Event) => {
		chainName = (e.target as HTMLInputElement).value;
		chainDataState.update(() => {
			return chainName === 'cosmoshubtestnet' ? getTestnetChainInfo[0] : getTestnetChainInfo[2];
		});
		globalState.set(initialState);
		getBalance();
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
		const signingClient = await SigningStargateClient.connectWithSigner(chainData.rpc, offlineSigner);
		// Get the address and balance of your user
		const account: AccountData = (await offlineSigner.getAccounts())[0];
		let myAddress = account.address;
		let myBalance = (await signingClient.getBalance(account.address, state.denom)).amount;
		globalState.update((localState) => {
			const newState = { ...localState, myAddress: myAddress, myBalance: myBalance };
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
		if ($isWalletInitialised == 'connected') {
			connectWallet();
		}
	});
</script>

<main class="w-screen h-screen flex items-center justify-center flex-col">
	{#if $isWalletInitialised == 'connected'}
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
			<select
				bind:value={chainName}
				class="border-2 rounded-lg bg-purple-900"
				on:change={changeChainName}
			>
				<option value="cosmoshubtestnet">Cosmoshub</option>
				<option value="persistencetestnet">Persistence</option>
			</select>
			{#if mode == 'Send'}
				<Send />
			{:else}
				<Stake data={data.validatorData} />
			{/if}
		</div>
	{:else}
		<button on:click={connectWallet} class="px-2 py-1 rounded-lg bg-gray-500"
			>Connect to wallet</button
		>
	{/if}
</main>
