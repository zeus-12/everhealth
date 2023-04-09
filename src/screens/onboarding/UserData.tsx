import { Controller, useForm } from "react-hook-form";
import { Keyboard, Text, TouchableWithoutFeedback, View } from "react-native";
import { SCREEN_HEIGHT } from "../../lib/constants";
import { Button, FormControl, Input, WarningOutlineIcon } from "native-base";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUserStore } from "../../hooks/useStore";
import { SafeAreaView } from "react-native-safe-area-context";

interface FormValues {
	name: string;
	age: string;
	height: string;
	weight: string;
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
});

const PersonalData = () => {
	const { setHasOnBoarded, setHeight, setAge, setWeight, setName } =
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
		}
	};

	const formEntries = [
		{
			label: "Name",
			title: "name",
			text: "What should we call you?",
			isNumeric: false,
		},
		{
			label: "Age",
			title: "age",
			text: "How old are you?",
			isNumeric: true,
		},
		{
			label: "Height (in cm)",
			title: "height",
			text: "How tall are you?",
			isNumeric: true,
		},
		{
			label: "Weight (in kg)",
			title: "weight",
			text: "How heavy are you?",
			isNumeric: true,
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
