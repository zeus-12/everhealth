import { FIRESTORE_DB } from "../lib/firebaseConfig";
import {
	addDoc,
	doc,
	collection,
	getDocs,
	updateDoc,
	deleteDoc
} from "firebase/firestore";


//new collection 'data' undakki athil one doc add akkum(with fields 'title' and 'done')
const addData = async () => {
	const doc = addDoc(collection(FIRESTORE_DB, "data"), {
		title: "test data",
		done: false,
	});
};

//already ulla 'data' collection nn docs fetch cheyyum
const getData = async () => {
	const colref = collection(FIRESTORE_DB, "data");
	let docSnap = await getDocs(colref);

	docSnap.forEach((doc) => {
		console.log(doc.data());//each data will be displayed
	});
};

//already exist aaya collection il ulla doc il new field add akkan
const addDataField = async (docID) => {
	const docref = doc(FIRESTORE_DB, "data", docID);
	const data = {
		code: "444",
	};
	await updateDoc(docref, data);

};

//already exist aaya collection il ulla doc il field value update cheyyan(field already exists)

const updateDataField = async(docID)=>{
	const docref = doc(FIRESTORE_DB, "data", docID);
	const data={
		title:'updated title' //already ulla title field nte value maarum
	}
	updateDoc(docref,data);
}

//delete a document from collections

const deleteData =(docID)=>{
	const docref = doc(FIRESTORE_DB, "data",docID);
	deleteDoc(docref);
} ///if last doc is deleted collection itself will be kahoot!