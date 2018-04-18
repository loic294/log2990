
export enum MessageType {
    userConnected,
    highligthCell,
    userScore,
    opponentScore,
    wordToValidate,
    opponentDisconnected,
    opponentName,
    gridValidated,
    requestRematch,
    requestModeMenu,
    acceptRematch,
    gridValidation
}

export interface IOMessage {
    type: MessageType;
    data: string | boolean | number;
}

export interface IOString {
    type: MessageType;
    data: string;
}

export interface IONumber {
    type: MessageType;
    data: number;
}

export interface IOBoolean {
    type: MessageType;
    data: boolean;
}
