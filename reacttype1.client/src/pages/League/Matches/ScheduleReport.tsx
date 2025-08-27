import { useQuery } from '@tanstack/react-query';
import useLeague from "@hooks/useLeague";
import { Spinner } from "flowbite-react";
import fetchText from '@components/fetchText.tsx';

function ScheduleReport() {
   const {league} = useLeague();

    const { data, isLoading, isError, error } = useQuery<string>({
        queryKey: ['ScheduleReport-pdf', league.id],
        queryFn: () => fetchText(`/api/Matches/ScheduleReport/${league.id}`),
        enabled: !!league.id,
        staleTime: Infinity
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

export default ScheduleReport;