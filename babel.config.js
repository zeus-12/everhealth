module.exports = function (api) {
	api.cache(true);
	return {
		presets: ["babel-preset-expo"],
		plugins: [
			"nativewind/babel",
			// react-native-paper/babel may cause issue
			"react-native-paper/babel",
			[
				"module-resolver",
				{
					alias: {
						"@hooks": "./src/hooks",
						"@screens": "./src/screens",
						"@components": "./src/components",
						"@lib": "./src/lib",
					},
				},
			],
		],
	};
};
