import {
	View,
	Text,
	Animated,
	TouchableHighlight,
	StyleSheet,
	TouchableOpacity,
} from "react-native";
import { db } from "../../lib/db";
import { useRef, useState } from "react";
import { SCREEN_WIDTH } from "../../lib/constants";
import { Checkbox } from "native-base";
import { AntDesign } from "@expo/vector-icons";
import { SwipeListView } from "react-native-swipe-list-view";

const TasksCard = ({
	bgColor,
	title,
	tasks,
	emptyTasksMessage,
	fetchRemindersByDate,
	deleteReminderById,
	textBgColor,
}) => {
	const rowTranslateAnimatedValues = {};
	Array(tasks.length)
		.fill("")
		.forEach((_, i) => {
			rowTranslateAnimatedValues[`${i}`] = new Animated.Value(1);
		});

	const updateTaskStatus = (id: string, isCompleted: boolean) => {
		db.transaction((tx) => {
			// todo make sure the date is date.now() format it accodingly
			tx.executeSql(
				"UPDATE reminders SET isCompleted = ? WHERE id = ?",
				[isCompleted ? 1 : 0, id],
				(_, result) => {
					console.log(`Rows updated: ${result.rowsAffected}`);
					fetchRemindersByDate(tx);
				},
				(tx, error) => {
					console.log(`Error updating row: ${error.message}`);
					return true; // Rollback the transaction
				}
			);
		}, null);
	};
	const animationIsRunning = useRef(false);

	const onSwipeValueChange = (swipeData) => {
		const { key, value } = swipeData;
		if (value < -SCREEN_WIDTH / 8 && !animationIsRunning.current) {
			animationIsRunning.current = true;
			Animated.timing(rowTranslateAnimatedValues[key], {
				toValue: 0,
				duration: 200,
				useNativeDriver: false,
			}).start(() => {
				const itemToDelete = tasks.find((item) => item.key === key);
				deleteReminderById(itemToDelete.id);
				animationIsRunning.current = false;
			});
		}
	};

	const renderItem = (data) => {
		const task = data.item;
		return (
			<Animated.View
				style={[
					{
						height: rowTranslateAnimatedValues[data.item.key].interpolate({
							inputRange: [0, 1],
							outputRange: [0, 65],
						}),
					},
				]}
			>
				<TouchableHighlight
					onPress={() => console.log("You touched me")}
					style={styles.rowFront}
					// underlayColor={"#AAA"}
				>
					<View
						key={task.id}
						className={`w-full h-full justify-center pl-4 ${bgColor}`}
					>
						<Checkbox
							className="rounded-full w-6 h-6"
							isChecked={task.isCompleted === 1}
							onChange={(newVal) => {
								console.log(newVal);
								updateTaskStatus(task.id, newVal);
							}}
							value={task.task}
						>
							<View>
								<Text
									className={` text-white text-3xl font-semibold tracking-tight ${
										task.isCompleted === 1 ? "line-through" : ""
									}`}
								>
									{task.task.length > 23 ? task.task.slice(0, 23) + "..." : task.task}
								</Text>
								<Text className="text-slate-800">{task.time}</Text>
							</View>
						</Checkbox>
					</View>
				</TouchableHighlight>
			</Animated.View>
		);
	};

	return (
		<TasksBody
			textBgColor={textBgColor}
			bgColor={bgColor}
			title={title}
			tasks={tasks}
			renderItem={renderItem}
			renderHiddenItem={renderHiddenItem}
			onSwipeValueChange={onSwipeValueChange}
		/>
	);
};

const renderHiddenItem = () => (
	<View style={styles.rowBack}>
		<View style={[styles.backRightBtn, styles.backRightBtnRight]}>
			<Text className="text-white">Delete</Text>
		</View>
	</View>
);

const TasksBody = ({
	textBgColor,
	bgColor,
	title,
	tasks,
	renderItem,
	renderHiddenItem,
	onSwipeValueChange,
}) => {
	const tasksRemainingCount = tasks.filter(
		(item) => item.isCompleted === 0
	).length;
	const [hideTasks, setHideTasks] = useState(false);

	return (
		<>
			<TouchableOpacity
				activeOpacity={1}
				className={`${bgColor} p-4 my-2 rounded-lg justify-between flex-row`}
				onPress={() => setHideTasks((prev) => !prev)}
			>
				<Text className="text-white text-2xl font-semibold tracking-tight">
					{title}
				</Text>

				<View className="flex-row items-center">
					<View
						className={`rounded-full w-8 h-8 items-center justify-center ${textBgColor} `}
					>
						<Text className="text-white text-xl font-semibold tracking-tight">
							{tasksRemainingCount}
						</Text>
					</View>
					<AntDesign
						name="down"
						size={24}
						color="black"
						style={{
							transform: [{ rotate: hideTasks ? "0deg" : "180deg" }],
						}}
					/>
				</View>
			</TouchableOpacity>
			{!hideTasks && (
				<SwipeListView
					disableRightSwipe
					data={tasks}
					renderItem={renderItem}
					renderHiddenItem={renderHiddenItem}
					rightOpenValue={-SCREEN_WIDTH}
					onSwipeValueChange={onSwipeValueChange}
					useNativeDriver={false}
					className={`${bgColor} dark:bg-black rounded-xl`}
				/>
			)}
		</>
	);
};

const styles = StyleSheet.create({
	rowFront: {
		alignItems: "center",
		borderBottomColor: "black",
		borderBottomWidth: 1,
		justifyContent: "center",
		height: 65,
	},
	rowBack: {
		alignItems: "center",
		backgroundColor: "red",
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		paddingLeft: 15,
	},
	backRightBtn: {
		alignItems: "center",
		bottom: 0,
		justifyContent: "center",
		position: "absolute",
		top: 0,
		width: 75,
	},
	backRightBtnRight: {
		backgroundColor: "red",
		right: 0,
	},
});

export default TasksCard;
