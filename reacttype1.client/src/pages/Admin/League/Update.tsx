import { useLocation, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { UpdateFormData, UpdateFormDataSchema } from "./UpdateFormData.tsx";
import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox, TextInput, Button, Spinner } from "flowbite-react";
import Layout from "@layouts/Layout.tsx";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import fetchData from '@components/fetchData.tsx';

const updateLeague = async ({ id, data }: { id: number, data: UpdateFormData }) => {
    const response = await fetch(`/api/leagues/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

const LeagueUpdate = () => {


    const location = useLocation();
    const id: number = location.state;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UpdateFormData>({
        resolver: zodResolver(UpdateFormDataSchema),
    });

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery<UpdateFormData>({
        queryKey: ['league', id],
        queryFn: () => fetchData<UpdateFormData>(`/api/leagues/${id}`),
        enabled: !!id,
    });

    const mutation = useMutation({
        mutationFn: (formData: UpdateFormData) => updateLeague({ id, data: formData }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['league', id] });
            queryClient.invalidateQueries({ queryKey: ['leagueslist'] });
            navigate("/Admin/Leagues");
        },
        
    });

    const onSubmit: SubmitHandler<UpdateFormData> = (formData) => {
        mutation.mutate(formData);
    };

    if (error)
        return (
            <Layout>
                <h3>Update membership record</h3>
                {(error as Error).message}
            </Layout>
        );

    if (isLoading)
        return (
            <Layout>
                <h3>Update membership record</h3>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                    <Spinner size="xl" />
                </div>
            </Layout>
        );

    if (data) {
        return (
            <Layout>
                <h3>Update record for league {data.leagueName}</h3>
                <form onSubmit={handleSubmit(onSubmit)} >
                    <input type="hidden" {...register('startWeek')} defaultValue="1" />
                    <table>
                        <input type="hidden" {...register("id", { valueAsNumber: true })} defaultValue={data.id} />
                        <tr>
                            <td className="Label">League Name:</td>
                            <td className="Field"><TextInput {...register('leagueName')} defaultValue={data.leagueName} style={{ width: "400px" }} /></td>
                        </tr>
                        <tr>
                            <td className="Label">Active:</td>
                            <td className="Field">
                                <Checkbox {...register('active')} defaultChecked={data.active} />
                            </td>
                        </tr>
                        <tr>
                            <td className="Label">Team Size:</td>
                            <td className="Field"><TextInput type="number" {...register('teamSize')} defaultValue={data.teamSize} /></td>
                        </tr>
                        <tr>
                            <td className="Label">Ties Allowed:</td>
                            <td className="Field">
                                <Checkbox {...register('tiesAllowed')} defaultChecked={data.tiesAllowed} />
                            </td>
                        </tr>
                        <tr>
                            <td className="Label">Points Count:</td>
                            <td className="Field">
                                <Checkbox {...register('pointsCount')} defaultChecked={data.pointsCount} />
                            </td>
                        </tr>
                        <tr>
                            <td className="Label">Points for a Win:</td>
                            <td className="Field"><TextInput {...register('winPoints')} defaultValue={data.winPoints} /></td>
                        </tr>
                        <tr>
                            <td className="Label">Points for a Tie:</td>
                            <td className="Field"><TextInput {...register('tiePoints')} defaultValue={data.tiePoints} /></td>
                        </tr>
                        <tr>
                            <td className="Label">Points for a Bye:</td>
                            <td className="Field"><TextInput {...register('byePoints')} defaultValue={data.byePoints} /></td>
                        </tr>
                        <tr>
                            <td className="Label">Points are limited:</td>
                            <td className="Field">
                                <Checkbox {...register('pointsLimit')} defaultChecked={data.pointsLimit} />
                            </td>
                        </tr>
                        <tr>
                            <td className="Label"># of Divisions:</td>
                            <td className="Field"><TextInput {...register('divisions')} defaultValue={data.divisions} /></td>
                        </tr>
                        <tr>
                            <td className="Label">Playoffs:</td>
                            <td className="Field">
                                <Checkbox {...register('playOffs')} defaultChecked={data.playOffs} />
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2} >
                                <div className="flex flex-wrap gap-2" >
                                    <Button outline color="Default" type="submit" disabled={mutation.isPending}>Submit</Button>
                                    <Button outline color="Default" onClick={() => navigate("/Admin/Leagues")}>Go back to list</Button>
                                </div>
                            </td>
                        </tr>
                        <tr><td colSpan={2}>
                            {errors.leagueName && <p className="errorMessage">{errors.leagueName.message}</p>}
                            {errors.teamSize && <p className="errorMessage">{errors.teamSize.message}</p>}
                            {errors.winPoints && <p className="errorMessage">{errors.winPoints.message}</p>}
                            {errors.tiePoints && <p className="errorMessage">{errors.tiePoints.message}</p>}
                            {errors.byePoints && <p className="errorMessage">{errors.byePoints.message}</p>}
                            {errors.startWeek && <p className="errorMessage">{errors.startWeek.message}</p>}
                            {errors.divisions && <p className="errorMessage">{errors.divisions.message}</p>}
                            {mutation.isError && (
                                <p className="errorMessage">
                                    {mutation.error instanceof Error
                                        ? mutation.error.message
                                        : "An error occurred while updating the league record."}
                                </p>
                            )}
                        </td></tr>
                    </table>
                </form>
            </Layout>
        );
    }
}

export default LeagueUpdate;