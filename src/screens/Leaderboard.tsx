import { Text, View } from "react-native";
import Layout from "../components/common/Layout";

const Leaderboard = ({ navigation }) => {
	const SCORE_DATA = [
		{
			name: "Amar",
			streak: 5,
			total: 7,
		},

		{
			name: "Vishnu",
			streak: 3,
			total: 4,
		},
		{
			name: "Nishan",
			streak: 2,
			total: 3,
		},
		{
			name: "Abhaumika",
			streak: 1,
			total: 1,
		},
		{
			name: "Test",
			streak: 0,
			total: 0,
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
