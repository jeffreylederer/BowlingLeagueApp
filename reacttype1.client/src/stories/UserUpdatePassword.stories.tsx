import type { Meta, StoryObj } from '@storybook/react-vite';
import UserUpdatePassword from '@pages/Admin/Login/UserUpdatePassword.tsx';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

type Story = StoryObj<typeof UserUpdatePassword>;

const meta: Meta<typeof UserUpdatePassword> = {
    component: UserUpdatePassword,
    title: 'Pages/UserUpdatePassword',
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