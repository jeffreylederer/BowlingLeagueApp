import type { Meta, StoryObj } from '@storybook/react-vite';
import ReturnButton from '@components/ReturnButton.tsx';
const meta: Meta<typeof ReturnButton> = {
    component: ReturnButton,
};

const fn = () => alert('Return');

export default meta;
type Story = StoryObj<typeof ReturnButton>;
export const Primary: Story = {
  args: {
    Back: fn,
    disabled : false,
  },
};

export const Secondary: Story = {
  args: {
        disabled: true
  },
};