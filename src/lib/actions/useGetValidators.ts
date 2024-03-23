import { createQuery } from '@tanstack/svelte-query';
import { getValidators } from '$lib/actions';

function useGetValidators() {
    const refetchInterval = 10000;
    const getVal = async () => {
        const res = await getValidators()
        return res;
    };
    return createQuery({
        queryKey: ["getValidators"],
        queryFn: getVal,
        refetchOnMount: true,
        refetchInterval: refetchInterval
    });
}

export default useGetValidators;