import type { Meta, StoryObj } from '@storybook/react-vite';
import LeagueCreate from '@pages/Admin/League/Create.tsx';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

type Story = StoryObj<typeof LeagueCreate>;

const meta: Meta<typeof DeleteButton> = {
    component: LeagueCreate,
    title: 'Pages/LeagueCreate',
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