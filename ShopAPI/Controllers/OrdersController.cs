using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ShopAPI.Models;

namespace ShopAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private ShopAPIContext _context;

        public OrdersController(ShopAPIContext _ShopAPIContext)
        {
            _context = _ShopAPIContext;            
        }

        //--------------- thêm vào giỏ hàng -------------------
        [HttpPost("add/{userId}")]
        public async Task<IActionResult> AddToCart(int userId, [FromBody] AddToCartRequest request)
        {
            

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "Không tìm thấy người dùng" });
            }

            // Kiểm tra có đơn hàng đang pending chưa
            var existingOrder = await _context.Orders
                .Where(o => o.UserId == userId && o.DeliStatus == "pending")
                .FirstOrDefaultAsync();

            Order order;
            if (existingOrder == null)
            {
                // Nếu không có đơn hàng đang pending, tạo đơn hàng mới
                var currentDate = DateTime.Now;
                var dateString = currentDate.ToString("yyyyMMdd");
                var todayOrderCount = await _context.Orders
                    .CountAsync(o => o.OrderDate.Date == currentDate.Date);
                var newOrderId = $"{dateString}_{todayOrderCount + 1:000}";

                order = new Order
                {
                    OrderId = newOrderId,
                    UserId = userId,
                    OrderDate = currentDate,
                    Quantity = 0, 
                    TotalAmount = 0, 
                    DeliStatus = "pending",
                    PayStatus = false,
                    PaymentMethodId = "cash", // Giả sử mặc định là tiền mặt
                    DeliveryMethodId = "delivery", // Giả sử mặc định là giao hàng
                    BarcodeNumber = null
                };

                _context.Orders.Add(order);
                await _context.SaveChangesAsync();
            }
            else
            {
                order = existingOrder;
            }

            // Lấy giá sản phẩm từ cơ sở dữ liệu
            var productPrice = await GetProductPrice(request.ProductId);

            // Kiểm tra xem sản phẩm đã tồn tại trong OrderItems chưa
            var existingOrderItem = await _context.OrderItems
                .Where(oi => oi.OrderId == order.OrderId && oi.ProductId == request.ProductId)
                .FirstOrDefaultAsync();

            if (existingOrderItem != null)
            {
                // Cập nhật số lượng và giá của sản phẩm trong OrderItem
                existingOrderItem.ProductQuantity += request.Quantity;
                existingOrderItem.Price = existingOrderItem.ProductQuantity * productPrice;
            }
            else
            {
                // Thêm mới OrderItem
                var newOrderItemId = $"{order.OrderId}_{(await _context.OrderItems.CountAsync(oi => oi.OrderId == order.OrderId) + 1):000}";
                var orderItem = new OrderItem
                {
                    OrderItemId = newOrderItemId,
                    OrderId = order.OrderId,
                    ProductId = request.ProductId,
                    ProductQuantity = request.Quantity,
                    Price = request.Quantity * productPrice
                };

                _context.OrderItems.Add(orderItem);
            }

            await _context.SaveChangesAsync();

            // Cập nhật tổng số lượng và tổng số tiền của đơn hàng
            var orderItems = await _context.OrderItems
                .Where(oi => oi.OrderId == order.OrderId)
                .ToListAsync();

            order.Quantity = orderItems.Sum(oi => oi.ProductQuantity);
            order.TotalAmount = orderItems.Sum(oi => oi.Price);

            _context.Orders.Update(order);
            await _context.SaveChangesAsync();

            // Tạo phản hồi
            var response = new OrderResponseDto
            {
                OrderId = order.OrderId,
                Quantity = order.Quantity,
                TotalAmount = order.TotalAmount,
                Items = orderItems.Select(oi => new OrderItemDto
                {
                    OrderItemId = oi.OrderItemId,
                    ProductId = oi.ProductId,
                    ProductQuantity = oi.ProductQuantity,
                    Price = oi.Price
                }).ToList()
            };

            return Ok(response);
        }

        private async Task<decimal> GetProductPrice(string productId)
        {
            var product = _context.Products
                .Where(p => p.ProductId == productId)
                .Select(p => p.Price)
                .FirstOrDefault();

            return product;
        }

        // lấy order pending
        [HttpGet("orders/pending/{userId}")]
        public IActionResult GetPendingOrders(int userId)
        {
            try
            {
                // Lấy danh sách các đơn hàng có trạng thái 'pending'
                var pendingOrders = _context.Orders
                    .Where(o => o.UserId == userId && o.DeliStatus == "pending")
                    .Select(o => new OrderDto
                    {
                        OrderId = o.OrderId,
                        UserId = (int)o.UserId,
                        OrderDate = o.OrderDate,
                        Quantity = o.Quantity,
                        TotalAmount = o.TotalAmount,
                        DeliStatus = o.DeliStatus,
                        PayStatus = (bool)o.PayStatus,
                        PaymentMethodId = o.PaymentMethodId,
                        DeliveryMethodId = o.DeliveryMethodId,
                        BarcodeNumber = o.BarcodeNumber
                    })
                    .ToList();

                if (pendingOrders == null || !pendingOrders.Any())
                {
                    // Tạo phản hồi mặc định
                    var defaultResponse = new PendingOrderResponseDto
                    {
                        OrderId = null,
                        Quantity = 0,
                        TotalAmount = 0,
                        DeliStatus = "no_pending_order",
                        Items = new List<OrderItemWithProductDto>()
                    };

                    return Ok(defaultResponse);
                }

                return Ok(pendingOrders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Lỗi không lấy được: " + ex.Message);
            }
        }

        // Lấy sản phẩm trong order pending
        [HttpGet("pending/{userId}")]
        public async Task<IActionResult> GetPendingOrdersWithItems(int userId)
        {
            try
            {
                // Lấy đơn hàng có trạng thái 'pending'
                var pendingOrder = await _context.Orders
                    .Where(o => o.UserId == userId && o.DeliStatus == "pending")
                    .FirstOrDefaultAsync();

                if (pendingOrder == null)
                {
                    // Tạo phản hồi mặc định
                    var defaultResponse = new PendingOrderResponseDto
                    {
                        OrderId = null,
                        Quantity = 0,
                        TotalAmount = 0,
                        DeliStatus = "no_pending_order",
                        Items = new List<OrderItemWithProductDto>()
                    };

                    return Ok(defaultResponse);
                }

                // Lấy các OrderItem liên quan đến đơn hàng pending
                var orderItems = await _context.OrderItems
                    .Where(oi => oi.OrderId == pendingOrder.OrderId)
                    .Include(oi => oi.Product) 
                    .ToListAsync();

                // Tạo phản hồi
                var response = new PendingOrderResponseDto
                {
                    OrderId = pendingOrder.OrderId,
                    Quantity = pendingOrder.Quantity,
                    TotalAmount = pendingOrder.TotalAmount,
                    DeliStatus = pendingOrder.DeliStatus,
                    Items = orderItems.Select(oi => new OrderItemWithProductDto
                    {
                        OrderItemId = oi.OrderItemId,
                        Product = new ProductDto
                        {
                            ProductId = oi.Product.ProductId,
                            Name = oi.Product.Name,
                            Description = oi.Product.Description,
                            ColorName = oi.Product.ColorName,
                            Price = oi.Product.Price,
                            Stock = oi.Product.Stock,
                            ImageUrl = oi.Product.ImageUrl
                        },
                        ProductQuantity = oi.ProductQuantity,
                        Price = oi.Price
                    }).ToList()
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Lỗi không lấy được: " + ex.Message);
            }
        }

        //--------------- Cập nhật sản phẩm trong giỏ hàng --------------------
        [HttpPut("update/{userId}/{orderItemId}")]
        public async Task<IActionResult> UpdateOrderItemQuantity(int userId, string orderItemId, [FromBody] UpdateOrderItemRequest request)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    return NotFound(new { message = "Không tìm thấy người dùng" });
                }

                var orderItem = await _context.OrderItems
                    .Where(oi => oi.OrderItemId == orderItemId)
                    .FirstOrDefaultAsync();

                if (orderItem == null)
                {
                    return NotFound(new { message = "Không tìm thấy sản phẩm trong giỏ hàng" });
                }

                // Cập nhật số lượng và giá của sản phẩm
                var productPrice = await GetProductPrice(orderItem.ProductId);
                orderItem.ProductQuantity = request.Quantity;
                orderItem.Price = request.Quantity * productPrice;

                await _context.SaveChangesAsync();

                // Cập nhật tổng số lượng và tổng số tiền của đơn hàng
                var order = await _context.Orders
                    .Where(o => o.OrderId == orderItem.OrderId)
                    .FirstOrDefaultAsync();

                if (order != null)
                {
                    var orderItems = await _context.OrderItems
                        .Where(oi => oi.OrderId == order.OrderId)
                        .ToListAsync();

                    order.Quantity = orderItems.Sum(oi => oi.ProductQuantity);
                    order.TotalAmount = orderItems.Sum(oi => oi.Price);

                    _context.Orders.Update(order);
                    await _context.SaveChangesAsync();
                }

                return Ok(new { message = "Cập nhật số lượng sản phẩm thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Lỗi không cập nhật được: " + ex.Message);
            }
        }

        //----------------- Xóa sản phẩm khỏi giỏ hàng ------------------------
        [HttpDelete("remove/{userId}/{orderItemId}")]
        public async Task<IActionResult> RemoveOrderItem(int userId, string orderItemId)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    return NotFound(new { message = "Không tìm thấy người dùng" });
                }

                var orderItem = await _context.OrderItems
                    .Where(oi => oi.OrderItemId == orderItemId)
                    .FirstOrDefaultAsync();

                if (orderItem == null)
                {
                    return NotFound(new { message = "Không tìm thấy sản phẩm trong giỏ hàng" });
                }

                var orderId = orderItem.OrderId;

                // Xóa OrderItem
                _context.OrderItems.Remove(orderItem);
                await _context.SaveChangesAsync();

                // Cập nhật tổng số lượng và tổng số tiền của đơn hàng
                var order = await _context.Orders
                    .Where(o => o.OrderId == orderItem.OrderId)
                    .FirstOrDefaultAsync();

                if (order != null)
                {
                    var orderItems = await _context.OrderItems
                        .Where(oi => oi.OrderId == order.OrderId)
                        .ToListAsync();

                    if (orderItems.Count == 0)
                    {
                        _context.Orders.Remove(order);
                    } else
                    {
                        order.Quantity = orderItems.Sum(oi => oi.ProductQuantity);
                        order.TotalAmount = orderItems.Sum(oi => oi.Price);

                        _context.Orders.Update(order);
                    }
                      
                    await _context.SaveChangesAsync();
                }

                return Ok(new { message = "Xóa sản phẩm khỏi giỏ hàng thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Lỗi không xóa được: " + ex.Message);
            }
        }

        //-------- xác nhận đơn -----------
        [HttpPost("confirmOrder/{userId}")]
        public async Task<IActionResult> ConfirmPayment(int userId, [FromBody] ConfirmOrderRequest request)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    return NotFound(new { message = "Không tìm thấy người dùng" });
                }

                // Lấy đơn hàng với trạng thái 'pending'
                var order = await _context.Orders
                    .Where(o => o.UserId == userId && o.DeliStatus == "pending")
                    .FirstOrDefaultAsync();

                if (order == null)
                {
                    return NotFound("Không có đơn hàng trạng thái pending");
                }

                
                order.PaymentMethodId = request.PaymentMethodId;
                order.DeliveryMethodId = request.DeliveryMethodId;

                
                if (order.DeliveryMethodId == "delivery")
                {
                    order.TotalAmount += 20;
                }

                if (request.PaymentMethodId == "card")
                {
                    order.PayStatus = true;
                }

                // Lấy danh sách các OrderItems trong đơn hàng
                var orderItems = await _context.OrderItems
                    .Where(oi => oi.OrderId == order.OrderId)
                    .ToListAsync();

                // Cập nhật số lượng sản phẩm trong kho
                foreach (var item in orderItems)
                {
                    var product = await _context.Products
                        .Where(p => p.ProductId == item.ProductId)
                        .FirstOrDefaultAsync();

                    if (product != null)
                    {
                        product.Stock -= item.ProductQuantity;
                    }
                }

                
                order.DeliStatus = "accept";
                order.OrderDate = DateTime.Now;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Xác nhận thanh toán thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Lỗi không cập nhật được: " + ex.Message);
            }
        }

        // ------------- lấy order ngoài pending ------------------
        [HttpGet("getOrders/{userId}")]
        public async Task<IActionResult> GetOrdersByStatus(int userId, int? page = null, int? limit = null)
        {
            try
            {
                var query = _context.Orders
                    .Where(o => o.UserId == userId && o.DeliStatus != "pending");

                var totalOrders = await query.CountAsync();

                if (page.HasValue && limit.HasValue)
                {
                    query = query.Skip((page.Value - 1) * limit.Value).Take(limit.Value);
                }

                var orders = await query
                    .Select(o => new OrderDto
                    {
                        OrderId = o.OrderId,
                        UserId = (int)o.UserId,
                        OrderDate = o.OrderDate,
                        Quantity = o.Quantity,
                        TotalAmount = o.TotalAmount,
                        DeliStatus = o.DeliStatus,
                        PayStatus = (bool)o.PayStatus,
                        PaymentMethodId = o.PaymentMethodId,
                        DeliveryMethodId = o.DeliveryMethodId,
                        BarcodeNumber = o.BarcodeNumber
                    })
                    .ToListAsync();

                if (!orders.Any())
                {
                    var defaultResponse = new
                    {
                        message = "Không có đơn hàng với trạng thái khác ngoài pending."
                    };

                    return Ok(defaultResponse);
                }

                var response = new
                {
                    totalOrders,
                    currentPage = page,
                    totalPages = limit.HasValue ? (int)Math.Ceiling(totalOrders / (double)limit.Value) : 1,
                    orders
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Lỗi không lấy được: " + ex.Message);
            }
        }

        // --------------- lấy thông tin order và sản phẩm ----------------
        [HttpGet("orderDetails/{orderId}")]
        public async Task<IActionResult> GetOrderDetails(string orderId)
        {
            try
            {
                // Lấy thông tin đơn hàng
                var order = await _context.Orders
                    .Where(o => o.OrderId == orderId)
                    .FirstOrDefaultAsync();

                if (order == null)
                {
                    return NotFound(new { message = "Không tìm thấy đơn hàng" });
                }

                
                var orderItems = await _context.OrderItems
                    .Where(oi => oi.OrderId == orderId)
                    .Include(oi => oi.Product) 
                    .ToListAsync();

                
                var response = new OrderDetailsDto
                {
                    OrderId = order.OrderId,
                    UserId = (int)order.UserId,
                    OrderDate = order.OrderDate,
                    Quantity = order.Quantity,
                    TotalAmount = order.TotalAmount,
                    DeliStatus = order.DeliStatus,
                    PayStatus = (bool)order.PayStatus,
                    PaymentMethodId = order.PaymentMethodId,
                    DeliveryMethodId = order.DeliveryMethodId,
                    BarcodeNumber = order.BarcodeNumber,
                    Items = orderItems.Select(oi => new OrderItemWithProductDto
                    {
                        OrderItemId = oi.OrderItemId,
                        Product = new ProductDto
                        {
                            ProductId = oi.Product.ProductId,
                            Name = oi.Product.Name,
                            Description = oi.Product.Description,
                            Price = oi.Product.Price,
                            Stock = oi.Product.Stock,
                            ImageUrl = oi.Product.ImageUrl,
                            ColorName = oi.Product.ColorName
                        },
                        ProductQuantity = oi.ProductQuantity,
                        Price = oi.Price
                    }).ToList()
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Lỗi không lấy được: " + ex.Message);
            }
        }

        //quản lý order 
        [HttpGet("getOrders")]
        public async Task<IActionResult> GetAllOrdersByStatus(int? page = null, int? limit = null)
        {
            try
            {
                var query = _context.Orders
                    .Where(o => o.DeliStatus != "pending");

                var totalOrders = await query.CountAsync();

                if (page.HasValue && limit.HasValue)
                {
                    query = query.Skip((page.Value - 1) * limit.Value).Take(limit.Value);
                }

                var orders = await query
                    .Select(o => new OrderDto
                    {
                        OrderId = o.OrderId,
                        UserId = (int)o.UserId,
                        OrderDate = o.OrderDate,
                        Quantity = o.Quantity,
                        TotalAmount = o.TotalAmount,
                        DeliStatus = o.DeliStatus,
                        PayStatus = (bool)o.PayStatus,
                        PaymentMethodId = o.PaymentMethodId,
                        DeliveryMethodId = o.DeliveryMethodId,
                        BarcodeNumber = o.BarcodeNumber
                    })
                    .ToListAsync();

                if (!orders.Any())
                {
                    var defaultResponse = new
                    {
                        message = "Không có đơn hàng với trạng thái khác ngoài pending."
                    };

                    return Ok(defaultResponse);
                }

                var response = new
                {
                    totalOrders,
                    currentPage = page,
                    totalPages = limit.HasValue ? (int)Math.Ceiling(totalOrders / (double)limit.Value) : 1,
                    orders
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Lỗi không lấy được: " + ex.Message);
            }
        }

        //---------------- cập nhật trạng thái đơn hàng --------------------
        [HttpPut("updateOrderStatus/{orderId}")]
        public async Task<IActionResult> UpdateOrderStatus(string orderId, [FromBody] UpdateOrderStatusRequest request)
        {
            try
            {
                
                var order = await _context.Orders
                    .Where(o => o.OrderId == orderId)
                    .FirstOrDefaultAsync();

                if (order == null)
                {
                    return NotFound(new { message = "Không tìm thấy đơn hàng" });
                }

                // Cập nhật PayStatus nếu có giá trị truyền vào
                if (request.PayStatus.HasValue)
                {
                    order.PayStatus = request.PayStatus.Value;
                }

                // Cập nhật DeliStatus nếu có giá trị truyền vào
                if (!string.IsNullOrEmpty(request.DeliStatus))
                {
                    order.DeliStatus = request.DeliStatus;
                }

                
                _context.Orders.Update(order);
                await _context.SaveChangesAsync();

                
                var response = new OrderDto
                {
                    OrderId = order.OrderId,
                    UserId = (int)order.UserId,
                    OrderDate = order.OrderDate,
                    Quantity = order.Quantity,
                    TotalAmount = order.TotalAmount,
                    DeliStatus = order.DeliStatus,
                    PayStatus = (bool)order.PayStatus,
                    PaymentMethodId = order.PaymentMethodId,
                    DeliveryMethodId = order.DeliveryMethodId,
                    BarcodeNumber = order.BarcodeNumber
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Lỗi không cập nhật được: " + ex.Message);
            }
        }

    }

    //----------- request ---------------
    public class AddToCartRequest
    {
        public string ProductId { get; set; }
        public int Quantity { get; set; }
    }

    public class UpdateOrderItemRequest
    {
        public int Quantity { get; set; }
    }

    public class UpdateDeliMethodRequest
    {
        public string OrderId { get; set; }
        public string DeliveryMethodId { get; set; }
    }

    public class UpdatePayMethodRequest
    {
        public string OrderId { get; set; }
        public string PaymentMethodId { get; set; }
    }
    public class ConfirmOrderRequest
    {
        public string PaymentMethodId { get; set; }
        public string DeliveryMethodId { get; set; }
    }

    public class UpdateOrderStatusRequest
    {
        public string DeliStatus { get; set; }
        public bool? PayStatus { get; set; }
    }

    //----------- DTO ---------------

    public class OrderResponseDto
    {
        public string OrderId { get; set; }
        public int Quantity { get; set; }
        public decimal TotalAmount { get; set; }
        public List<OrderItemDto> Items { get; set; }
    }

    public class OrderItemDto
    {
        public string OrderItemId { get; set; }
        public string ProductId { get; set; }
        public int ProductQuantity { get; set; }
        public decimal Price { get; set; }
    }

    public class OrderDto
    {
        public string OrderId { get; set; }
        public int UserId { get; set; }
        public DateTime OrderDate { get; set; }
        public int Quantity { get; set; }
        public decimal TotalAmount { get; set; }
        public string DeliStatus { get; set; }
        public bool PayStatus { get; set; }
        public string PaymentMethodId { get; set; }
        public string DeliveryMethodId { get; set; }
        public string BarcodeNumber { get; set; }
    }

    public class PendingOrderResponseDto
    {
        public string OrderId { get; set; }
        public int Quantity { get; set; }
        public decimal TotalAmount { get; set; }
        public string DeliStatus { get; set; }
        public List<OrderItemWithProductDto> Items { get; set; }
    }

    public class OrderItemWithProductDto
    {
        public string OrderItemId { get; set; }
        public ProductDto Product { get; set; }
        public int ProductQuantity { get; set; }
        public decimal Price { get; set; }
    }

    public class ProductDto
    {
        public string ProductId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public string ImageUrl { get; set; }
        public string ColorName { get; set; }
    }

    public class OrderDetailsDto
    {
        public string OrderId { get; set; }
        public int UserId { get; set; }
        public DateTime OrderDate { get; set; }
        public int Quantity { get; set; }
        public decimal TotalAmount { get; set; }
        public string DeliStatus { get; set; }
        public bool PayStatus { get; set; }
        public string PaymentMethodId { get; set; }
        public string DeliveryMethodId { get; set; }
        public string BarcodeNumber { get; set; }
        public List<OrderItemWithProductDto> Items { get; set; }
    }
}
