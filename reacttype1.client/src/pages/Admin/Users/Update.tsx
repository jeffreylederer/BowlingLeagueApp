import { useLocation, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { UpdateFormData, UpdateFormDataSchema } from "./UpdateFormData.tsx";
import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox, TextInput, Select, Spinner } from "flowbite-react";
import Layout from "@layouts/Layout.tsx";
import SubmitButton from '@components/Buttons.tsx';
import { PasswordType } from './ChangePasswordType.tsx';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const UsersUpdate = () => {
    const [errorMsg, setErrorMsg] = useState<string>('');
    const location = useLocation();
    const id: number = location.state;
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UpdateFormData>({
        resolver: zodResolver(UpdateFormDataSchema),
    });

    // Fetch user data
    const { data, isLoading, isError, error } = useQuery<PasswordType>({
        queryKey: ['user', id],
        queryFn: async () => {
            const response = await fetch(`/api/Users/${id}`);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to fetch user');
            }
            return response.json();
        },
    });

    // Set form values when data loads
    

    // Mutation for updating user
    const mutation = useMutation({
        mutationFn: async (updateData: UpdateFormData) => {
            const response = await fetch(`/api/Users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData),
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to update user');
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userslist'] });
            navigate("/Admin/Users");
        },
        onError: (error) => {
            setErrorMsg(error.message || String(error));
        },
    });

    const onSubmit: SubmitHandler<UpdateFormData> = (newData) => mutation.mutate(newData);

    if (isError)
        return (
            <Layout>
                <h3>Update membership record</h3>
                <p className="errorMessage">
                    {error instanceof Error ? error.message : "An error occurred while loading user details."}
                </p>
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
                <h3>Update user record</h3>
                <form onSubmit={handleSubmit(onSubmit)} >
                    <table>
                        <input type="hidden" {...register("id", { valueAsNumber: true })} defaultValue={data.id.toString()} />
                        <tr>
                            <td className="Label">User Name:</td>
                            <td className="Field">{data?.userName}</td>
                        </tr>
                        <tr>
                            <td className="Label">Active:</td>
                            <td className="Field">
                                <Checkbox {...register('isActive')} defaultChecked={data.isActive} />
                            </td>
                        </tr>
                        <tr>
                            <td className="Label">Display Name:</td>
                            <td className="Field">
                                <TextInput {...register('displayName')} style={{ width: '85%' }} defaultValue={data.displayName} />
                            </td>
                        </tr>
                        <tr>
                            <td className="Label">Role:</td>
                            <td className="Field">
                                <Select style={{ width: '85%' }}  {...register('roleId')} defaultValue={data.roleId}>
                                    <option value="1">Observer</option>
                                    <option value="2">Scorer</option>
                                    <option value="3">Admin</option>
                                    <option value="4">SiteAdmin</option>
                                </Select>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2} style={{ textAlign: "center" }}>
                                <SubmitButton disabled={mutation.isPending} />
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={1}>
                                {errors.displayName && <p className="errorMessage">{errors.displayName.message}</p>}
                                {mutation.isError && (
                                    <p className="errorMessage">
                                        {mutation.error instanceof Error ? mutation.error.message : "An error occurred while updating the user."}
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

export default UsersUpdate;