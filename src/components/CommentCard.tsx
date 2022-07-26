import React, { useState, useEffect, useRef } from "react";
import Votes from "./Votes";
import DeleteModal from "./DeleteModal";
import { User, Comment } from "../models";

type Props = {
	comments: Comment[];
	setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
	currentUser: User;
	id?: number;
	user: User;
	score: number;
	content: string;
	createdAt: string;
	isReply?: boolean;
	replyingTo?: string;
};

const CommentCard = ({
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
	const replyContainerRef = useRef<HTMLLIElement | null>(null);

	useEffect(() => {
		replyTextareaRef.current?.focus();
	}, [replyMode]);

	useEffect(() => {
		replyContainerRef.current?.focus();
	}, [replyMode]);

	useEffect(() => {
		let handler = (event: MouseEvent) => {
			if (
				replyContainerRef.current &&
				!replyContainerRef.current.contains(event.target as Node)
			) {
				setReplyMode(false);
			}
		};
		document.addEventListener("mousedown", handler);
		return () => {
			document.removeEventListener("mousedown", handler);
		};
	}, []);

	function handleDeleteComment(id: number) {
		console.log("YO.");

		/* check top level comments */
		let newComments = comments.filter((comment) => comment.id !== id);

		/* check replies */
		newComments.forEach((comment) => {
			if (comment.replies) {
				comment.replies = comment.replies.filter(
					(reply: Comment) => reply.id !== id
				);
			}
		});

		/* check nested replies */
		newComments.forEach((comment: Comment) => {
			comment.replies?.forEach((reply: Comment) => {
				if (reply.replies) {
					reply.replies = reply.replies?.filter(
						(nestedReply: Comment) => nestedReply.id !== id
					);
				}
			});
		});

		setComments(newComments);
		setShowDeleteModal(false);
	}

	function toggleDeleteModal() {
		setShowDeleteModal(true);
	}

	function handleEditComment(id?: number) {
		if (!editContent) {
			alert("Comment can't be empty.");
			return;
		}
		let newComments = comments.map((comment) => {
			if (comment.id === id) {
				return { ...comment, content: editContent };
			}
			if (comment.replies) {
				let newReplies = comment.replies.map((reply: Comment) => {
					if (reply.id === id) {
						return { ...reply, content: editContent };
					}
					return reply;
				});
				return { ...comment, replies: newReplies };
			}
			return comment;
		});

		/* edit reply to a reply. */
		newComments = newComments.map((comment) => {
			if (comment.replies) {
				let newReplies = comment.replies.map((reply: Comment) => {
					if (reply.replies) {
						let newNestedReplies = reply.replies.map(
							(nestedReply: Comment) => {
								if (nestedReply.id === id) {
									return {
										...nestedReply,
										content: editContent,
									};
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
				let newReplies = comment.replies.map((reply: Comment) => {
					if (reply.id === id) {
						let prevNestedReplies: Comment[] = reply.replies ?? [];
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
							setVote={setVote}
							score={score}
							comments={comments}
							setComments={setComments}
						/>
						{editMode ? (
							<button
								onClick={() => handleEditComment(id)}
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
				<li ref={replyContainerRef} className="new-reply-container">
					<div className="new-reply-flex">
						<img
							className="comment-user-image"
							src={currentUser.image.png}
							alt="user"
						/>
						<textarea
							ref={replyTextareaRef}
							onChange={(e) => setReplyContent(e.target.value)}
							className="new-reply-textarea"
						></textarea>
						<button
							onClick={() => handleSubmitReply(id)}
							className="new-reply-submit"
						>
							reply
						</button>
					</div>
				</li>
			)}
		</>
	);
};

export default CommentCard;
