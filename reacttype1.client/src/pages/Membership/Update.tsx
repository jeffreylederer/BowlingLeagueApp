import { useLocation, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { UpdateFormData, UpdateFormDataSchema } from "./UpdateFormData.tsx";
import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox, TextInput } from "flowbite-react";
import SubmitButton from '@components/Buttons.tsx';
import Layout from '@layouts/Layout.tsx';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const MembershipUpdate = () => {
    const [errorMsg, setErrorMsg] = useState<string>('');
    const navigate = useNavigate();
    const location = useLocation();
    const id: number = location.state;
    const queryClient = useQueryClient()

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<UpdateFormData>({
        resolver: zodResolver(UpdateFormDataSchema),
    });

    // Fetch membership data
    const { data, isLoading, isError, error } = useQuery<UpdateFormData>({
        queryKey: ['membership', id],
        queryFn: async () => {
            const response = await fetch(`/api/Memberships/${id}`);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to fetch membership');
            }
            return response.json();
        },
    });

    // Mutation for updating membership
    const mutation = useMutation({
        mutationFn: async (formData: UpdateFormData) => {
            const response = await fetch(`/api/Memberships/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to update membership');
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['membershiplist'] });
            queryClient.invalidateQueries({ queryKey: ['membership', id] });
            navigate("/Membership");
        },
        onError: (error) => {
            setErrorMsg(error.message || String(error));
        },
    });

    const onSubmit: SubmitHandler<UpdateFormData> = (formData) => mutation.mutate(formData);

    if (isError)
        return (
            <Layout>
                <h3>Update membership record</h3>
                <p className="errorMessage">
                    {error instanceof Error ? error.message : "An error occurred while loading the member."}
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
        // Set default values for the form fields
        setValue("id", data.id);
        setValue("nickName", data.nickName ?? "");
        setValue("fullName", data.fullName ?? "");
        setValue("firstName", data.firstName ?? "");
        setValue("lastName", data.lastName ?? "");
        setValue("shortname", data.shortname ?? "");
        setValue("wheelchair", data.wheelchair ?? false);

        return (
            <Layout>
                <h3>Update membership record</h3>
                <form onSubmit={handleSubmit(onSubmit)} >
                    <input type="hidden" {...register("id", { valueAsNumber: true })} />
                    <TextInput {...register("nickName")} type="hidden" />
                    <TextInput {...register("fullName")} type="hidden" />
                    <table>
                        <tr>
                            <td className="Label">First Name:</td>
                            <td className="Field">
                                <TextInput type="text" {...register('firstName')} style={{ width: '85%' }} />
                            </td>
                        </tr>
                        <tr>
                            <td className="Label">Last Name:</td>
                            <td className="Field">
                                <TextInput {...register('lastName')} style={{ width: '85%' }} />
                            </td>
                        </tr>
                        <tr>
                            <td className="Label">Short Name:</td>
                            <td className="Field">
                                <TextInput {...register('shortname')} style={{ width: '85%' }} />
                            </td>
                        </tr>
                        <tr>
                            <td className="Label">Wheel Chair:</td>
                            <td className="Field">
                                <Checkbox {...register('wheelchair')} />
                            </td>
                        </tr>
                        <tr className="center-td">
                            <td colSpan={2}>
                                <SubmitButton disabled={mutation.isPending} />
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={1}>
                                {errors.firstName && <p className="errorMessage">{errors.firstName.message}</p>}
                                {errors.lastName && <p className="errorMessage">{errors.lastName.message}</p>}
                                {errors.shortname && <p className="errorMessage">{errors.shortname.message}</p>}
                                {errors.id && <p className="errorMessage">{errors.id.message}</p>}
                                {mutation.isError && (
                                    <p className="errorMessage">
                                        {mutation.error instanceof Error
                                            ? mutation.error.message
                                            : "An error occurred while updating the membership."}
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

export default MembershipUpdate;