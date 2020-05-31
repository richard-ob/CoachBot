import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { TeamService } from '../../shared/services/team.service';
import { Channel } from '../../shared/model/channel.model';
import { ChannelService } from '../../shared/services/channel.service';
import { Team } from '../../shared/model/team.model';
import { ActivatedRoute } from '@angular/router';
import { DiscordGuildEditorComponent } from './discord-guild-editor/discord-guild-editor.component';

@Component({
    selector: 'app-team-editor-discord-integration',
    templateUrl: './team-editor-discord-integration.component.html'
})
export class TeamEditorDiscordIntegrationComponent implements OnInit {

    @ViewChild(DiscordGuildEditorComponent, { static: false }) guildEditor: DiscordGuildEditorComponent;
    @Input() teamId: number;
    team: Team;
    channels: Channel[];
    isDiscordGuildSet: boolean;
    isGuildEditorOpen = false;
    isChannelWizardOpen = false;
    isLoading = true;

    constructor(private route: ActivatedRoute, private teamService: TeamService, private channelService: ChannelService) { }

    ngOnInit() {
        this.route.parent.paramMap.pipe().subscribe(params => {
            this.teamId = +params.get('id');
            this.teamService.getTeam(this.teamId).subscribe(team => {
                this.team = team;
                if (this.team.guild && this.team.guild.discordGuildId) {
                    this.isDiscordGuildSet = true;
                    this.loadChannels();
                } else {
                    this.isDiscordGuildSet = false;
                    this.isLoading = false;
                    this.isGuildEditorOpen = true;
                    this.guildEditor.openGuildEditor(this.teamId);
                }
            });
        });
    }

    loadChannels() {
        this.isLoading = true;
        this.channelService.getChannelsForGuild(this.team.guild.discordGuildId).subscribe(channels => {
            this.channels = channels;
            this.isLoading = false;
        });
    }

}
