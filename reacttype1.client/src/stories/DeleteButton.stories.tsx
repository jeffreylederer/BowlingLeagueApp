import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import DeleteButton from '@components/DeleteButton'; // Adjust path if needed

type Story = StoryObj<typeof DeleteButton>;

const fn = () => alert('Delete');

const meta: Meta<typeof DeleteButton> = {
    component: DeleteButton,
    title: 'Components/DeleteButton',
    decorators: [
        (Story) => (
            <MemoryRouter initialEntries={['/']} >
                <Story />
            </MemoryRouter>
        ),
    ],
};


export const Disabled: Story = {
    args: {
        DeleteItem: fn,
        disabled: true,
    },
};

export const Enabled: Story = {
    args: {
        disabled: false
    },
};


export default meta;
