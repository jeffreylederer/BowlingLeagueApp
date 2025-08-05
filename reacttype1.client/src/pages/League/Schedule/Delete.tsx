import { useLocation, useNavigate } from "react-router-dom";
import { useState } from 'react';
import { UpdateFormData } from "./UpdateFormData.tsx";
import LeagueClass from '@components/LeagueClass.tsx';;
import DeleteButton from '@components/DeleteButton.tsx'
import Layout from '@layouts/Layout.tsx';
import convertDate from '@components/convertDate.tsx';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Spinner } from "flowbite-react";

const fetchSchedule = async (id: number): Promise<UpdateFormData | undefined> => {
    const schedulesStr = localStorage.getItem("schedule");
    if (schedulesStr) {
        const schedules: UpdateFormData[] = JSON.parse(schedulesStr);
        return schedules.find(x => x.id == id);
    }
    const response = await fetch(`/api/Schedules/${id}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

const deleteSchedule = async (id: number) => {
    const response = await fetch(`/api/Schedules/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

const ScheduleDelete = () => {
    const league = new LeagueClass();
    const location = useLocation();
    const id: number = location.state;
    const [errorMsg, SeterrorMsg] = useState("");
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: schedule, isLoading, error } = useQuery<UpdateFormData | undefined>({
        queryKey: ['schedule', id],
        queryFn: () => fetchSchedule(id),
        enabled: !!id,
    });

    const mutation = useMutation({
        mutationFn: () => deleteSchedule(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['schedules', league.id] });
            navigate("/League/Schedule");
        },
        onError: (error: unknown) => {
            SeterrorMsg(error instanceof Error ? error.message : String(error));
        }
    });

    function deleteItem() {
        mutation.mutate();
    }

    if (error)
        return (
            <Layout>
                <h3>Delete game date in league {league.leagueName}</h3>
                <p className="errorMessage">{(error as Error).message}</p>
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

    if (schedule) {
        return (
            <Layout>
                <h3>Delete game date in league {league.leagueName}</h3>
                <table>
                    <tr>
                        <td className="Label">Game Date:</td>
                        <td className="Field">{convertDate(schedule.gameDate)}</td>
                    </tr>
                    <tr>
                        <td className="Label">playOffs:</td>
                        <td className="Field">{schedule.playOffs ? "Yes" : "No"}</td>
                    </tr>
                    <tr>
                        <td className="Label">Cancelled:</td>
                        <td className="Field">{schedule.cancelled ? "Yes" : "No"}</td>
                    </tr>
                    <tr>
                        <td colSpan={2} style={{ textAlign: "center" }}>
                            <DeleteButton DeleteItem={deleteItem} disabled={mutation.isPending} />
                        </td>
                    </tr>
                </table>
                <p className="errorMessage">{errorMsg}</p>
                {mutation.isError && <p className="errorMessage">{(mutation.error as Error).message}</p>}
            </Layout>
        );
    }

    return null;
}

export default ScheduleDelete;