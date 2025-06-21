import { Link } from 'react-router-dom';
import { TableData } from './TableData.ts';
import UserClass from "@components/UserClass.tsx";
import Layout from '@layouts/Layout.tsx';
import Table from './Table.tsx';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from "flowbite-react";

function Membership() {
    const user = new UserClass();
    const hideAddButton: boolean = !(user.role == "SiteAdmin" || user.role == "Admin");

    const { data, isLoading, isError, error } = useQuery<TableData[]>({
        queryKey: ['membershiplist'],
        queryFn: async () => {
            const response = await fetch('/api/memberships');
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `HTTP error! status: ${response.status}`);
            }
            return response.json();
        },
    });

    if (isLoading)
        return (
            <Layout>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                    <Spinner size="xl" />
                </div>
            </Layout>
        );

    if (isError)
        return (
            <Layout>
                <h3 aria-label="Membership table">Membership</h3>
                <p className="errorMessage">
                    {error instanceof Error ? error.message : "An error occurred while loading memberships."}
                </p>
            </Layout>
        );

    if (data === null || (Array.isArray(data) && data.length === 0))
        return (
            <Layout>
                <h3 aria-label="Membership table">Membership</h3>
                <Link to="/Membership/Create" hidden={hideAddButton} aria-label="Add Membership">Add</Link>
                <p>No Members</p>
            </Layout>
        );

    if (data != undefined) {
        return (
            <Layout>
                <h3 aria-label="Membership table">Membership</h3>
                <Link to="/Membership/Create" hidden={hideAddButton} aria-label="Add Membership">Add</Link>
                <Table data={data} rowsPerPage={15} hide={hideAddButton} />
            </Layout>
        );
    }
}

export default Membership;