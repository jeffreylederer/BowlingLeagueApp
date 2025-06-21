import Layout from "@layouts/Layout.tsx";
import { SiteInfoType } from './SiteInfoType.ts';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from "flowbite-react";

const Contact = () => {
    const { data, isLoading, isError, error } = useQuery<SiteInfoType>({
        queryKey: ['site-info'],
        queryFn: async () => {
            const response = await fetch(`/api/Home`);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to fetch site info');
            }
            return response.json();
        },
    });

    if (isError)
        return (
            <Layout>
                <h3>Contact</h3>
                <p className="errorMessage">
                    {error instanceof Error ? error.message : "An error occurred while loading site info."}
                </p>
            </Layout>
        );

    if (isLoading)
        return (
            <Layout>
                <h3>Contact</h3>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                    <Spinner size="xl" />
                </div>
            </Layout>
        );

    return (
        <Layout>
            <>
                <h3 style={{ textAlign: 'center' }}>Contact</h3>
                <p style={{ width: '100%', textAlign: 'left' }}>
                    This application is supported by Jeffrey Lederer.
                    The source code depository for this application is at <a href="https://github.com/jeffreylederer/ReactType1" target="blank">https://github.com/jeffreylederer/ReactType1</a>
                </p>
                <p style={{ width: '100%', textAlign: 'left' }}>
                    <address>
                        <strong>Support:</strong> <a href={`mailto:${data?.contact}`}>{data?.contact}</a><br />
                    </address>
                </p>
            </>
        </Layout>
    );
}

export default Contact;