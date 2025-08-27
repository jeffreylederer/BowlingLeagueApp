import { useState, useEffect } from 'react';
import fetchData from '@components/fetchData.tsx'; 
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Spinner } from "flowbite-react";
import Layout from '@layouts/Layout.tsx';
import SetupType from './SetupType.ts';    
import PlayOffMatchType from './PlayOffMatchType.ts';
import { useLocation, useNavigate } from "react-router-dom";
import useLeague from "@hooks/useLeague";

function PlayoffsUpdate ()  {
    const location = useLocation();
    const weekid: number = location.state;
   const {league} = useLeague();
    const navigate = useNavigate();
    
    const [matches, setMatches] = useState<PlayOffMatchType[] | undefined>(undefined);
    const queryClient = useQueryClient();

    const SaveMatches = async () => {
        const response = await fetch('/api/Playoffs', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(matches),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    };

    const mutation = useMutation({
        mutationFn: SaveMatches,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['UpdateMatches', weekid] });
            navigate("/League/Playoffs");
        },
        
    });

    function SaveSelection() {
        mutation.mutate();
    }

    const { data, isLoading, error, isError } = useQuery<SetupType[] | undefined>({
        queryKey: ['teamlist', league.id],
        queryFn: () => fetchData(`/api/teams/AllTeamsWithNames/${league.id}`),
        enabled: !!league.id
    });

    const { data: dataMatches, isLoading : isLoadingMatch, error: errorMatch, isError: isErrorMatch } = useQuery<PlayOffMatchType[] | undefined>({
        queryKey: ['UpdateMatches', weekid],
        queryFn: () => fetchData(`/api/Playoffs/GetMatchesForUpdate/${weekid}`),
        staleTime: Infinity
    });

    // Set matches when dataMatches loads
    useEffect(() => {
        if (dataMatches && !matches) {
            setMatches(dataMatches);
        }
    }, [dataMatches, matches]);

    // Correctly update matches array immutably
    const handleTeamChange = (
        matchIndex: number,
        teamType: '1' | '2',
        teamId: number
    ) => {
        setMatches(prevMatches => {
            if (!prevMatches) return prevMatches;
            const updated = prevMatches.map((m, idx) => {
                if (idx !== matchIndex) return m;
                return {
                    ...m,
                    teamNo1: teamType === '1' ? teamId : m.teamNo1,
                    teamNo2: teamType === '2' ? teamId : m.teamNo2
                };
            });
            return updated;
        });
    };

    if (isLoading || isLoadingMatch) {
        return (
            <Layout>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                    <Spinner size="xl" />
                </div>
            </Layout>
        );
    }

    if (isError) {
        return (
            <Layout>
                <h3>Games </h3>
                <p className="errorMessage">{error instanceof Error ? error.message : "An error occurred loading schedule."}</p>
            </Layout>
        );
    }

    if (isErrorMatch) {
        return (
            <Layout>
                <h3>Games </h3>
                <p className="errorMessage">{errorMatch instanceof Error ? errorMatch.message : "An error occurred loading schedule."}</p>
            </Layout>
        );
    }

    return (
        <div>
            <h3>Update Playoff Matches</h3>
            {matches?.map((match, idx) => (
                <div key={idx} style={{ marginBottom: 16 }}>
                    <label>
                        <span>Rink {idx + 1} </span>                  
                        <select
                            value={match?.teamNo1?.toString() || ''}
                            onChange={(e) =>
                                handleTeamChange(idx, '1', Number(e.target.value))}
                        >
                            <option value="">Select Team</option>
                            {data?.map((team) => (
                                <option key={team.teamNo} value={team.teamNo}>
                                    {team.teamMembers}
                                </option>
                            ))}
                        </select>
                    </label>
                    <span style={{ margin: '0 8px' }}>vs</span>
                    <label>
                        <select
                            value={match?.teamNo2?.toString() || ''}
                            onChange={(e) =>
                                handleTeamChange(idx, '2', Number(e.target.value))}
                        >
                            <option value="">Select Team</option>
                            {data?.map((team) => (
                                <option key={team.teamNo} value={team.teamNo}>
                                    {team.teamMembers}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
            ))}
            <button onClick={SaveSelection}>Save Selections</button>&nbsp;
            <button onClick={() => navigate(-1)}>Back to List</button>
            {mutation.isError && (
                <p className="errorMessage">
                    {mutation.error instanceof Error
                        ? mutation.error.message
                        : "An error occurred while updating playoff record."}
                </p>
            )}
        </div>
    );
};

export default PlayoffsUpdate;