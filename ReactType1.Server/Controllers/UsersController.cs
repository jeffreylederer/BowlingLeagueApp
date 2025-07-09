using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactType1.Server.Code;
using ReactType1.Server.DTOs;
using ReactType1.Server.Models;
using System.Data;



namespace ReactType1.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController(DbLeagueApp context) : ControllerBase
    {
        private readonly DbLeagueApp _context = context;

        // GET: Users
        [HttpGet]
        public async Task<IEnumerable<DTOUserRoleDetails>> Get()
        {
            var newList = new List<DTOUserRoleDetails>();  
            try
            {
                var list = await _context.Users.ToListAsync();
                foreach (var user in list)
                {
                    var item = new DTOUserRoleDetails()
                    {
                        Id= user.Id,
                        IsActive = user.IsActive,
                        UserName = user.Username,
                        DisplayName = user.DisplayName,
                        RoleId = user.RoleId
                        
                    };
                    switch (user.RoleId)
                    {
                        case 1: item.Role = "Observer"; break;
                        case 2: item.Role = "Scorer"; break;
                        case 3: item.Role = "Admin"; break;
                        case 4: item.Role = "SiteAdmin"; break;
                    }
                 
                    newList.Add(item);
                }
            }
            catch (Exception)
            {
                return newList;
            }
            return newList;
        }



        // GET: Users/Details/5
        [HttpGet("{id}")]
        public async Task<DTOUserRoleDetails?> Details(int? id)
        {
            if (id == null)
            {
                return null;
            }

            var item = await _context.Users.FindAsync(id.Value);
            if (item == null)
            {
                return null;
            }

            var user = new DTOUserRoleDetails()
            {
                Id = id.Value,
                IsActive = item.IsActive,
                UserName = item.Username,
                DisplayName = item.DisplayName,
                RoleId = item.RoleId
            };

            switch (item.RoleId)
            {
                case 1: user.Role = "Observer"; break;
                case 2: user.Role = "Scorer"; break;
                case 3: user.Role = "Admin"; break;
                case 4: user.Role = "SiteAdmin"; break;
            }
            return user;
        }

        // GET: Users/Create
        [HttpPost]
        public async Task<ActionResult<DTOUserRoleCreate>> Create(DTOUserRoleCreate item)
        {
            string password = GetSha256Hash.Encode(item.Password);
            try
            {
                var user = new User()
                {
                    LastLoggedIn = null,
                    SerialNumber = Guid.NewGuid().ToString(),
                    Password = password,
                    IsActive = item.IsActive,
                    Username = item.Username,
                    DisplayName = item.DisplayName,
                    RoleId = item.RoleId
                };
                _context.Users.Add(user);
                await _context.SaveChangesAsync();

               
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
            return Ok(item);

        }

        // GET: Users/Edit/5
        [HttpPut("{id}")]
        public async Task<ActionResult<DTOUserRoleUpdate>> Edit(int id, DTOUserRoleUpdate item)
        {
            if (id != item.Id)
            {
                return BadRequest();
            }

            User? user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            user.IsActive = item.IsActive;
            user.DisplayName = item.DisplayName;
            user.RoleId = item.RoleId;

            _context.Entry(user).State = EntityState.Modified;
           

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
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

        [HttpPut("ChangePassword{id}")]
        public async Task<ActionResult<DTOChangePassword>> ChangePassword(int id, DTOChangePassword item)
        {
            if (id != item.Id)
            {
                return BadRequest();
            }

            User? user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            user.Password= GetSha256Hash.Encode(item.Password);
            _context.Entry(user).State = EntityState.Modified;



            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
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

        // GET: Users/Delete/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _context.Users.FindAsync(id);
            if (item == null)
            {
                return NotFound();
            }

            _context.Users.Remove(item);
            try
            {
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }



        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }

   
}
