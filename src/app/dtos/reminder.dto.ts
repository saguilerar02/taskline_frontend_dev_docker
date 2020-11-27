export class ReminderDTO{
    _id:string
    remindAt: Date;
    reminderData: string;
    reminded: boolean;
    idTask: string;
    createdAt: Date;
    createdBy: string;
}
