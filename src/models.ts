export interface User {
	image: {
		png: string;
		webp: string;
	};
	username: string;
}

export interface CommentModel {
	id?: number;
	content: string;
	createdAt: string;
	score: number;
	replyingTo?: string;
	user: {
		image: {
			png: string;
			webp: string;
		};
		username: string;
	};
	replies?: any;
}
