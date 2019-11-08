﻿using Discord;
using Discord.WebSocket;

namespace CoachBot.Domain.Services
{
    public class AnnouncementService
    {
        private DiscordSocketClient _client;

        public AnnouncementService(DiscordSocketClient client)
        {
            _client = client;
        }

        public void Say(string message)
        {
            foreach (var server in _client.Guilds)
            {
                foreach (var channel in server.Channels)
                {
                    if (_client.GetChannel(channel.Id) is ITextChannel textChannel)
                    {
                        textChannel.SendMessageAsync("", embed: new EmbedBuilder().WithAuthor("Coach", "http://coachbot.iosoccer.com/assets/coach_head.png", "http://coachbot.iosoccer.com").WithDescription(message).WithCurrentTimestamp().Build());
                    }
                }
            }
        }
    }
}
