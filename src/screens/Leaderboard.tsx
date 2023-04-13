import { Text, View } from "react-native";
import Layout from "../components/common/Layout";

const Leaderboard = ({ navigation }) => {
	const SCORE_DATA = [
		{
			name: "John",
			streak: 5,
			total: 50,
		},

		{
			name: "Jordan",
			streak: 15,
			total: 20,
		},
		{
			name: "George",
			streak: 10,
			total: 60,
		},
		{
			name: "Jordan",
			streak: 15,
			total: 20,
		},
		{
			name: "George",
			streak: 10,
			total: 60,
		},
		{
			name: "Jordan",
			streak: 15,
			total: 20,
		},
		{
			name: "George",
			streak: 10,
			total: 60,
		},
	];
	return (
		<Layout
			pageHeading="Leaderboard"
			showBackButton={true}
			onBackButtonPress={() => navigation.goBack()}
		>
			<View className="space-y-5 mt-4">
				{SCORE_DATA.map((score, index) => (
					<View className="flex-row justify-between" key={index}>
						<Text className="text-xl font-semibold dark:text-slate-100">
							{score.name}
						</Text>
						<View className="flex-row gap-12">
							<Text className="text-xl dark:text-slate-100">🔥 {score.streak}</Text>
							<Text className="text-xl dark:text-slate-100">🏆 {score.total}</Text>
						</View>
					</View>
				))}
			</View>
		</Layout>
	);
};
export default Leaderboard;
