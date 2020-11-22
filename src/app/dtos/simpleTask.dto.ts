import { ReminderDTO } from './reminder.dto';
import { ToolbarProfileDTO } from './toolbarProfile.dto';

export class TaskDTO{
    _id: string;
    goal: string;
    description: string;
    archivementDateTime: Date;
    createdAt: Date;
    idTasklist: {
        _id: string,
        name: string
    };
    createdBy: string;
    status: string;
    contributors: Array<ToolbarProfileDTO>;
    reminders: Array<ReminderDTO>;

    constructor(){
        this.goal = 'Tengo que hacer tal cosa...';
        this.description = 'Describiendo que tengo que hacer...';
        this.archivementDateTime = new Date();
        this.idTasklist = {
            _id: '',
            name:'Nombre de mi lista'
        };
        this.status = 'PENDING';
        this.contributors = new Array<ToolbarProfileDTO>();
        this.reminders = new Array<ReminderDTO>();
    }
}
