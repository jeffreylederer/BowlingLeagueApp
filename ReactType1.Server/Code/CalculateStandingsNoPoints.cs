using Microsoft.EntityFrameworkCore;
using ReactType1.Server.Models;
using System.Linq;

namespace ReactType1.Server.Code
{
    public class CalculateStandingsNoPoints
    {
        /// <summary>
        /// Determine the standings based on all the games played so far
        /// </summary>
        /// <param name="weekid">the record Id of the week in the schedule table</param>
        /// <param name="teamsize">number of players per team</param>
        /// <param name="leagueid">the record Id of the league table</param>
        /// <returns></returns>
        public static List<StandingNoPoints> Doit(int weekid, int leagueid, int DivisionId, DbLeagueApp db)
        {
            League? league = db.Leagues.Find(leagueid);
            if (league == null)
                return new List<StandingNoPoints>();

            int? teamsize = league.TeamSize;

            var list = new List<StandingNoPoints>();


            // get the names of the player for each team
            foreach (var team in db.Teams.Where(x => (x.Leagueid == league.Id) && x.DivisionId == DivisionId).ToList())
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

                list.Add(new StandingNoPoints()
                {
                    Team = team.TeamNo,
                    TeamId = team.Id,
                    Points = 0,
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

                    //teams tied
                    if (match.Team1Score==match.Team2Score && match.Rink != -1 && match.ForFeitId == 0)
                    {
                        var winner = list.Find(x => x.Team == teamView?.Team);
                        var loser = list.Find(x => x.Team == teamView?.Team1);
                        if (winner != null && loser != null)
                        {
                            winner.Points += league.TiePoints;
                            loser.Points += league.TiePoints;

                        }
                    }


                    //team 1 wins
                    else if (match.Team1Score > match.Team2Score && match.Rink != -1 && match.ForFeitId == 0)
                    {
                        var winner = list.Find(x => x.Team == teamView?.Team);
                        if (winner != null)
                        {
                            winner.Points += league.WinPoints;
                        }
                    }

                    //team 2 wins
                    else if (match.Team1Score < match.Team2Score && match.Rink != -1 && match.ForFeitId == 0)
                    {
                        var winner = list.Find(x => x.Team == teamView?.Team1);
                        if (winner != null)
                        {
                            winner.Points += league.WinPoints;
                        }
                    }
                    // forfeit
                    else if(match.Rink != -1 && match.ForFeitId != 0)
                    {
                        var team1 = list.Where(x => x.TeamId == match.TeamNo1).FirstOrDefault();
                        var team2 = list.Where(x => x.TeamId == match.TeamNo2).FirstOrDefault();
                        if (team1?.Team == match.ForFeitId)
                        {
                            var winner = team2;
                            if(winner != null)
                                winner.Points += league.WinPoints;
                        }
                        else 
                        {
                            var winner = team1;
                            if (winner != null)
                                winner.Points += league.WinPoints;
                        }

                    }
                    // bye
                    else if (match.Rink == -1)
                    {
                        
                        var winner = list.Find(x => x.Team == teamView?.Team);
                        if (winner != null)
                        {
                            winner.Points += league.ByePoints;
                        }

                    }
                }
            }

            int place = 1;
            int nextplace = 1;
            StandingNoPoints previous = new StandingNoPoints()
            {
                Points = 0,

            };

            list.Sort((a, b) => b.Points.CompareTo(a.Points));
            foreach (var item in list)
            {
                if (item.Points != previous.Points)
                {
                    place = nextplace;
                }
                item.Place = place;
                previous = item;
                nextplace++;
            }
            return list;
        }
    }

    public class StandingNoPoints
    {
        public int Team { get; set; }
        public int TeamId { get; set; } = 0;
        public string Players { get; set; } = "";
        public int Points { get; set; } = 0;
        public short DivisionId { get; set; } = 0;
        public int Place { get; set; } = 0;


    }
}
