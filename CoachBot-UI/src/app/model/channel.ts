import { Team } from "./team";
import { Formation } from "./formation";

export class Channel {
    id: number;
    positions: string[];
    team1: Team;
    team2: Team;
    formation: Formation;
    classicLineup: boolean;
}