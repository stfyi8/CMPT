import notifee, { AndroidImportance, TriggerType } from '@notifee/react-native';
import type { ReminderItem } from "./Reminder";

type ReminderListProps = {
  reminders: (ReminderItem & { id: string })[];
};

export async function iniNotification() {
    await notifee.requestPermission();
    await notifee.createChannel({
        id: 'default',
        name: 'default',
        importance: AndroidImportance.HIGH,
    });
}

// export async function showLocalNotification () {
//     await notifee.displayNotification({
//         title: 'Do your homework',
//         body:'',
//         android:{
//             channelId:'default',
//             smallIcon:""
//         }
//     })

// }


export async function timerNotification({reminders}: ReminderListProps) {
    await iniNotification();

    const futureReminders = reminders.filter((reminder) => {
        const timestamp = reminder.time.getTime();
        return Number.isFinite(timestamp) && timestamp > Date.now();
    });

    await Promise.all(futureReminders.map((reminder) =>
        notifee.createTriggerNotification({
            title: reminder.title ?? 'Time to complete your tasks',
            body: reminder.tasks?.join('\n'),
            android: {
                channelId: 'default',
                smallIcon: 'ic_launcher',
            },
        }, {
            type: TriggerType.TIMESTAMP,
            timestamp: reminder.time.getTime(),
        })
    ));
}