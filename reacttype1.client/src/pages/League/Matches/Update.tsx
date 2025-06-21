import { useLocation, useNavigate } from "react-router-dom";
import { useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { UpdateFormData, UpdateFormDataSchema } from "./UpdateFormData.tsx";
import { zodResolver } from '@hookform/resolvers/zod';
import { TextInput, Spinner } from "flowbite-react";
import MatchFormData from "./MatchFormData.tsx";
import { ReturnButton } from '@components/Buttons.tsx';
import Layout from '@layouts/Layout.tsx';
import convertDate from '@components/convertDate.tsx';
import { useQuery, useMutation } from '@tanstack/react-query';


const MatchUpdate = () => {
    const location = useLocation();
    const id: number = location.state;
    const [hidden, setHidden] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string>('');
    const navigate = useNavigate();
    

    // Fetch match data from API
    const { data: match, isLoading, isError, error } = useQuery<MatchFormData>({
        queryKey: ['match', id],
        queryFn: async () => {
            const response = await fetch(`/api/Matches/GetOneMatch/${id}`);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to fetch match');
            }
            return response.json();
        },
    });

    // Mutation for updating match
    const mutation = useMutation({
        mutationFn: async (data: UpdateFormData) => {
            if (data.forfeit != 0) {
                data.team1Score = 0;
                data.team2Score = 0;
            }
            const response = await fetch(`/api/Matches/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to update match');
            }
        },
        onSuccess: () => {
            const url: string = match ? `/League/Matches?id=${match.weekId}` : "/League/Matches";
            navigate(url);
        },
        onError: (error) => {
            setErrorMsg(error.message || String(error));
        },
    });

    const {
        register,
        handleSubmit,
        formState: { errors }

    } = useForm<UpdateFormData>({
        resolver: zodResolver(UpdateFormDataSchema),
    });

    

   
    const onSubmit: SubmitHandler<UpdateFormData> = (data) => mutation.mutate(data);

    function Goback() {
        const url: string = match ? `/League/Matches?id=${match.weekId}` : "/League/Matches";
        navigate(url);
    }

    if (isLoading) {
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
                <h3>Enter score for match</h3>
                <p className="errorMessage">
                    {error instanceof Error ? error.message : "An error occurred while loading the match."}
                </p>
            </Layout>
        );
    }


    if (match) {
       
        return (
            <Layout>
                <h3>Enter score for match </h3>
                <form onSubmit={handleSubmit(onSubmit)} >
                    <table>
                        <input type="hidden" {...register("id", { valueAsNumber: true })} defaultValue={match.id} />
                        <tr>
                            <td className="Label">Game Date:</td>
                            <td className="Field">{convertDate(match.gameDate)}</td>
                        </tr>
                        <tr>
                            <td className="Label">Rink:</td>
                            <td className="Field">{match.rink + 1}</td>
                        </tr>
                        <tr>
                            <td className="Label">Team {match.team1No}:</td>
                            <td className="Field">{match.team1}</td>
                        </tr>
                        <tr>
                            <td className="Label">Team {match.team2No}:</td>
                            <td className="Field">{match.team2}</td>
                        </tr>
                        <tr>
                            <td className="Label">Team {match.team1No} Score</td>
                            <td className="Field">
                                <TextInput {...register('team1Score')} defaultValue={match.team1Score} hidden={hidden} />
                            </td>
                        </tr>
                        <tr>
                            <td className="Label">Team {match.team2No} Score</td>
                            <td className="Field">
                                <TextInput {...register('team2Score')} defaultValue={match.team2Score} hidden={hidden} />
                            </td>
                        </tr>
                        <tr>
                            <td className="Label">Forfeit</td>
                            <td className="Field">
                                <select
                                    {...register('forfeit')} defaultValue={match.forFeitId}
                                    
                                    onChange={e => {
                                        const value = e.target.value;
                                        setHidden(value !== '0');
                                    }}
                                >
                                    <option value="0">No Forfeit</option>
                                    <option value={match.team1No}>{match.team1No}</option>
                                    <option value={match.team2No}>{match.team2No}</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2} >
                                <ReturnButton Back={Goback} disabled={mutation.isPending} />
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={1}>
                                {errors.team1Score && <p className="errorMessage">{errors.team1Score.message}</p>}
                                {errors.team2Score && <p className="errorMessage">{errors.team2Score.message}</p>}
                                {mutation.isError && (
                                    <p className="errorMessage">
                                        {mutation.error instanceof Error
                                            ? mutation.error.message
                                            : "An error occurred while updating the match."}
                                    </p>
                                )}
                                <p className="errorMessage">{errorMsg}</p>
                            </td>
                        </tr>
                    </table>
                </form>
            </Layout>
        );
    }

    return null;
};

export default MatchUpdate;