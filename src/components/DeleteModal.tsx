import React from "react";

interface Props {
	comments: any;
	setComments: any;
	id?: number;
	setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
	handleDeleteComment: (arg0: number) => void;
}

const DeleteModal = ({
	comments,
	setComments,
	id,
	setShowDeleteModal,
	handleDeleteComment,
}: Props) => {
	return (
		<div className="modal">
			<div className="modal__card">
				<h2>Delete comment</h2>
				<p>
					Are you sure you want to delete this comment? This will
					remove the comment and can't be undone.
				</p>
				<div className="modal__buttons">
					<button
						onClick={() => setShowDeleteModal(false)}
						className="modal__cancel"
					>
						No, Cancel
					</button>
					<button
						onClick={() => handleDeleteComment(id!)}
						className="modal__submit"
					>
						Yes, Delete
					</button>
				</div>
			</div>
		</div>
	);
};

export default DeleteModal;
