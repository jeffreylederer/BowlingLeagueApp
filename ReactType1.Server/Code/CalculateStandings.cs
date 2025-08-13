using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ReactType1.Server.Models;


namespace ReactType1.Server.Code
{

    public static class CalculateStandings
    {


        /// <summary>
        /// Determine the standings based on all the games played so far
        /// </summary>
        /// <param name="weekid">the record Id of the week in the schedule table</param>
        /// <param name="teamsize">number of players per team</param>
        /// <param name="leagueid">the record Id of the league table</param>
        /// <returns></returns>
        public static List<Standing> Doit(int weekid, int leagueid, int DivisionId, DbLeagueApp db)
        {
            League? league = db.Leagues.Find(leagueid);
            if(league == null) 
                return new List<Standing>();

            int? teamsize = league.TeamSize;

            var list = new List<Standing>();


            // get the names of the player for each team
            foreach (var team in db.Teams.Where(x => (x.Leagueid == league.Id) && x.DivisionId== DivisionId).ToList())
            {

                


                OneTeamView? team1 = db.OneTeamViews
                         .FromSql($"EXEC OneTeam {team.Id}")
                         .AsEnumerable()
                         .FirstOrDefault();
                
                string players = " ";
                if (team1 != null && team1.Skip != null)
                {
                    switch (teamsize)
                    {
                        case 1:
                            players = team1.Skip;
                            break;
                        case 2:
                            players = $"{team1.Skip}, {team1.Lead}";
                            break;
                        case 3:
                            players = $"{team1.Skip}, {team1.ViceSkip}, {team1.Lead}";
                            break;
                    }
                }

                list.Add(new Standing()
                {
                    Team = team.TeamNo,
                    TeamId = team.Id,
                    Wins = 0,
                    Loses = 0,
                    TotalScore = 0,
                    Ties = 0,
                    Byes = 0,
                    Players = players,
                    DivisionId = team.DivisionId
                });
               
            }

            // determine the total score and wins and loses for each team for each week
            foreach (var week in db.Schedules.Where(x => x.Id <= weekid && x.Leagueid == league.Id).ToList())
            {

                //cancelled weeks do not count
                if (week.Cancelled)
                    continue;

                foreach (var match in db.Matches.Where(x => x.WeekId == week.Id).Where(x => x.TeamNo1Navigation.DivisionId == DivisionId).ToList())
                {

                    GetTeamView? teamView = db.GetTeamViews
                        .FromSql($"Exec GetTeam {match.Id}")
                        .AsEnumerable()
                        .FirstOrDefault();


                    // both teams forfeits
                    if (match.Rink != -1 && match.ForFeitId == -1)
                    {
                        var winner = list.Find(x => x.Team == teamView?.Team);
                        var loser = list.Find(x => x.Team == teamView?.Team1);
                        if (winner != null && loser != null)
                        {
                            winner.Loses++;
                            loser.Loses++;
                        }

                    }
                    // tie game
                    else if (match.Team1Score == match.Team2Score && match.Rink != -1 && match.ForFeitId == 0)
                    {
                        var winner = list.Find(x => x.Team == teamView?.Team);
                        var loser = list.Find(x => x.Team == teamView?.Team1);
                        if (winner != null && loser != null)
                        {
                            winner.Ties++;
                            loser.Ties++;
                            if (league.PointsLimit)
                            {
                                winner.TotalScore += Math.Min(20, match.Team1Score);
                                loser.TotalScore += Math.Min(20, match.Team2Score);
                                //total += Math.Min(20, match.Team1Score);
                            }
                            else
                            {
                                winner.TotalScore += match.Team1Score;
                                loser.TotalScore += match.Team2Score;
                                //total += match.Team1Score;
                            }
                        }
                    }
                    //team 1 wins
                    else if (match.Team1Score > match.Team2Score && match.Rink != -1 && match.ForFeitId == 0)
                    {
                        var winner = list.Find(x => x.Team == teamView?.Team);
                        var loser = list.Find(x => x.Team == teamView?.Team1);
                        if (winner != null && loser != null)
                        {
                            winner.Wins++;
                            loser.Loses++;
                            if (league.PointsLimit)
                            {
                                winner.TotalScore += Math.Min(20, match.Team1Score);
                                loser.TotalScore += Math.Min(20, match.Team2Score);
                            }
                            else
                            {
                                winner.TotalScore += match.Team1Score;
                                loser.TotalScore += match.Team2Score;
                            }
                        }
                    }
                    //team 2 wins
                    else if (match.Rink != -1 && match.ForFeitId == 0)
                    {
                        var winner = list.Find(x => x.Team == teamView?.Team1);
                        var loser = list.Find(x => x.Team == teamView?.Team);
                        if (winner != null && loser != null)
                        {
                            winner.Wins++;
                            loser.Loses++;
                            if (league.PointsLimit)
                            {
                                winner.TotalScore += Math.Min(20, match.Team2Score);
                                loser.TotalScore += Math.Min(20, match.Team1Score);
                            }
                            else
                            {
                                winner.TotalScore += match.Team2Score;
                                loser.TotalScore += match.Team1Score;
                            }
                        }
                    }
                    // one team forfeits
                    else if (match.Rink != -1 && match.ForFeitId > 0)
                    {
                        var team1 =list.Where(x=>x.TeamId==match.TeamNo1).FirstOrDefault();
                        var team2 = list.Where(x => x.TeamId == match.TeamNo2).FirstOrDefault();
                        if (team1?.Team == match.ForFeitId)
                        {
                            var winner = team2;
                            var loser = team1;
                            winner.Wins++;
                            loser.Loses++;
                            winner.TotalScore += 14;
                        }
                        else 
                        {
                            var winner = team1;
                            var loser = team2;
                            winner.Wins++;
                            loser.Loses++;
                            winner.TotalScore += 14;
                        }
                    }
                    if( match.Rink == -1 && match.ForFeitId == 0)
                    {
                        var winner = list.Find(x => x.Team == teamView?.Team);
                        if (winner != null)
                        {
                            winner.Wins++;
                            winner.Byes++;
                            winner.TotalScore += 14;
                        }
                    }
                }

             }

            int place = 1;
            int nextplace = 1;
            Standing previous = new Standing()
            {
                Loses = 0,
                TotalScore = 0,
                Wins = 0,
                Ties = 0,
                Byes = 0

            };
            foreach (var item in list)
            {
                var points = (item.Wins - item.Byes) * league.WinPoints +
                                   item.Ties * league.TiePoints + item.Byes * league.ByePoints;
                item.TotalPoints = points * 1000 + item.TotalScore;
                

            }
            list.Sort((a, b) => (b.TotalPoints).CompareTo(a.TotalPoints));
            foreach (var item in list)
            {
                if (item.TotalPoints != previous.TotalPoints)
                {
                    place = nextplace;
                }
                item.Place = place;
                previous = item;
                nextplace++;
            }
            return list;
        }


