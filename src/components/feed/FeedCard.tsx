import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import * as Linking from "expo-linking";

const FeedCard = ({ image, title, publishedDate, articleUrl }) => {
	const blurHash =
		"|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

	const handleArticleClick = () => {
		Linking.openURL(articleUrl);
	};

	return (
		<TouchableOpacity
			onPress={handleArticleClick}
			className="my-2 bg-gray-100 border-gray-200 border-[1px] px-2 py-2 rounded-md"
		>
			<Image
				source={image}
				contentFit="cover"
				transition={1000}
				placeholder={blurHash}
				className="aspect-video w-screen mx-auto rounded-xl"
			/>
			<Text className="text-lg tracking-tight font-normal">{title}</Text>
		</TouchableOpacity>
	);
};
export default FeedCard;
