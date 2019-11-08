﻿using CoachBot.Domain.Model;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CoachBot.Model
{
    public class Player
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public string Name { get; set; }

        public ulong? DiscordUserId { get; set; }

        public string DiscordUserMention { get; set; }

        public string SteamID { get; set; }

        public ICollection<PlayerTeamPosition> PlayerTeamPositions { get; set; }

        public ICollection<PlayerTeamSubstitute> PlayerSubstitutes { get; set; }

        public string DisplayName
        {
            get { return DiscordUserMention ?? Name ?? "Unknown"; }
        }

    }
}
