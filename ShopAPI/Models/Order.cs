﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;

namespace ShopAPI.Models
{
    public partial class Order
    {

        public string OrderId { get; set; }
        public int? UserId { get; set; }
        public DateTime OrderDate { get; set; }
        public int Quantity { get; set; }
        public decimal TotalAmount { get; set; }
        public string DeliStatus { get; set; }
        public bool? PayStatus { get; set; }
        public string PaymentMethodId { get; set; }
        public string DeliveryMethodId { get; set; }
        public string BarcodeNumber { get; set; }
    }
}