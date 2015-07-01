﻿using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Scrum.Web.Database.Inputs {
    public class Input_AddSprint {

        [Required]
        public int TeamId { get; set; }

        public string Name { get; set; }
    }
}
