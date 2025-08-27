import { useQuery, useQueryClient } from '@tanstack/react-query';
import useLeague from "@hooks/useLeague";
import Layout from '@layouts/Layout.tsx';
import {SetCount} from '@components/CountMatches';
import fetchText from '@components/fetchText.tsx';
import { Spinner } from "flowbite-react";


const ClearMatches = () => {
   const {league} = useLeague();
    const queryClient = useQueryClient();
    

    const { data, isLoading, isError, error } = useQuery<string>({
        queryKey: ['ClearMatches', league.id],
        queryFn: () => fetchText(`/api/Matches/ClearSchedule/${league.id}`),
        enabled: !!league.id
    })


    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <Spinner size="xl" />
            </div>
        );
    }


    if (isError) {
        return <p className="errorMessage">{error instanceof Error ? error.message : "An error occurred."}</p>;
    }

    if (data != undefined && data == 'Cleared matches') { 
        SetCount(false);
        queryClient.invalidateQueries({ queryKey: ['ClearMatches', league.id] });
        queryClient.invalidateQueries({ queryKey: ['CreateMatches', league.id] });
    }
    return (
        <Layout>
            <p>{data}</p>
        </Layout>
    );
    
}

export default ClearMatches;