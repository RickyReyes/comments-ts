import React, { useState, useEffect, useRef } from "react";
import Votes from "./Votes";
import DeleteModal from "./DeleteModal";
import { CommentModel } from "../models";

interface Props {
	comments: CommentModel[];
	setComments: React.Dispatch<React.SetStateAction<CommentModel[]>>;
	currentUser: any;
	id?: number;
	user: any;
	score: number;
	content: string;
	createdAt: string;
	isReply?: boolean;
	replyingTo?: string;
}

const Comment = ({
	comments,
	setComments,
	currentUser,
	id,
	user,
	score,
	content,
	createdAt,
	isReply,
	replyingTo,
}: Props) => {
	const [vote, setVote] = useState<string | null>(null);

	const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

	const [editMode, setEditMode] = useState<boolean>(false);
	const [editContent, setEditContent] = useState<string>(content);

	const [replyMode, setReplyMode] = useState<boolean>(false);
	const [replyContent, setReplyContent] = useState<string>("");
	const replyTextareaRef = useRef<HTMLTextAreaElement | null>(null);

	useEffect(() => {
		replyTextareaRef.current?.focus();
	}, [replyMode]);

	function handleVote(newVote: string | null, id: number | undefined) {
		let newComments = comments.map((comment) => {
			if (comment.id === id) {
				if (newVote === "down" && score === 0) return comment;
				if (newVote === "down" && score === 1) {
					setVote(null);
					return { ...comment, score: 0 };
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

		/* handle nested comments */
		newComments = newComments.map((comment: any) => {
			if (comment.replies) {
				let newReplies = comment.replies.map((reply: any) => {
					if (reply.id === id) {
						if (newVote === "down" && score === 0) return reply;
						if (newVote === "down" && score === 1) {
							setVote(null);
							return { ...reply, score: 0 };
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
		setComments(newComments);
	}

	function handleDeleteComment(id: number) {
		let newComments = comments.filter((comment) => comment.id !== id);
		newComments = newComments.map((comment) => {
			if (comment.replies) {
				let newReplies = [];
				newReplies = comment.replies.filter(
					(reply: any) => reply.id !== id
				);
				return { ...comment, replies: newReplies };
			}
			return comment;
		});

		setComments(newComments);
		setShowDeleteModal(false);
	}

	function toggleDeleteModal() {
		setShowDeleteModal(true);
	}

	function handleUpdateComment(id?: number) {
		if (!editContent) {
			alert("Comment can't be empty.");
			return;
		}
		setComments((prevComments) =>
			prevComments.map((comment) => {
				if (comment.id === id) {
					return { ...comment, content: editContent };
				} else {
					return comment;
				}
			})
		);
		setEditMode(false);
	}

	function handleBeginReply(id?: number) {
		setReplyMode(true);
	}

	/* id is the id of the comment we're appending a reply to. */
	function handleSubmitReply(id?: number) {
		if (!replyContent) {
			alert("Reply can't be empty.");
			return;
		}
		let newComments = comments.map((comment) => {
			if (comment.id === id) {
				let previousReplies = comment.replies ?? [];
				return {
					...comment,
					replies: [
						{
							id: Date.now(),
							content: replyContent,
							createdAt: "just now",
							score: 0,
							user: currentUser,
							replyingTo: comment.user.username,
						},
						...previousReplies,
					],
				};
			}
			return comment;
		});

		/* handle reply to a reply. */
		newComments = newComments.map((comment) => {
			if (comment.replies) {
				let newReplies = comment.replies.map((reply: any) => {
					if (reply.id === id) {
						let prevNestedReplies: CommentModel[] = [];
						return {
							...reply,
							replies: [
								...prevNestedReplies,
								{
									id: Date.now(),
									content: replyContent,
									createdAt: "just now",
									score: 0,
									user: currentUser,
									replyingTo: reply.user.username,
								},
							],
						};
					}
					return reply;
				});
				return {
					...comment,
					replies: newReplies,
				};
			}
			return comment;
		});
		setComments(newComments);
		setReplyContent("");
		setReplyMode(false);
	}

	return (
		<>
			<li className="comment">
				{showDeleteModal && (
					<DeleteModal
						comments={comments}
						setComments={setComments}
						id={id}
						setShowDeleteModal={setShowDeleteModal}
						handleDeleteComment={handleDeleteComment}
					/>
				)}
				<div className="comment-header">
					<img
						className="comment-user-image"
						src={user.image.png}
						alt="user"
					/>
					<p className="comment-username">{user.username}</p>
					{user.username === currentUser.username && (
						<small className="comment-you-tag">you</small>
					)}
					<p className="comment-created-at">{createdAt}</p>

					{/*   
						DESKTOP ACTION BTNS
					*/}
					{currentUser.username === user.username ? (
						<div className="desktop-comment-action-button-container">
							<button
								onClick={toggleDeleteModal}
								className="comment-action-button delete"
							>
								<img
									src="./images/icon-delete.svg"
									alt="delete icon"
								/>
								Delete
							</button>
							<button
								onClick={() => setEditMode(true)}
								className="comment-action-button"
							>
								<img
									src="./images/icon-edit.svg"
									alt="edit icon"
								/>
								Edit
							</button>
						</div>
					) : (
						<div className="desktop-comment-action-button-container">
							<button
								onClick={() => handleBeginReply(id)}
								className="comment-action-button"
							>
								<img
									src="./images/icon-reply.svg"
									alt="reply icon"
								/>
								Reply
							</button>
						</div>
					)}
				</div>
				<div className="desktop-flex">
					{editMode ? (
						<textarea
							className="edit-box"
							value={editContent}
							onChange={(e) => setEditContent(e.target.value)}
						/>
					) : (
						<p className="comment-content">
							{isReply && (
								<span className="comment-replying-to">
									@{replyingTo}
								</span>
							)}{" "}
							{content}
						</p>
					)}
					<div className="comment-footer">
						<Votes
							id={id}
							vote={vote}
							handleVote={handleVote}
							score={score}
						/>
						{editMode ? (
							<button
								onClick={() => handleUpdateComment(id)}
								className="update-btn"
							>
								update
							</button>
						) : currentUser.username === user.username ? (
							<div className="comment-action-button-container">
								<button
									onClick={toggleDeleteModal}
									className="comment-action-button delete"
								>
									<img
										src="./images/icon-delete.svg"
										alt="delete icon"
									/>
									Delete
								</button>
								<button
									onClick={() => setEditMode(true)}
									className="comment-action-button"
								>
									<img
										src="./images/icon-edit.svg"
										alt="edit icon"
									/>
									Edit
								</button>
							</div>
						) : (
							<div className="comment-action-button-container">
								<button
									onClick={() => handleBeginReply(id)}
									className="comment-action-button"
								>
									<img
										src="./images/icon-reply.svg"
										alt="reply icon"
									/>
									Reply
								</button>
							</div>
						)}
					</div>
				</div>
			</li>
			{replyMode && (
				<li className="new-reply-container">
					<div className="new-reply-flex">
						<img
							className="comment-user-image"
							src={currentUser.image.png}
							alt="user"
						/>
						<textarea
							ref={replyTextareaRef}
							onChange={(e) => setReplyContent(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									handleSubmitReply(id);
								}
							}}
							className="new-reply-textarea"
						></textarea>
						<button className="new-reply-submit">reply</button>
					</div>
				</li>
			)}
		</>
	);
};

export default Comment;
