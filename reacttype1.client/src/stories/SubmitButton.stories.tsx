import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import SubmitButton from '@components/SubmitButton'; // Adjust path if needed

type Story = StoryObj<typeof SubmitButton>;

const meta: Meta<typeof SubmitButton> = {
    component: SubmitButton,
    title: 'Components/SubmitButton',
    decorators: [
        (Story) => (
            <MemoryRouter initialEntries= { ['/']} >
            <Story />
            </MemoryRouter>
    ),
  ],
};


export const Enabled: Story = {
    args: {
        disabled: false,
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
    },
};

export default meta;
