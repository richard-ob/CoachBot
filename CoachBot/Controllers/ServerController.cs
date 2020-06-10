﻿using CoachBot.Domain.Services;
using CoachBot.Extensions;
using CoachBot.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace CoachBot.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ServerController : Controller
    {
        private readonly ServerService _serverService;
        private readonly PlayerService _playerService;

        public ServerController(ServerService serverService, PlayerService playerService)
        {
            _serverService = serverService;
            _playerService = playerService;
        }

        [HttpGet("{id}")]
        public Server Get(int id)
        {
            if (!_playerService.IsAdmin(User.GetSteamId()))
            {
                throw new Exception();
            }
            return _serverService.GetServer(id);
        }

        [HttpGet]
        public IEnumerable<Server> GetAll()
        {
            if (!_playerService.IsAdmin(User.GetSteamId()))
            {
                throw new Exception();
            }
            return _serverService.GetServers();
        }

        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            if (!_playerService.IsAdmin(User.GetSteamId()))
            {
                throw new Exception();
            }
            _serverService.RemoveServer(id);
        }

        [HttpPatch("{id}")]
        public void UpdateRconPassword(int id, [FromForm]string rconPassword)
        {
            if (!_playerService.IsAdmin(User.GetSteamId()))
            {
                throw new Exception();
            }
            _serverService.UpdateServerRconPassword(id, rconPassword);
        }

        [HttpPost]
        public void Create(Server server)
        {
            if (!_playerService.IsAdmin(User.GetSteamId()))
            {
                throw new Exception();
            }
            server.Name = server.Name.Trim();
            _serverService.AddServer(server);
        }
    }
}
