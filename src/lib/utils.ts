import * as SQLite from "expo-sqlite";
import { Platform } from "react-native";

export const getParsedData = (data: string) => {
	try {
		const parsedData = JSON.parse(data) || [];
		return parsedData;
	} catch (err) {
		console.log("Error parsing data:", err.message);
		return null;
	}
};

function openDatabase() {
	if (Platform.OS === "web") {
		return {
			transaction: () => {
				return {
					executeSql: () => {},
				};
			},
		};
	}
	const db = SQLite.openDatabase("db.db");
	return db;
}

export const db = openDatabase();
