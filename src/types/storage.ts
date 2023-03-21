export interface StorageType {
	hasOnboarded: boolean;

	user: {
		isAuthenticated: boolean;
		authDetails: {
			provider: "google" | "facebook" | "email";
			email: string;
			photoURL: string;
			displayName: string;			
		}
	}

	personalDetails: {
		name: string;
		height: number;
		weight: number;
		age: number;
	}

	reminders: { startDate: Date; endDate: Date; time: string[]; task: string }[];
	feedsInterested: string[];
	appSettings: {
		theme: "light" | "dark";
		notifications: boolean;		
	}
}
