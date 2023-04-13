import Layout from "@/components/common/Layout";
import { Button, FormControl, Input, WarningOutlineIcon } from "native-base";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { TouchableOpacity, View } from "react-native";
import { z } from "zod";
import { Text } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@react-native-community/datetimepicker";

const NewReminder = ({ route }) => {
	const { reminderType, task: newTask } = route.params;

	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());
	const [times, setTimes] = useState([]);

	const [showTimeModal, setShowTimeModal] = useState(false);

	const addTime = (time) => {
		setTimes((prev) => [...prev, time]);
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
		console.log(data);
	};

	const prettifyReminder = (reminderType: string) => {
		const reminderSplit = reminderType.split("_");
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

			<Text className="text-black dark:text-slate-100">Start Date</Text>
			<DateTimePicker
				value={startDate}
				onChange={(event, selectedDate) => {
					// Handle date change here
					if (event.type === "set") {
						setStartDate(selectedDate);
					}
				}}
				// todo fix type here
				// themeVariant={isDarktheme ? "dark" : "light"}
				maximumDate={new Date(2024, 10, 20)}
				minimumDate={new Date(2023, 0, 1)}
				mode="date"
			/>

			<Text className="text-black dark:text-slate-100">End Date</Text>
			<DateTimePicker
				value={endDate}
				onChange={(event, selectedDate) => {
					if (event.type === "set") {
						setEndDate(selectedDate);
					}
				}}
				// themeVariant={isDarktheme ? "dark" : "light"}
				maximumDate={new Date(2024, 10, 20)}
				minimumDate={new Date(2023, 0, 1)}
				mode="date"
			/>

			<Text className="text-black dark:text-slate-100">Times</Text>
			{times?.map((time) => (
				<Text className="text-black dark:text-slate-100">{time}</Text>
			))}
			<TouchableOpacity onPress={showAddTimeModal}>
				<Text>+</Text>
			</TouchableOpacity>

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

			{showTimeModal && (
				<DateTimePicker
					value={new Date()}
					onChange={(event, selectedDate) => {
						if (event.type === "set") {
							addTime(selectedDate);
							setShowTimeModal(false);
						}
					}}
					// themeVariant={isDarktheme ? "dark" : "light"}
					mode="time"
				/>
			)}
		</Layout>
	);
};
export default NewReminder;