        /// <summary>
        /// Determine the standings based on all the games this week
        /// </summary>
        /// <param name="weekid">the record Id of the week in the schedule table</param>
        /// <param name="teamsize">number of players per team</param>
        /// <param name="leagueid">the record Id of the league table</param>
        /// <returns></returns>
        public static List<Standing> DoitPlayoffs(int weekid, int leagueid, DbLeagueApp db)
        {
            League? league = db.Leagues.Find(leagueid);
            if (league == null)
                return new List<Standing>();

            int? teamsize = league.TeamSize;
            

            var list = new List<Standing>();


            // get the names of the player for each team
            foreach (var team in db.Teams.Where(x => x.Leagueid == league.Id).ToList())
            {
                OneTeamView? team1 = db.OneTeamViews
                .FromSql($"EXEC OneTeam {league.Id}")
                .AsEnumerable()
                .FirstOrDefault();
                string players = " ";
                if (team1 != null && team1.Skip != null)
                {
                    switch (teamsize)
                    {
                        case 1:
                            players = team1.Skip;
                            break;
                        case 2:
                            players = $"{team1.Skip}, {team1.Lead}";
                            break;
                        case 3:
                            players = $"{team1.Skip}, {team1.ViceSkip}, {team1.Lead}";
                            break;
                    }
                }
                list.Add(new Standing()
                {
                    Team = team.TeamNo,
                    TeamId = team.Id,   
                    Wins = 0,
                    Loses = 0,
                    TotalScore = 0,
                    Ties = 0,
                    Byes = 0,
                    Players = players,
                    DivisionId = team.DivisionId
                });
            }

            // determine the total score and wins and loses for each team for each week
            var week = db.Schedules.Find(weekid);
            if (week != null) 
            {

               

                foreach (var match in db.Matches.Where(x => x.WeekId == week.Id).ToList())
                {
                    GetTeamView? teamView = db.GetTeamViews
                    .FromSql($"Exec GetTeam {match.Id}")
                    .AsEnumerable()
                    .FirstOrDefault();

                    // both teams forfeits
                    if (match.Rink != -1 && match.ForFeitId == -1)
                    {
                        var winner = list.Find(x => x.Team == teamView?.Team);
                        var loser = list.Find(x => x.Team == teamView?.Team1);
                        if (winner != null && loser != null)
                        {
                            winner.Loses++;
                            loser.Loses++;
                        }

                    }
                    // tie game
                    else if (match.Team1Score == match.Team2Score && match.Rink != -1 && match.ForFeitId == 0)
                    {
                        var winner = list.Find(x => x.Team == teamView?.Team);
                        var loser = list.Find(x => x.Team == teamView?.Team1);
                        if (winner != null && loser != null)
                        {
                            winner.Ties++;
                            loser.Ties++;
                            if (league.PointsLimit)
                            {
                                winner.TotalScore += Math.Min(20, match.Team1Score);
                                loser.TotalScore += Math.Min(20, match.Team2Score);
                                //total += Math.Min(20, match.Team1Score);
                            }
                            else
                            {
                                winner.TotalScore += match.Team1Score;
                                loser.TotalScore += match.Team2Score;
                                //total += match.Team1Score;
                            }
                        }
                    }
                    //team 1 wins
                    else if (match.Team1Score > match.Team2Score && match.Rink != -1 && match.ForFeitId == 0)
                    {
                        var winner = list.Find(x => x.Team == teamView?.Team);
                        var loser = list.Find(x => x.Team == teamView?.Team1);
                        if (winner != null && loser != null)
                        {
                            winner.Wins++;
                            loser.Loses++;
                            if (league.PointsLimit)
                            {
                                winner.TotalScore += Math.Min(20, match.Team1Score);
                                loser.TotalScore += Math.Min(20, match.Team2Score);
                            }
                            else
                            {
                                winner.TotalScore += match.Team1Score;
                                loser.TotalScore += match.Team2Score;
                            }
                        }
                    }
                    //team 2 wins
                    else if (match.Rink != -1 && match.ForFeitId == 0)
                    {
                        var winner = list.Find(x => x.Team == teamView?.Team1);
                        var loser = list.Find(x => x.Team == teamView?.Team);
                        if (winner != null && loser != null)
                        {
                            winner.Wins++;
                            loser.Loses++;
                            if (league.PointsLimit)
                            {
                                winner.TotalScore += Math.Min(20, match.Team2Score);
                                loser.TotalScore += Math.Min(20, match.Team1Score);
                            }
                            else
                            {
                                winner.TotalScore += match.Team2Score;
                                loser.TotalScore += match.Team1Score;
                            }
                        }
                    }
                    // one team forfeits
                    else if (match.Rink != -1 && match.ForFeitId > 0)
                    {
                        var team1 = list.Where(x => x.TeamId == match.TeamNo1).FirstOrDefault();
                        var team2 = list.Where(x => x.TeamId == match.TeamNo2).FirstOrDefault();
                        if (team1?.Team == match.ForFeitId)
                        {
                            var winner = team2;
                            var loser = team1;
                            winner.Wins++;
                            loser.Loses++;
                            if (winner != null)
                                winner.TotalScore += 14;
                        }
                        else
                        {
                            var winner = team1;
                            var loser = team2;
                            winner.Wins++;
                            loser.Loses++;
                            if (winner != null)
                                winner.TotalScore += 14;
                        }

                    }
                    //bye
                    else if(match.Rink == -1 && match.ForFeitId == 0)
                    {
                        var winner = list.Find(x => x.Team == teamView?.Team);
                        if (winner != null)
                        {
                            winner.Byes++;
                            winner.TotalScore += 14;
                        }
                    }

                }

            }

            int place = 1;
            int nextplace = 1;
            Standing previous = new Standing()
            {
                Loses = 0,
                TotalScore = 0,
                Wins = 0,
                Ties = 0,
                Byes = 0

            };
            foreach (var item in list)
            {
               
                item.TotalPoints = 1000*(item.Wins * league.WinPoints +
                                   item.Ties * league.TiePoints + item.Byes * league.ByePoints) + item.TotalScore;

            }

            list.Sort((a, b) => (b.TotalPoints).CompareTo(a.TotalPoints));
            foreach (var item in list)
            {
                if (item.TotalPoints != previous.TotalPoints)
                {
                    place = nextplace;
                }
                previous = item;
                nextplace++;
                item.Place = place;
            }
            return list;
        }
    }



    public class Standing
    {
        public int Team { get; set; }
        public int TeamId { get; set; } = 0;    
        public string Players { get; set; } = "";
        public int TotalScore { get; set; } = 0;
        public int Wins { get; set; } = 0;
        public int Loses { get; set; } = 0;
        public int Ties { get; set; } = 0;
        public int Byes { get; set; } = 0;  
        public short DivisionId { get; set; }=0;
        public int TotalPoints { get; set; } = 0;
        public int Place { get; set; } = 0;

        
    }
}
    

