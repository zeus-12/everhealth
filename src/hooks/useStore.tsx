import AsyncStorage from "@react-native-async-storage/async-storage";
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

			resetAll: () => {
				set({
					hasOnboarded: false,
					isAuthenticatedAsGuest: false,
					name: "",
					height: 0,
					weight: 0,
					age: 0,
					gender: "",
				});
			},
		}),
		{
			name: "user-storage", // unique name
			getStorage: () => AsyncStorage, // Add this here!
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

			resetAll: () => {
				set({ isDarktheme: false });
				set({ allowNotifications: false });
			},
		}),
		{
			name: "app-data", // unique name
			getStorage: () => AsyncStorage, // Add this here!
		}
	)
);

enum Gender {
	MALE = "MALE",
	FEMALE = "FEMALE",
}
