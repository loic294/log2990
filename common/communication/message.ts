export class Message {
    public title: string;
    public body: string;
}

export enum SocketMessage {
    createGame = "create_game",
    createdGame = "created_game",
    connectToGame = "connect_to_game",
    connectedToGame = "connected_to_game",
    addGame = "add_games",
    getGames = "get_games",
    receiveWord = "receive_word",
    pushValidation = "push_validation",
    secondPlayerJoined = "second_player_joined",
    opponentDisconnected = "opponent_disconnected",
    requestRematch = "request_rematch",
    rematchInvitation = "rematch_invitation",
    acceptRematch = "accept_rematch",
    rematchAccepted = "rematch_accepted",
    sendValidation = "send_validation",
    syncWord = "sync_word",
    disconnect = "disconnect",
    syncGridSend = "sync_grid_send",
    readyToSync = "ready_to_sync",
    syncGrid = "sync_grid",
}