﻿namespace CoachBot.Model
{
    public class Config
    {
        public int Id { get; set; }

        public string BotToken { get; set; }

        public string OAuth2Id { get; set; }

        public string OAuth2Secret { get; set; }

        public string ClientUrl { get; set; }

        public ulong OwnerGuildId { get; set; }

        public string SqlConnectionString { get; set; }

        public int ApiPort { get; set; }

    }
}
