import { create } from 'zustand';

export type LeagueType = {
    id: number;
    leagueName: string;
    active: boolean;
    teamSize: number;
    tiesAllowed: boolean;
    pointsCount: boolean;
    winPoints: number;
    tiePoints: number;
    byePoints: number;
    startWeek: number;
    pointsLimit: boolean;
    divisions: number;
    playOffs: boolean;

};



type LeagueState = {
    league: LeagueType;
    update: (newRecord: LeagueType) => void;
    initialize: () => void;
}

const useLeague = create<LeagueState>((set) => ({
    league: {
        id: 0,
        leagueName: '',
        active: false,
        teamSize: 0,
        tiesAllowed: false,
        pointsCount: false,
        winPoints: 0,
        tiePoints: 0,
        byePoints: 0,
        startWeek: 0,
        pointsLimit: false,
        divisions: 0,
        playOffs: false
    },
        

    update: (newRecord: LeagueType) => set({ league: newRecord }),
    initialize: () => set({
        league: {
            id: 0,
            leagueName: '',
            active: false,
            teamSize: 0,
            tiesAllowed: false,
            pointsCount: false,
            winPoints: 0,
            tiePoints: 0,
            byePoints: 0,
            startWeek: 0,
            pointsLimit: false,
            divisions: 0,
            playOffs: false
        } })

}));

export default useLeague;