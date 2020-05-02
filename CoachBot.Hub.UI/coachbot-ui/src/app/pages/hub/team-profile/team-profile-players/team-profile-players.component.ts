import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TeamService } from '../../shared/services/team.service';
import { PlayerTeamStatisticsTotals } from '../../shared/model/player-team-statistics-totals.model';

@Component({
    selector: 'app-team-profile-players',
    templateUrl: './team-profile-players.component.html'
})
export class TeamProfilePlayersComponent implements OnInit {

    playerTeamStatisticsTotals: PlayerTeamStatisticsTotals[];
    isLoading = true;

    constructor(private route: ActivatedRoute, private teamService: TeamService, private router: Router) { }

    ngOnInit() {
        this.route.parent.paramMap.pipe().subscribe(params => {
            const teamId = +params.get('id');
            this.teamService.getTeamSquad(teamId).subscribe((playerTeamStatisticsTotals) => {
                this.playerTeamStatisticsTotals = playerTeamStatisticsTotals;
            });
        });
    }

    navigateToPlayerProfile(playerId: number) {
        this.router.navigate(['/player-profile/', playerId]);
    }

}
