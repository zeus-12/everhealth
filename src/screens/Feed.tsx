import React from "react";
import { ScrollView, View } from "react-native";
import * as DUMMY_DATA from "@/assets/feed-data.json";
import FeedCard from "@components/feed/FeedCard";
import Layout from "@components/common/Layout";

const Feed = () => {
	return (
		<Layout pageHeading="Feeds">
			{/* todo add some margin at bottom */}
			<ScrollView>
				{DUMMY_DATA.items.map((item) => (
					<FeedCard
						articleUrl={item.url}
						key={item.id}
						image={item.image}
						publishedDate={item.date_published}
						title={item.title}
					/>
				))}
			</ScrollView>
		</Layout>
	);
};
export default Feed;
