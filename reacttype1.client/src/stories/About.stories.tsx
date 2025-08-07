import type { Meta, StoryObj } from '@storybook/react-vite';
import About from '@pages/About.tsx';
import { MemoryRouter } from 'react-router-dom';


const meta = {
    component: About,
    title: 'Pages/About',
    decorators: [
        (Story) => (
            <MemoryRouter initialEntries={['/']} >
                <Story />
            </MemoryRouter>
        ),
    ],
} satisfies Meta<typeof About>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Simple: Story = {};