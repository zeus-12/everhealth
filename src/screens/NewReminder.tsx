import Layout from "@/components/common/Layout";
import {
	Button,
	FormControl,
	Input,
	Modal,
	WarningOutlineIcon,
} from "native-base";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { TouchableOpacity, View } from "react-native";
import { z } from "zod";
import { Text } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import { useAppSettings } from "@/hooks/useStore";
import { EvilIcons } from "@expo/vector-icons";

const NewReminder = ({ route }) => {
	// const { reminderType, task: newTask } = route.params;
	const reminderType = "hellp";
	const newTask = "hello";
	const isDarktheme = useAppSettings((s) => s.isDarktheme);

	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());
	const [times, setTimes] = useState([]);
	const [timesError, setTimesError] = useState("");
	const [dateError, setDateError] = useState("");
	const [showTimeModal, setShowTimeModal] = useState(false);

	const convertTimeTo12Hour = (time: string) => {
		const splitTime = time.split(":");
		const hour = splitTime[0];
		const minutes = splitTime[1];

		const ampm = parseInt(hour) >= 12 ? "PM" : "AM";
		const hour12 = parseInt(hour) % 12 || 12;

		return `${hour12}:${minutes} ${ampm}`;
	};

	const removeTimeFromSelectedTimesByIndex = (index: number) => {
		const newTimes = times.filter((_, i) => i !== index);
		setTimes(newTimes);
	};

	const addTime = (time) => {
		setTimes((prev) => [...prev, dayjs(time)?.format("HH:mm")]);
	};

	const showAddTimeModal = () => {
		setShowTimeModal(true);
	};

	interface FormValues {
		task: string;
	}

	const schema = z.object({
		task: z
			.string({
				required_error: "Task is required",
				invalid_type_error: "Task must be a string",
			})
			.min(4, { message: "Should be atleast 4 characters long." }),
	});

	const onSubmit = (data) => {
		setDateError("");
		setTimesError("");

		const startdate = dayjs(startDate);
		const enddate = dayjs(endDate);

		if (enddate.isBefore(startdate) && !enddate.isSame(startdate, "minutes")) {
			setDateError("End date should be after start date");
			return;
		}
		if (times.length === 0) {
			setTimesError("Please select atleast one time slot");
			return;
		}

		const days = [];
		let current = startdate;

		while (current.isBefore(enddate) || current.isSame(enddate, "minutes")) {
			console.log(
				"current",
				current.format("YYYY-MM-DD"),
				current.isSame(enddate)
			);

			days.push(current.format("YYYY-MM-DD"));
			current = current.add(1, "day");
		}

		addGroupedReminder({
			dates: days,
			times,
			task: data.task,
			type: reminderType,
		});
	};

	const prettifyReminder = (reminderType: string) => {
		const reminderSplit = reminderType?.split("_");
		const reminderPrettified = reminderSplit
			.map((word) => word[0] + word.slice(1).toLowerCase())
			.join(" ");
		return reminderPrettified;
	};

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<FormValues>({
		defaultValues: { task: newTask || "" },
		resolver: zodResolver(schema),
	});

	return (
		<Layout
			pageHeading={`New ${prettifyReminder(reminderType)}`}
			showBackButton={true}
			showAddTasksButton={false}
		>
			<Controller
				control={control}
				rules={{
					required: true,
				}}
				render={({ field: { onChange, onBlur, value } }) => (
					<View className="mb-3">
						<Text className="font-semibold text-xl">Enter task</Text>
						<FormControl isRequired isInvalid={!!errors["task"]?.message}>
							<Input
								className="bg-gray-200 dark:text-slate-200 dark:bg-slate-700"
								size="lg"
								placeholder={"Enter the Task"}
								// mode="outlined"
								onBlur={onBlur}
								contextMenuHidden={true}
								onChangeText={onChange}
								value={value}
							/>
							<FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
								Invalid task name
							</FormControl.ErrorMessage>
						</FormControl>
					</View>
				)}
				name="task"
			/>

			<View className="flex-row justify-between">
				<View>
					<Text className="text-black dark:text-slate-100 text-xl font-semibold">
						Start Date
					</Text>
					<DateTimePicker
						value={startDate}
						themeVariant={isDarktheme ? "dark" : "light"}
						onChange={(event, selectedDate) => {
							// Handle date change here
							if (event.type === "set") {
								setStartDate(selectedDate);
							}
						}}
						// todo fix type here
						maximumDate={new Date(2024, 10, 20)}
						minimumDate={new Date(2023, 0, 1)}
						mode="date"
					/>
				</View>

				<View>
					<Text className="text-black dark:text-slate-100 text-xl font-semibold">
						End Date
					</Text>
					<DateTimePicker
						value={endDate}
						onChange={(event, selectedDate) => {
							if (event.type === "set") {
								setEndDate(selectedDate);
							}
						}}
						themeVariant={isDarktheme ? "dark" : "light"}
						maximumDate={new Date(2024, 10, 20)}
						minimumDate={new Date(2023, 0, 1)}
						mode="date"
					/>
				</View>
			</View>

			{dateError && (
				<Text className="mt-4 text-red-400 font-semibold">{dateError}</Text>
			)}

			<View className="flex-row gap-4 mt-2">
				<Text className="text-black dark:text-slate-100 text-xl font-semibold">
					Times
				</Text>
				{times.length < 3 && (
					<TouchableOpacity
						className="bg-gray-300 dark:bg-gray-700 rounded-full justify-center items-center w-8 h-8"
						onPress={showAddTimeModal}
					>
						<Text className="dark:text-slate-100 text-2xl">+</Text>
					</TouchableOpacity>
				)}
			</View>

			<View className="flex-row gap-2 my-2">
				{times?.map((time, index) => (
					<View
						key={index}
						className="bg-gray-200 dark:bg-gray-800 flex-row p-2 rounded-lg"
					>
						<Text className="text-black dark:text-slate-100 mr-2">
							{convertTimeTo12Hour(time)}
						</Text>
						<TouchableOpacity
							onPress={() => removeTimeFromSelectedTimesByIndex(index)}
						>
							<EvilIcons
								name="close"
								size={24}
								className="text-black dark:text-slate-100"
							/>
						</TouchableOpacity>
					</View>
				))}
			</View>
			<Text className="text-gray-600 dark:text-gray-200">
				Add upto 3 time slots per day
			</Text>

			{timesError && (
				<Text className="mt-4 text-red-400 font-semibold">{timesError}</Text>
			)}

			<Button
				size="lg"
				px={"5"}
				py={"2"}
				className="absolute bottom-10 right-0 dark:bg-gray-900"
				onPress={handleSubmit(onSubmit)}
				variant="subtle"
				colorScheme="secondary"
			>
				Add
			</Button>

			{showTimeModal && times.length < 3 && (
				<AddTimeModal
					showTimeModal={showTimeModal}
					isDarktheme={isDarktheme}
					setShowTimeModal={setShowTimeModal}
					addTime={addTime}
				/>
			)}
		</Layout>
	);
};
export default NewReminder;

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
