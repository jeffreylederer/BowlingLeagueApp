import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { FormData, FormDataSchema } from "./FormData.tsx";
import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox, TextInput } from "flowbite-react";
import Layout from '@layouts/Layout.tsx';
import SubmitButton from '@components/SubmitButton.tsx'
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const MembershipCreate = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(FormDataSchema),
    });

    const [errorMsg, setErrorMsg] = useState<string>('');
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Mutation for creating a membership
    const mutation = useMutation({
        mutationFn: async (data: FormData) => {
            const response = await fetch(`/api/Memberships`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to create membership');
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['membershiplist'] });
            navigate("/Membership");
        },
        onError: (error) => {
            setErrorMsg(error.message || String(error));
        },
    });

    const onSubmit: SubmitHandler<FormData> = (data) => mutation.mutate(data);

    return (
        <Layout>
            <form onSubmit={handleSubmit(onSubmit)} >
                <TextInput {...register("nickName")} type="hidden" />
                <TextInput {...register("fullName")} type="hidden" />
                <table>
                    <tr>
                        <td className="Label">First Name:</td>
                        <td className="Field"><TextInput {...register('firstName')} /></td>
                    </tr>
                    <tr>
                        <td className="Label">Last Name:</td>
                        <td className="Field"><TextInput  {...register('lastName')} /></td>
                    </tr>
                    <tr>
                        <td className="Label">Short Name:</td>
                        <td className="Field"><TextInput {...register('shortname')} /></td>
                    </tr>
                    <tr>
                        <td className="Label">Wheel Chair:</td>
                        <td className="Field">
                            <Checkbox {...register('wheelchair')} />
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            <SubmitButton disabled={mutation.isPending} />
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={1}>
                            {errors.firstName && <p className="errorMessage">{errors.firstName.message}</p>}
                            {errors.lastName && <p className="errorMessage">{errors.lastName.message}</p>}
                            {errors.shortname && <p className="errorMessage">{errors.shortname.message}</p>}
                            {mutation.isError && (
                                <p className="errorMessage">
                                    {mutation.error instanceof Error
                                        ? mutation.error.message
                                        : "An error occurred while creating the membership."}
                                </p>
                            )}
                            <p className="errorMessage">{errorMsg}</p>
                        </td>
                    </tr>
                </table>
            </form>
        </Layout>
    );
};

export default MembershipCreate;