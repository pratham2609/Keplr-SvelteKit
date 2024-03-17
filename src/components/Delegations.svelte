<script lang="ts">
	import { onMount } from 'svelte';
	import { getRewards, withdrawRewards } from '$lib/actions';
	import { rewards } from '$lib/stores/walletStore';
	let loading = false;
	onMount(async () => {
		loading = true;
		const data = await getRewards();
		rewards.set(data);
		loading = false;
	});
</script>

<table class="w-[1200px]">
	<tr class="w-fullmb-5">
		<th class="font-bold">Validator</th>
		<th class="font-bold">validator address</th>
		<th class="font-bold">reward</th>
		<th class="font-bold">Undelegate</th>
	</tr>
	{#if loading}
		<p>Data is loading...</p>
	{:else if $rewards.length == 0}
		<p>No stakes yet</p>
	{:else}
		{#each $rewards as val}
			<tr class="w-full mb-2">
				<td class="text-center">
					{val.validator}
				</td>
				<td class="text-center">
					{val.validator_address}
				</td>
				<td class="text-center">
					{#each val.reward as re}
						<p class="flex justify-center,">{(Number(re.amount) / 1000000).toFixed(6)} {re.denom}</p>
					{/each}
				</td>
				<td class="flex justify-center gap-2">
					<button
						on:click={() => withdrawRewards(val.validator_address)}
						class="bg-green-600 rounded-lg px-2 py-1">Withdraw</button
					>
				</td>
			</tr>
		{/each}
	{/if}
</table>
