import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect} from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { UpdateFormData } from "./UpdateFormData.tsx";
import { Checkbox, TextInput } from "flowbite-react";
import LeagueClass from '@components/LeagueClass.tsx';
import SubmitButton from '@components/SubmitButton.tsx'
import Layout from '@layouts/Layout.tsx';
import { GetCount } from '@components/CountMatches.tsx';
import { useMutation, useQueryClient } from '@tanstack/react-query';






const updateSchedule = async ({ id, data }: { id: number, data: UpdateFormData }) => {
    const response = await fetch(`/api/Schedules/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

const ScheduleUpdate = () => {
    const league = new LeagueClass();
    const location = useLocation();
    const id: number = location.state;
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [schedule, setSchedule] = useState<UpdateFormData>();
    function GetData() {

        const schedules: UpdateFormData[] = JSON.parse(localStorage.getItem("schedule") as string);
        const results = schedules.find(x => x.id == id);
        setSchedule(results)
    }


    useEffect(() => {
        GetData();
    }, []);
    

    // Setup mutation for updating the schedule
    const mutation = useMutation({
        mutationFn: (data: UpdateFormData) => updateSchedule({ id, data }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['schedules', league.id] });
            navigate("/League/Schedule");
        },
        
    });

    

    const zeroPad = (num: number): string => {
        const x: string = num.toString();
        if (x.length == 2)
            return x;
        return '0' + x;
    }

    function today(): string {
        if (schedule === undefined)
            return new Date().toLocaleDateString();

        const date = new Date(schedule.gameDate);
        return `${date.getFullYear()}-${zeroPad(date.getMonth() + 1)}-${zeroPad(date.getDate())}`;
    }
   
    // Setup form with default values from fetched schedule
    const {
        register,
        handleSubmit
    } = useForm<UpdateFormData>({
        defaultValues: schedule,
    });

   
    

    

    

    const onSubmit: SubmitHandler<UpdateFormData> = (data) => {
        mutation.mutate(data);
        
    };

    
    if (schedule) {
        return (
            <Layout>
                <h3>Update schedule for league {league.leagueName}</h3>
                <form onSubmit={handleSubmit(onSubmit)} >
                    <input type="hidden" {...register("id", { valueAsNumber: true })} defaultValue={schedule.id} />
                    <input type="hidden" {...register("leagueid", { valueAsNumber: true })} defaultValue={schedule.leagueid} />
                    <table>
                        <tr >
                            <td className="Label">Game Date:</td>
                            <td className="Field">
                                <TextInput type="date" {...register('gameDate', { valueAsDate: false })} defaultValue={today()} disabled={GetCount() > 0} />
                            </td>
                        </tr>
                        
                       
                        <tr>
                            <td className="Label">Playoffs:</td>
                            <td className="Field">
                                <Checkbox id='playOffs'  {...register('playOffs')} defaultChecked={schedule.playOffs} disabled={GetCount() > 0 }  />
                            </td>
                        </tr>
                        <tr>
                            <td className="Label">Cancelled:</td>
                            <td className="Field">
                                <Checkbox id='cancelled' {...register('cancelled')} defaultChecked={schedule.cancelled} />
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2} >
                                <SubmitButton disabled={mutation.isPending} />
                            </td>
                        </tr>
                    </table>
                    
                    {mutation.isError && (
                        <p className="errorMessage">
                            {mutation.error instanceof Error
                                ? mutation.error.message
                                : "An error occurred while updating the schedule record."}
                        </p>
                    )}
                </form>
            </Layout>
        );
    }
};

export default ScheduleUpdate;