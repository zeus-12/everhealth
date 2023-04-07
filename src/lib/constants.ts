import { Dimensions } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

export const SCREEN_HEIGHT = Dimensions.get("window").height;
export const SCREEN_WIDTH = Dimensions.get("window").width;

export const getScreenHeightWithoutTabs = () => {
	const TAB_HEIGHT = useBottomTabBarHeight();
	const SCREEN_HEIGHT_WITHOUT_TABS = SCREEN_HEIGHT - TAB_HEIGHT;

	return SCREEN_HEIGHT_WITHOUT_TABS;
};
