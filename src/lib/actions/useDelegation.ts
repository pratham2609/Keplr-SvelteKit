import { stake } from "$lib/actions";
import { createMutation, useQueryClient } from "@tanstack/svelte-query";

function useDelegation() {
    const queryClient = useQueryClient();
    const stakeVal = async ({ myAddress, toAddress, denom, toSend, memo }: {
        myAddress: string,
        toAddress: string,
        denom: string,
        toSend: string,
        memo: string
    }) => {
        const stakedVal = await stake({ myAddress, toAddress, denom, toSend, memo });
        return stakedVal;
    }
    return createMutation({
        mutationFn: stakeVal,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["userBalance"],
                refetchType: 'all',
            });
        },
    })
}
export default useDelegation;