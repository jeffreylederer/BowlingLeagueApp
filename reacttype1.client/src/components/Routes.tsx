import {
    Routes,
    Route
} from "react-router-dom";
import { Suspense } from "react";    



import Membership from "@pages/Membership/List.tsx";
import MembershipDelete from "@pages/Membership/Delete.tsx";
import MembershipUpdate from "@pages/Membership/Update.tsx";
import MembershipCreate from "@pages/Membership/Create.tsx";

import League from "@pages/Admin/League/List.tsx";
import LeagueDelete from "@pages/Admin/League/Delete.tsx";
import LeagueUpdate from "@pages/Admin/League/Update.tsx";
import LeagueCreate from "@pages/Admin/League/Create.tsx";
import LeagueDetails from "@pages/Admin/League/Details.tsx";

import Users from "@pages/Admin/Users/List.tsx";
import UsersDelete from "@pages/Admin/Users/Delete.tsx";
import UsersUpdate from "@pages/Admin/Users/Update.tsx";
import UsersCreate from "@pages/Admin/Users/Create.tsx";
import ChangePassword from "@pages/Admin/Users/ChangePassword.tsx";



import Players from "@pages/League/Players/List.tsx";
import PlayersDelete from "@pages/League/Players/Delete.tsx";
import PlayersCreate from "@pages/League/Players/Create.tsx";

import Schedule from "@pages/League/Schedule/List.tsx";
import SchedulesDelete from "@pages/League/Schedule/Delete.tsx";
import SchedulesCreate from "@pages/League/Schedule/Create.tsx";
import SchedulesUpdate from "@pages/League/Schedule/Update.tsx";

import Teams from "@pages/League/Teams/List.tsx";
import TeamsDelete from "@pages/League/Teams/Delete.tsx";
import TeamsCreate from "@pages/League/Teams/Create.tsx";
import TeamsUpdate from "@pages/League/Teams/Update.tsx";
import TeamReport from "@pages/League/Teams/Report.tsx";

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
import UserUpdatePassword from "@pages/Admin/Login/UserUpdatePassword.tsx";
import UpdateRecoverPassword from "@pages/Admin/Login/UpdateRecoverPassword.tsx";
import RecoverPasswordRequest from "@pages/Admin/Login/RecoverPasswordRequest.tsx";
import NotLogin from "@pages/Admin/Login/NotLogin.tsx";


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
				</Suspense>}  />
            <Route path='*' element={<NotLogin />} />
            <Route path="/Welcome" element={<Welcome/>} />

            <Route path="/Weather" element={<Weather />} />
        </Routes>

 
  );
}

export default RouteMenu;