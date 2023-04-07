import React from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import Layout from "@components/common/Layout";

const User = () => {
	const userSettings = [{}];

	return (
		<Layout pageHeading="User">
			<ScrollView>
				{/* usericon */}
				<Text>username</Text>

				{/* usersettings */}
				<View></View>
			</ScrollView>
		</Layout>
	);
};
export default User;
