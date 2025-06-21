using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactType1.Server.Models;


namespace ReactType1.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LeaguesController(DbLeagueApp context) : ControllerBase
    {
        private readonly DbLeagueApp _context = context;

        // GET: Leagues
        [HttpGet]
        public async Task<IEnumerable<League>?> Get()
        {
            try
            {
                var list = await _context.Leagues
                    .ToArrayAsync();
                return list;
            }
            catch(Exception)
            {
                return null;
            }
        }



        // GET: Leagues/Details/5
        [HttpGet("{id}")]
        public async Task<League?> Details(int? id)
        {
            if (id == null)
            {
                return null;
            }

            var league = await _context.Leagues.FindAsync(id.Value);
            if (league == null)
            {
                return null;
            }
            return league;

        }

        // GET: Leagues/Create
        [HttpPost]
        public async Task<ActionResult<League>> Create(League item)
        {
            try
            {
                _context.Leagues.Add(item);
                await _context.SaveChangesAsync();
            }
            catch(Exception ex)
            {
                return StatusCode(500, ex.Message); ;
            }
            return Ok(item);

        }

        // GET: Leagues/Edit/5
        [HttpPut("{id}")]
        public async Task<ActionResult<League>> Edit(int id, League item)
        {
            if (id != item.Id)
            {
                return BadRequest();
            }

            _context.Entry(item).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LeagueExists(id))
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

        // GET: Leagues/Delete/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<League>> Delete(int id)
        {
            var item = await _context.Leagues.FindAsync(id);
            if (item == null)
            {
                return NotFound();
            }

            _context.Leagues.Remove(item);
            try
            {
                await _context.SaveChangesAsync();
                return Ok(item);
            }
            catch (DbUpdateException )
            {
                return StatusCode(409, "This league cannot be deleted, it has players and game dates assigned.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }



        private bool LeagueExists(int id)
        {
            return _context.Leagues.Any(e => e.Id == id);
        }
    }
}
