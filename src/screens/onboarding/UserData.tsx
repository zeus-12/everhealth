import { useState } from "react";
import { Controller, Resolver, useForm } from "react-hook-form";
import { SafeAreaView, Text, View } from "react-native";
import { SCREEN_HEIGHT } from "../../lib/constants";
import { Button, FormControl, Input, WarningOutlineIcon } from "native-base";

interface FormValues {
	name: string;
	age: string;
	height: string;
	weight: string;
}

// use select element for gender

const resolver: Resolver<FormValues> = async (values) => {
	return {
		values: values.name ? values : {},
		errors: !values.name
			? {
					firstName: {
						type: "required",
						message: "This is required.",
					},
			  }
			: {},
	};
};

const PersonalData = () => {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<FormValues>({ resolver });

	const onSubmit = (data) => {
		console.log(data);
	};

	const formEntries = [
		{
			label: "Name",
			title: "name",
			text: "What should we call you?",
		},
		{
			label: "Age",
			title: "age",
			text: "How old are you?",
		},
		{
			label: "Height (in cm)",
			title: "height",
			text: "How tall are you?",
		},
		{
			label: "Weight (in kg)",
			title: "weight",
			text: "How heavy are you?",
		},
	] as const;

	return (
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
								<FormControl>
									<Input
										size="lg"
										placeholder={item.label}
										// mode="outlined"
										onBlur={onBlur}
										onChangeText={onChange}
										value={value}
									/>
									<FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
										Try different from previous passwords.
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
			>
				Next
			</Button>
		</SafeAreaView>
	);
};
export default PersonalData;
