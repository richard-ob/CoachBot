﻿using Discord;
using Discord.WebSocket;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CoachBot.Domain.Services
{
    public class DiscordNotificationService
    {
        private readonly DiscordSocketClient _discordSocketClient;

        public DiscordNotificationService(DiscordSocketClient discordSocketClient)
        {
            _discordSocketClient = discordSocketClient;
        }

        public async Task<ulong> SendChannelMessage(ulong discordChannelId, Embed embed)
        {
            if (_discordSocketClient.GetChannel(discordChannelId) is ITextChannel channel)
            {
                var result = await channel.SendMessageAsync("", embed: embed);

                return result.Id;
            }

            return 0;
        }

        public async Task<ulong> SendChannelMessage(ulong discordChannelId, string message)
        {
            return await SendChannelMessage(discordChannelId, new EmbedBuilder().WithDescription(message).Build());
        }

        public async Task<Dictionary<ulong, ulong>> SendChannelMessage(List<ulong> discordChannelIds, Embed embed)
        {
            var messageIds = new Dictionary<ulong, ulong>();

            foreach (var discordChannelId in discordChannelIds)
            {
                var discordMessageId = await SendChannelMessage(discordChannelId, embed);
                if (discordMessageId != 0) messageIds.Add(discordChannelId, discordMessageId);
            }

            return messageIds;
        }

        public async Task<Dictionary<ulong, ulong>> SendChannelMessage(List<ulong> discordChannelIds, string message)
        {
            var messageIds = new Dictionary<ulong, ulong>();

            foreach (var discordChannelId in discordChannelIds)
            {
                var discordMessageId =  await SendChannelMessage(discordChannelId, message);
                if (discordMessageId != 0) messageIds.Add(discordChannelId, discordMessageId);
            }

            return messageIds;
        }

        public async Task<ulong> SendUserMessage(ulong discordUserId, string message)
        {
            if (await _discordSocketClient.GetUser(discordUserId).GetOrCreateDMChannelAsync() is IDMChannel dmChannel)
            {
                var result = await dmChannel.SendMessageAsync(message);

                return result.Id;
            }

            return 0;
        }
    }
}
