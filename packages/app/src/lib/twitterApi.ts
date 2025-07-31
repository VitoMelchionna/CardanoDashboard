import { TwitterApi } from "twitter-api-v2";

class TwitterAPI {
	client;
	constructor(config) {
		this.client = new TwitterApi({
			appKey: config.apiKey,
			appSecret: config.apiSecret,
			accessToken: config.accessToken,
			accessSecret: config.accessTokenSecret,
		});
	}

	async postTweet(text) {
		try {
			const tweet = await this.client.v2.tweet(text);
			return tweet;
		} catch (error) {
			console.error("Error posting tweet:", error);
			throw error;
		}
	}
}

export default TwitterAPI;
