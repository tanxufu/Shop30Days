using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopAPI.Models;

namespace ShopAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private ShopAPIContext _context;

        public UsersController(ShopAPIContext _ShopAPIContext)
        {
            _context = _ShopAPIContext;
        }

        //---------- Users ----------
        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _context.Users.ToListAsync();
            return Ok(users);
        }

        //---------- getUser -------------
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        //---------- Login ----------
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
        {
            if (loginRequest == null || string.IsNullOrEmpty(loginRequest.Email) || string.IsNullOrEmpty(loginRequest.Password))
            {
                return BadRequest("Không hợp lệ");
            }

            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginRequest.Email);

                if (user == null)
                {
                    return NotFound("Email không tồn tại");
                }

                if (user.Password != loginRequest.Password)
                {
                    return Unauthorized("Mật khẩu không chính xác");
                }

                user.Password = null;

                return Ok( user);
            }
            catch (Exception ex)
            {            
                return StatusCode(500, $"Lỗi đăng nhập thất bại: {ex.Message}");
            }
        }

        //---------- Register ----------
        [HttpPost("register")]
        public async Task<IActionResult> PostUsers([FromBody] UserRegistrationRequest userRequest)
        {            
            if (string.IsNullOrEmpty(userRequest.Name) 
                || string.IsNullOrEmpty(userRequest.Email) 
                || string.IsNullOrEmpty(userRequest.PhoneNumber)
                || string.IsNullOrEmpty(userRequest.Password) 
                || string.IsNullOrEmpty(userRequest.ConfirmPassword)
                )
            {
                return BadRequest("Không hợp lệ");
            }

            var existingEmail = await _context.Users.FirstOrDefaultAsync(u => u.Email == userRequest.Email);
            if (existingEmail != null)
            {
                return BadRequest(new { field = "email", message = "Email đã được sử dụng" });
            }

            if (userRequest.Password != userRequest.ConfirmPassword)
            {
                return BadRequest("Xác nhận mật khẩu không chính xác");
            }

            var newUser = new User
            {
                Name = userRequest.Name,
                Email = userRequest.Email,
                Password = userRequest.Password,
                PhoneNumber = userRequest.PhoneNumber,
                TypeAccount = "cs", 
                City = "Chưa đăng ký", 
                District = "Chưa đăng ký", 
                Ward = "Chưa đăng ký", 
                HouseNumber = "Chưa đăng ký", 
                BarcodeNumber = "Chưa tạo" 
            };

            try
            {
                await _context.Users.AddAsync(newUser);
                await _context.SaveChangesAsync();
                                
                newUser.Password = null;

                return Ok(newUser);
            }
            catch (Exception ex)
            {                
                return StatusCode(500, $"Lỗi đăng ký thất bại: {ex.Message}");
            }
        }

        //---------- Change Pass ----------
        [HttpPut("changePassword")]
        public async Task<IActionResult> ForgotPassword([FromBody] ChangePasswordRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.Email)
                                || string.IsNullOrEmpty(request.NewPassword) 
                                || string.IsNullOrEmpty(request.ConfirmNewPassword)
                                )
            {
                return BadRequest("Không hợp lệ");
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
            {
                return BadRequest("Email không tồn tại" );
            }


            if (request.NewPassword != request.ConfirmNewPassword)
            {
                return BadRequest("Xác nhận mật khẩu không chính xác");
            }

            try
            {
                user.Password = request.NewPassword;

                _context.Users.Update(user);
                await _context.SaveChangesAsync();

                return Ok("Đổi mật khẩu thành công");
            } catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi đăng ký thất bại: {ex.Message}");
            }
            
        }

        //---------- Change Phone ----------
        [HttpPut("updatePhoneNumber/{userId}")]
        public async Task<IActionResult> UpdatePhoneNumber(int userId, [FromBody] UpdatePhoneNumberRequest request)
        {
            if (string.IsNullOrEmpty(request.PhoneNumber))
            {
                return BadRequest("Không hợp lệ");
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound("Không tìm thấy người dùng");
            }

            user.PhoneNumber = request.PhoneNumber;

            try
            {
                await _context.SaveChangesAsync();
                return Ok("Số điện thoại đã được cập nhật");
            }
            catch (Exception ex)
            {
                
                return StatusCode(500, $"Lỗi đăng ký thất bại: {ex.Message}");
            }
        }


        //---------- Update Address ----------
        [HttpPut("updateAddress/{userId}")]
        public async Task<IActionResult> UpdateAddress(int userId, [FromBody] UpdateAddressRequest request)
        {
            if (string.IsNullOrEmpty(request.City)
                || string.IsNullOrEmpty(request.District)
                || string.IsNullOrEmpty(request.Ward)
                || string.IsNullOrEmpty(request.HouseNumber))
            {
                return BadRequest("Không hợp lệ");
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound("Không tìm thấy người dùng");
            }

            user.City = request.City;
            user.District = request.District;
            user.Ward = request.Ward;
            user.HouseNumber = request.HouseNumber;

            try
            {
                await _context.SaveChangesAsync();
                return Ok("Địa chỉ đã được cập nhật");
            }
            catch (Exception ex)
            {
                
                return StatusCode(500, $"Lỗi đăng ký thất bại: {ex.Message}");
            }
        }

    }
    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
    public class UserRegistrationRequest
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
    }
    public class ChangePasswordRequest
    {
        public string Email { get; set; }
        public string NewPassword { get; set; }
        public string ConfirmNewPassword { get; set; }
    }
    public class UpdatePhoneNumberRequest
    {
        public string PhoneNumber { get; set; }
    }

    
    public class UpdateAddressRequest
    {
        public string City { get; set; }
        public string District { get; set; }
        public string Ward { get; set; }
        public string HouseNumber { get; set; }
    }
}
