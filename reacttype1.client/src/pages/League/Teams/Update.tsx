import { useLocation, useNavigate } from "react-router-dom";
import { useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { UpdateFormData, UpdateFormDataSchema } from "./UpdateFormData.tsx";
import { zodResolver } from '@hookform/resolvers/zod';
import useLeague from '@hooks/useLeague';
import { Membership } from "./Membership.tsx";
import Layout from '@layouts/Layout.tsx';
import SubmitButton from '@components/SubmitButton.tsx'
import { TeamType } from './TeamType.ts';
import GetCount from '@components/CountMatches';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Spinner } from "flowbite-react";
import fetchData from '@components/fetchData.tsx';

const updateTeam = async ({ id, data }: { id: string, data: UpdateFormData }) => {
    const response = await fetch(`/api/Teams/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

const TeamUpdate = () => {
    const { league } = useLeague();
    const [errorMsg, setErrorMsg] = useState("");
    const location = useLocation();
    const id: string = location.state;
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery<TeamType>({
        queryKey: ['team', id],
        queryFn: () => fetchData<TeamType>(`/api/Teams/getOne/${id}`),
        enabled: !!id,
    });

    const { data: membership, isLoading: membershipIsLoading, error: membershipError } = useQuery<Membership[]>({
        queryKey: ['teammembership', league.id],
        queryFn: () => fetchData<Membership[]>(`/api/Teams/NotOnTeam/${league.id}`),
        enabled: !!id
    });

    const mutation = useMutation({
        mutationFn: (formData: UpdateFormData) => updateTeam({ id, data: formData }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['team', id] });
            queryClient.invalidateQueries({ queryKey: ['teammembership', league.id] });
            queryClient.invalidateQueries({ queryKey: ['teamlist', league.id] });
            navigate("/League/Teams");
        },
 
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UpdateFormData>({
        resolver: zodResolver(UpdateFormDataSchema)
    });

   

    const onSubmit: SubmitHandler<UpdateFormData> = (formData) => {
        switch (league.teamSize) {
            case 1:
                break;
            case 2:
                if (formData.skip != 0 && formData.lead != 0 && formData.skip == formData.lead) {
                    setErrorMsg("Skip and Lead have to be different members");
                    return;
                }
                break;
            case 3:
                if (formData.skip != 0 && formData.lead != 0 && formData.skip == formData.lead) {
                    setErrorMsg("Skip and Lead have to be different members");
                    return;
                }
                if (formData.skip != 0 && formData.viceSkip != 0 && formData.skip == formData.viceSkip) {
                    setErrorMsg("Skip and Vice Skip have to be different members");
                    return;
                }
                if (formData.viceSkip != 0 && formData.lead != 0 && formData.viceSkip == formData.lead) {
                    setErrorMsg("Vice Skip and Lead have to be different members");
                    return;
                }
                break;
        }
        mutation.mutate(formData);
    };

    if (error)
        return <p>{(error as Error).message}</p>;

    if (membershipError)
        return <p>{(membershipError as Error).message}</p>;

    if (isLoading || membershipIsLoading)
        return (
            <Layout>
                <h3>Update Team</h3>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                    <Spinner size="xl" />
                </div>
            </Layout>
        );

    if (data != undefined && membership != undefined) {
        return (
            <Layout>
                <h3>Update Team {data.teamNo} for league {league.leagueName}</h3>
                <form onSubmit={handleSubmit(onSubmit, (errors) => console.log(errors))} >
                    <input type="hidden" {...register("id", { valueAsNumber: true })} defaultValue={data.id} />
                    <input type="hidden" {...register("leagueid", { valueAsNumber: true })} defaultValue={data.leagueid} />
                    <input type="hidden" {...register("teamNo", { valueAsNumber: true })} defaultValue={data.teamNo} />
                    <table>
                        <tr>
                            <td className="Label">Skip:</td>
                            <td>
                                <select defaultValue={data.skipid} {...register("skip")}>
                                    <option value="0" key="0">Select member</option>
                                    <option value={data.skipid} key={data.skipid}>{data.skip}</option>
                                    <option value={data.viceSkipid} key={data.viceSkipid == null ? "viceSkip" : data.viceSkipid} hidden={league.divisions > 1}>{data.viceSkip}</option>
                                    <option value={data.leadid} key={data.leadid == null ? "lead" : data.leadid} hidden={league.divisions > 2}>{data.lead}</option>
                                    {membership.map((item) => (
                                        <option value={item.id} key={item.id}>{item.fullName}</option>
                                    ))}
                                    )
                                </select></td>
                        </tr>

                        <tr hidden={league.teamSize < 3}>
                            <td className="Label">Vice Skip:</td>
                            <td>
                                <select defaultValue={data.viceSkipid} {...register("viceSkip")}>
                                    <option value="0" key="0">Select member</option>
                                    <option value={data.skipid} key={data.skipid}>{data.skip}</option>
                                    <option value={data.viceSkipid} key={data.viceSkipid == null ? "viceSkip" : data.viceSkipid} hidden={league.divisions > 1}>{data.viceSkip}</option>
                                    <option value={data.leadid} key={data.leadid == null ? "lead" : data.leadid} hidden={league.divisions > 2}>{data.lead}</option>
                                    {membership.map((item) => (
                                        <option value={item.id} key={item.id}>{item.fullName}</option>
                                    ))}
                                    )
                                </select></td>
                        </tr>

                        <tr hidden={league.teamSize < 2}>
                            <td className="Label">Lead:</td>
                            <td>
                                <select  {...register("lead")} defaultValue={data.leadid}>
                                    <option value="0" key="0">Select member</option>
                                    <option value={data.skipid} key={data.skipid}>{data.skip}</option>
                                    <option value={data.viceSkipid} key={data.viceSkipid == null ? "viceSkip" : data.viceSkipid} hidden={league.divisions > 1}>{data.viceSkip}</option>
                                    <option value={data.leadid} key={data.leadid == null ? "lead" : data.leadid} hidden={league.divisions > 2}>{data.lead}</option>
                                    {membership.map((item) => (
                                        <option value={item.id} key={item.id}>{item.fullName}</option>
                                    ))}
                                    )
                                </select></td>
                        </tr>
                        <tr hidden={GetCount()} >
                            <td className="Label">Division:</td>
                            <td>
                                <select defaultValue={data.division} {...register("divisionId")}>
                                    <option value="0" key="0">Select Devision</option>
                                    <option value="1" key="1">1</option>
                                    <option value="2" key="2" hidden={league.divisions < 2}>2</option>
                                    <option value="3" key="3" hidden={league.divisions < 3}>3</option>
                                </select>
                            </td>
                        </tr>
                        <tr hidden={GetCount()} >
                            <input type="hidden" value={data.division} {...register("divisionId")} />
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <SubmitButton disabled={mutation.isPending} />
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                {errors.skip && <p className="errorMessage">skip: {errors.skip.message}</p>}
                                {errors.viceSkip && <p className="errorMessage">viceskip: {errors.viceSkip.message}</p>}
                                {errors.lead && <p className="errorMessage">lead: {errors.lead.message}</p>}
                                {errors.divisionId && <p className="errorMessage">{errors.divisionId.message}</p>}
                                {errors.id && <p className="errorMessage">id: {errors.id.message}</p>}
                                {errors.teamNo && <p className="errorMessage">teamNo: {errors.teamNo.message}</p>}
                                {errors.leagueid && <p className="errorMessage">leagueid:  {errors.leagueid.message}</p>}
                                {errorMsg != '' && <p className="errorMessage">{errorMsg}</p>}
                                {mutation.isError && (
                                    <p className="errorMessage">
                                        {mutation.error instanceof Error
                                            ? mutation.error.message
                                            : "An error occurred while updating the team record."}
                                    </p>
                                )}
                            </td>
                        </tr>
                    </table>
                    {league.teamSize < 3 && <input type="hidden" defaultValue="0" {...register("viceSkip")} />}
                    {league.teamSize < 2 && <input type="hidden" defaultValue="0" {...register("lead")} />}
                </form>
               
            </Layout>
        );
    }
};

export default TeamUpdate;