
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Guild } from '../model/guild';

@Injectable({
    providedIn: 'root'
})
export class GuildService {

    constructor(private http: HttpClient) { }

    getGuildByDiscordId(discordGuildId: string): Observable<Guild> {
        return this.http.get<Guild>(`${environment.apiUrl}/api/guild/${discordGuildId}`);
    }
}
