import type { Meta, StoryObj } from '@storybook/react-vite';
import Login from '@pages/Admin/Login/Login.tsx';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

type Story = StoryObj<typeof Login>;

const meta: Meta<typeof Login> = {
    component: Login,
    title: 'Pages/Login',
    decorators: [
        (Story) => (
            <MemoryRouter initialEntries={['/']} >
                <QueryClientProvider client={queryClient}>{Story()}</QueryClientProvider>
            </MemoryRouter>
        ),
    ],
};


export const Simple: Story = {

};

export default meta;