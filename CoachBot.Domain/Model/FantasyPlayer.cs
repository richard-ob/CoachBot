﻿using CoachBot.Model;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace CoachBot.Domain.Model
{
    public class FantasyPlayer
    {
        [Key]
        public int Id { get; set; }

        public PositionGroup PositionGroup { get; set; }

        public double Rating { get; set; }

        public int? PlayerId { get; set; }

        public Player Player { get; set; }

        public int? TeamId { get; set; }

        public Team Team { get; set; }

        public int? TournamentId { get; set; }

        public Tournament Tournament { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDate { get; set; }

    }
}
