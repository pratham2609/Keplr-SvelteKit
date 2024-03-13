import axios from "axios"
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async () => {
    const data = await axios.get("https://validators.testcosmos.directory/chains/cosmoshubtestnet");
    if (data) { 
        return data.data; }
    error(404, 'Not found');
}