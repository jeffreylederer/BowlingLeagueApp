import { useQuery } from '@tanstack/react-query';
import LeagueClass from "@components/LeagueClass.tsx";
import { Spinner } from "flowbite-react";
import fetchText from '@components/fetchText.tsx';
import { useLocation } from "react-router-dom";

function PlayoffResults() {
    const league = new LeagueClass();
    const location = useLocation();
    const weekid: string = location.search.substring(4);


    const { data, isLoading, isError, error } = useQuery<string>({
        queryKey: ['ScheduleReport-pdf', league.id],
        queryFn: () => fetchText(`/api/Playoffs/PlayoffResults/${weekid}`),
        enabled: !!league.id
    },
    );


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



    return (
        <embed src={!data ? 'No data generated' : `data:application/pdf;base64,${data}`} type="application/pdf" width='1000' height='800' />
    );
}

export default PlayoffResults;