import { RecoverPasswordRequestData, RecoverPasswordRequestDataSchema } from "./LoginDataTypes.tsx";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from 'react';
import { TextInput, Button } from "flowbite-react";
import { useMutation } from '@tanstack/react-query';

function RecoverPasswordRequest() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RecoverPasswordRequestData>({
        resolver: zodResolver(RecoverPasswordRequestDataSchema),
    });

    const addr: string = window.location.href.replace("RecoverPasswordRequest", "");
    const [errorMsg, setErrorMsg] = useState('');

    // Mutation for password recovery request
    const mutation = useMutation({
        mutationFn: async (data: RecoverPasswordRequestData) => {
            const response = await fetch('/api/Admin/RecoverPasswordRequest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return response.text();
        },
        onSuccess: (result: string) => {
            setErrorMsg(result);
        },
        onError: (error: any) => {
            setErrorMsg(error.message || `Error occurred`);
        },
    });

    const onSubmit: SubmitHandler<RecoverPasswordRequestData> = (data) => mutation.mutate(data);

    return (
        <>
            <h3>Password Recover for {import.meta.env.VITE_SERVER_ClubName} league application</h3>
            <p>Please fill in your email address (which is also your login user name). Once you select the submit button, an email
                will be set to you. This email will have a hyperlink with a unique ticket number. Once the email is sent, you have 20
                minutes to response or the ticket will expire.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} >
                <input type="hidden" {...register("url")} defaultValue={addr} />
                <table>
                    <tbody>
                        <tr>
                            <td className="Label">User Name:</td>
                            <td className="Field"><TextInput {...register('userName')} /></td>
                        </tr>
                        <tr>
                            <td colSpan={2} style={{ textAlign: "center" }}>
                                <Button type="submit" color="gray" disabled={mutation.isPending}>Submit</Button>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                {errors.userName && <p className="errorMessage">{errors.userName.message}</p>}
                                {mutation.isError && (
                                    <p className="errorMessage">
                                        {mutation.error instanceof Error
                                            ? mutation.error.message
                                            : "An error occurred during password recovery request."}
                                    </p>
                                )}
                                <p className='errorMessage'>{errorMsg}</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </>
    );
}

export default RecoverPasswordRequest;