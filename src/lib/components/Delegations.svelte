<script lang="ts">
	import { type InitialValidatorState } from './../stores/walletStore';
	import { onMount } from 'svelte';
	import { getRewards, withdrawRewards } from '$lib/actions';
	import useGetDelegations from '$lib/actions/useGetDelegations';
	export let validators: InitialValidatorState[] = [];
	$: delegations = useGetDelegations();
	const validatorMonikerMap: { [key: string]: string } = {};
	validators.map((item) => {
		validatorMonikerMap[item.address] = item.moniker;
	});
	// console.log($delegations.data)
	// let rewards: Reward[] = [];

	// rewards = $delegations.data?.rewards.map((item: Reward) => {
	// 	return { ...item, validator: validatorMonikerMap[item.validator_address] };
	// });
</script>

<!-- <table class="w-[1200px]">
	<tr class="w-fullmb-5">
		<th class="font-bold">Validator</th>
		<th class="font-bold">validator address</th>
		<th class="font-bold">reward</th>
		<th class="font-bold">Undelegate</th>
	</tr>
	{#if rewards.length == 0}
		<p>No stakes yet</p>
	{:else}
		{#each rewards as val}
			<tr class="w-full mb-2">
				<td class="text-center">
					{val.validator}
				</td>
				<td class="text-center">
					{val.validator_address}
				</td>
				<td class="text-center">
					{#each val.reward as re}
						<p class="flex justify-center,">
							{(Number(re.amount) / 1000000).toFixed(6)}
							{re.denom}
						</p>
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
</table> -->
