import axios from "axios"
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getValidators } from "$lib/actions";
import { validators } from "$lib/stores/walletStore";
export const load: PageServerLoad = async () => {
    const valData = await getValidators("cosmoshubtestnet")
    const chainData = await axios.get("https://chains.testcosmos.directory/");
    validators.set(valData)
    if (valData && chainData) {
        return {
            validatorData: valData,
            chainData: chainData.data.chains
        }
    }
    error(404, 'Not found');
}