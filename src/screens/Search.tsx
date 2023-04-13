import React, { useState } from "react";
import {
	Keyboard,
	ScrollView,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import Layout from "@components/common/Layout";
import { Input } from "native-base";
import { useUserStore } from "../hooks/useStore";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";

const Search = ({ navigation }) => {
	const [query, setQuery] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [results, setResults] = useState([
		"Here are some natural ways to potentially increase height for a male of age 22, 180cm tall, and weighing 76kg:",
		"**Get proper nutrition:** Eating a balanced diet with adequate amounts of protein, vitamins, and minerals is essential for healthy growth. Foods high in calcium, such as dairy products, leafy greens, and fortified cereals, can help strengthen bones.",
		"**Exercise regularly:** Engaging in physical activities like swimming, cycling, and stretching can help improve posture and increase flexibility. Weight-bearing exercises like running and jumping may also stimulate bone growth.",
		"**Get enough sleep:** Getting enough restful sleep is important for overall health and growth. Aim for 7-9 hours of sleep per night.",
		"**Avoid smoking and alcohol:** Smoking and excessive alcohol consumption can inhibit growth and cause other health problems. It's important to keep in mind that genetics and other factors may play a significant role in determining height, and there is no guaranteed way to increase it naturally.",
	]);

	// const [results, setResults] = useState([]);
	const { age, gender, height, weight } = useUserStore((s) => s);

	const queryHandler = async () => {
		Keyboard.dismiss();
		if (!query.trim()) return;

		setLoading(true);
		const url = "https://ora.sh/api/conversation";
		const chatbotId = "3084782d-dae1-453a-85f0-49161fee40b5";
		const userId = "a234d5e0-af4b-40da-aff4-1df18a990d8f";

		const payload = {
			chatbotId: chatbotId,
			input:
				query +
				` for a ${gender}, of age ${age}, ${height}cm tall weighing ${weight}kg `,
			userId: userId,
			includeHistory: false,
			model: "gpt-4",
			provider: "OPEN_AI",
		};

		console.log(payload.input);
		try {
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Referer: "https://ora.sh/openai/gpt4",
					Origin: "https://ora.sh",
					"User-Agent":
						"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
				},
				body: JSON.stringify(payload),
			});

			const data = await response.json();
			console.log(data);

			let resp = data.response;
			// resp = JSON.parse(resp);
			console.log("resp", resp);
			resp = resp.split("- ").filter((item) => item);

			setResults(resp);
			setLoading(false);
			setError(false);
		} catch (err) {
			console.log("here");
			console.log(err.message);
			setLoading(false);
			setError(true);
		}
	};

	const addReminder = (task: string) => {
		navigation.navigate("Add Reminder", {
			task,
			reminderType: "Personal Growth",
		});
	};

	return (
		<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
			<Layout pageHeading="Search">
				<View className="flex-row items-center gap-4">
					<View className="flex-1">
						<Input
							variant="filled"
							size="lg"
							className="rounded-md bg-gray-200"
							placeholder="Email"
							value={query}
							onChangeText={(text) => setQuery(text)}
						/>
					</View>
					<TouchableOpacity onPress={queryHandler}>
						<AntDesign
							name="search1"
							size={24}
							className="text-black dark:text-slate-200"
						/>
					</TouchableOpacity>
				</View>

				<ScrollView showsVerticalScrollIndicator={false} className="mt-2 mb-16">
					<SearchBody
						error={error}
						loading={loading}
						results={results}
						addReminder={addReminder}
					/>
				</ScrollView>
			</Layout>
		</TouchableWithoutFeedback>
	);
};

const SearchBody = ({ error, loading, results, addReminder }) => {
	console.log(results);
	if (error) {
		return (
			<Text className="text-lg font-medium text-gray-900 dark:text-slate-100">
				error
			</Text>
		);
	} else if (loading) {
		return (
			<Text className="text-lg font-medium text-gray-900 dark:text-slate-100">
				loading
			</Text>
		);
	} else if (results?.length > 0) {
		console.log(typeof results);
		console.log("results", results);
		return (
			<View className="my-2">
				{results.map((item, index) => (
					<View
						key={index}
						className="flex-row my-2 w-full items-center border-[0.2px] border-gray-400 dark:border-gray-500 rounded-xl"
					>
						<Text
							className={`break-words mr-2 p-2 text-lg font-medium text-black dark:text-slate-200`}
							style={{ width: "85%" }}
						>
							{item}
						</Text>

						<TouchableOpacity
							className=" h-full flex-row items-center justify-center bg-blue-100 dark:bg-blue-400 rounded-r-xl rounded-e-xl"
							style={{ width: "12.75%" }}
							onPress={() => addReminder(item)}
						>
							<MaterialIcons
								name="add-task"
								size={24}
								className="text-black dark:text-slate-200"
							/>
						</TouchableOpacity>
					</View>
				))}
			</View>
		);
	} else {
		return (
			<Text className="text-lg font-medium text-gray-900 dark:text-slate-100">
				Please enter you query
			</Text>
		);
	}
};

export default Search;
