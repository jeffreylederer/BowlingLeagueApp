import { useState, useMemo } from 'react';
import fetchData from '@components/fetchData.tsx';
import { useQuery, useQueryClient , useMutation} from '@tanstack/react-query';
import { Spinner } from "flowbite-react";
import Layout from '@layouts/Layout.tsx';
import SetupType from './SetupType.ts';
import { useLocation, useNavigate } from "react-router-dom";
import LeagueClass from "@components/LeagueClass";
import TeamType from './TeamType.ts';  
import { ColumnDef } from '@tanstack/react-table';
import DisplayTable from '@components/DisplayTable';
import CreateMatchType from './CreateMatchType.ts'; // Assuming this is the correct import path for CreateMatchType



function PlayoffsCreate() {


    const location = useLocation();
    const weekid: number = location.state;
    const league = new LeagueClass();
    const navigate = useNavigate();

    const [errorMsg, setErrorMsg] = useState<string>('');
    const [rink, setRink] = useState<number>(0);
    const queryClient = useQueryClient()
    const [teams, setTeams] = useState<SetupType[] | undefined>(); 
    const [team, setTeam] = useState<TeamType>({ rink: 0, teamMembers1: '', teamMembers2: '', teamNo1: 0, teamNo2: 0 });
    const [match, setMatch] = useState<TeamType[]| undefined>([]);    
 
    const { data, isLoading, error, isError } = useQuery<SetupType[] | undefined>({
        queryKey: ['teamlist', league.id],
        queryFn: () => fetchData(`/api/teams/AllTeamsWithNames/${league.id}`),
        enabled: !!league.id,
        staleTime: Infinity


    });

    const SaveMatches = async () => {
        if (match != undefined && data != undefined && match.length < data.length/2) {
            setErrorMsg("Not all teams are assigned to rink");
            return;
        }
        const theMatches: CreateMatchType[] = match?.map((m) => ({
            weekId: weekid,
            teamNo1: m.teamNo1,
            teamNo2: m.teamNo2,
            rink: m.rink
        })) || [];
  

        const response = await fetch('/api/Playoffs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(theMatches),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    };

    const mutation = useMutation({
        mutationFn: SaveMatches,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['CreateMatches', weekid] });
            navigate("/League/Playoffs");
        },
        
    });

    function SaveSelection() {
        mutation.mutate();

    }

    const columns = useMemo<ColumnDef<TeamType, unknown>[]>(() => [

        {
            header: 'Rink',
            accessorFn: row => `${row.rink+1}`,
        },
        {
            header: 'Team1',
            accessorKey: 'teamMembers1'
        },
        {
            header: 'Team2',
            accessorKey: 'teamMembers2'
        }
       


    ], []);
    

    const handleTeamChange = (

        teamType: '1' | '2',
        teamId: number
    ) => {
            const ateam = teams?.find((x) => x.teamNo === teamId);  
            if (teamType == '1') {
                team.teamNo1 = teamId;
                team.teamMembers1 = ateam ? ateam.teamMembers : '';


            }
            else {
                team.teamNo2 = teamId;
                team.teamMembers2 = ateam ? ateam.teamMembers : '';
            }
        setTeam({ ...team }); 
    };

    const AddNewTeam = () => {
        if (team.teamNo1 === 0 || team.teamNo2 === 0) {
            setErrorMsg("Please select both teams before adding a new team.");
            return;
        }
        if (team.teamNo1 === team.teamNo2) {
            setErrorMsg("Teams cannot be the same. Please select different teams.");
            return;
        }
        const teamType: TeamType = { rink: rink, teamMembers1: team.teamMembers1, teamMembers2: team.teamMembers2, teamNo1: team.teamNo1, teamNo2: team.teamNo2 };  
        setMatch(match ? [...match, teamType] : [teamType]); 
        setRink(rink + 1);
        setTeam({ rink: rink, teamMembers1: '', teamMembers2: '', teamNo1: 0, teamNo2: 0 });
        const rest = teams?.filter(t => t.teamNo !== team.teamNo1 && t.teamNo !== team.teamNo2);
        if(rest != undefined)
            setTeams(rest); // Remove selected teams from dropdown)
        setErrorMsg('');
    }


        if (isLoading ) {
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

   

    if (data != undefined && teams == undefined) {
            setTeams(data);
    }




    if (match != undefined) {
        return (

            <Layout>
                <div hidden={data && match && data.length / 2 == match.length}>
                    <label>Rink: {rink + 1}&nbsp;&nbsp; </label>
                    <label>

                        <select
                            defaultValue="0"
                            value={team?.teamNo1?.toString()}
                            onChange={(e) =>
                                handleTeamChange('1', Number(e.target.value))}
                        >
                            <option value="0">Select Team</option>
                            {teams?.map((team) => (
                                <option key={team.teamNo.toString()} value={team.teamNo.toString()}>
                                    {team.teamMembers}
                                </option>
                            ))}
                        </select>
                    </label>
                    <span style={{ margin: '0 8px' }}>vs</span>
                    <label>

                        <select
                            defaultValue="0"
                            value={team?.teamNo2?.toString()}
                            onChange={(e) =>
                                handleTeamChange('2', Number(e.target.value))}>
                            <option value="0">Select Team</option>
                            {teams?.map((team) => (
                                <option key={team?.teamNo?.toString()} value={team?.teamNo?.toString()}>
                                    {team.teamMembers}
                                </option>
                            ))}
                        </select>
                    </label>


                    <label ><button onClick={() => AddNewTeam()} >Add team</button></label>
                </div>
                <DisplayTable<TeamType> data={match} columns={columns} />
                <button onClick={() => SaveSelection()} disabled={!(data && match && data.length / 2 == match.length)}>Save Selections</button>&nbsp;  <button onClick={() => navigate(-1)}>Back to List</button>
                {mutation.isError && (
                    <p className="errorMessage">
                        {mutation.error instanceof Error
                            ? mutation.error.message
                            : "An error occurred while creating playoff record."}
                    </p>
                )}
                <p className="errorMessage">{errorMsg}</p>
            </Layout>
        );
    }
};

export default PlayoffsCreate;