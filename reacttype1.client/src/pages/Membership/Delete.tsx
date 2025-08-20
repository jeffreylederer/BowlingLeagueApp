import { useLocation, useNavigate } from "react-router-dom";
import { ListData } from "./ListData.tsx";
import Layout from '@layouts/Layout.tsx';
import DeleteButton from '@components/DeleteButton.tsx'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Spinner } from "flowbite-react";

const MembershipDelete = () => {
    const location = useLocation();
    const id: number = location.state;
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Fetch membership data
    const { data, isLoading, isError, error } = useQuery<ListData>({
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

    // Mutation for deleting membership
    const mutation = useMutation({
        mutationFn: async () => {
            const response = await fetch(`/api/Memberships/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to delete membership');
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['membershiplist'] });
            navigate("/Membership");
        },
        
    });

    function deleteItem() {
        mutation.mutate();
    }

    if (isError)
        return (
            <Layout>
                <h3>Delete Member</h3>
                <p className="errorMessage">
                    {error instanceof Error ? error.message : "An error occurred while loading the member."}
                </p>
            </Layout>
        );

    if (isLoading)
        return (
            <Layout>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                    <Spinner size="xl" />
                </div>
            </Layout>
        );

    if (data) {
        return (
            <Layout>
                <h3>Delete Member</h3>
                <table>
                    <tr>
                        <td className="Label">First Name:</td>
                        <td className="Field">{data.firstName}</td>
                    </tr>
                    <tr>
                        <td style={{ width: "200px" }}>Last Name:</td>
                        <td className="Field">{data.lastName}</td>
                    </tr>
                    <tr>
                        <td style={{ width: "200px" }}>Short Name:</td>
                        <td className="Field">{data.shortname == null ? "" : data.shortname}</td>
                    </tr>
                    <tr>
                        <td style={{ width: "200px" }}>Wheel Chair:</td>
                        <td className="Field">{data.wheelchair ? "Yes" : "No"}</td>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            <DeleteButton DeleteItem={deleteItem} disabled={mutation.isPending} />
                        </td>
                    </tr>
                </table>
                {mutation.isError && (
                    <p className="errorMessage">
                        {mutation.error instanceof Error
                            ? mutation.error.message
                            : "An error occurred while deleting the member."}
                    </p>
                )}

            </Layout>
        );
    }

    return null;
};

export default MembershipDelete;