import AsyncStorage from "@react-native-async-storage/async-storage";

export const getParsedData = (data: string) => {
	try {
		const parsedData = JSON.parse(data) || [];
		return parsedData;
	} catch (err) {
		console.log("Error parsing data:", err.message);
		return null;
	}
};

export const storeData = async (key: string, value: any) => {
	try {
		if (typeof value === "object") {
			value = JSON.stringify(value);
		} else if (typeof value === "number") {
			value = value.toString();
		}

		await AsyncStorage.setItem(key, value);
	} catch (err) {}
};

export const getData = async (key: string) => {
	let value: any;
	try {
		value = await AsyncStorage.getItem(key);
	} catch (e) {
		// error reading value
	}

	// look for a better way
	try {
		const res = JSON.stringify(value);
		return res;
	} catch (err) {
		return value;
	}
};
