import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Types {
	hasOnboarded: boolean;
	setHasOnBoarded: (hasOnboarded: boolean) => void;
}

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

			height: 0,
			setHeight: (height: number) => set({ height }),

			weight: 0,
			setWeight: (weight: number) => set({ weight }),

			age: 0,
			setAge: (age: number) => set({ age }),

			resetAll: () => {
				set({ hasOnboarded: false });
				set({ isAuthenticatedAsGuest: false });
				set({ name: "" });
				set({ height: 0 });
				set({ weight: 0 });
				set({ age: 0 });
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
				set({ theme: "light" });
				set({ allowNotifications: false });
			},
		}),
		{
			name: "app-data", // unique name
			getStorage: () => AsyncStorage, // Add this here!
		}
	)
);
