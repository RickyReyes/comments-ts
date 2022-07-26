import React, { useState } from "react";
import "./App.css";
import CommentCard from "./components/CommentCard";
import NewComment from "./components/NewComment";
import data from "./data.json";
import { Comment } from "./models";

const App: React.FC = () => {
	const [comments, setComments] = useState<Comment[]>(
		data.comments.map((comment) => ({
			...comment,
			id: Math.random(),
			replies: comment.replies
				? comment.replies.map((reply) => ({
						...reply,
						id: Math.random(),
						replies: [],
				  }))
				: [],
		}))
	);

	return (
		<div className="App">
			<ul className="comments-container">
				{comments.map((comment) => (
					<>
						<CommentCard
							id={comment.id}
							currentUser={data.currentUser}
							comments={comments}
							setComments={setComments}
							{...comment}
						/>
						{comment.replies && (
							<ul className="replies-container">
								{comment.replies.map((reply: Comment) => (
									<>
										<CommentCard
											currentUser={data.currentUser}
											comments={comments}
											setComments={setComments}
											isReply={true}
											{...reply}
										/>
										{reply.replies && (
											<ul className="replies-container">
												{reply.replies.map(
													(nestedReply: Comment) => (
														<CommentCard
															currentUser={
																data.currentUser
															}
															comments={comments}
															setComments={
																setComments
															}
															isReply={true}
															{...nestedReply}
														/>
													)
												)}
											</ul>
										)}
									</>
								))}
							</ul>
						)}
					</>
				))}
				<NewComment
					comments={comments}
					setComments={setComments}
					currentUser={data.currentUser}
				/>
			</ul>
		</div>
	);
};

export default App;
