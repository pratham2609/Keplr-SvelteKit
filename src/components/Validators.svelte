<script lang="ts">
	import { getValidators } from '$lib/actions';
	import { chainDataState, validators, type InitialValidatorState } from '$lib/stores/walletStore';
	import { onMount } from 'svelte';

	export let togglePopup = (val: InitialValidatorState) => {};
	let loading = false;
	onMount(async () => {
		loading = true;
		validators.set(await getValidators());
		loading = false;
	});
</script>

<table class="w-[900px] flex flex-col items-center">
	<tr class="w-full flex justify-between mb-5">
		<th class="font-bold">Validator</th>
		<th class="font-bold">Active</th>
		<th class="font-bold">Actions</th>
	</tr>
	{#if loading}
		<p>Data is loading...</p>
	{:else if $validators.length == 0}
		<p>No active validators for {$chainDataState.chainName}</p>
	{:else}
		{#each $validators as val}
			{#if val.rank >= 1 && val.rank <= 3}
				<tr class="w-full relative flex mb-2 items-center justify-between">
					<td>
						<p>
							{val.name ? val.name : val.moniker}
						</p>
					</td>
					<td>
						{val.active}
					</td>
					<td>
						<button
							on:click={() => {
								togglePopup(val);
							}}
							class="bg-green-600 rounded-lg px-2 py-1">Stake</button
						>
					</td>
					<p class="text-green-700 absolute -left-10">#{val.rank}</p>
				</tr>
			{:else}
				<tr class="w-full relative flex mb-2 items-center justify-between">
					<td>
						<p>
							{val.name ? val.name : val.moniker}
						</p>
					</td>
					<td>
						{val.active}
					</td>
					<td>
						<button
							on:click={() => {
								togglePopup(val);
							}}
							class="bg-green-600 rounded-lg px-2 py-1">Stake</button
						>
					</td>
				</tr>
			{/if}
		{/each}
	{/if}
</table>
