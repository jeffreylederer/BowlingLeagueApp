import { useState, useMemo } from 'react';
import MatchFormData from "./MatchFormData.tsx";
import { UpdateFormData } from "../Schedule/UpdateFormData.tsx";
import { Link, useLocation } from 'react-router-dom';
import Layout from '@layouts/Layout.tsx';
import uparrow from '@images/uparrow.png';
import convertDate from '@components/convertDate.tsx';
import LeagueClass from "@components/LeagueClass";
import UserClass from '@components/UserClass.tsx';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from "flowbite-react";
import fetchData from '@components/fetchData.tsx';
import { GetCount } from '@components/CountMatches.tsx';
import DisplayTable from '@components/DisplayTable';
import { ColumnDef } from '@tanstack/react-table';



function Matches() {
    const user = new UserClass();
    const league = new LeagueClass();
    const permission: string = user.role;
    const allowed: boolean = (permission == "SiteAdmin" || permission == "Admin" || permission == "Scorer") ? false : true;
    const admin: boolean = (permission == "SiteAdmin" || permission == "Admin") ? false : true;
    const location = useLocation();
    const id: string = location.search.substring(4);
    const [weekid, setWeekid] = useState(+id);
    const standingUrl: string = "/League/Matches/Standings?id=".concat(weekid.toString());
    const scoreUrl: string = "/league/matches/ScoreCard?id=".concat(weekid.toString());
    const [errorMsg, setErrorMsg] = useState('');

    // Fetch schedule (weeks)
    const { data, isLoading, isError, error } = useQuery<UpdateFormData[]>({
        queryKey: ['schedules', league.id],
        queryFn: () => fetchData<UpdateFormData[]>(`/api/Schedules/${league.id}`)
    });

    const columns = useMemo<ColumnDef<MatchFormData, unknown>[]>(() => [
        {
            header: 'Exchange Rink',
            id: 'actions',
            cell: ({ row }) => (
                <button hidden={row.original.rink == 0} onClick={() => Reorder(row.original.id)} style={{ backgroundColor: 'white' }}><img src={uparrow} /></button>
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
                <Link to="/League/Matches/Update" state={row.original.id.toString()}>Score</Link>
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

    // Refetch matches when weekid changes
    const selectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setWeekid(+value);
        // refetch will be triggered automatically by useQuery due to key change
    };

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
                <h3>Games in {league.leagueName} league</h3>
                <p className="errorMessage">{error instanceof Error ? error.message : "An error occurred loading schedule."}</p>
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

    if (GetCount() == 0) {
        return (
            <Layout>
                <h3>Games in {league.leagueName} league</h3>
                <p>No matches created yet</p>
            </Layout>
        );
    }

    if (data != undefined ) {
        const week = data.find(x => x.id == weekid)
        if (week?.playOffs) {
            return (
                <Layout>
                    <h3>Games in {league.leagueName} league</h3>
                    <div className="toLeft">
                        <p className="toLeft">Date: <select onChange={selectChange} value={weekid}>
                            <option value="0" key="0" disabled>Select date</option>
                            {data?.map(item =>
                                <option key={item.id} value={item.id.toString()}>{convertDate(item.gameDate)}</option>
                            )}
                        </select><br />
                            <a href={standingUrl} target='blank' hidden={weekid == 0}>Standings report</a>
                           
                        </p>
                    </div>
                    <p>Playoff week</p>
                </Layout>
            );
        }
    }

    if (match == undefined || match.length === 0) {
        return (
            <Layout>
                <h3>Games in {league.leagueName} league</h3>
                <div className="toLeft">
                    <p className="toLeft">Date: <select onChange={selectChange} value={weekid}>
                        <option value="0" key="0" disabled>Select date</option>
                        {data?.map(item =>
                            <option key={item.id} value={item.id.toString()}>{convertDate(item.gameDate)}</option>
                        )}
                    </select><br />
                        <a href={standingUrl} target='blank' hidden={weekid == 0}>This week's standings report</a><br />
                        <a href={scoreUrl} target='blank' hidden={weekid == 0}>This week's score card</a>
                    </p>
                </div>
                
                <div hidden={match != undefined}>
                    <p>Select a game date</p>
                </div>
                <p style={{ textAlign: "center" }}>{errorMsg}</p>
            </Layout>

        )
    }

    return (
        <Layout>
            <h3>Games in {league.leagueName} league</h3>
            <div className="toLeft">
                <p className="toLeft">Date: <select onChange={selectChange} value={weekid}>
                    <option value="0" key="0" disabled>Select date</option>
                    {data?.map(item =>
                        <option key={item.id} value={item.id.toString()}>{convertDate(item.gameDate)}</option>
                    )}
                </select><br />
                    <a href={standingUrl} target='blank' hidden={weekid == 0}>This week's standings report</a><br />
                    <a href={scoreUrl} target='blank' hidden={weekid == 0}>This week's score card</a>
                </p>
            </div>
            <div hidden={match == undefined}>
                <DisplayTable<MatchFormData> data={match} columns={columns} />
            <p style={{ color: 'red', textAlign: 'left' }} hidden={weekid == 0}>Teams with wheel chair members are in red</p>
            </div>
            <div hidden={match != undefined}>
            <p>Select a game date</p>
            </div>
            <p style={{ textAlign: "center" }}>{errorMsg}</p>
        </Layout>
    );
}

export default Matches;