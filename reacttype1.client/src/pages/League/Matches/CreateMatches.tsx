import { useQuery } from '@tanstack/react-query';
import LeagueClass from "@components/LeagueClass.tsx";
import Layout from '@layouts/Layout.tsx';
import { SetCount } from '@components/CountMatches.tsx';
import fetchText from '@components/fetchText.tsx';
import { Spinner } from "flowbite-react";


const CreateMatches = () => {
    const league = new LeagueClass();
    

    const { data, isLoading, isError, error } = useQuery<string>({
        queryKey: ['CreateMatches', league.id],
        queryFn: () => fetchText(`/api/Matches/CreateSchedule/${league.id}`),
        enabled: !!league.id,
        staleTime: Infinity
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

    if (data != undefined && data == 'Created matches') {
        SetCount(1);
        
    }
    return (
        <Layout>
            <p>{data}</p>
        </Layout>
    );

}

export default CreateMatches;