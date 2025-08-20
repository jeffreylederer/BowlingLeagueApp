using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Fluent;
using QuestPDF.Infrastructure;
using ReactType1.Server.Code;
using ReactType1.Server.DTOs.Match;
using ReactType1.Server.Models;
using System.Net;
using System.Net.NetworkInformation;
using System.Text;

// https://medium.com/@hassanjabbar2017/performing-crud-operations-using-react-with-net-core-a-step-by-step-guide-0176efa86934
namespace ReactType1.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MatchesController(DbLeagueApp context, IConfiguration configuration) : ControllerBase
    {
        private readonly DbLeagueApp _context = context;
        private readonly IConfiguration _configuration = configuration;


        // GET: Matches
        [HttpGet("{id}")]
        public async Task<IEnumerable<OneMatchWeekView>?> Get(int id)
        {
            var list = await _context.OneMatchWeekViews
                     .FromSql($"EXEC OneMatchWeek {id}")
                    .ToListAsync();
            return list;
        }


        

        // GET: Matches
        [HttpGet("GetOneMatch/{id}")]
        public async Task<OneMatchView> GetOneMatch(int id)
        {
            var list = await _context.OneMatchViews
                     .FromSql($"EXEC OneMatch {id}").ToListAsync();
            var item = list[0];

            if (item == null)
            {
                throw new Exception("Match not found");
            }
            return item;
        }

     


        // GET: Matches
        [HttpGet("GetAllMatches/{id}")]
        public int GetAllMatches(int id)
        {
            var query = from m in _context.Matches
                        join s in _context.Schedules
                        on m.WeekId equals s.Id
                        where s.Leagueid == id && m.Rink != -1
                        select new
                        {
                            m.Id
                        };
            var list = query.ToListAsync();
            var list1 = list.Result;
            return list1.Count;
        }

       

        // GET: Matches
        [HttpGet("Reorder{id}")]
        public async Task<ActionResult<IEnumerable<OneMatchWeekView>>> GetReorder(int id)
        {
            var match = await _context.Matches.FindAsync(id);
            if (match == null)
                return StatusCode(400, "could not find a match");
            var weekMatches = _context.Matches.Where(x => x.WeekId == match.WeekId);
            var match1 = weekMatches.First(x => x.Rink == match.Rink - 1);
            match1.Rink = match.Rink;
            match.Rink = match1.Rink - 1;
            _context.Entry(match).State = EntityState.Modified;
            try
            {
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }


            return Ok(weekMatches);
        }

        // GET: Matches
        [HttpGet("Byes/{id}")]
        public async Task<ActionResult<string>> Byes(int id)
        {

            QuestPDF.Settings.License = LicenseType.Community;
            var report = new ByesReport();
            var site = _configuration.GetValue<string>("SiteInfo:clubname") ?? "Unknown club";
            var document = await report.CreateDocument(id, _context, site);
            byte[] pdfBytes = document.GeneratePdf();
            var results = Convert.ToBase64String(pdfBytes);
            return Ok(results);
        }

        // GET: Matches/Details/5
        [HttpGet("getOne/{id}")]
        public OneMatchWeekView? Get(int? id)
        {
            if (id == null)
            {
                return null;
            }
            try
            {
                SqlParameter[] parameters = [
                    new("matchid", id)
                ];
                var match = _context.OneMatchWeekViews
                         .FromSqlRaw("EXEC OneMatch @matchid", parameters)
                         .AsEnumerable()
                         .FirstOrDefault();
                if (match == null)
                {
                    return null;
                }
                return match;
            }
            catch (Exception)
            {

            }
            return null;
        }


        [HttpPut("{id}")]
        public async Task<ActionResult<MatchType>> Edit(int id, MatchType item)
        {
            if (id != item.Id)
            {
                return BadRequest();
            }

            var match = _context.Matches.Find(id);
            if (match == null)
            {
                return NotFound();
            }
            if(item.Version != match.Version)
            {
                return StatusCode(409, "Match has been updated by another user");
            }
            match.Team1Score = item.Team1Score;
            match.Team2Score = item.Team2Score;
            match.ForFeitId = item.Forfeit;
            match.Version = item.Version + 1;


            _context.Entry(match).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(item);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MatchExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }

        




        // GET: Players/Details/5
        [HttpGet("Standings/{id}")]
        public async Task<ActionResult<string>> Standings(int? id)
        {
            if (id == null)
            {
                return StatusCode(500, "Bad value");
            }
            Schedule? schedule = _context.Schedules.Find(id);
            League? league = _context.Leagues.Find(schedule?.Leagueid);
            QuestPDF.Settings.License = LicenseType.Community;
            string results = "";
            if (league != null && league.PointsCount)
            {
                var report = new StandingsReport();
                var site = _configuration.GetValue<string>("SiteInfo:clubname") ?? "Unknown club";
                var document = await report.CreateDocument(id.Value, _context, site);
                byte[] pdfBytes = document.GeneratePdf();
                results = Convert.ToBase64String(pdfBytes);
            }
            else
            {

                var report = new StandingsNoPoinrsReport();
                var site = _configuration.GetValue<string>("SiteInfo:clubname") ?? "Unknown club";
                var document = report.CreateDocument(id.Value, _context, site);
                byte[] pdfBytes1 = document.GeneratePdf();
                results = Convert.ToBase64String(pdfBytes1);
            }
            return Ok(results);
        }

        [HttpGet("ScoreCard/{id}")]
        public async Task<ActionResult<string>> ScoreCard(int? id)
        {
            if (id == null)
            {
                return StatusCode(500, "Bad value");
            }
            QuestPDF.Settings.License = LicenseType.Community;
            var site = _configuration.GetValue<string>("SiteInfo:clubname") ?? "Unknown club";
            var report = new ScorecardReport();
            var document = await report.CreateDocument(id.Value, _context, site);
            byte[] pdfBytes = document.GeneratePdf();
            var results = Convert.ToBase64String(pdfBytes);
            return Ok(results);
        }

        [HttpGet("ScheduleReport/{id}")]
        public async Task<ActionResult<string>> ScheduleReport(int? id)
        {
            if (id == null)
            {
                return StatusCode(500, "Bad value");
            }
            QuestPDF.Settings.License = LicenseType.Community;
            var site = _configuration.GetValue<string>("SiteInfo:clubname") ?? "Unknown club";
            var report = new ScheduleReport();
            try
            {
                var document = await report.CreateDocument(id.Value, _context, site);
                byte[] pdfBytes = document.GeneratePdf();
                var results = Convert.ToBase64String(pdfBytes);
                return Ok(results);
            }
            catch (Exception ex)
            {
                return StatusCode(400, ex.Message);
            }
        }

        

       

        [HttpGet("ClearSchedule/{id}")]
        public async Task<ActionResult<string>> ClearSchedule(int? id)
        {
            if (id == null)
            {
                return StatusCode(500, "Bad value");
            }

            var list = _context.Matches
             .Join(
                  _context.Schedules,
                  match => match.WeekId,
                  schedule => schedule.Id,
                  (match, schedule) => new
                  {
                      match.Id,
                      schedule.Leagueid,
                      score = match.Team2Score + match.Team1Score + match.ForFeitId,
                      match.Rink
                  }
                )
              .Where(x => x.Leagueid == id)
             .ToList();

            if (list.Count == 0)
                return Ok("Cleared matches");

            if (list.Any(x => x.score > 0))
            {
                return "Matches cannot be delete, some matches have scores";
            }

            try
            {

                foreach (var item in list)
                {
                    Match? match = await _context.Matches.FindAsync(item.Id);
                    if (match != null)
                    {
                        _context.Matches.Remove(match);
                    }
                }


                await _context.SaveChangesAsync();
            }
            catch (Exception e)
            {
                return $"Matches were not removed, Error: {e.Message}";
            }

            return Ok("Cleared matches");
        }

        [HttpGet("CreateSchedule/{id}")]
        public async Task<ActionResult<string>> CreateSchedule(int? id)
        {
            if (id == null)
            {
                return StatusCode(500, "Bad value");
            }

            var league = _context.Leagues.Find(id);
            var weeks = _context.Schedules.Where(x => x.Leagueid == id && !x.PlayOffs).ToList();
            var teams = _context.Teams.Where(x => x.Leagueid == id).ToList();
            if (weeks.Count == 0)
            {
                return "No weeks scheduled";
            }
            if (teams.Count == 0)
            {
                return "No teams have been created";
            }
            var list = await _context.TotalScoreViews
                    .FromSql($"EXEC TotalScore {id}")
                   .ToListAsync();
            if (list.Count > 0)
            {
                return "Matches exist, clear schedule first";
            }

            var sl = new CreateScheduleList();
            List<CalculatedMatch> matches = [];
            if (league?.Divisions == 1)
            {
                matches = sl.RoundRobin(weeks.Count, teams.Count);
            }
            else
            {
                matches = sl.matchesWithDivisions(weeks.Count, _context, id.Value);
            }


            foreach (var item in matches)
            {
                var TeamNo1 = teams.Find(x => x.TeamNo == item.Team1 + 1);
                var TeamNo2 = teams.Find(x => x.TeamNo == item.Team2 + 1);
                var match = new Match()
                {
                    WeekId = weeks[item.Week].Id,
                    Rink = item.Rink,
                    TeamNo1 = TeamNo1 == null ? 0 : TeamNo1.Id,
                    TeamNo2 = TeamNo2 == null ? 0 : TeamNo2.Id,
                    Team1Score = 0,
                    Team2Score = 0,
                    ForFeitId = 0,
                    Version = 1
                };
                _context.Matches.Add(match);
            }


            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception e)
            {
                return $"Could not create matches: {e.Message}";
            }
            return Ok("Created matches");

        }


        private bool MatchExists(int id)
        {
            return _context.Matches.Any(e => e.Id == id);
        }
    }

    public class MatchType
    {
        public int Id { get; set; }
        public int Team1Score { get; set; }
        public int Team2Score { get; set; }
        public int Forfeit { get; set; }
        public int Version { get; set; }

    }

    public class UpdateMatchDto
    {
        public int Id { get; set; }
        public int TeamNo1 { get; set; }
        public int? TeamNo2 { get; set; }

    }

    public class CreeateMatchDto
    {
        public int WeekId { get; set; }
        public int TeamNo1 { get; set; }
        public int? TeamNo2 { get; set; }
        public int Rink { get; set; }

    }

}
