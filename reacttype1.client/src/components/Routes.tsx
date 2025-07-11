import {
    Routes,
    Route
} from "react-router-dom";
import { Suspense, lazy } from "react";    



const Membership = lazy(() => import("@pages/Membership/List.tsx"));
const MembershipDelete = lazy(() => import("@pages/Membership/Delete.tsx"));
const MembershipUpdate = lazy(() => import("@pages/Membership/Update.tsx"));
const MembershipCreate = lazy(() => import("@pages/Membership/Create.tsx"));

const League = lazy(() => import("@pages/Admin/League/List.tsx"));
const LeagueDelete = lazy(() => import("@pages/Admin/League/Delete.tsx"));
const LeagueUpdate = lazy(() => import("@pages/Admin/League/Update.tsx"));
const LeagueCreate = lazy(() => import("@pages/Admin/League/Create.tsx"));
const LeagueDetails = lazy(() => import("@pages/Admin/League/Details.tsx"));

const Users = lazy(() => import("@pages/Admin/Users/List.tsx"));
const UsersDelete = lazy(() => import("@pages/Admin/Users/Delete.tsx"));
const UsersUpdate = lazy(() => import("@pages/Admin/Users/Update.tsx"));
const UsersCreate = lazy(() => import("@pages/Admin/Users/Create.tsx"));
const ChangePassword = lazy(() => import("@pages/Admin/Users/ChangePassword.tsx"));



const Players = lazy(() => import("@pages/League/Players/List.tsx"));
const PlayersDelete = lazy(() => import("@pages/League/Players/Delete.tsx"));
const PlayersCreate = lazy(() => import("@pages/League/Players/Create.tsx"));

const Schedule = lazy(() => import("@pages/League/Schedule/List.tsx"));
const SchedulesDelete = lazy(() => import("@pages/League/Schedule/Delete.tsx"));
const SchedulesCreate = lazy(() => import("@pages/League/Schedule/Create.tsx"));
const SchedulesUpdate = lazy(() => import("@pages/League/Schedule/Update.tsx"));

const Teams = lazy(() => import("@pages/League/Teams/List.tsx"));
const TeamsDelete = lazy(() => import("@pages/League/Teams/Delete.tsx"));
const TeamsCreate = lazy(() => import("@pages/League/Teams/Create.tsx"));
const TeamsUpdate = lazy(() => import("@pages/League/Teams/Update.tsx"));
const TeamReport = lazy(() => import("@pages/League/Teams/Report.tsx"));

import Matches from "@pages/League/Matches/list.tsx";
import ScoreCard from "@pages/League/Matches/ScoreCard.tsx";
import Standings from "@pages/League/Matches/Standings.tsx";
import MatchUpdate from "@pages/League/Matches/Update.tsx";
import Byes from "@pages/League/Matches/Byes.tsx";
import ScheduleReport from "@pages/League/Matches/ScheduleReport.tsx";
import CreateMatches  from "@pages/League/Matches/CreateMatches.tsx";
import ClearMatches from "@pages/League/Matches/ClearMatches.tsx";

import PlayoffsUpdate from "@pages/League/Playoffs/Update.tsx";
import PlayoffsCreate from "@pages/League/Playoffs/Create.tsx";
import Playoffs from "@pages/League/Playoffs/List.tsx";
import PlayoffScoring from "@pages/League/Playoffs/Scoring.tsx";
import ListGames from "@pages/League/Playoffs/ListGames.tsx";
import GameReport from "@pages/League/Playoffs/GameReport.tsx";
import PlayoffsResults from "@pages/League/Playoffs/PlayoffResults.tsx";



import Logoff from "@pages/Admin/Login/Logoff.tsx";
import Login from "@pages/Admin/Login/Login.tsx";
const UserUpdatePassword = lazy(() => import("@pages/Admin/Login/UserUpdatePassword.tsx"));
const UpdateRecoverPassword = lazy(() => import("@pages/Admin/Login/UpdateRecoverPassword.tsx"));
const RecoverPasswordRequest = lazy(() => import("@pages/Admin/Login/RecoverPasswordRequest.tsx"));
const NotLogin = lazy(() => import("@pages/Admin/Login/NotLogin.tsx"));


import About from "@pages/About.tsx";



import Welcome from "@pages/Welcome.tsx";
import Home from '@pages/Home.tsx'; 

import Weather from '@pages/Weather.tsx';


