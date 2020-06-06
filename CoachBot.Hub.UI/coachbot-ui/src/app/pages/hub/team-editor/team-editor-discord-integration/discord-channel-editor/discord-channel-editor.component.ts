import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { DiscordService } from '../../../shared/services/discord.service';
import { TeamService } from '../../../shared/services/team.service';
import { ChannelService } from '../../../shared/services/channel.service';
import { DiscordChannel } from '../../../shared/model/discord-channel.model';
import { Channel } from '../../../shared/model/channel.model';
import { Team } from '../../../shared/model/team.model';
import { Position } from '../../../shared/model/position';
import { ChannelPosition } from '../../../shared/model/channel-position';
import { FormatPositions } from './format-positions';
import { SwalComponent, SwalPortalTargets } from '@sweetalert2/ngx-sweetalert2';

@Component({
    selector: 'app-discord-channel-editor',
    templateUrl: './discord-channel-editor.component.html'
})
export class DiscordChannelEditorComponent {

    @ViewChild('editPositionModal', { static: false }) editPositionModal: SwalComponent;
    @Output() wizardClosed = new EventEmitter<void>();
    team: Team;
    channel: Channel = new Channel();
    discordChannels: DiscordChannel[];
    discordGuildId: string;
    positionToEdit: ChannelPosition;
    wizardMode: WizardMode;
    wizardStep: WizardStep;
    wizardModes = WizardMode;
    wizardSteps = WizardStep;
    isLoading = true;
    isSaving = false;

    constructor(
        private discordService: DiscordService,
        private teamService: TeamService,
        private channelService: ChannelService,
        public readonly swalTargets: SwalPortalTargets
    ) { }

    startCreateWizard(teamId: number) {
        this.isLoading = true;
        this.wizardMode = WizardMode.Creating;
        this.wizardStep = WizardStep.ChannelSelection;
        this.channel = new Channel();
        this.channel.teamId = teamId;
        this.teamService.getTeam(teamId).subscribe(team => {
            this.team = team;
            this.discordService.getChannelsForGuild(this.team.guild.discordGuildId).subscribe(discordChannels => {
                this.discordChannels = discordChannels;

                this.isLoading = false;
            });
        });
    }

    startEditWizard(channelId: number) {
        this.isLoading = true;
        this.wizardMode = WizardMode.Editing;
        this.wizardStep = WizardStep.Configuration;
        this.channelService.getChannel(channelId).subscribe(channel => {
            this.channel = channel;
            this.channel.channelPositions = channel.channelPositions.sort((a, b) => a.ordinal - b.ordinal);
            this.isLoading = false;
        });
    }

    abortWizard() {
        this.wizardMode = WizardMode.Disabled;
        this.isLoading = true;
        this.isSaving = false;
        this.wizardClosed.emit();
    }

    setChannelName(discordChannelId: string) {
        this.channel.discordChannelName = this.discordChannels.find(c => c.id === discordChannelId).name;
    }

    setPositions(format: number) {
        this.channel.channelPositions = this.channel.channelPositions || [];
        if (this.channel.channelPositions.length > format) {
            this.channel.channelPositions.splice(format);
        } else if (this.channel.channelPositions.length < format) {
            while (this.channel.channelPositions.length < format) {
                const channelPosition = new ChannelPosition();
                channelPosition.position = new Position();
                channelPosition.channelId = this.channel.id;
                this.channel.channelPositions.push(channelPosition);
            }
        }
        this.usePositionNames();
    }

    usePositionNames() {
        const format = this.channel.channelPositions.length;
        console.log(format);
        const positionNames = FormatPositions.names;
        for (let i = 0; i < format; i++) {
            const channelPosition = this.channel.channelPositions[i];
            channelPosition.positionId = 0;
            channelPosition.position = new Position();
            channelPosition.position.id = 0;
            channelPosition.position.name = positionNames[format][i];
            channelPosition.ordinal = i + 1;
        }
    }

    usePositionNumbers() {
        const format = this.channel.channelPositions.length;
        for (let i = 1; i <= format; i++) {
            const channelPosition = this.channel.channelPositions[i - 1];
            channelPosition.positionId = 0;
            channelPosition.position = new Position();
            channelPosition.position.id = 0;
            channelPosition.position.name = i.toString();
            channelPosition.ordinal = i;
        }
    }

    editPosition(channelPosition: ChannelPosition) {
        this.positionToEdit = channelPosition;
        this.editPositionModal.fire();
    }

    updatePosition() {
        this.positionToEdit.positionId = 0;
        this.positionToEdit.position.id = 0;
        this.editPositionModal.dismiss();
    }

    addSearchIgnoreChannel(discordChannelId: string) {
        this.channel.searchIgnoreList.push(discordChannelId);
    }

    saveChannel() {
        this.isLoading = true;
        this.isSaving = true;
        switch (this.wizardMode) {
            case WizardMode.Creating:
                this.channelService.createChannel(this.channel).subscribe(() => {
                    this.isLoading = false;
                    this.abortWizard();
                });
                break;
            case WizardMode.Editing:
                this.channelService.updateChannel(this.channel).subscribe(() => {
                    this.isLoading = false;
                    this.abortWizard();
                });
                break;
        }
    }
}

enum WizardMode {
    Disabled,
    Creating,
    Editing
}
enum WizardStep {
    ChannelSelection,
    Configuration
}
