import React, { useState } from "react";
import "./App.css";
import Comment from "./components/Comment";
import NewComment from "./components/NewComment";
import data from "./data.json";
import { CommentModel } from "./models";

const App: React.FC = () => {
	const [comments, setComments] = useState<CommentModel[]>(
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
						<Comment
							id={comment.id}
							currentUser={data.currentUser}
							comments={comments}
							setComments={setComments}
							{...comment}
						/>
						{comment.replies && (
							<ul className="replies-container">
								{comment.replies.map((reply: any) => (
									<>
										<Comment
											currentUser={data.currentUser}
											comments={comments}
											setComments={setComments}
											isReply={true}
											{...reply}
										/>
										{reply.replies && (
											<ul className="replies-container">
												{reply.replies.map(
													(nestedReply: any) => (
														<Comment
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
