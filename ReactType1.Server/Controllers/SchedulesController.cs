using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using ReactType1.Server.Code;
using ReactType1.Server.Models;

// https://medium.com/@hassanjabbar2017/performing-crud-operations-using-react-with-net-core-a-step-by-step-guide-0176efa86934
namespace ReactType1.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SchedulesController(DbLeagueApp context) : ControllerBase
    {
        private readonly DbLeagueApp _context = context;

        // GET: Schedules
        [HttpGet("{id}")]
        public async Task<IEnumerable<ScheduleType>> Get(int id)
        {
            var list = await _context.Schedules.Where(x => x.Leagueid == id).ToListAsync();
            list.Sort((a, b) => a.GameDate.CompareTo(b.GameDate));
            List<ScheduleType> newList = new();
            foreach (var item in list)
            {
                var sch = new ScheduleType()
                {
                    Leagueid = item.Leagueid,
                    PlayOffs = item.PlayOffs,
                    Id = item.Id,
                    GameDate = item.GameDate.ToShortDateString(),
                    Cancelled = item.Cancelled
                };
                newList.Add(sch);
            }
            return newList;
        }

        // GET: Schedules/Details/5
        [HttpGet("getOne/{id}")]
        public async Task<ScheduleType?> GetOne(int? id)
        {
            if (id == null)
            {
                return null;
            }
            
            var schedule = await _context.Schedules.FindAsync(id.Value);
            if (schedule == null)
            {
                return null;
            }
            var sch = new ScheduleType()
            {
                Leagueid = schedule.Leagueid,
                PlayOffs = schedule.PlayOffs,
                Id = schedule.Id,
                GameDate = schedule.GameDate.ToShortDateString(),
                Cancelled = schedule.Cancelled

            };
            return sch;
        }


        [HttpPost]
        public async Task<ActionResult<ScheduleTypeCreate>> Create(ScheduleTypeCreate item)
        {
            var schedule = new Schedule()
            {
               
                GameDate = DateOnly.Parse(item.GameDate),
                Cancelled = item.Cancelled,
                PlayOffs = item.PlayOffs,
                Leagueid = int.Parse(item.Leagueid)
            };
            _context.Schedules.Add(schedule);
           
            await _context.SaveChangesAsync();

            return item;
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ScheduleType>> Edit(int id, ScheduleType item)
        {
            if (id != item.Id)
            {
                return BadRequest();
            }

            var schedule = new Schedule()
            {
                Id = item.Id,
                GameDate = DateOnly.Parse(item.GameDate?? DateTime.Now.ToString()),
                Cancelled = item.Cancelled,
                PlayOffs = item.PlayOffs,
                Leagueid = item.Leagueid
            };

            _context.Entry(schedule).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ScheduleExists(id))
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


        // GET: Schedules/Delete/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<ScheduleType>> Delete(int id)
        {
            var item = await _context.Schedules.FindAsync(id);
            if (item == null)
            {
                return NotFound();
            }

            _context.Schedules.Remove(item);
            try
            {
                await _context.SaveChangesAsync();
                return Ok(item);
            }
            catch (DbUpdateException)
            {
                return StatusCode(409, "This game date cannot be deleted, this game date has matches assigned.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }

        private bool ScheduleExists(int id)
        {
            return _context.Schedules.Any(e => e.Id == id);
        }
    }

    public partial class ScheduleType
    {
        public int Id { get; set; }

        public required string GameDate { get; set; }

        public int Leagueid { get; set; }

        public bool Cancelled { get; set; }

        public bool PlayOffs { get; set; }
    }

    public partial class ScheduleTypeCreate
    {
        public required string GameDate { get; set; }

        public required string Leagueid { get; set; }

        public bool Cancelled { get; set; }

        public bool PlayOffs { get; set; }
    }
}
