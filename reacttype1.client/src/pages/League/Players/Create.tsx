import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { PlayerFormData, PlayerFormDataSchema } from "./FormData.tsx";
import { UpdateFormData } from "../../Membership/UpdateFormData.tsx";
import { zodResolver } from '@hookform/resolvers/zod';
import useLeague from '@hooks/useLeague';
import SubmitButton from '@components/SubmitButton.tsx'
import Layout from '@layouts/Layout.tsx';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Spinner } from "flowbite-react";
import fetchData from '@components/fetchData.tsx';

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
    const navigate = useNavigate();
   const {league} = useLeague();
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
    } = useForm<PlayerFormData>({
        resolver: zodResolver(PlayerFormDataSchema),
    });

    const { data, isLoading, error } = useQuery<UpdateFormData[]>({
        queryKey: ['members', league.id],
        queryFn: () => fetchData<UpdateFormData[]>(`/api/players/getMembers/${league.id}`),
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
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                    <Spinner size="xl" />
                </div>
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
                            {mutation.isError && (
                                <p className="errorMessage">
                                    {mutation.error instanceof Error
                                        ? mutation.error.message
                                        : "An error occurred while creating player record."}
                                </p>
                            )}
                        </td>
                    </tr>
                </table>
            </form>
        </Layout>
    );
};

export default PlayersCreate;