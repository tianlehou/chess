import { database } from '../environment/firebase-config.js';

const db = database;

// Configuración corregida de Stockfish
const stockfish = new Worker('./stockfish-worker.js');

$(document).ready(function () {
    // Inicialización correcta de Chess
    const game = new Chess();
    
    const board = Chessboard('board', {
        position: 'start',
        draggable: true,
        pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',
        onDrop: handleMove
    });

    let engineReady = false;

    stockfish.onmessage = function (event) {
        if (event.data === 'uciok') {
            engineReady = true;
            stockfish.postMessage('setoption name Skill Level value 10');
        } else if (event.data.startsWith('bestmove')) {
            const move = event.data.split(' ')[1];
            game.move(move);
            board.position(game.fen());
            updateStatus();
        }
    };

    function updateStatus() {
        $('#status').text(
            `Turno: ${game.turn() === 'w' ? 'Blancas' : 'Negras'} | ` +
            `Estado: ${getGameStatus()}`
        );
    }

    function getGameStatus() {
        if (game.in_checkmate()) return 'Jaque mate';
        if (game.in_draw()) return 'Tablas';
        if (game.in_check()) return 'Jaque';
        return 'En juego';
    }

    function handleMove(source, target) {
        const move = game.move({
            from: source,
            to: target,
            promotion: 'q'
        });

        if (move === null) return 'snapback';

        updateStatus();

        // La IA hace su movimiento después de un breve retraso
        setTimeout(makeAIMove, 500);
    }

    function makeAIMove() {
        if (!engineReady) return;

        stockfish.postMessage(`position fen ${game.fen()}`);
        stockfish.postMessage('go depth 10');
    }

    stockfish.postMessage('uci');

    updateStatus();
});

// Firebase functions
function saveGame() {
    const gameData = {
        fen: game.fen(),
        moves: game.history(),
        date: new Date().toISOString()
    };
    db.ref('games').push(gameData);
}

// Llamar saveGame() cuando termine la partida
function getGameStatus() {
    if (game.in_checkmate() || game.in_draw()) {
        saveGame();
    }
}
