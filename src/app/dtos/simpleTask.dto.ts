import { ReminderDTO } from './reminder.dto';
import { ToolbarProfileDTO } from './toolbarProfile.dto';

export class TaskDTO{
    _id: string;
    goal: string;
    description: string;
    archivementDateTime: Date;
    createdAt: Date;
    idTasklist:any
    createdBy: string;
    contributors: Array<ToolbarProfileDTO>;
    reminders: Array<ReminderDTO>;

    constructor(data:any){
        this._id = data._id;
        this.goal = data.goal
        this.description = data.description
        this.archivementDateTime = data.archivementDateTime
        this.idTasklist = data.idTasklist
        this.createdAt = data.createdAt;
        this.createdBy = data.createdBy;
        this.contributors = new Array<ToolbarProfileDTO>(...data.contributors);
        this.reminders = new Array<ReminderDTO>(...data.reminders);
    }
}
