﻿using CoachBot.Domain.Model.Dtos;
using CoachBot.Domain.Services;
using CoachBot.Model;
using CoachBot.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace CoachBot.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class PlayerController : Controller
    {
        private readonly PlayerService _playerService;

        public PlayerController(PlayerService playerService)
        {
            _playerService = playerService;
        }

        [HttpGet("{id}")]
        public Player Get(int id)
        {
            return _playerService.GetPlayer(id);
        }

        [HttpPost]
        public PagedResult<Player> PagedMatchList([FromBody]PagedPlayerRequestDto pagedRequest)
        {
            return _playerService.GetPlayers(pagedRequest.Page, pagedRequest.PageSize, pagedRequest.SortOrderFull);
        }
        
        [Authorize]
        [HttpPost]
        [Route("update-steam-id")]
        public IActionResult UpdateSteamId([FromBody]SteamIdDto steamIdDto)
        {
            // TODO: encrypt and decrypt SteamID
            var playerDiscordUserId = ulong.Parse(User.Claims.First().Value);
            _playerService.UpdatePlayerSteamID(playerDiscordUserId, steamIdDto.SteamId, User.Identity.Name);

            return Ok();
        }

    }
}