function RouteMenu() {
   
    
    return (
       
        <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/Membership" element={
				<Suspense fallback={<div>Loading...</div>}>
					<Membership />
				</Suspense>}  />
            <Route path="/Membership/Delete" element={
				<Suspense fallback={<div>Loading...</div>}>
					<MembershipDelete />
				</Suspense>}  />
            <Route path="/Membership/Update" element={
				<Suspense fallback={<div>Loading...</div>}>
					<MembershipUpdate />
				</Suspense>}  />
            <Route path="/Membership/Create" element={
				<Suspense fallback={<div>Loading...</div>}>
					<MembershipCreate />
				</Suspense>}  />

            <Route path="/Admin/Leagues" element={
				<Suspense fallback={<div>Loading...</div>}>
					<League />
				</Suspense>}  />
            <Route path="/Admin/League/Delete" element={
				<Suspense fallback={<div>Loading...</div>}>
					<LeagueDelete />
				</Suspense>}  />
            <Route path="/Admin/League/Update" element={
				<Suspense fallback={<div>Loading...</div>}>
					<LeagueUpdate />
				</Suspense>}  />
            <Route path="/Admin/League/Create" element={
				<Suspense fallback={<div>Loading...</div>}>
					<LeagueCreate />
				</Suspense>}  />
            <Route path="/Admin/League/Details" element={
				<Suspense fallback={<div>Loading...</div>}>
					<LeagueDetails />
				</Suspense>}  />

            <Route path="/Admin/Users" element={
				<Suspense fallback={<div>Loading...</div>}>
					<Users />
				</Suspense>}  />
            <Route path="/Admin/Users/Delete" element={
				<Suspense fallback={<div>Loading...</div>}>
					<UsersDelete />
				</Suspense>}  />
            <Route path="/Admin/Users/Update" element={
				<Suspense fallback={<div>Loading...</div>}>
					<UsersUpdate />
				</Suspense>}  />
            <Route path="/Admin/Users/Create" element={
				<Suspense fallback={<div>Loading...</div>}>
					<UsersCreate />
				</Suspense>}  />
            <Route path="/Admin/Users/RecoverPasswordRequest" element={
				<Suspense fallback={<div>Loading...</div>}>
					<RecoverPasswordRequest />
				</Suspense>}  />
            <Route path="/Admin/Users/ChangePassword" element={
				<Suspense fallback={<div>Loading...</div>}>
					<ChangePassword />
				</Suspense>}  />
            


            <Route path="/League/Players" element={
				<Suspense fallback={<div>Loading...</div>}>
					<Players />
				</Suspense>}  />
            <Route path="/League/Players/Delete" element={
				<Suspense fallback={<div>Loading...</div>}>
					<PlayersDelete />
				</Suspense>}  />
            <Route path="/League/Players/Create" element={
				<Suspense fallback={<div>Loading...</div>}>
					<PlayersCreate />
				</Suspense>}  />

            <Route path="/League/Schedule" element={
				<Suspense fallback={<div>Loading...</div>}>
					<Schedule />
				</Suspense>}  />
            <Route path="/League/Schedule/Delete" element={
				<Suspense fallback={<div>Loading...</div>}>
					<SchedulesDelete />
				</Suspense>}  />
            <Route path="/League/Schedule/Create" element={
				<Suspense fallback={<div>Loading...</div>}>
					<SchedulesCreate />
				</Suspense>}  />
            <Route path="/League/Schedule/Update" element={
				<Suspense fallback={<div>Loading...</div>}>
					<SchedulesUpdate />
				</Suspense>}  />

            <Route path="/League/Teams" element={
				<Suspense fallback={<div>Loading...</div>}>
					<Teams />
				</Suspense>}  />
            <Route path="/League/Teams/Delete" element={
				<Suspense fallback={<div>Loading...</div>}>
					<TeamsDelete />
				</Suspense>}  />
            <Route path="/League/Teams/Create" element={
				<Suspense fallback={<div>Loading...</div>}>
					<TeamsCreate />
				</Suspense>}  />
            <Route path="/League/Teams/Update" element={
				<Suspense fallback={<div>Loading...</div>}>
					<TeamsUpdate />
				</Suspense>}  />
            <Route path="/League/Teams/Report" element={
				<Suspense fallback={<div>Loading...</div>}>
					<TeamReport />
				</Suspense>}  />

            <Route path="/League/Matches" element={<Matches />} />
            <Route path="/League/Matches/Update" element={<MatchUpdate />} />
            <Route path="/League/Matches/Standings" element={<Standings />} />
            <Route path="/League/Matches/ScoreCard" element={<ScoreCard />} />
            <Route path="/League/Byes" element={<Byes />} />
            <Route path="/League/ScheduleReport" element={<ScheduleReport />} />
            <Route path="/League/CreateMatches" element={<CreateMatches />} />
            <Route path="/League/ClearMatches" element={<ClearMatches />} />

            <Route path="/League/Playoffs" element={<Playoffs />} />
            <Route path="/League/Playoffs/Update" element={<PlayoffsUpdate />} />
            <Route path="/League/Playoffs/Create" element={<PlayoffsCreate />} />
            <Route path="/League/Playoffs/PlayoffScoring" element={<PlayoffScoring />} />
            <Route path="/League/Playoffs/ListGames" element={<ListGames />} />
            <Route path="/League/Playoffs/GameReport" element={<GameReport />} />
            <Route path="/League/Playoffs/PlayoffResults" element={<PlayoffsResults />} />
                           

                
            
            <Route path="/About" element={<About />} />
            <Route path="/Logoff" element={<Logoff />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/UserUpdatePassword" element={
				<Suspense fallback={<div>Loading...</div>}>
					<UserUpdatePassword />
				</Suspense>}  />
            <Route path="/UpdateRecoverPassword" element={
				<Suspense fallback={<div>Loading...</div>}>
					<UpdateRecoverPassword />
				</Suspense>}  />
			<Route path="/RecoverPasswordRequest" element={
				<Suspense fallback={<div>Loading...</div>}>
					<RecoverPasswordRequest />
				</Suspense>} />
            <Route path='*' element={<NotLogin />} />
            <Route path="/Welcome" element={<Welcome/>} />

            <Route path="/Weather" element={<Weather />} />
        </Routes>

 
  );
}

export default RouteMenu;