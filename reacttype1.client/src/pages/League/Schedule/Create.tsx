import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { FormData, FormDataSchema } from "./FormData.tsx";
import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox, TextInput } from "flowbite-react";
import LeagueClass from '@components/LeagueClass.tsx';;
import SubmitButton from '@components/SubmitButton.tsx'
import Layout from '@layouts/Layout.tsx';
import { UpdateFormData } from "./UpdateFormData.tsx";
import { useMutation, useQueryClient } from '@tanstack/react-query';

const createSchedule = async (data: FormData) => {
    const response = await fetch('/api/Schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

const ScheduleCreate = () => {
   const {
        register,
        handleSubmit,      
    } = useForm<FormData>({
        resolver: zodResolver(FormDataSchema),
    });
    const navigate = useNavigate();
    const league = new LeagueClass();
    const queryClient = useQueryClient();

    const zeroPad = (num: number): string => {
        const x: string = num.toString();
        if (x.length == 2)
            return x;
        return '0' + x;
    }

    function today(): string {
        const data: UpdateFormData[] = JSON.parse(localStorage.getItem("schedule") as string);
        if (data && data.length > 0) {
            const date = new Date(data[data.length - 1].gameDate);
            date.setDate(date.getDate() + 7);
            return `${date.getFullYear()}-${zeroPad(date.getMonth() + 1)}-${zeroPad(date.getDate())}`;
        }
        return new Date().toLocaleDateString();
    }  

    
    const defaultDate: string = today();

    const mutation = useMutation({
        mutationFn: createSchedule,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['schedules', league.id] });
            navigate("/League/Schedule");
        },
       
    });

    const onSubmit: SubmitHandler<FormData> = (data) => {
        mutation.mutate(data);
    };

    return (
        <Layout>
            <h3>Create new game date for league {league.leagueName}</h3>
            <form onSubmit={handleSubmit(onSubmit)} >
                <table>
                    <input type="hidden" defaultValue={league.id} {...register('leagueid')} />
                    <tr>
                        <td className="Label">Game Date:</td>
                        <td className="Field">
                            <TextInput type="date" {...register('gameDate')} defaultValue={defaultDate} />
                        </td>
                    </tr>
                    <tr>
                        <td className="Label">Playoffs:</td>
                        <td className="Field">
                            <Checkbox {...register('playOffs')} />
                        </td>
                    </tr>
                    <tr>
                        <td className="Label">Cancelled:</td>
                        <td className="Field">
                            <Checkbox {...register('cancelled')}  />
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            <SubmitButton disabled={mutation.isPending} />
                        </td>
                    </tr>
                    <td colSpan={2}>
                       
                        {mutation.isError && (
                            <p className="errorMessage">
                                {mutation.error instanceof Error
                                    ? mutation.error.message
                                    : "An error occurred while creaating schedule record."}
                            </p>
                        )}
                    </td>
                </table>
            </form>
        </Layout>
    );
}

export default ScheduleCreate;