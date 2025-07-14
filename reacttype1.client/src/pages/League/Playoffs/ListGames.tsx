import { useState } from 'react';
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


   

    // Fetch matches for selected week
    const { data: match, isLoading: isLoadingMatch, isError: isErrorMatch, error: errorMatch, refetch } = useQuery<MatchFormData[]>({
        queryKey: ['matches', weekid],
        queryFn: () => fetchData<MatchFormData[]>(`/api/Matches/${weekid}`),
        enabled: !!weekid, // Only run if weekid is truthy
    });

   
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
                                <td hidden={allowed} ><Link to="/League/Playoffs/PlayoffScoring" state={item.id.toString()}>Score</Link></td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <p style={{ color: 'red', textAlign: 'left' }} >Teams with wheel chair members are in red</p>
            </div>
            <button onClick={() => navigate("/league/playoffs")} >Back to list</button> 
            
            <p style={{ textAlign: "center" }}>{errorMsg}</p>
        </Layout>
    );
}

export default GameList;