﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;

namespace ShopAPI.Models
{
    public partial class DeliveryMethod
    {
        public DeliveryMethod()
        {
            Orders = new HashSet<Order>();
        }

        public string MethodId { get; set; }
        public string MethodName { get; set; }

        public virtual ICollection<Order> Orders { get; set; }
    }
}