import DateTimePicker from "@react-native-community/datetimepicker";
import { Button, Modal } from "native-base";
import { useState } from "react";
import { View } from "react-native";

const AddTimeModal = ({
	showTimeModal,
	isDarktheme,
	setShowTimeModal,
	addTime,
}) => {
	const [curTime, setCurTime] = useState(new Date());

	return (
		<Modal isOpen={showTimeModal} onClose={() => setShowTimeModal(false)}>
			<Modal.CloseButton />
			<View className="p-4 bg-white dark:bg-black rounded-xl">
				<DateTimePicker
					value={curTime}
					onChange={(event, selectedDate) => {
						setCurTime(selectedDate);
					}}
					themeVariant={isDarktheme ? "dark" : "light"}
					mode="time"
					display="spinner"
				/>
				<Button
					onPress={() => {
						setShowTimeModal(false);
						addTime(curTime);
					}}
				>
					Add
				</Button>
			</View>
		</Modal>
	);
};
export default AddTimeModal;
