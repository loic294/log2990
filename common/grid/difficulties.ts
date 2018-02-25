export enum Difficulty {
    Easy = 0,
    Normal = 1,
    Hard = 2
}

export const difficultyName = (difficulty: Difficulty): string => {
	switch (difficulty) {
		case Difficulty.Easy:
			return "Easy";
		case Difficulty.Normal:
			return "Normal";
		case Difficulty.Hard:
			return "Hard";
		default: 
			return "Normal";
	}
}