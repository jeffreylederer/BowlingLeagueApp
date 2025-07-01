import { useQuery, useQueryClient } from '@tanstack/react-query';
import LeagueClass from "@components/LeagueClass.tsx";
import Layout from '@layouts/Layout.tsx';
import { SetCount } from '@components/CountMatches.tsx';
import fetchText from '@components/fetchText.tsx';
import { Spinner } from "flowbite-react";


const ClearMatches = () => {
    const league = new LeagueClass();
    const queryClient = useQueryClient()

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
        SetCount(0);
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