using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Fluent;
using QuestPDF.Infrastructure;
using ReactType1.Server.Code;
using ReactType1.Server.DTOs.Admin;
using ReactType1.Server.Models;
using System.Collections.Generic;
using static QuestPDF.Helpers.Colors;




// https://medium.com/@hassanjabbar2017/performing-crud-operations-using-react-with-net-core-a-step-by-step-guide-0176efa86934
namespace ReactType1.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TeamsController(DbLeagueApp context, IConfiguration configuration) : ControllerBase
    {
        private readonly DbLeagueApp _context = context;
        private readonly IConfiguration _configuration = configuration;

        // GET: Teams
        [HttpGet("{id}")]
        public async Task<IEnumerable<TeamMember>> Get(int id)
        {
            var list = await _context.TeamMembers
                     .FromSql($"EXEC TeamAllowDelete {id}")
                    .ToListAsync();
            
            return list;
        }

        // GET: Players/Details/5
        [HttpGet("NotOnTeam/{id}")]
        public async Task<IEnumerable<Membership>> NotOnTeam(int id)
        {
            List<Membership> list = await _context.Memberships
                     .FromSql($"EXEC NotOnTeam {id}")
                    .ToListAsync();
            list.Sort((a, b) => a.LastName.CompareTo(b.LastName));
            return list;
        }

        // GET: Teams/Details/5
        [HttpGet("getOne/{id}")]
        public OneTeamView? GetOne(int? id)
        {
            if (id == null)
            {
                return null;
            }

            try
            {
                Microsoft.Data.SqlClient.SqlParameter[] parameters = [
                    new ("teamid", id)
                ];
                var team = _context.OneTeamViews
                         .FromSqlRaw("EXEC OneTeamFullname @teamid", parameters)
                         .AsEnumerable()
                         .FirstOrDefault();
                         

                if (team == null)
                {
                    return null;
                }
                
                return team;
            }
            catch (Exception ex)
            {
                var message = ex.Message;
            }
            return null;
        }

        // GET: Players/Details/5
        [HttpGet("TeamReport/{id}")]
        public async Task<ActionResult<string>> TeamReport(int? id)
        {
            if (id == null)
            {
                return StatusCode(500, "Bad value");
            }
            QuestPDF.Settings.License = LicenseType.Community;
            string? site = _configuration.GetValue<string>("SiteInfo:clubname");
            var report = new TeamReportDoc();
            var document = await report.CreateDocument(id.Value, _context, site ?? "Unknown");
            byte[] pdfBytes = document.GeneratePdf();
            var results = Convert.ToBase64String(pdfBytes);
            return results;
        }


        [HttpPost]
        public async Task<ActionResult<TeamTypeCreate>> Create(TeamTypeCreate item)
        {

            var teamNo = await _context.Teams.Where(x => x.Leagueid == item.Leagueid).CountAsync() + 1;

            var Team = new Team()
            {
                Id = item.Id,
                Skip = item.Skip == 0 ? null : item.Skip,
                ViceSkip = item.ViceSkip == 0 ? null : item.ViceSkip,
                Lead = item.Lead == 0 ? null : item.Lead,
                Leagueid = item.Leagueid,
                TeamNo = teamNo,
                DivisionId = item.DivisionId
            };
            _context.Teams.Add(Team);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch
            {
                return BadRequest();
            }
            await Reorder(item.Leagueid);
            return (item);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<TeamType>> Edit(int id, TeamType item)
        {
            if (id != item.Id)
            {
                return BadRequest();
            }

            var teamNo = _context.Teams.Where(x => x.Leagueid == item.Leagueid).Count()+1;

            var Team = new Team()
            {
                Id = item.Id,
                Skip = item.Skip==0? null:  item.Skip,
                ViceSkip = item.ViceSkip == 0 ? null : item.ViceSkip,
                Lead = item.Lead == 0 ? null : item.Lead,
                Leagueid = item.Leagueid,
                TeamNo = item.TeamNo,
                DivisionId=item.DivisionId
            };

            _context.Entry(Team).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TeamExists(id))
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
            return Ok(item);
        }


        // GET: Teams/Delete/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<TeamType>> Delete(int id)
        {
            var item = await _context.Teams.FindAsync(id);
            if (item == null)
            {
                return NotFound();
            }

            _context.Teams.Remove(item);
            try
            {
                await _context.SaveChangesAsync();
               
            }
            catch (DbUpdateException)
            {
                return StatusCode(409, "Team cannot be deleted, the team is has been assigned to a match.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
            await Reorder(item.Leagueid);
            return Ok(item);

        }

        private bool TeamExists(int id)
        {
            return _context.Teams.Any(e => e.Id == id);
        }

        private async Task<IActionResult> Reorder(int LeagueId)
        {
            var list = await _context.Teams
                .Where(x=>x.Leagueid==LeagueId)
                .OrderBy(x => x.DivisionId)
                .ToListAsync();
            int index = 1;
            foreach (var team in list)
            {
                team.TeamNo = index++;
                _context.Entry(team).State = EntityState.Modified;
            }
            try
            {
                await _context.SaveChangesAsync();
            }
            catch 
            {
                return BadRequest();
            }
            return Ok();
        }

        [HttpGet("AllTeamsWithNames/{id}")]
        public async Task<IEnumerable<AllTeamsWithNamesView>> AllTeamsWithNames(int id)
        {
            var list = await _context.AllTeamsWithNamesViews
                     .FromSql($"EXEC AllTeamsWithNames {id}").ToListAsync();
            ;

            if (list == null)
            {
                throw new Exception("Teams not found");
            }
            return list;
        }
    }

    public partial class TeamType
    {
        public int Id { get; set; }

        public int? Skip { get; set; }

        public int? ViceSkip { get; set; }

        public int? Lead { get; set; }

        public int Leagueid { get; set; }

        public int TeamNo { get; set; }

        public short DivisionId { get; set; }
    }

    public partial class TeamTypeCreate
    {
        public int Id { get; set; }

        public int? Skip { get; set; }

        public int? ViceSkip { get; set; }

        public int? Lead { get; set; }

        public int Leagueid { get; set; }

        public int TeamNo { get; set; }

        public short DivisionId { get; set; }
    }
}
