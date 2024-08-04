using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ShopAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace ShopAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BankCardController : ControllerBase
    {
        private ShopAPIContext _context;

        public BankCardController(ShopAPIContext _ShopAPIContext)
        {
            _context = _ShopAPIContext;
        }

        [HttpPost("addbankCard/{userId}")]
        [Consumes("application/json")]
        public async Task<ActionResult<BankCard>> PostBankCard(int userId, [FromBody] BankCardRequest request)
        {
         
            if (string.IsNullOrEmpty(request.CardNumber)
                || string.IsNullOrEmpty(request.CardholderName)
                || string.IsNullOrEmpty(request.ExpiryDate)
                || string.IsNullOrEmpty(request.Cvv)
                || string.IsNullOrEmpty(request.BankName))
            {
                return BadRequest("Thông tin không hợp lệ");
            }          

            
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound("Không tìm thấy người dùng");
            }

            var existingBankCard = await _context.BankCards.FirstOrDefaultAsync(bc => bc.UserId == userId);

            if (existingBankCard != null)
            {
                // Cập nhật thẻ ngân hàng hiện tại
                existingBankCard.CardNumber = request.CardNumber;
                existingBankCard.CardholderName = request.CardholderName;
                existingBankCard.ExpiryDate = request.ExpiryDate;
                existingBankCard.Cvv = request.Cvv;
                existingBankCard.BankName = request.BankName;

                _context.BankCards.Update(existingBankCard);

                // Thay đổi đối tượng DTO với thông tin từ thẻ ngân hàng hiện tại
                var bankCardDto = new BankCardDto
                {
                    UserId = (int)existingBankCard.UserId,
                    CardId = existingBankCard.CardId,
                    CardNumber = existingBankCard.CardNumber,
                    CardholderName = existingBankCard.CardholderName,
                    ExpiryDate = existingBankCard.ExpiryDate,
                    Cvv = existingBankCard.Cvv,
                    BankName = existingBankCard.BankName
                };

                try
                {
                    await _context.SaveChangesAsync();
                    return Ok(bankCardDto);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Lỗi đăng ký thất bại: {ex.Message}");
                }
            }
            else
            {
                // Thêm thẻ ngân hàng mới
                var newBankCard = new BankCard
                {
                    UserId = userId,
                    CardNumber = request.CardNumber,
                    CardholderName = request.CardholderName,
                    ExpiryDate = request.ExpiryDate,
                    Cvv = request.Cvv,
                    BankName = request.BankName,
                };

                _context.BankCards.Add(newBankCard);

                try
                {
                    await _context.SaveChangesAsync();

                    var bankCardDto = new BankCardDto
                    {
                        UserId = (int)newBankCard.UserId,
                        CardId = newBankCard.CardId,
                        CardNumber = newBankCard.CardNumber,
                        CardholderName = newBankCard.CardholderName,
                        ExpiryDate = newBankCard.ExpiryDate,
                        Cvv = newBankCard.Cvv,
                        BankName = newBankCard.BankName
                    };

                    return Ok(bankCardDto);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Lỗi đăng ký thất bại: {ex.Message}");
                }
            }
        }

        //----------- get Card -----------
        [HttpGet("getbankCard/{userId}")]
        public async Task<ActionResult<IEnumerable<BankCardDto>>> GetBankCard(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound("Không tìm thấy người dùng");
            }

            try
            {
                var bankCards = _context.BankCards
                .Where(bc => bc.UserId == userId)
                .Select(bc => new BankCardDto
                {
                    UserId = (int)bc.UserId,
                    CardId = bc.CardId,
                    CardNumber = bc.CardNumber,
                    CardholderName = bc.CardholderName,
                    ExpiryDate = bc.ExpiryDate,
                    Cvv = bc.Cvv,
                    BankName = bc.BankName
                })
                .ToList();

                var response = new
                {
                    bankCards = bankCards
                };

                return Ok(response);
            } catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi lấy thất bại: {ex.Message}");
            }
        }
    }

    public class BankCardRequest
    {
        public string CardNumber { get; set; }
        public string CardholderName { get; set; }
        public string ExpiryDate { get; set; }
        public string Cvv { get; set; }
        public string BankName { get; set; }
    }

    public class BankCardDto
    {
        public int UserId { get; set; }
        public int CardId { get; set; }
        public string CardNumber { get; set; }
        public string CardholderName { get; set; }
        public string ExpiryDate { get; set; }
        public string Cvv { get; set; }
        public string BankName { get; set; }
    }
}
