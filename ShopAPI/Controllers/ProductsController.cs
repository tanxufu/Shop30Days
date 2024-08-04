using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using ShopAPI.Models;
using System.Collections.Generic;
using System.Linq;

namespace ShopAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private ShopAPIContext _context;

        public ProductsController(ShopAPIContext _ShopAPIContext)
        {
            _context = _ShopAPIContext;
        }

        //---------- Get Danh sách sản phẩm ----------
        [HttpGet]
        public async Task<IActionResult> GetProducts(
                                            [FromQuery] int? page = null,
                                            [FromQuery] int? limit = null,
                                            [FromQuery] int? categoryId = null,
                                            [FromQuery] decimal? minPrice = null,
                                            [FromQuery] decimal? maxPrice = null
            )
        {
            var query = _context.Products.AsQueryable();

            // Lọc theo CategoryId
            if (categoryId.HasValue)
            {
                query = query.Where(p => p.CategoryId == categoryId.Value);
            }

            // Lọc theo khoảng giá
            if (minPrice.HasValue)
            {
                query = query.Where(p => p.Price >= minPrice.Value);
            }
            if (maxPrice.HasValue)
            {
                query = query.Where(p => p.Price <= maxPrice.Value);
            }

            if (page.HasValue && limit.HasValue)
            {
                // Phân trang
                var totalItems = await query.CountAsync();
                var products = await query
                    .Skip((page.Value - 1) * limit.Value)
                    .Take(limit.Value)
                    .ToListAsync();

                var result = new
                {
                    TotalItems = totalItems,
                    Page = page.Value,
                    Limit = limit.Value,
                    Products = products
                };

                return Ok(result);
            }
            else
            {
                // Không phân trang
                var products = await query.ToListAsync();
                return Ok(products);
            }
        }

        //---------- getProduct -------------
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductById(string id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }          

            return Ok(product);
        }

        //---------- updateProduct -------------
        [HttpPut("updateProduct/{id}")]
        public async Task<IActionResult> UpdateProduct(string id, [FromBody] UpdateProductRequest request)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            if (request.Name != "string") product.Name = request.Name;
            if (request.Description != "string") product.Description = request.Description;
            if (request.Price != 0) product.Price = (decimal)request.Price;
            if (request.Stock != 0) product.Stock = (int)request.Stock;
            if (request.ColorHex != "string") product.ColorHex = request.ColorHex;
            if (request.ColorName != "string") product.ColorName = request.ColorName;
            if (request.CategoryId != 0) product.CategoryId = request.CategoryId;
            if (request.ImageUrl != "string") product.ImageUrl = request.ImageUrl;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(product);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Products.Any(p => p.ProductId == id))
                {
                    return NotFound();
                }
                throw;
            }
        }
    }

    public class UpdateProductRequest
    {
        public string Name { get; set; } = null;
        public string Description { get; set; } = null;
        public decimal? Price { get; set; } = null;
        public int? Stock { get; set; } = null;
        public string ColorHex { get; set; } = null;
        public string ColorName { get; set; } = null;
        public int? CategoryId { get; set; } = null;
        public string ImageUrl { get; set; } = null;
    }
}
