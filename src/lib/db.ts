import { Platform } from "react-native";
import * as SQLite from "expo-sqlite";

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
export const deleteDatabase = () => {
	db.transaction((tx) => {
		tx.executeSql("DROP DATABASE db.db;", [], () => {
			console.log("Database deleted");
		});
	});
};

export const deleteTable = (tableName: string) => {
	db.transaction((tx) => {
		tx.executeSql(`DROP TABLE IF EXISTS ${tableName}`);
	});
};
