import { FIRESTORE_DB } from "../lib/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";

const addData = async () => {
	const doc = addDoc(collection(FIRESTORE_DB, "data"), {
		title: "test data",
		done: false,
	});
};
