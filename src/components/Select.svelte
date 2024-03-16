<script lang="ts">
	import { getTestnetChainInfo } from '$lib/stores/global';
	import { chainDataState, globalState } from '$lib/stores/walletStore';
	import { getBalance, getRewards, getValidators } from '$lib/actions';
	import { get } from 'svelte/store';
	import toast from 'svelte-french-toast';

	$: chainId = get(chainDataState).chainName;
	const changeChainName = async (e: Event) => {
		toast.loading('loading Data...', { duration: 2500 });
		try {
			chainId = (e.target as HTMLInputElement).value;
			const newChain = getTestnetChainInfo.filter((val) => val.chainId == chainId);
			chainDataState.set(newChain[0]);
			globalState.update((lastState) => {
				return { ...lastState, denom: $chainDataState.currencies[0].coinMinimalDenom };
			});
			await getBalance();
			await getValidators();
			await getRewards();
			toast.success('Fetching successful');
		} catch (error) {
			toast.error(String(error));
		}
	};
</script>

<div class="flex flex-col items-center gap-4">
	<h1 class="font-semibold text-xl">Change network</h1>
	<select
		bind:value={chainId}
		class="border-2 rounded-lg bg-purple-900"
		on:change={changeChainName}
	>
		<option value="theta-testnet-001">Cosmoshub testnet</option>
		<option value="test-core-1">Persistence testnet</option>
		<option value="osmo-test-5">Osmosis testnet</option>
		<option value="mocha-4">Celestia testnet</option>
	</select>
</div>
