import { useLocation, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { ChangePasswordType, ChangePasswordTypeSchema, PasswordType } from "./ChangePasswordType.tsx";
import { zodResolver } from '@hookform/resolvers/zod';
import { TextInput } from "flowbite-react";
import Layout from "@layouts/Layout.tsx";
import SubmitButton from '@components/Buttons.tsx';
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';

const ChangePassword = () => {
    const location = useLocation();
    const id: number = location.state;

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<ChangePasswordType>({
        resolver: zodResolver(ChangePasswordTypeSchema),
    });

    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState<string>('');

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

    // Mutation for changing password
    const mutation = useMutation({
        mutationFn: async (formData: ChangePasswordType) => {
            const response = await fetch(`/api/Users/ChangePassword${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to change password');
            }
        },
        onSuccess: () => {
            navigate("/Admin/Users");
        },
        onError: (error) => {
            setErrorMsg(error.message || String(error));
        },
    });

    const onSubmit: SubmitHandler<ChangePasswordType> = (formData) => mutation.mutate(formData);

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
                <p>Loading...</p>
            </Layout>
        );

    if (data) {
        setValue("id", data.id);

        return (
            <Layout>
                <h3>Change user's password</h3>
                <form onSubmit={handleSubmit(onSubmit)} >
                    <table>
                        <input type="hidden" {...register("id", { valueAsNumber: true })} defaultValue={data.id.toString()} />
                        <tr>
                            <td className="Label">User Name:</td>
                            <td className="Field">{data.userName}</td>
                        </tr>
                        <tr>
                            <td className="Label">Password:</td>
                            <td className="Field">
                                <TextInput type="password" {...register('password')} style={{ width: '85%' }} />
                            </td>
                        </tr>
                        <tr>
                            <td className="Label">Confirm Password:</td>
                            <td className="Field">
                                <TextInput type="password" {...register('confirmPassword')} style={{ width: '85%' }} />
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2} style={{ textAlign: "center" }}>
                                <SubmitButton disabled={mutation.isPending} />
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                {errors.password && <p className="errorMessage">{errors.password.message}</p>}
                                {errors.confirmPassword && <p className="errorMessage">{errors.confirmPassword.message}</p>}
                                {errors.id && <p className="errorMessage">{errors.id.message}</p>}
                                {mutation.isError && (
                                    <p className="errorMessage">
                                        {mutation.error instanceof Error ? mutation.error.message : "An error occurred while changing the password."}
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

export default ChangePassword;