import { useState, useMemo } from 'react';
import MatchFormData from "@pages/League/Matches/MatchFormData.tsx";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Layout from '@layouts/Layout.tsx';
import uparrow from '@images/uparrow.png';
import convertDate from '@components/convertDate.tsx';
import LeagueClass from "@components/LeagueClass";
import UserClass from '@components/UserClass.tsx';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from "flowbite-react";
import fetchData from '@components/fetchData.tsx';
import DisplayTable from '@components/DisplayTable';
import { ColumnDef } from '@tanstack/react-table';




function GameList() {
    const user = new UserClass();
    const league = new LeagueClass();
    const permission: string = user.role;
    const allowed: boolean = (permission == "SiteAdmin" || permission == "Admin" || permission == "Scorer") ? false : true;
    const admin: boolean = (permission == "SiteAdmin" || permission == "Admin") ? false : true;
    const location = useLocation();
    const weekid: string = location.search.substring(4);
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const columns = useMemo<ColumnDef<MatchFormData, unknown>[]>(() => [
        {
            header: 'Exchange Rink',
            id: 'actions',
            cell: ({ row }) => (
                <button hidden={row.original.rink == 0} onClick={()=>Reorder(row.original.id)} style={{ backgroundColor: 'white' }}><img src={uparrow} /></button>
            ),
            meta: { hidden: admin }
        },
        {
            header: 'Game Date',
            cell: ({ row }) => {
                return <span>{convertDate(row.original.gameDate)}</span>
            }
        },
        {
            header: 'Rink',
            cell: ({ row }) => {
                return <div style={{ textAlign: 'center' }} >{row.original.rink + 1}</div>
            }
        },
        {
            header: 'Team 1',
            cell: ({ row }) => {
                return <span style={{ color: row.original.wheelchair1, textAlign: "left" }} >
                    {row.original.team1No} ({row.original.team1})</span>
            }
        },
        {
            header: 'Team 2',
            cell: ({ row }) => {
                return <span style={{ color: row.original.wheelchair2, textAlign: "left" }} >
                    {row.original.team2No} ({row.original.team2})</span>
            }
        },
        {
            header: 'Team 1 Score',
            cell: ({ row }) => {
                return <div style={{ textAlign: 'center' }} >{row.original.forFeitId != 0 ? '' : row.original.team1Score}</div>
            }
        },
        {
            header: 'Team 2 Score',
            cell: ({ row }) => {
                return <div style={{ textAlign: 'center' }} >{row.original.forFeitId != 0 ? '' : row.original.team2Score}</div>
            }
        },
        {
            header: 'Team Forfeiting',
            cell: ({ row }) => {
                return <div style={{ textAlign: 'center' }} >{row.original.forFeitId == 0 ? '' : row.original.forFeitId}</div>

            }
        },
        {
            header: '',
            id: 'actions',
            cell: ({ row }) => (
                <Link to="/League/Playoffs/PlayoffScoring" state={row.original.id.toString()}>Score</Link>
            ),
            meta: { hidden: allowed }
        },
    ], []);
   

    // Fetch matches for selected week
    const { data: match, isLoading: isLoadingMatch, isError: isErrorMatch, error: errorMatch, refetch } = useQuery<MatchFormData[]>({
        queryKey: ['matches', weekid],
        queryFn: () => fetchData<MatchFormData[]>(`/api/Matches/${weekid}`),
        enabled: !!weekid, // Only run if weekid is truthy
    });

   
    async function Reorder(id: number) {
       
        try {
            const response = await fetch(`/api/Matches/Reorder${id}`);
            if (!response.ok) {
                setErrorMsg(`HTTP error! Status: ${response.status}`);
                return;
            }
        } catch (error) {
            setErrorMsg(`Error: ${error instanceof Error ? error.message : String(error)}`);
            return;
        }
        refetch();
    }

    if (isLoadingMatch) {
        return (
            <Layout>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                    <Spinner size="xl" />
                </div>
            </Layout>
        );
    }

    
    if (isErrorMatch) {
        return (
            <Layout>
                <h3>Games in {league.leagueName} league</h3>
                <p className="errorMessage">{errorMatch instanceof Error ? errorMatch.message : "An error occurred loading matches."}</p>
            </Layout>
        );
    }

      
        return (
            <Layout>
                <h3>Playoff games in {league.leagueName} league</h3>
                <div className="toLeft">
                    <a href={`/league/playoffs/GameReport?id=${weekid}`} target='blank' >This week's schedule</a><br />
                    <a href={`/league/playoffs/PlayoffResults?id=${weekid}`} target='blank' >This week's results</a><br />
                    <a href={`/league/matches/ScoreCard?id=${weekid}`} target='blank' >This week's score card</a>
                </div>

                
               
                
                <div hidden={match == undefined}>
                    <DisplayTable<MatchFormData> data={match} columns={columns} />
                    <p style={{ color: 'red', textAlign: 'left' }} >Teams with wheel chair members are in red</p>
                </div>
                <button onClick={() => navigate("/league/playoffs")} >Back to list</button>
                <p style={{ textAlign: "center" }}>{errorMsg}</p>
            </Layout>
        );
    
}

export default GameList;