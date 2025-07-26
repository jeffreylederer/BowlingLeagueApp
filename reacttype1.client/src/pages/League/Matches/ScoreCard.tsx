import { useQuery } from '@tanstack/react-query';
import { Spinner } from "flowbite-react";
import { useLocation } from "react-router-dom";
import fetchText from '@components/fetchText.tsx';




function ScoreCard() {
    const location = useLocation();
    const id: string = location.search.substring(4);

    const { data, isLoading, isError, error } = useQuery<string>({
        queryKey: ['ScoreCardReport-pdf', id],
        queryFn: () => fetchText(`/api/Matches/ScoreCard/${id}`),
        enabled: !!id
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

export default ScoreCard;