import type { Meta, StoryObj } from '@storybook/react-vite';
import RecoverPasswordRequest from '@pages/Admin/Login/RecoverPasswordRequest.tsx';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();



const meta = {
    component: RecoverPasswordRequest,
    title: 'Pages/RecoverPasswordRequest',
    decorators: [
        (Story) => (
            <MemoryRouter initialEntries={['/']} >
                <QueryClientProvider client={queryClient}>{Story()}</QueryClientProvider>
            </MemoryRouter>
        ),
    ],
} satisfies Meta<typeof RecoverPasswordRequest>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Simple: Story = {};
