import { useNavigate, useLocation, Link } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { UpdatePasswordData, UpdatePasswordDataScheme } from "./LoginDataTypes.tsx";
import { zodResolver } from '@hookform/resolvers/zod';
import { TextInput, Button, Spinner } from "flowbite-react";
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';

const UpdateRecoverPassword = () => {
    const location = useLocation();
    const id: string = location.search.substring(4);
    const [errorMsg, setErrorMsg] = useState<string | null>('');
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<UpdatePasswordData>({
        resolver: zodResolver(UpdatePasswordDataScheme),
    });

    const { data, isLoading, isError, error } = useQuery<number>({
        queryKey: ['update-password-ticket', id],
        queryFn: async () => {
            const response = await fetch(`/api/Admin/UpdatePassword/${id}`);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to fetch password update ticket');
            }
            return response.json();
        },
    });

    const mutation = useMutation({
        mutationFn: async (formData: UpdatePasswordData) => {
            const response = await fetch(`/api/Admin/${formData.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to update password');
            }
        },
        onSuccess: () => {
            navigate("/Login");
        },
        onError: (error) => {
            setErrorMsg(error.message || String(error));
        },
    });

    const onSubmit: SubmitHandler<UpdatePasswordData> = (formData) => mutation.mutate(formData);

    if (isLoading)
        if (isLoading)
            return (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                    <Spinner size="xl" />
                </div>
            );

    if (isError)
        return <p aria-label="Error">Return Error: {error instanceof Error ? error.message : String(error)}</p>;

    if (data != undefined) {
        setValue("id", data.toString());

        return (
            <>
                <h3>Update your password for {import.meta.env.VITE_SERVER_ClubName} league application</h3>
                <p hidden={data > 0}>Your time has expired. <Link to="/RecoverPasswordRequest">Try again</Link></p>
                <form onSubmit={handleSubmit(onSubmit)} >
                    <input type="hidden" {...register("id", { valueAsNumber: true })} defaultValue={data} />
                    <table>
                        <tr>
                            <td className="Label">Password:</td>
                            <td className="Field">
                                <TextInput type="password" {...register('password')} />
                            </td>
                        </tr>
                        <tr>
                            <td className="Label">Confirm Password:</td>
                            <td className="Field">
                                <TextInput type="password" {...register('confirmPassword')} />
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <div className="flex flex-wrap gap-5 items-center">
                                    <Button color="gray" type="submit" disabled={mutation.isPending}>Submit</Button>
                                    {mutation.isPending && <Spinner size="sm" />}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                {errors.password && <p className="errorMessage">{errors.password.message}</p>}
                                {errors.confirmPassword && <p className="errorMessage">{errors.confirmPassword.message}</p>}
                                {mutation.isError && (
                                    <p className="errorMessage">
                                        {mutation.error instanceof Error
                                            ? mutation.error.message
                                            : "An error occurred while updating the password."}
                                    </p>
                                )}
                                <p>{errorMsg}</p>
                            </td>
                        </tr>
                    </table>
                </form>
            </>
        );
    }

    return null;
};

export default UpdateRecoverPassword;