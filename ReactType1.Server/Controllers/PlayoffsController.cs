using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Fluent;
using QuestPDF.Infrastructure;
using ReactType1.Server.Code;
using ReactType1.Server.DTOs.Match;
using ReactType1.Server.Models;

namespace ReactType1.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlayoffsController(DbLeagueApp context, IConfiguration configuration) : ControllerBase
    {
        private readonly DbLeagueApp _context = context;
        private readonly IConfiguration _configuration = configuration;




        [HttpGet("{id}")]
        public async Task<IEnumerable<PlayoffGamesView?>> Get(int id)
        {
            var list = await _context.PlayoffGamesViews
                     .FromSql($"EXEC PlayoffGames {id}").ToListAsync();

            return list;
        }

        [HttpPost]
        public async Task<ActionResult<CreateMatchDto>> Create(IEnumerable<CreateMatchDto> list)
        {
            var listItem = list.FirstOrDefault();
            if (listItem != null && _context.Matches.Any(x => x.WeekId == listItem.WeekId))
            {
                return BadRequest(new { error = "Matches already exixts.", code = 400 });
            }
            foreach (var item in list)
            {
                var match = new Match()
                {
                    WeekId = item.WeekId,
                    Rink = item.Rink,
                    TeamNo1 = item.TeamNo1,
                    TeamNo2 = item.TeamNo2,
                    Team1Score = 0,
                    Team2Score = 0,
                    ForFeitId = 0
                };
                _context.Matches.Add(match);
            }
            await _context.SaveChangesAsync();
            return Ok(list);
        }


        [HttpGet("GameReport/{id}")]
        public async Task<ActionResult<string>> GameReport(int? id)
        {
            if (id == null)
            {
                return StatusCode(500, "Bad value");
            }
            QuestPDF.Settings.License = LicenseType.Community;
            var site = _configuration.GetValue<string>("SiteInfo:clubname") ?? "Unknown club";
            var report = new GameReport();
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

        [HttpGet("PlayoffResults/{id}")]
        public async Task<ActionResult<string>> PlayoffResults(int? id)
        {
            if (id == null)
            {
                return StatusCode(500, "Bad value");
            }
            QuestPDF.Settings.License = LicenseType.Community;
            var site = _configuration.GetValue<string>("SiteInfo:clubname") ?? "Unknown club";
            var report = new PlayoffResults();
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

        [HttpPut()]
        public async Task<ActionResult<UpdateMatchDto>> Update([FromBody] List<UpdateMatchDto> items)
        {
            foreach (var item in items)
            {
                var match = await _context.Matches.FindAsync(item.Id);
                if (match == null)
                {
                    return NotFound($"Match with ID {item.Id} not found.");
                }
                match.TeamNo1 = item.TeamNo1;
                match.TeamNo2 = item.TeamNo2 ?? 0; // Handle nullable TeamNo2
                _context.Entry(match).State = EntityState.Modified;
            }
            _context.SaveChanges();
            return Ok(items);
        }

        // GET: Matches
        [HttpGet("GetMatchesForUpdate/{id}")]
        public async Task<IEnumerable<UpdateMatchDto>?> GetMatchesForUpdate(int id)
        {
            var list = await _context.Matches
                     .Where(x => x.WeekId == id && x.Rink != -1)
                     .Select(x => new UpdateMatchDto
                     {
                         Id = x.Id,
                         TeamNo1 = x.TeamNo1,
                         TeamNo2 = x.TeamNo2
                     })
                     .ToListAsync();
            return list;
        }

        // GET: Matches
        [HttpGet("PlayoffGames/{id}")]
        public async Task<IEnumerable<PlayoffGamesView?>> PlayoffGames(int id)
        {
            var list = await _context.PlayoffGamesViews
                     .FromSql($"EXEC PlayoffGames {id}").ToListAsync();

            return list;
        }
    }




}
