import Layout from "@/components/common/Layout";
import { Button, FormControl, Input, WarningOutlineIcon } from "native-base";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { z } from "zod";
import { Text } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker from "@components/common/DatePicker";
import dayjs from "dayjs";
import { useAppSettings } from "@/hooks/useStore";
import { EvilIcons } from "@expo/vector-icons";
import { randomUUID } from "expo-crypto";
import { ReminderType } from "@/types/storage";
import { db } from "@/lib/db";
import { Keyboard } from "react-native";
import { convertTimeTo12Hour } from "@/lib/utils";
import AddTimeModal from "@/components/reminders/AddTimeModal";

interface FormValues {
	task: string;
}

const NewReminder = ({ navigation, route }) => {
	const { reminderType, task: newTask } = route.params;
	const isDarktheme = useAppSettings((s) => s.isDarktheme);

	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());
	const [times, setTimes] = useState([]);
	const [timesError, setTimesError] = useState("");
	const [dateError, setDateError] = useState("");
	const [showTimeModal, setShowTimeModal] = useState(false);

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

	const schema = z.object({
		task: z
			.string({
				required_error: "Task is required",
				invalid_type_error: "Task must be a string",
			})
			.min(4, { message: "Should be atleast 4 characters long." }),
	});

	const addGroupedReminder = ({
		dates,
		task,
		type,
		times,
	}: {
		dates: string[];
		task: string;
		type: ReminderType;
		times: string[];
	}) => {
		const group_id = randomUUID();

		dates.forEach((date) => {
			times.forEach((time) => {
				const reminderPayload = {
					task,
					type,
					date,
					time,
					isCompleted: false,
					id: randomUUID(),
					group_id,
				};
				addIndividualTask(reminderPayload);
			});
		});
	};

	const addIndividualTask = (taskPayload) => {
		const { task, isCompleted, type, date, time, id, group_id } = taskPayload;

		db.transaction((tx) => {
			tx.executeSql(
				"INSERT INTO reminders (task, isCompleted, type, date, time, id, group_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
				[task, isCompleted ? 1 : 0, type, date, time, id, group_id],
				(_, result) => {
					navigation.reset({
						index: 0,
						routes: [{ name: "Home" }],
					});
				},
				(tx, error) => {
					console.log(`Error inserting row: ${error.message}`);
					return true; // Rollback the transaction
				}
			);
		}, null);
	};

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

		console.log(days, times, data.task, reminderType);
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
		<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
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
						<DatePicker
							date={startDate}
							setDate={setStartDate}
							isDarktheme={isDarktheme}
						/>
					</View>

					<View>
						<Text className="text-black dark:text-slate-100 text-xl font-semibold">
							End Date
						</Text>

						<DatePicker
							date={endDate}
							setDate={setEndDate}
							isDarktheme={isDarktheme}
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
		</TouchableWithoutFeedback>
	);
};
export default NewReminder;
