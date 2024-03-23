import { createQuery } from '@tanstack/svelte-query';
import { getRewards } from '$lib/actions';

function useGetDelegations() {
    const refetchInterval = 10000;
    const getVal = async () => {
        const res = await getRewards()
        console.log(res)
        return res;
    };
    return createQuery({
        queryKey: ["getDelegations"],
        queryFn: getVal,
        refetchOnMount: true,
        refetchInterval: refetchInterval
    });
}

export default useGetDelegations;