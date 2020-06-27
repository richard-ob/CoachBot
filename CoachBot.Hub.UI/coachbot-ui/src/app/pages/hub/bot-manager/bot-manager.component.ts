import { Component, OnInit } from '@angular/core';
import { BotState } from '../shared/model/bot-state.model';
import { BotService } from '../shared/services/bot.service';

@Component({
    selector: 'app-bot-manager',
    templateUrl: './bot-manager.component.html',
    styleUrls: ['./bot-manager.component.scss']
})
export class BotManagerComponent implements OnInit {

    botState: BotState;
    isReconnecting = false;
    isRefreshing = false;
    isLoading = true;

    constructor(private botService: BotService) { }

    ngOnInit() {
        this.refreshBotState();
        this.startAutomaticRefresh();
    }

    refreshBotState() {
        this.isRefreshing = true;
        this.botService.getBotState().subscribe(botState => {
            this.botState = botState;
            this.isLoading = false;
            this.isRefreshing = false;
        });
    }

    startAutomaticRefresh() {
        setInterval(() => this.refreshBotState(), 60000);
    }

    reconnectBot() {
        this.isReconnecting = true;
        this.botService.reconnectBot().subscribe(() => {
            this.botService.getBotState().subscribe(state => {
                this.botState = state;
                this.isReconnecting = false;
            });
        });
    }

}