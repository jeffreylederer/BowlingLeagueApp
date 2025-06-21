using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using ReactType1.Server.Models;
using ReactType1.Server.Code;
using System.Data.Common;
using QuestPDF.Fluent;

// https://medium.com/@hassanjabbar2017/performing-crud-operations-using-react-with-net-core-a-step-by-step-guide-0176efa86934
namespace ReactType1.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlayersController(DbLeagueApp context) : ControllerBase
    {
        private readonly DbLeagueApp _context = context;

        // GET: Players
        [HttpGet("{id}")]
        public async Task<IEnumerable<PlayerMembership>> Get(int? id)
        {
            var list = await (
                from a in _context.Players
                join b in _context.Memberships on a.MembershipId equals b.Id
                where(a.Leagueid == id)
                select new PlayerMembership()
                {
                    id = a.Id,
                    FullName = b.FullName,
                    LastName = b.LastName
                })
                .OrderBy(x=>x.LastName)
                .ToListAsync();
  
            return list;
        }

        // GET: Players/Details/5
        [HttpGet("getOne/{id}")]
        public async Task<PlayerMembership?> GetOne(int? id)
        {
            if (id == null)
            {
                return null;
            }

            var Player = await (
                from a in _context.Players
                join b in _context.Memberships on a.MembershipId equals b.Id
                where (a.Id == id)
                select new PlayerMembership()
                {
                    id = a.Id,
                    FullName = b.FullName,
                    LastName = b.LastName
                })
                .OrderBy(x => x.LastName)
                .FirstOrDefaultAsync();
            if (Player == null)
            {
                return null;
            }

            return Player;
        }

      

        // GET: Players/Details/5
        [HttpGet("getMembers/{id}")]
        public async Task<IEnumerable<Membership>> GetMembers(int? id)
        {
            var players = await _context.Players
                .Where(x=>x.Leagueid == id)
                .ToListAsync();
            var list = new List<Membership>();
            foreach (var member in _context.Memberships)
            {
                if (!players.Any(x => x.MembershipId == member.Id && x.Leagueid == id))
                    list.Add(member);
            }
            list.Sort((a,b)=>a.LastName.CompareTo(b.LastName));
            return list;
        }


        [HttpPost]
        public async Task<ActionResult<CreateType>> Create(CreateType item)
        {
            var player = new Player()
            {
                Leagueid = item.leagueid,
                MembershipId = item.membershipId
            };
            _context.Players.Add(player);
            await _context.SaveChangesAsync();
            return Ok(item);           
        }


        // GET: Players/Delete/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _context.Players.FindAsync(id);
            if (item == null)
            {
                return NotFound();
            }

            _context.Players.Remove(item);
            try
            {
                await _context.SaveChangesAsync();
                return Ok(item);
            }
            catch(DbUpdateException )
            {
                return StatusCode(409, "Player cannot be deleted, the player is already on a team.");
            }
            catch(Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }
        
    }

    public class CreateType
    {
        public int leagueid { get; set; }
        public int membershipId { get; set; }
    }
}
