import type { Meta, StoryObj } from '@storybook/react-vite';
import Menu from '@components/Menu.tsx';
import { MemoryRouter } from 'react-router-dom';


const meta = {
    component: Menu,
    title: 'Components/Menu',
    decorators: [
        (Story) => (
            <MemoryRouter initialEntries={['/']} >
                <Story />
            </MemoryRouter>
        ),
    ],
} satisfies Meta<typeof About>;

export default meta;
type Story = StoryObj<typeof Menu>;

export const SiteAdmin: Story = {
    args: {
        league: {
            id: 1,
            leagueName: "Test League",
            active: true,
            teamSize: 0,
            tiesAllowed: false,
            pointsCount: false,
            winPoints: 0,
            tiePoints: 0,
            byePoints: 0,
            startWeek: 0,
            pointsLimit: false,
            divisions: 1,
            playOffs: false
        },
        user: {
            id: 1,
            userName: "ledejh",
            role: "SiteAdmin"
        }
    }
};

export const Observer: Story = {
    args: {
        league: {
            id: 1,
            leagueName: "Test League",
            active: true,
            teamSize: 0,
            tiesAllowed: false,
            pointsCount: false,
            winPoints: 0,
            tiePoints: 0,
            byePoints: 0,
            startWeek: 0,
            pointsLimit: false,
            divisions: 1,
            playOffs: false
        },
        user: {
            id: 1,
            userName: "ledejh",
            role: "Observer"
        },
    }
};

export const NoLeague: Story = {
    args: {
        league: {
            id: 0,
            leagueName: "Test League",
            active: true,
            teamSize: 0,
            tiesAllowed: false,
            pointsCount: false,
            winPoints: 0,
            tiePoints: 0,
            byePoints: 0,
            startWeek: 0,
            pointsLimit: false,
            divisions: 1,
            playOffs: false
        },
        user: {
            id: 1,
            userName: "ledejh",
            role: "Observer"
        },
    }
};