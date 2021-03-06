import { Component } from '@angular/core';
import { ChannelService } from '../shared/services/channel.service';
import { Channel } from '../model/channel';
import { Team } from '../model/team';

@Component({
    selector: 'app-channels',
    templateUrl: './channels.component.html'
})
export class ChannelsComponent {

    channels: Channel[];
    unconfiguredChannels: Channel[];
    unconfiguredChannel: Channel;
    isLoading = true;

    constructor(private channelService: ChannelService) {
        this.loadChannels();
    }

    loadChannels() {
        this.channelService.getChannels()
            .subscribe(channels => {
                this.channels = channels;
                this.channels.forEach(c => c.id = c.idString);
                this.channelService.getUnconfiguredChannels()
                    .subscribe(unconfiguredChannels => {
                        this.unconfiguredChannels = unconfiguredChannels;
                        this.unconfiguredChannels.forEach(u => u.id = u.idString);
                        this.isLoading = false;
                    });
            });
    }

    addChannel() {
        this.isLoading = true;
        this.unconfiguredChannel.formation = 0;
        this.unconfiguredChannel.classicLineup = true;
        this.unconfiguredChannel.positions = [];
        ['GK', 'LB', 'RB', 'CB', 'CM', 'LW', 'RW', 'CF'].map(m => this.unconfiguredChannel.positions.push({ positionName: m }));
        this.unconfiguredChannel.team1 = new Team();
        this.unconfiguredChannel.team1.name = 'Unnamed';
        this.unconfiguredChannel.team1.color = '#2463B0';
        this.unconfiguredChannel.team1.isMix = false;
        this.unconfiguredChannel.team1.players = [];
        this.unconfiguredChannel.team2 = new Team();
        this.unconfiguredChannel.team2.players = [];
        this.channelService.updateChannel(this.unconfiguredChannel)
            .subscribe(complete => this.loadChannels());
    }

}
