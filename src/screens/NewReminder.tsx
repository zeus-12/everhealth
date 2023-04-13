import Layout from "@/components/common/Layout";
import { Button, FormControl, Input, WarningOutlineIcon } from "native-base";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { z } from "zod";

import { Text } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";

const NewReminder = ({ route }) => {
	const { reminderType, task: newTask } = route.params;

	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [time, setTime] = useState("");
	const [task, setTask] = useState(newTask ? newTask : "");

	console.log(newTask);

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

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<FormValues>({ resolver: zodResolver(schema) });

	return (
		<Layout
			pageHeading={`New ${reminderType}`}
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
						<FormControl isRequired isInvalid={!!errors[task]?.message}>
							<Input
								size="lg"
								placeholder={"Enter the Task"}
								// mode="outlined"
								contextMenuHidden={true}
								onChangeText={setTask}
								value={task}
							/>
							<FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
								Invalid task name
							</FormControl.ErrorMessage>
						</FormControl>
					</View>
				)}
				name="task"
			/>

			{/* start date */}
			{/* end date */}

			{/* time */}
			{/* add button */}

			<Button
				size="lg"
				px={"5"}
				py={"2"}
				className="absolute bottom-10 right-0 "
				onPress={handleSubmit(onSubmit)}
				variant="subtle"
				colorScheme="secondary"
			>
				Add
			</Button>
		</Layout>
	);
};
export default NewReminder;
