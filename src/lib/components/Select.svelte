<script lang="ts">
	import { getTestnetChainInfo } from '$lib/stores/global';
	import { chainDataState, globalState } from '$lib/stores/walletStore';
	import { connectWallet, getRewards, getValidators } from '$lib/actions';
	import toast from 'svelte-french-toast';
	export let selected = 'theta-testnet-00';
	const changeChainName = async (e: Event) => {
		try {
			selected = (e.target as HTMLInputElement).value;
			const newChain = getTestnetChainInfo.filter((val) => val.chainId == selected);
			chainDataState.set(newChain[0]);
			globalState.update((lastState) => {
				return { ...lastState, denom: $chainDataState.currencies[0].coinMinimalDenom };
			});
			await connectWallet();
			await getValidators();
			await getRewards();
		} catch (error) {
			toast.error(String(error));
		}
	};
</script>

<div class="flex flex-col items-center gap-4">
	<h1 class="font-semibold text-xl">Change network</h1>
	<select
		bind:value={selected}
		class="border-2 rounded-lg bg-purple-900"
		on:change={changeChainName}
	>
		<option value="theta-testnet-001">Cosmoshub testnet</option>
		<option value="test-core-1">Persistence testnet</option>
		<option value="osmo-test-5">Osmosis testnet</option>
		<option value="mocha-4">Celestia testnet</option>
	</select>
</div>
