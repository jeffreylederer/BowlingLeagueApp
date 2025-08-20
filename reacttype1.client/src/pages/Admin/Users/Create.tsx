import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { FormData, FormDataSchema } from "./FormData.tsx";
import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox, TextInput, Select } from "flowbite-react";
import Layout from "@layouts/Layout.tsx";
import SubmitButton from '@components/SubmitButton.tsx'
import { useMutation, useQueryClient } from '@tanstack/react-query';

const UserCreate = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(FormDataSchema),
    });
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // Mutation for creating a user
    const mutation = useMutation({
        mutationFn: async (data: FormData) => {
            const response = await fetch('/api/Users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to create user');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userslist'] });
            navigate("/Admin/Users");
        },
        
    });

    const onSubmit: SubmitHandler<FormData> = (data) => mutation.mutate(data);

    return (
        <Layout>
            <h3>Add new user</h3>
            <form onSubmit={handleSubmit(onSubmit)} >
                <table>
                    <tr>
                        <td className="Label">User Name:</td>
                        <td className="Field"><TextInput {...register('userName')} /></td>
                    </tr>
                    <tr>
                        <td className="Label">Password:</td>
                        <td className="Field"><TextInput type="password" {...register('password')} /></td>
                    </tr>
                    <tr>
                        <td className="Label">Active:</td>
                        <td className="Field">
                            <Checkbox {...register('isActive')} />
                        </td>
                    </tr>
                    <tr>
                        <td className="Label">Display Name:</td>
                        <td className="Field"><TextInput {...register('displayName')} /></td>
                    </tr>
                    <tr>
                        <td className="Label">Role:</td>
                        <td className="Field">
                            <Select {...register('roleId')} defaultValue="1" name='roleId'>
                                <option value="1">Observer</option>
                                <option value="2">Scorer</option>
                                <option value="3">Admin</option>
                                <option value="4">SiteAdmin</option>
                            </Select>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            <SubmitButton disabled={mutation.isPending } />
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            {errors.userName && <p className="errorMessage">{errors.userName.message}</p>}
                            {errors.displayName && <p className="errorMessage">{errors.displayName.message}</p>}
                            {errors.password && <p className="errorMessage">{errors.password.message}</p>}
                            {errors.roleId && <p className="errorMessage">{errors.roleId.message}</p>}
                            {mutation.isError && (
                                <p className="errorMessage">
                                    {mutation.error instanceof Error
                                        ? mutation.error.message
                                        : "An error occurred while creating user record."}
                                </p>
                            )}
                        </td>
                    </tr>
                </table>
            </form>
        </Layout>
    );
}

export default UserCreate;