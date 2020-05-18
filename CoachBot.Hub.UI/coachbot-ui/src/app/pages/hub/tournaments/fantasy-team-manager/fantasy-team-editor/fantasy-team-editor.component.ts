import { Component, OnInit } from '@angular/core';
import { FantasyService } from '../../../shared/services/fantasy.service';
import { FantasyTeam } from '../../../shared/model/fantasy-team.model';
import { ActivatedRoute } from '@angular/router';
import { FantasyPlayer } from '../../../shared/model/fantasy-player.model';
import { TournamentService } from '../../../shared/services/tournament.service';
import { TournamentEdition } from '../../../shared/model/tournament-edition.model';
import { FantasyTeamSelection } from '../../../shared/model/fantasy-team-selection.model';
import { PositionGroup } from '../../../shared/model/position-group.enum';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-fantasy-team-editor',
    templateUrl: './fantasy-team-editor.component.html',
    styleUrls: ['./fantasy-team-editor.component.scss']
})
export class FantasyTeamEditorComponent implements OnInit {

    fantasyTeamId: number;
    fantasyTeam: FantasyTeam;
    tournamentEdition: TournamentEdition;
    positionGroups = PositionGroup;
    isLoading = true;
    isUpdating = false;

    constructor(
        private fantasyService: FantasyService,
        private route: ActivatedRoute,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit() {
        this.route.paramMap.pipe().subscribe(params => {
            this.fantasyTeamId = +params.get('id');
            this.fantasyService.getFantasyTeam(this.fantasyTeamId).subscribe(fantasyTeam => {
                this.fantasyTeam = fantasyTeam;
                this.isLoading = false;
            });
        });
    }

    addFantasyTeamSelection(fantasyPlayer: FantasyPlayer) {
        if (this.canAddToGroup(fantasyPlayer.positionGroup)
            && !this.fantasyTeam.fantasyTeamSelections.some(f => f.fantasyPlayerId === fantasyPlayer.id)) {
            this.isUpdating = true;
            const selection = new FantasyTeamSelection();
            selection.fantasyPlayer = fantasyPlayer;
            selection.fantasyPlayerId = fantasyPlayer.id;
            selection.fantasyTeamId = this.fantasyTeamId;
            selection.isFlex = false;
            this.fantasyService.addFantasyTeamSelection(selection).subscribe(() => {
                this.fantasyService.getFantasyTeam(this.fantasyTeamId).subscribe(fantasyTeam => {
                    this.fantasyTeam = fantasyTeam;
                    this.isUpdating = false;
                });
            });
        } else {
            this.snackBar.open('Cannot add player as they are already added or not available slots', 'Dismiss', { duration: 5000 });
        }
    }

    removeFantasyTeamSelection(fantasyTeamSelection: FantasyTeamSelection) {
        this.isUpdating = true;
        this.fantasyService.removeFantasyTeamSelection(fantasyTeamSelection).subscribe(() => {
            this.fantasyService.getFantasyTeam(this.fantasyTeamId).subscribe(fantasyTeam => {
                this.fantasyTeam = fantasyTeam;
                this.isUpdating = false;
            });
        });
    }

    private canAddToGroup(positionGroup: PositionGroup) {
        if (positionGroup === PositionGroup.Goalkeeper && this.getPlayerCountForPosition(positionGroup) < 2) {
            return true;
        } else if (positionGroup === PositionGroup.Defence && this.getPlayerCountForPosition(positionGroup) < 5) {
            return true;
        } else if (positionGroup === PositionGroup.Midfield && this.getPlayerCountForPosition(positionGroup) < 3) {
            return true;
        } else if (positionGroup === PositionGroup.Attack && this.getPlayerCountForPosition(positionGroup) < 3) {
            return true;
        }

        return false;
    }

    private getPlayerCountForPosition(positionGroup): number {
        return this.fantasyTeam.fantasyTeamSelections.filter(f => f.fantasyPlayer.positionGroup === positionGroup).length;
    }

}