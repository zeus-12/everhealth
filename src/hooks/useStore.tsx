import AsyncStorage from "@react-native-async-storage/async-storage";
import { randomUUID } from "expo-crypto";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create<any>(
	persist(
		(set, get) => ({
			hasOnboarded: false,
			setHasOnBoarded: (hasOnboarded: boolean) => set({ hasOnboarded }),

			isAuthenticatedAsGuest: false,
			setIsAuthenticatedAsGuest: (isAuthenticatedAsGuest: boolean) =>
				set({ isAuthenticatedAsGuest }),

			name: "",
			setName: (name: string) => set({ name }),

			gender: "",
			setGender: (gender: Gender) => set({ gender }),

			height: 0,
			setHeight: (height: number) => set({ height }),

			weight: 0,
			setWeight: (weight: number) => set({ weight }),

			age: 0,
			setAge: (age: number) => set({ age }),

			userId: 0,
			generateUserId: () => {
				set({ userId: randomUUID() });
			},

			resetAll: () => {
				set({
					hasOnboarded: false,
					isAuthenticatedAsGuest: false,
					name: "",
					height: 0,
					weight: 0,
					age: 0,
					gender: "",
					userId: 0,
				});
			},
		}),
		{
			name: "user-storage",
			getStorage: () => AsyncStorage,
		}
	)
);

export const useAppSettings = create<any>(
	persist(
		(set, get) => ({
			isDarktheme: false,
			setIsDarktheme: (isDarktheme: boolean) => set({ isDarktheme }),

			allowNotifications: false,
			setAllowNotifications: (allowNotifications: boolean) =>
				set({ allowNotifications }),

			streak: 0,
			setStreak: (streak: number) => set({ streak }),

			resetAll: () => {
				set({ isDarktheme: false });
				set({ allowNotifications: false });
				set({ streak: 0 });
			},
		}),
		{
			name: "app-data",
			getStorage: () => AsyncStorage,
		}
	)
);

enum Gender {
	MALE = "MALE",
	FEMALE = "FEMALE",
}
