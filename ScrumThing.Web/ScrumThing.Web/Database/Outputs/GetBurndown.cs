﻿using Newtonsoft.Json;
using System;

namespace ScrumThing.Web.Database.Outputs {
    public class Output_GetBurndown {
        [JsonIgnore]
        public DateTime SprintDay { get; set; }
        public string FormattedBurnDate {
            get {
                return SprintDay.ToString("MM-dd ddd");
            }
        }
        public decimal? HoursBurned { get; set; }
        public decimal? HoursRemaining { get; set; }
        public double IdealHoursRemaining { get; set; }
        public bool Preliminary { get; set; }
    }
}
