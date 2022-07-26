import { Comment } from "../models";

interface Props {
	id?: number;
	vote: string | null;
	setVote: React.Dispatch<React.SetStateAction<string | null>>;
	score: number;
	comments: Comment[];
	setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
}

const Votes = ({ id, vote, setVote, score, comments, setComments }: Props) => {
	function handleVote(newVote: string | null, id: number | undefined) {
		let newComments = comments.map((comment) => {
			if (comment.id === id) {
				if (newVote === "down" && score === 0) return comment;
				if (newVote === "down" && score === 1) {
					if (vote === "up") {
						setVote("down");
						return { ...comment, score: 0 };
					}
					if (vote === "down") {
						setVote(null);
						return { ...comment, score: 2 };
					}
				}
				if (newVote === vote) {
					if (newVote === "up") {
						setVote(null);
						return {
							...comment,
							score: comment.score - 1,
						};
					}
					if (newVote === "down") {
						setVote(null);
						return {
							...comment,
							score: comment.score + 1,
						};
					}
				}
				if (newVote === "up" && !vote) {
					setVote(newVote);
					return {
						...comment,
						score: comment.score + 1,
					};
				}
				if (newVote === "down" && !vote) {
					setVote(newVote);
					return {
						...comment,
						score: comment.score - 1,
					};
				}
				if (newVote === "up" && vote === "down") {
					setVote(newVote);
					return {
						...comment,
						score: comment.score + 2,
					};
				}
				if (newVote === "down" && vote === "up") {
					setVote(newVote);
					return {
						...comment,
						score: comment.score - 2,
					};
				}
			}
			return comment;
		});

		/* handle replies */
		newComments = newComments.map((comment: Comment) => {
			if (comment.replies) {
				let newReplies = comment.replies.map((reply: Comment) => {
					if (reply.id === id) {
						if (newVote === "down" && score === 0) return reply;
						if (newVote === "down" && score === 1) {
							if (vote === "up") {
								setVote("down");
								return { ...reply, score: 0 };
							}
							if (vote === "down") {
								setVote(null);
								return { ...reply, score: 2 };
							}
						}
						if (newVote === vote) {
							if (newVote === "up") {
								setVote(null);
								return {
									...reply,
									score: reply.score - 1,
								};
							}
							if (newVote === "down") {
								setVote(null);
								return {
									...reply,
									score: reply.score + 1,
								};
							}
						}
						if (newVote === "up" && !vote) {
							setVote(newVote);
							return {
								...reply,
								score: reply.score + 1,
							};
						}
						if (newVote === "down" && !vote) {
							setVote(newVote);
							return {
								...reply,
								score: reply.score - 1,
							};
						}
						if (newVote === "up" && vote === "down") {
							setVote(newVote);
							return {
								...reply,
								score: reply.score + 2,
							};
						}
						if (newVote === "down" && vote === "up") {
							setVote(newVote);
							return {
								...reply,
								score: reply.score - 2,
							};
						}
					}
					return reply;
				});
				return { ...comment, replies: newReplies };
			}
			return comment;
		});

		// handle nested replies
		newComments = newComments.map((comment: Comment) => {
			if (comment.replies) {
				let newReplies = comment.replies.map((reply: Comment) => {
					if (reply.replies) {
						let newNestedReplies = reply.replies.map(
							(nestedReply: Comment) => {
								if (nestedReply.id === id) {
									if (newVote === "down" && score === 0)
										return nestedReply;
									if (newVote === "down" && score === 1) {
										if (vote === "up") {
											setVote(null);
											return { ...nestedReply, score: 0 };
										}
										if (vote === "down") {
											setVote(null);
											return { ...nestedReply, score: 2 };
										}
									}
									if (newVote === vote) {
										if (newVote === "up") {
											setVote(null);
											return {
												...nestedReply,
												score: nestedReply.score - 1,
											};
										}
										if (newVote === "down") {
											setVote(null);
											return {
												...nestedReply,
												score: nestedReply.score + 1,
											};
										}
									}
									if (newVote === "up" && !vote) {
										setVote(newVote);
										return {
											...nestedReply,
											score: nestedReply.score + 1,
										};
									}
									if (newVote === "down" && !vote) {
										setVote(newVote);
										return {
											...nestedReply,
											score: nestedReply.score - 1,
										};
									}
									if (newVote === "up" && vote === "down") {
										setVote(newVote);
										return {
											...nestedReply,
											score: nestedReply.score + 2,
										};
									}
									if (newVote === "down" && vote === "up") {
										setVote(newVote);
										return {
											...nestedReply,
											score: nestedReply.score - 2,
										};
									}
								}
								return nestedReply;
							}
						);
						return { ...reply, replies: newNestedReplies };
					}
					return reply;
				});
				return { ...comment, replies: newReplies };
			}
			return comment;
		});

		setComments(newComments);
	}

	return (
		<div className="comment-votes-container">
			<img
				style={{
					filter:
						vote === "up"
							? "invert(17%) sepia(86%) saturate(621%) hue-rotate(95deg) brightness(52%) contrast(101%)"
							: "none",
				}}
				src="./images/icon-plus.svg"
				onClick={() => handleVote("up", id)}
				alt="plus icon"
			/>
			<p className="comment-score">{score}</p>
			<img
				style={{
					filter:
						vote === "down"
							? "invert(7%) sepia(90%) saturate(7500%) hue-rotate(2deg) brightness(97%) contrast(106%)"
							: "none",
				}}
				src="./images/icon-minus.svg"
				onClick={() => handleVote("down", id)}
				alt="minus icon"
			/>
		</div>
	);
};

export default Votes;
