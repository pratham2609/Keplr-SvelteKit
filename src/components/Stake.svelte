<script lang="ts">
	import { type InitialValidatorState } from '../stores/walletStore';
	export let data: InitialValidatorState[];
	let pageData = data.filter((val) => val.active === true);
</script>

<section class="w-screen h-screen px-20">
	<table class="w-full flex flex-col items-center ">
		<tr class="w-full flex justify-center mb-10 ">
			<th class="font-bold">Validator</th>
		</tr>

		{#each pageData as val}
			<tr class="w-full flex justify-center">
				<td>{val.name ? val.name : val.moniker}</td>
			</tr>
		{/each}
	</table>
</section>
