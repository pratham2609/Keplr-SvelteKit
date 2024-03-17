<script lang="ts">
	import { transactionMode } from '../lib/stores/global';
	import { get } from 'svelte/store';
	import Send from '../components/Send.svelte';
	import { onMount } from 'svelte';
	import { chainDataState, globalState, isWalletInitialised } from '../lib/stores/walletStore';
	import Stake from '../components/Stake.svelte';
	import Select from '../components/Select.svelte';
	import { connectWallet } from '$lib/actions';
	$: mode = get(transactionMode);
	const changeMode = (newMode: string) => {
		transactionMode.update(() => {
			return newMode;
		});
		mode = newMode;
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
	const disconnect = () => {
		const { keplr } = window;
		if (keplr) keplr.disable($chainDataState.chainId)
		isWalletInitialised.set('not-connected');
	};
</script>

<main class="w-screen h-screen flex flex-col items-center relative py-20">
	{#if $isWalletInitialised == 'connected'}
		<div
			class="max-w-[600px] w-full h-full my-auto mx-auto flex flex-col gap-10 items-center justify-start"
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
		<button
			on:click={disconnect}
			class="absolute top-10 right-10 bg-gray-700 text-white rounded-lg font-bold px-2 py-1"
			>Disconnect</button
		>
	{:else}
		<button on:click={connectWallet} class="px-2 py-1 rounded-lg bg-gray-500"
			>Connect to wallet</button
		>
	{/if}
</main>
