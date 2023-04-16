import RNDateTimePicker, {
	DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import { View } from "native-base";
import { useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import { Platform } from "react-native";

const DateTimePicker = ({ date, setDate, isDarktheme }) => {
	// const [showPicker, setShowPicker] = useState(false);

	const onChange = (event, selectedDate) => {
		const currentDate = selectedDate;
		setDate(currentDate);
	};

	const showPicker = () => {
		DateTimePickerAndroid.open({
			value: date,
			onChange: onChange,
			mode: "date",
			is24Hour: true,
		});
	};
	const isIOS = Platform.OS === "ios";

	if (isIOS) {
		return (
			<View className="mt-6">
				<RNDateTimePicker
					value={date}
					onChange={(event, selectedDate) => {
						if (event.type === "set") {
							setDate(selectedDate);
						}
					}}
					themeVariant={isDarktheme ? "dark" : "light"}
					maximumDate={new Date(2024, 10, 20)}
					minimumDate={new Date(2023, 0, 1)}
				/>
			</View>
		);
	} else {
		return (
			<View className="mt-6">
				<TouchableOpacity
					onPress={showPicker}
					className="bg-gray-300 px-2 py-1 rounded-md dark:bg-gray-600"
				>
					<Text className="dark:text-slate-100 text-lg">
						{dayjs(date).format("D-MMM-YYYY")}
					</Text>
				</TouchableOpacity>

				{/* {showPicker && (
					<RNDateTimePicker
						value={date}
						onChange={(event, selectedDate) => {
							if (event.type === "set") {
								setDate(selectedDate);
							}
							console.log("set");
							setShowPicker(false);
						}}
						themeVariant={isDarktheme ? "dark" : "light"}
						maximumDate={new Date(2024, 10, 20)}
						minimumDate={new Date(2023, 0, 1)}
					/>
				)} */}
			</View>
		);
	}
};

export default DateTimePicker;
