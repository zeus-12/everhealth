import React, { useState } from "react";
import {
	Keyboard,
	ScrollView,
	Text,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import Layout from "@components/common/Layout";
import { Input } from "native-base";

const Search = () => {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState([]);

	const queryHandler = () => {
		if (!query.trim()) return;

		// send req to gpt
	};

	return (
		<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
			<Layout pageHeading="Search">
				<Input
					variant="filled"
					size="lg"
					className="rounded-md bg-gray-200"
					placeholder="Email"
					// mode="flat"
					// left={<TextInput.Icon icon="magnify" />}
					value={query}
					onChangeText={(text) => setQuery(text)}
				/>

				<ScrollView>
					{results.length > 0 ? (
						<View>{/* print result from gpt */}</View>
					) : (
						<Text>no results</Text>
					)}
				</ScrollView>
			</Layout>
		</TouchableWithoutFeedback>
	);
};
export default Search;
