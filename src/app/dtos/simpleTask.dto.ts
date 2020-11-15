import { ReminderDTO } from './reminder.dto';

export class TaskDTO{
    goal: string;
    description: string;
    archivementDateTime: Date;
    createdAt: Date;
    idTasklist: string;
    createdBy: string;
    status: string;
    contributors: [string];
    reminders: Array<ReminderDTO>;
}
