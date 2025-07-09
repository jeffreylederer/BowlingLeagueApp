import { Link } from 'react-router-dom';
import { UpdateFormData } from "@pages/League/Schedule/UpdateFormData.tsx";
import LeagueClass from "@components/LeagueClass";
//import UserClass from "@components/UserClass";
import Layout from '@layouts/Layout.tsx';
import { useQuery } from '@tanstack/react-query';
//import { useMemo } from 'react';
import { Spinner } from "flowbite-react";
//import DisplayTable from '@components/DisplayTable';
//import { ColumnDef } from '@tanstack/react-table';
import fetchData from '@components/fetchData';
import PlayoffGamesType from './PlayoffGamesType.tsx';

function Playoffs() {
    //const user = new UserClass();
    const league = new LeagueClass();
    //const permission: string = user.role;
    //const updateAllowed: boolean = (permission == "SiteAdmin" || permission == "Admin");
   

    const { data, isLoading, error } = useQuery<UpdateFormData[]>({
        queryKey: ['schedules', league.id],
        queryFn: () => fetchData<UpdateFormData[]>(`/api/schedules/${league.id}`),
        enabled: !!league.id,
        select: (data) => data.filter(item => item.playOffs)
    });

    const { data: dataGames, isLoading: isLoadingGames, error: errorGames } = useQuery<PlayoffGamesType[]>({
        queryKey: ['PlayoffGames', league.id],
        queryFn: () => fetchData<UpdateFormData[]>(`/api/matches/PlayoffGames/${league.id}`),
        enabled: !!league.id,
        
    });

    const HasMatches = (id: number): boolean => {
        return dataGames != undefined && dataGames.some((game) => game.id === id);

    }

    //const columns = useMemo<ColumnDef<UpdateFormData, unknown>[]>(() => [
        
    //    {
    //        header: 'Game Date',
    //        accessorKey: 'gameDate'
    //    },
    //    {
    //        header: 'Cancelled',
    //        accessorKey: 'cancelled'
    //    },
         
    //    {
    //        header: '',
    //        id: 'actions',
    //        cell: ({ row }) => (
    //            <>
    //                <span hidden={HasMatches(row.original.id) && !updateAllowed}>
    //                    <Link to={'/league/playoffs/Create'} state={row.original.id.toString()} >Create Week's Teams</Link>
    //                 </span>
    //                <span hidden={!HasMatches(row.original.id) && !updateAllowed}>
    //                    <Link to={'/league/playoffs/Create'} state={row.original.id.toString()} >Update Week's Teams</Link>|
    //                    <Link to={`/League/playoffs/ListGames?id=${row.original.id}`} >Score Games</Link>
    //                </span>
    //            </>
    //        ),
    //    },
    //], []);

    if (isLoading || isLoadingGames)
        return (
            <Layout>
                <h3 aria-label="Membership table">Playoffs for League {league.leagueName}</h3>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                    <Spinner size="xl" />
                </div>
            </Layout>
        );

    if (error)
        return (
            <Layout>
                <h3 aria-label="Membership table">Playoffs for League {league.leagueName}</h3>
                <p className="errorMessage">{(error as Error).message}</p>
            </Layout>
        );


    if (errorGames)
        return (
            <Layout>
                <h3 aria-label="Membership table">Playoffs for League {league.leagueName}</h3>
                <p className="errorMessage">{(errorGames as Error).message}</p>
            </Layout>
        );

    if (!data || data.length === 0)
        return (
            <Layout>
                <h3 aria-label="Membership table">Playoffs for League {league.leagueName}</h3>
              
                <p>No Playoff Dates</p>
            </Layout>
        );

   

    if (dataGames != undefined) {
        return (
            <Layout>
                <h3 id="tableLabel">Playoff Schedule for League {league.leagueName}</h3>

                <table>
                    <thead>
                        <th>Game Date</th>
                        <th>Cancelled</th>
                        <th></th>
                    </thead>
                    <tbody>
                        {data?.map(item =>
                            <tr>
                                <td>{item.gameDate}</td>
                                <td align="center">{item.cancelled ? "Yes" : "No"}</td>
                                <td>
                                    <span hidden={HasMatches(item.id)}>
                                        <Link to={'/league/playoffs/Create'} state={item.id.toString()} >Create Week's Teams</Link>
                                    </span>
                                    <span hidden={!HasMatches(item.id)}>
                                        <Link to={'/league/playoffs/Update'} state={item.id.toString()} >Update Week's Teams</Link> |&nbsp;
                                        <Link to={`/League/playoffs/ListGames?id=${item.id}`} >Score Games</Link> 
                                    </span>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </Layout>
        );
    }
}

export default Playoffs;