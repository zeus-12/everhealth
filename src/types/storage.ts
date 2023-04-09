export interface Storage {
	hasOnboarded: boolean;
	isAuthenticatedAsGuest: false;

	personalDetails: {
		name: string;
		height: number;
		weight: number;
		age: number;
	};

	appSettings: {
		isDarkTheme: boolean;
		allowNotifications: boolean;
	};
}

export interface Reminder {
	group_id: string;
	id: string;

	date: Date; // YYYY-MM-DD
	isCompleted: boolean;

	task: string;
	type: ReminderType;

	time: string; // 24 hour time format 20:30 , 04:40 ,etc
}

export enum ReminderType {
	PERSONAL_GROWTH = "PERSONAL_GROWTH",
	MEDICATION = "MEDICATION",
	DOCTOR_VISIT = "DOCTOR_VISIT",
}
