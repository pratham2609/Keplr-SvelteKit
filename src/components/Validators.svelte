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

<table class="w-[900px]">
	<tr class="mb-5">
		<th class="font-bold">Validator</th>
		<th class="font-bold">Active</th>
		<th class="font-bold">Actions</th>
	</tr>
	{#if loading}
		<p class="w-full text-center flex justify-center">Data is loading...</p>
	{:else if $validators.length == 0}
		<p>No active validators for {$chainDataState.chainName}</p>
	{:else}
		{#each $validators as val}
			<tr class=" relative py-4">
				<td>
					{val.name ? val.name : val.moniker}
				</td>
				<td class="text-center">
					{val.active}
				</td>
				<td class="flex justify-center">
					<button
						on:click={() => {
							togglePopup(val);
						}}
						class="bg-green-600 rounded-lg px-2 py-0.5">Stake</button
					>
				</td>
				{#if val.rank >= 1 && val.rank <= 3}
					<p class="text-green-700 absolute -left-10 -translate-y-1/2 top-1/2">#{val.rank}</p>
				{/if}
			</tr>
		{/each}
	{/if}
</table>
