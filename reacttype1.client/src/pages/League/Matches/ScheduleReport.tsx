import { useQuery } from '@tanstack/react-query';
import LeagueClass from "@components/LeagueClass.tsx";
import { Spinner } from "flowbite-react";

const fetchPDF = async (id: number): Promise<string> => {
    const response = await fetch(`/api/Matches/ScheduleReport/${id}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.text();
};

function ScheduleReport() {
    const league = new LeagueClass();

    const { data, isLoading, isError, error } = useQuery<string>({
        queryKey: ['ScheduleReport-pdf', league.id],
        queryFn: () => fetchPDF(league.id),
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

export default ScheduleReport;