﻿using CoachBot.Domain.Model;
using CoachBot.Domain.Services;
using CoachBot.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using static CoachBot.Attributes.HubRoleAuthorizeAttribute;

namespace CoachBot.Controllers
{
    [Produces("application/json")]
    [Route("api/tournaments")]
    [ApiController]
    public class TournamentController : Controller
    {
        private readonly TournamentService _tournamentService;
        private readonly FantasyService _fantasyService;
        private readonly PlayerService _playerService;

        public TournamentController(TournamentService tournamentService, FantasyService fantasyService, PlayerService playerService)
        {
            _tournamentService = tournamentService;
            _fantasyService = fantasyService;
            _playerService = playerService;
        }

        [HttpGet("current")]
        public List<Tournament> GetCurrentTournaments()
        {
            return _tournamentService.GetTournaments(true);
        }

        [HttpGet("past")]
        public List<Tournament> GetPastTournaments()
        {
            return _tournamentService.GetPastTournaments();
        }


        [HttpGet]
        public List<Tournament> GetTournaments()
        {
            return _tournamentService.GetTournaments();
        }

        [HttpGet("{id}")]
        public Tournament GetTournament(int id)
        {
            return _tournamentService.GetTournament(id);
        }

        [HubRolePermission(HubRole = PlayerHubRole.Administrator)]
        [HttpPost]
        public void CreateTournament(Tournament tournament)
        {
            // TODO: Check player is tournament organiser
            _tournamentService.CreateTournament(tournament, User.GetSteamId());
        }

        [HubRolePermission(HubRole = PlayerHubRole.Administrator)]
        [HttpPut]
        public void UpdateTournament(Tournament tournament)
        {
            // TODO: Check player is tournament organiser
            _tournamentService.UpdateTournament(tournament);
        }

        [HttpGet("{id}/groups")]
        public List<TournamentGroup> GetTournamentGroups(int id)
        {
            return _tournamentService.GetTournamentGroups(id);
        }

        [HttpGet("{id}/teams")]
        public List<Team> GetTournamentTeams(int id)
        {
            return _tournamentService.GetTournamentTeams(id);
        }

        [HttpGet("{id}/staff")]
        public List<TournamentStaff> GetTournamentStaff(int id)
        {
            return _tournamentService.GetTournamentStaff(id);
        }

        [HubRolePermission(HubRole = PlayerHubRole.Administrator)]
        [HttpPost("{id}/generate-schedule")]
        public void GenerateTournamentSchedule(int id)
        {
            // TODO: Check player is tournament organiser
            _tournamentService.GenerateTournamentSchedule(id);
        }

        [HttpGet("{id}/current-phase")]
        public TournamentPhase GetCurrentPhase(int id)
        {
            return _tournamentService.GetCurrentTournamentPhase(id);
        }

        [HttpGet("{id}/match-day-slots")]
        public List<TournamentMatchDaySlot> GetTournamentMatchDayslots(int id)
        {
            return _tournamentService.GetTournamentMatchDaySlots(id);
        }

        [HubRolePermission(HubRole = PlayerHubRole.Administrator)]
        [HttpPost("{id}/match-day-slots")]
        public void CreateTournamentMatchDaySlot(TournamentMatchDaySlot tournamentMatchDaySlot)
        {
            if (!_playerService.IsAdmin(User.GetSteamId()))
            {
                throw new Exception();
            }
            // TODO: Check player is tournament organiser
            _tournamentService.CreateTournamentMatchDaySlot(tournamentMatchDaySlot);
        }

        [HubRolePermission(HubRole = PlayerHubRole.Administrator)]
        [HttpDelete("{id}/match-day-slots/{matchDaySlotId}")]
        public void DeleteTournamentMatchDaySlot(int matchDaySlotId)
        {
            if (!_playerService.IsAdmin(User.GetSteamId()))
            {
                throw new Exception();
            }
            _tournamentService.DeleteTournamentMatchDaySlot(matchDaySlotId);
        }

        [HubRolePermission(HubRole = PlayerHubRole.Administrator)]
        [HttpPost("{id}/generate-fantasy-snapshots")]
        public void GenerateFantasyTeamSnapshots(int id)
        {
            if (!_playerService.IsAdmin(User.GetSteamId()))
            {
                throw new Exception();
            }
            _fantasyService.GenerateFantasyPlayersSnapshot(id);
        }
    }
}
