import { Controller, useForm } from "react-hook-form";
import { Keyboard, Text, TouchableWithoutFeedback, View } from "react-native";
import { SCREEN_HEIGHT } from "../../lib/constants";
import {
	Button,
	FormControl,
	Input,
	Radio,
	WarningOutlineIcon,
} from "native-base";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUserStore } from "../../hooks/useStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../lib/db";

interface FormValues {
	name: string;
	age: string;
	height: string;
	weight: string;
	gender: string;
}

const schema = z.object({
	name: z
		.string({
			required_error: "Name is required",
			invalid_type_error: "Name must be a string",
		})
		.min(4, { message: "Should be atleast 4 characters long." }),
	age: z
		.string({
			required_error: "Age is required",
		})
		.refine(
			(val) => !isNaN(Number(val)) && Number(val) > 10 && Number(val) < 100,
			{ message: "Invalid Age" }
		),
	weight: z
		.string({
			required_error: "Weight is required",
		})
		.refine(
			(val) => !isNaN(Number(val)) && Number(val) > 30 && Number(val) < 300,
			{ message: "Invalid weight" }
		),
	height: z
		.string({
			required_error: "Height is required",
		})
		.refine(
			(val) => !isNaN(Number(val)) && Number(val) > 30 && Number(val) < 300,
			{ message: "Invalid height" }
		),
	gender: z.enum(["MALE", "FEMALE"]),
});

const PersonalData = () => {
	const { setHasOnBoarded, setHeight, setAge, setWeight, setName, setGender } =
		useUserStore((s) => {
			return s;
		});

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<FormValues>({ resolver: zodResolver(schema) });

	const onSubmit = (data) => {
		if (Object.keys(errors).length === 0) {
			setHasOnBoarded(true);
			setHeight(Number(data.height));
			setAge(Number(data.age));
			setWeight(Number(data.weight));
			setName(data.name);
			setGender(data.gender);
		}

		db.transaction((tx) => {
			tx.executeSql(
				"CREATE TABLE IF NOT EXISTS reminders (id TEXT PRIMARY KEY NOT NULL, group_id TEXT NOT NULL, date TEXT NOT NULL, isCompleted BOOLEAN NOT NULL, time TEXT NOT NULL, task TEXT NOT NULL, type TEXT NOT NULL);",
				[],
				(_, result) => {
					// success callback
				},
				(_, error) => {
					// error callback
					return true; // Rollback the transaction
				}
			);
		}, null);
	};

	const formEntries = [
		{
			label: "Name",
			title: "name",
			text: "What should we call you?",
			isNumeric: false,
			type: "FORM",
		},
		{
			label: "Age",
			title: "age",
			text: "How old are you?",
			isNumeric: true,
			type: "FORM",
		},
		{
			label: "Gender",
			title: "gender",
			text: "What do you identify as?",
			isNumeric: false,
			type: "RADIO",
		},

		{
			label: "Height (in cm)",
			title: "height",
			text: "How tall are you?",
			isNumeric: true,
			type: "FORM",
		},
		{
			label: "Weight (in kg)",
			title: "weight",
			text: "How heavy are you?",
			isNumeric: true,
			type: "FORM",
		},
	] as const;

	return (
		<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
			<SafeAreaView className="mx-4" style={{ minHeight: SCREEN_HEIGHT }}>
				<Text className="text-3xl font-semibold tracking-tighter">
					Hello there, 🙌
				</Text>
				<Text className="text-gray-600 text-xl font-medium tracking-tighter">
					Help us to get to know you better.
				</Text>

				<View className="mt-4">
					{formEntries.map((item) => (
						<Controller
							key={item.label}
							control={control}
							rules={{
								required: true,
							}}
							render={({ field: { onChange, onBlur, value } }) => (
								<View className="mb-3">
									<Text className="font-semibold text-xl">{item.text}</Text>
									<FormControl isRequired isInvalid={!!errors[item.title]?.message}>
										{item.type === "FORM" ? (
											<Input
												size="lg"
												placeholder={item.label}
												// mode="outlined"
												keyboardType={item.isNumeric ? "numeric" : "default"}
												onBlur={onBlur}
												contextMenuHidden={true}
												onChangeText={onChange}
												value={value}
											/>
										) : (
											<Radio.Group
												name="exampleGroup"
												accessibilityLabel="select prize"
												onChange={onChange}
												value={value}
												// defaultValue={groupValue}
												// onChange={(value) => {
												// 	setGroupValue(value || "");
												// }}
											>
												<Radio value="MALE" my="1">
													Male
												</Radio>
												<Radio value="FEMALE" my="1">
													Female
												</Radio>
											</Radio.Group>
										)}
										<FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
											{errors[item.title]?.message}
										</FormControl.ErrorMessage>
									</FormControl>
								</View>
							)}
							name={item.title}
						/>
					))}
				</View>

				<Button
					size="lg"
					px={"5"}
					py={"2"}
					className="absolute bottom-10 right-0 "
					onPress={handleSubmit(onSubmit)}
					variant="subtle"
					colorScheme="secondary"
				>
					Next
				</Button>
			</SafeAreaView>
		</TouchableWithoutFeedback>
	);
};
export default PersonalData;
