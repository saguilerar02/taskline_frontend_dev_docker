import { ReminderDTO } from './reminder.dto';
import { ToolbarProfileDTO } from './toolbarProfile.dto';

export class NewTaskDTO{
    goal: string;
    description: string;
    archivementDateTime: Date;
    createdAt: Date;
    idTasklist: string;
    status: string;
    contributors: Array<ToolbarProfileDTO>;
    reminders: Array<ReminderDTO>;

    constructor(){
        this.goal = 'Tengo que hacer tal cosa...';
        this.description = 'Describiendo que tengo que hacer...';
        this.archivementDateTime = new Date();
        this.idTasklist = null;
        this.status = 'PENDING';
        this.contributors = new Array<ToolbarProfileDTO>();
        this.reminders = new Array<ReminderDTO>();
    }
}
