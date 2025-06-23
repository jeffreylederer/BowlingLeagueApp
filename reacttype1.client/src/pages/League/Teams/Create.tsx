import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { FormData, FormDataSchema } from "./FormData.tsx";
import { Membership } from "./Membership.tsx";
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import LeagueClass from '@components/LeagueClass.tsx';
import SubmitButton from '@components/Buttons.tsx';
import Layout from '@layouts/Layout.tsx';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Spinner } from "flowbite-react";
import fetchData from "@components/fetchData.tsx";

const TeamsCreate = () => {
    const createTeam = async (data: FormData) => {
        switch (league.teamSize) {
            case 1:
                break;
            case 2:
                if (data.skip != 0 && data.lead != 0 && data.skip == data.lead) {
                    setErrorMsg("Skip and Lead have to be  different members");
                    return;
                }
                break;
            case 3:
                if (data.skip != 0 && data.lead != 0 && data.skip == data.lead) {
                    setErrorMsg("Skip and Lead have to be  different members");
                    return;
                }
                if (data.skip != 0 && data.viceSkip != 0 && data.skip == data.viceSkip) {
                    setErrorMsg("Skip and Vice Skip have to be  different members");
                    return;
                }
                if (data.viceSkip != 0 && data.lead != 0 && data.viceSkip == data.lead) {
                    setErrorMsg("Vice Skip and Lead have to be  different members");
                    return;
                }
                break;
        };

        const response = await fetch(`/api/Teams`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    };
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createTeam,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['createTeams'] });
            queryClient.invalidateQueries({ queryKey: ['teammembership', league.id] });
            queryClient.invalidateQueries({ queryKey: ['teamlist', league.id] });
            navigate("/League/Teams");
        },
        onError: (error: unknown) => {
            setErrorMsg(error instanceof Error ? error.message : String(error));
        }
    });

    
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(FormDataSchema),
    });
    const league = new LeagueClass();
    const onSubmit: SubmitHandler<FormData> = (data) => {
        mutation.mutate(data);
    };

    const [errorMsg, setErrorMsg] = useState("");

    const navigate = useNavigate();
    const { data, isLoading, error, isPending } = useQuery<Membership[]>({
        queryKey: ['teammembership'],
        queryFn: () => fetchData<Membership[]>(`/api/Teams/NotOnTeam/${league.id}`),
    });

    if (isLoading)
        return (
            <Layout>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                    <Spinner size="xl" />
                </div>
            </Layout>
        );

    if (error)
        return <p aria-label="Error">Return Error: {(error as Error).message}</p>;

    return (
        <Layout>
            <h3>Create new Team in league {league.leagueName} </h3>
            <form onSubmit={handleSubmit(onSubmit)} >
                <table>
                    <input type="hidden" {...register("leagueid")} defaultValue={league.id.toString()} />
                    <input type="hidden" {...register("teamNo")} defaultValue={"1"} />
                    <input type="hidden" {...register("id")} defaultValue={"0"} />
                    <tr>
                        <td className="Label">Skip:</td>
                        <td>
                            <select style={{ width: '85%' }} defaultValue="0" {...register("skip")}>
                                <option value="0" key="0">Select member</option>
                                {data?.map((item) => (
                                    <option value={item.id.toString()} key={item.id }>{item.fullName}</option>
                                ))}
                                )
                            </select></td>
                    </tr>

                    <tr hidden={league.teamSize < 3}>
                        <td className="Label">Vice Skip:</td>
                        <td>
                            <select style={{ width: '85%' }} defaultValue="0" {...register("viceSkip")}>
                                <option value="0" key="0">Select member</option>
                                {data?.map((item) => (
                                    <option value={item.id.toString()} key={item.id}>{item.fullName}</option>
                                ))}
                                )
                            </select></td>
                    </tr> 

                    <tr hidden={league.teamSize < 2}>
                        <td className="Label">Lead:</td>
                        <td>
                            <select style={{ width: '85%' }} defaultValue="0" {...register("lead")}>
                                <option value="0" key="0">Select Member</option>
                                {data?.map((item) => (
                                    <option value={item.id.toString()} key={item.id}>{item.fullName}</option>
                                ))}
                                )
                            </select></td>
                    </tr>
                    <tr >
                        <td className="Label">Division:</td>
                        <td>
                            <select style={{ width: '85%' }} defaultValue="0" {...register("divisionId")}>
                                <option value="0" key="0">Select Division</option>
                                <option value="1" key="1">1</option>
                                <option value="2" hidden={league.divisions < 2} key="2">2</option>
                                <option value="3" hidden={league.divisions < 3} key="3">3</option>
                            </select></td>
                    </tr>
                    <tr>
                        <td colSpan={2} >
                            <SubmitButton disabled={isPending} />
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={1}>
                        {errors.skip && <p className="errorMessage">skip: {errors.skip.message}</p>}
                        {errors.viceSkip && <p className="errorMessage">viceskip: {errors.viceSkip.message}</p>}
                        {errors.lead && <p className="errorMessage">lead: {errors.lead.message}</p>}
                        {errors.divisionId && <p className="errorMessage">division: {errors.divisionId.message}</p>}
                        {errors.teamNo && <p className="errorMessage">teamNo: {errors.teamNo.message}</p>}
                        {errors.leagueid && <p className="errorMessage">leagueid:  {errors.leagueid.message}</p>}   
                        </td>
                    </tr>
                </table>
                {
                    league.teamSize < 3 && <input type="hidden" defaultValue="0" {...register("viceSkip")} />
                }
                {
                    league.teamSize < 2 && <input type="hidden" defaultValue="0" {...register("lead")} />
                }
            </form>
            <p className="errorMessage">{errorMsg}</p>
        </Layout>
    );
}

export default TeamsCreate;