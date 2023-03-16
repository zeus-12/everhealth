import { StyleSheet, Text, View } from "react-native";
import NewReminder from "@components/reminders/NewReminder";
import ReminderList from "@components/reminders/ReminderList";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as PaperProvider } from "react-native-paper";


export default function App() {
  return (
    <PaperProvider>
      <SafeAreaProvider>
        <View style={styles.container}>
          <Text className="text-2xl font-bold tracking-tighter">
            Hello World
          </Text>
          <NewReminder />
          <ReminderList />
        </View>
      </SafeAreaProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
