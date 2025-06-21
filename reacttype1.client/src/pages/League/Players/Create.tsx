import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { PlayerFormData, PlayerFormDataSchema } from "./FormData.tsx";
import { UpdateFormData } from "../../Membership/UpdateFormData.tsx";
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import LeagueClass from '@components/LeagueClass.tsx';
import SubmitButton from '@components/Buttons.tsx';
import Layout from '@layouts/Layout.tsx';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const fetchMembers = async (leagueId: number): Promise<UpdateFormData[]> => {
    const response = await fetch(`/api/players/getMembers/${leagueId}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

const createPlayer = async (data: PlayerFormData) => {
    const response = await fetch(`/api/players`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

const PlayersCreate = () => {
    const [errorMsg, setErrorMsg] = useState<string>('');
    const navigate = useNavigate();
    const league = new LeagueClass();
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
    } = useForm<PlayerFormData>({
        resolver: zodResolver(PlayerFormDataSchema),
    });

    const { data, isLoading, error } = useQuery<UpdateFormData[]>({
        queryKey: ['members', league.id],
        queryFn: () => fetchMembers(league.id),
        enabled: !!league.id,
    });

    const mutation = useMutation({
        mutationFn: createPlayer,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['players', league.id] });
            queryClient.invalidateQueries({ queryKey: ['members', league.id] });
            queryClient.invalidateQueries({ queryKey: ['playerslist', league.id] });
            navigate("/League/Players");
        },
        onError: (error: unknown) => {
            setErrorMsg(error instanceof Error ? error.message : String(error));
        }
    });

    const onSubmit: SubmitHandler<PlayerFormData> = (formData) => {
        mutation.mutate(formData);
    };

    if (error)
        return (
            <Layout>
                {(error as Error).message}
            </Layout>
        );

    if (isLoading)
        return (
            <Layout>
                <p>Loading...</p>
            </Layout>
        );

    return (
        <Layout>
            <h3>Create new player in league {league.leagueName} </h3>
            <form onSubmit={handleSubmit(onSubmit)} >
                <table>
                    <input type="hidden" {...register("leagueid")} defaultValue={league.id} />
                    <tr>
                        <td className="Label">Members:</td>
                        <td className="Field">
                            <select defaultValue="0" {...register("membershipId")}>
                                <option value="0" key="0">Select member</option>
                                {data?.map((item) => (
                                    <option value={item.id.toString()} key={item.id}>{item.fullName}</option>
                                ))}
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2} style={{ textAlign: "center" }}>
                            <SubmitButton disabled={mutation.isPending} />
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            <p className="errorMessage">{errorMsg}</p>
                            {mutation.isError && <p className="errorMessage">{(mutation.error as Error).message}</p>}
                        </td>
                    </tr>
                </table>
            </form>
        </Layout>
    );
};

export default PlayersCreate;