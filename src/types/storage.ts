export interface StorageType {
	onboarding: {
		completed: boolean;
		user: {
			name: string;
			height: number;
			weight: number;
		};
	};
	reminders: { startDate: Date; endDate: Date; time: string[]; task: string }[];
	feedsInterested: string[];
}
