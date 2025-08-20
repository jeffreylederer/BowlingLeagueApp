import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { TextInput, Button } from "flowbite-react";
import UserClass from "@components/UserClass";
import { SetCount } from '@components/CountMatches.tsx';
import { LoginType, LoginTypeSchema } from './LoginDataTypes.tsx';
import { useMutation } from '@tanstack/react-query';

function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginType>({
        resolver: zodResolver(LoginTypeSchema),
    });
    const navigate = useNavigate();
 
    // Mutation for login
    const mutation = useMutation({
        mutationFn: async (data: LoginType) => {
            const response = await fetch(`/api/Admin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status} - ${errorText} `);
            }

            return response.json();
        },
        onSuccess: (returnData) => {
            const user = new UserClass();
            user.Initialize(returnData);
            SetCount(0);
            navigate("/");
        },
        
    });

    const onSubmit: SubmitHandler<LoginType> = (data) => mutation.mutate(data);

    return (
        <>
            <h3>Please login to {import.meta.env.VITE_SERVER_ClubName} league application</h3>
            <form onSubmit={handleSubmit(onSubmit)} >
                <table>
                    <tbody>
                        <tr>
                            <td className="Label">User Name:</td>
                            <td className="Field"><TextInput {...register('username')} /></td>
                        </tr>
                        <tr>
                            <td className="Label">Password:</td>
                            <td className="Field"><TextInput type="password" {...register('password')} /></td>
                        </tr>
                        <tr>
                            <td colSpan={2} style={{ textAlign: "center" }}>
                                <Button type="submit" color="gray" disabled={mutation.isPending}>Submit</Button>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                {errors.username && <p className="errorMessage">{errors.username.message}</p>}
                                {errors.password && <p className="errorMessage">{errors.password.message}</p>}
                                {mutation.isError && (
                                    <p className="errorMessage">
                                        {mutation.error instanceof Error
                                            ? mutation.error.message
                                            : "An error occurred during login."}
                                    </p>
                                )}
                               
                            </td>
                        </tr>
                        <Link to="/RecoverPasswordRequest" >Forgot your password?</Link>
                    </tbody>
                </table>
            </form>
        </>
    );
}

export default Login;