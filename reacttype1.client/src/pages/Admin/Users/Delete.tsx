import { useLocation, useNavigate } from "react-router-dom";
import { useState } from 'react';
import { DetailsType } from "./DetailsType.tsx";
import Layout from "@layouts/Layout.tsx";
import { DeleteButton } from '@components/Buttons.tsx';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const fetchUser = async (id: number): Promise<DetailsType> => {
    const response = await fetch(`/api/user/${id}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

const UsersDelete = () => {
    const location = useLocation();
    const id: number = location.state;
    const queryClient = useQueryClient();

    const [errorMsg, setErrorMsg] = useState('');

    const navigate = useNavigate();

    // TanStack mutation for deleting a user
    const mutation = useMutation({
        mutationFn: async () => {
            const response = await fetch(`/api/Users/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to delete user');
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user', id] });
            queryClient.invalidateQueries({ queryKey: ['userslist'] });
            navigate("/Admin/Users");
        },
        onError: (error) => {
            setErrorMsg(error.message || String(error));
        },
    });

    function deleteItem() {
        mutation.mutate();
    }

    // useQuery for fetching league data
    const { data, isLoading, error } = useQuery<DetailsType>({
        queryKey: ['user', id],
        queryFn: () => fetchUser(id),
        enabled: !!id,
    });

    if (error)
        return (
            <Layout>
                <h3>Update User</h3>
                {(error as Error).message}
            </Layout>
        );

    

    if (isLoading)
        return (
            <Layout>
                <h3>Delete Member</h3>
                <p>Loading...</p>
            </Layout>
        );

    return (
        <Layout>
            <h3>Delete user</h3>
            <table>
                <tr>
                    <td className="Label">Users Name:</td>
                    <td className="Field">{data?.userName}</td>
                </tr>
                <tr>
                    <td className="Label">Active:</td>
                    <td className="Field">{data?.isActive ? "Yes" : "No"}</td>
                </tr>
                <tr>
                    <td className="Label">Display Name:</td>
                    <td className="Field">{data?.displayName}</td>
                </tr>
                <tr>
                    <td className="Label">Role:</td>
                    <td className="Field">{data?.role}</td>
                </tr>
                <tr>
                    <td colSpan={2} >
                        <DeleteButton DeleteItem={deleteItem} disabled={mutation.isPending} />
                    </td>
                </tr>
            </table>
            <p>{errorMsg}</p>
        </Layout>
    );
};

export default UsersDelete;