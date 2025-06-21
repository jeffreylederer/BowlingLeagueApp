import { Link } from 'react-router-dom';
import { DetailsType } from "./DetailsType.tsx";
import Layout from "@layouts/Layout.tsx";
import UserClass from "@components/UserClass.tsx";
import { useQuery } from '@tanstack/react-query';

function Users() {
    const user = new UserClass();
    const permission: string = user.role;
    const allowed: boolean = permission !== "SiteAdmin";

    const { data, isLoading, isError, error } = useQuery<DetailsType[]>({
        queryKey: ['userslist'],
        queryFn: async () => {
            const response = await fetch('/api/Users');
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to fetch users');
            }
            return response.json();
        },
    });

    if (isLoading)
        return <p aria-label="Loading">Loading...</p>;

    if (isError)
        return <p aria-label="Error">Return Error: {error instanceof Error ? error.message : "Unknown error"}</p>;

    if (data === null || (Array.isArray(data) && data.length === 0))
        return (
            <Layout>
                <h3 id="tableLabel">Users</h3>
                <Link to="/Admin/Users/Create">Add</Link>
                <p>No Users</p>
            </Layout>
        );
    if (!((data === undefined || !Array.isArray(data)))) {
        return (
            <Layout>
                <h3 id="tableLabel">Users</h3>
                <Link to="/Admin/Users/Create">Add</Link>
                <table className="table table-striped" aria-labelledby="tableLabel">
                    <thead>
                        <tr>
                            <th>Users Name</th>
                            <th>Active</th>
                            <th>Display Name</th>
                            <th>Role</th>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(item =>
                            <tr key={item.id.toString()}>
                                <td>{item.userName}</td>
                                <td>{item.isActive ? "Yes" : "No"}</td>
                                <td>{item.displayName}</td>
                                <td>{item.role}</td>
                                <td>
                                    <Link to="/Admin/Users/Update" state={item.id.toString()}>Update</Link>|
                                    <Link to="/Admin/Users/Delete" state={item.id.toString()}>Delete</Link>
                                    <span hidden={allowed}>|</span>
                                    <Link hidden={allowed} to="/Admin/Users/ChangePassword" state={item.id.toString()}>Change Password</Link>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </Layout>
        );
    }

}

export default Users;