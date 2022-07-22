interface HandleVote {
	(newVote: string | null, id?: number): void;
}

interface Props {
	id?: number;
	vote: string | null;
	handleVote: HandleVote;
	score: number;
}

const Votes = ({ id, vote, handleVote, score }: Props) => {
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
