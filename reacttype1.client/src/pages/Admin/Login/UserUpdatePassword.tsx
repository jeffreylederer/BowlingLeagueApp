import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { UpdatePasswordData, UpdatePasswordDataScheme } from "./LoginDataTypes.tsx";
import { zodResolver } from '@hookform/resolvers/zod';
import { TextInput, Button, Spinner } from "flowbite-react";
import useLogin from '@hooks/useLogin';;
import { useMutation } from '@tanstack/react-query';

const UserUpdatePassword = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UpdatePasswordData>({
        resolver: zodResolver(UpdatePasswordDataScheme),
    });

    const navigate = useNavigate();
   const {user} = useLogin();

    // Mutation for updating the password
    const mutation = useMutation({
        mutationFn: async (data: UpdatePasswordData) => {
            const response = await fetch(`/api/Admin/${user.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to update password');
            }
        },
        onSuccess: () => {
            navigate(-1);
        },
        
    });

    const onSubmit: SubmitHandler<UpdatePasswordData> = (data) => mutation.mutate(data);

    const contents =
        <form onSubmit={handleSubmit(onSubmit)} >
            <table>
                <input type="hidden" {...register("id", { valueAsNumber: true })} defaultValue={user.id} />
                <tr>
                    <td className="Label">User Name:</td>
                    <td className="Field"><TextInput defaultValue={user.userName} disabled /></td>
                </tr>
                <tr>
                    <td className="Label">Password:</td>
                    <td className="Field">
                        <TextInput type="password" {...register('password')} defaultValue="" />
                    </td>
                </tr>
                <tr>
                    <td className="Label">Confirm Password:</td>
                    <td className="Field">
                        <TextInput type="password" {...register('confirmPassword')} defaultValue="" />
                    </td>
                </tr>
                <tr>
                    <td colSpan={2} >
                        <div className="flex flex-wrap gap-5 items-center">
                            <br />
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
                    </td>
                </tr>
            </table>
        </form>;

    return (
        <>
            <h3>Update your password</h3>
            {contents}
        </>
    );
};

export default UserUpdatePassword;