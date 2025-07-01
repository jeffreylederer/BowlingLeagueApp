
using ReactType1.Server.Models;
using System.IO;
using static QuestPDF.Helpers.Colors;

namespace ReactType1.Server.Code
{
    public class CreateScheduleList
    {
        private const int BYE = -1;

        /// <summary>
        /// It uses a week robin algoritm to generate the schedule.
        /// </summary>
        /// <param name="Weeks">number of weeks for this league</param>
        /// <param name="numTeams">number of teams in this league</param>
        /// <returns>Generates a list of matches. Each list has a week number, rink number, team 1 number and team 2 number. If the
        /// number of teams are odd, a bye week game is created with a rink of -1 and both teams are the same.</returns>

        /// <summary>
        /// Generates a round-robin schedule for the provided list of teams.
        /// For an even number of teams, a complete schedule (all teams playing each other once)
        /// takes n-1 rounds (here n=8 gives 7 rounds).
        /// </summary>
        /// <param name="teams">List of team names</param>
        /// <returns>A list of rounds; each round is a list of tuple matches (Team A, Team B)</returns>
        private static List<List<CalculatedMatch>> GenerateRoundRobinSchedule(int numWeeks, int numTeams)
        {
            List<int> teams = new List<int>();
            for (int i = 0; i < numTeams; i++)
                teams.Add(i);
            int n = numTeams;
            if (n % 2 != 0)
            {
                // For an odd number of teams, add a dummy "Bye" team.
                teams.Add(-1);
                n++;
            }

            var rounds = new List<List<CalculatedMatch>>();

            // Create a copy of the teams list so that we can rotate teams.
            var teamList = new List<int>(teams);

            // For each round...
            for (int round = 0; round < numWeeks; round++)
            {
                var roundMatches = new List<CalculatedMatch>();

                for (int i = 0; i < n / 2; i++)
                {
                    // Calculate indices for the paired teams.
                    int first = (round + i) % (n - 1);
                    int second = (n - 1 - i + round) % (n - 1);

                    // In every round, the last team stays in the same position.
                    if (i == 0)
                        second = n - 1;

                    int team1 = teamList[first];
                    int team2 = teamList[second];

                    // Exclude any matchup involving a "Bye" if present.
                    if (team1 != -1 && team2 != -1)
                        roundMatches.Add(new CalculatedMatch()
                        {
                            Week = round,
                            Rink = i,
                            Team1 = team1 > team2 ? team2 : team1,
                            Team2 = team2 < team1 ? team1 : team2
                        });
                    else
                        roundMatches.Add(new CalculatedMatch()
                        {
                            Week = round,
                            Rink = -1,
                            Team1 = team1 == -1 ? team2 : team1,
                            Team2 = team2 == -1 ? team1: team2
                        });

                }
                rounds.Add(roundMatches);
            }
            return rounds;
        }

        public List<CalculatedMatch> RoundRobin(int numWeeks, int numTeams)
        {
            List<CalculatedMatch> list = new List<CalculatedMatch>();
            int numRinks = numTeams / 2;
            var schedule = GenerateRoundRobinSchedule(numWeeks, numTeams);
            Random rnd = new Random();
            foreach (List<CalculatedMatch> round in schedule)
            {
                int rink = rnd.Next(0, numRinks - 1);
                foreach (CalculatedMatch week in round)
                {
   
                    if (week.Rink != -1)
                    {
                        week.Rink = rink % numRinks;
                        rink++;
                    }
                    list.Add(week);
                }
            }
            return list;
        }
  

        public List<CalculatedMatch> matchesWithDivisions(int weeks, DbLeagueApp db, int leagueid)
        {
            var teams = db.Teams.Where(x=>x.Leagueid==leagueid).ToList();
            var teamsinDivision1 = teams.Count(x => x.DivisionId == 1);
            var teamsinDivision2 = teams.Count(x => x.DivisionId == 2);
            List<CalculatedMatch> x1 = RoundRobin(weeks, teamsinDivision1);
            List<CalculatedMatch> x2 = RoundRobin(weeks, teamsinDivision2);
         
            foreach (var item in x2)
            {
                item.Rink += teamsinDivision1/2;
                item.Team1 += teamsinDivision1;
                item.Team2 += teamsinDivision1;
                x1.Add(item);
            }
            return x1;
        }

      
        
    }

    public class CalculatedMatch
    {
        public int Week;
        public int Rink;
        public int Team1;
        public int Team2;

    }
}