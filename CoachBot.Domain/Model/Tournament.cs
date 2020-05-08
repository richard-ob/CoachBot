﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace CoachBot.Domain.Model
{
    public class Tournament
    {
        [Key]
        public int Id { get; set; }

        public string Name { get; set; }

        public bool IsPublic { get; set; }

        public bool IsActive { get; set; }

        public TournamentType TournamentType { get; set; }

        public int? OrganisationId { get; set; }

        public Organisation Organisation { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime CreatedDate { get; set; }

        public ICollection<TournamentEdition> TournamentEditions { get; set; }

    }
}