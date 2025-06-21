import { useState } from 'react';
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

const fetchMatches = async (id: number): Promise<MatchFormData[]> => {
    const response = await fetch(`/api/Matches/${id}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

const fetchSchedule = async (id: number): Promise<UpdateFormData[]> => {
    const response = await fetch(`/api/Schedules/${id}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

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
    const [errorMsg, setErrorMsg] = useState('Matches created');

    // Fetch schedule (weeks)
    const { data, isLoading, isError, error } = useQuery<UpdateFormData[]>({
        queryKey: ['schedules', league.id],
        queryFn: () => fetchSchedule(league.id),
    });

    // Fetch matches for selected week
    const { data: match, isLoading: isLoadingMatch, isError: isErrorMatch, error: errorMatch, refetch } = useQuery<MatchFormData[]>({
        queryKey: ['matches', weekid],
        queryFn: () => fetchMatches(weekid),
        enabled: !!weekid, // Only run if weekid is truthy
    });

    // Refetch matches when weekid changes
    const selectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setWeekid(+value);
        // refetch will be triggered automatically by useQuery due to key change
    };

    async function Reorder(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        const button: HTMLButtonElement = event.currentTarget;
        const id: string = button.name;
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
            <table className="table table-striped" aria-labelledby="tableLabel">
                <thead>
                    <tr>
                        <th hidden={admin}>
                            Exchange Rink
                        </th>
                        <th>
                            Game Date
                        </th>
                        <th>
                            Rink
                        </th>
                        <th style={{ textAlign: "center" }}>
                            Team 1
                        </th>
                        <th style={{ textAlign: "center" }}>
                            Team 2
                        </th>
                        <th >
                            Team 1 Score
                        </th>
                        <th >
                            Team 2 Score
                        </th>
                        <th >
                            Team Forfeiting
                        </th>
                        <th hidden={allowed}></th>
                    </tr>
                </thead>
                <tbody>
                    {match?.map(item =>
                        <tr key={item.id}>
                            <td hidden={admin}><button hidden={item.rink == 0} onClick={Reorder} name={item.id.toString()} style={{ backgroundColor: 'white' }}><img src={uparrow} /></button></td>
                            <td>{convertDate(item.gameDate)}</td>
                            <td>{item.rink + 1}</td>
                            <td style={{ color: item.wheelchair1, textAlign: "left" }} >
                                {item.team1No} ({item.team1})</td>
                            <td style={{ color: item.wheelchair2, textAlign: "left" }} >
                                {item.team2No} ({item.team2})</td>
                            <td style={{ textAlign: 'center' }} >{item.forFeitId != 0 ? '' : item.team1Score}</td>
                            <td style={{ textAlign: 'center' }} >{item.forFeitId != 0 ? '' : item.team2Score}</td>
                            <td style={{ textAlign: 'center' }} >{item.forFeitId == 0 ? '' : item.forFeitId}</td>
                            <td hidden={allowed} ><Link to="/League/Matches/Update" state={item.id.toString()}>Score</Link></td>
                        </tr>
                    )}
                </tbody>
            </table>
            <p style={{ color: 'red', textAlign: 'left' }} hidden={weekid == 0}>Teams with wheel chair members are in red</p>
            <p style={{ textAlign: "center" }}>{errorMsg}</p>
        </Layout>
    );
}

export default Matches;