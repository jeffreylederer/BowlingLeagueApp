import type { Meta, StoryObj } from '@storybook/react-vite';
import ReturnButton from '@components/ReturnButton.tsx';

const meta: Meta<typeof ReturnButton> = {
    component: ReturnButton,
    title: 'Components/ReturnButton',
};

const fn = () => alert('Return');

type Story = StoryObj<typeof ReturnButton>;

export const Disabked: Story = {
  args: {
    Back: fn,
    disabled : false,
  },
};

export const Enabled: Story = {
  args: {
        disabled: true
  },
};

export default meta;