﻿using System;
using System.Collections.Generic;
using System.Text;

namespace CoachBot.Domain.Model
{
    public class PlayerPerformanceSnapshot
    {
        public int PlayerId { get; set; }

        public int? Day { get; set; }

        public int? Week { get; set; }

        public int? Month { get; set; }

        public int Year { get; set; }

        public double AverageGoals { get; set; }

        public double AverageAssists { get; set; }

        public double AverageGoalsConceded { get; set; }

        public int CleanSheets { get; set; }

        public int Appearances { get; set; }

    }
}