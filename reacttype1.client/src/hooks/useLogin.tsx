import { create } from 'zustand';

export type LoginType = {
    id: number;
    userName: string;
    role: string;

};



type LeagueState = {
    user: LoginType;
    update: (newRecord: LoginType) => void;
    initialize: () => void;

}


const useLogin = create<LeagueState>((set) => ({
    user: {
        id: 0,
        userName: "",
        role: ""
},
    update: (newRecord: LoginType) => set({ user: newRecord }),
    initialize: () => set({
        user: {
            id: 0,
            userName: "",
            role: ""
        } })

}));

export default useLogin;