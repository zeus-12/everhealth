import { Dimensions } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

export const SCREEN_HEIGHT = Dimensions.get("window").height;
export const SCREEN_WIDTH = Dimensions.get("window").width;

export const getScreenHeightWithoutTabs = () => {
	const TAB_HEIGHT = useBottomTabBarHeight();
	const SCREEN_HEIGHT_WITHOUT_TABS = SCREEN_HEIGHT - TAB_HEIGHT;

	return SCREEN_HEIGHT_WITHOUT_TABS;
};

export const blurHash =
	"|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";
