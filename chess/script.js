import { database } from '../environment/firebase-config.js';

const db = database;

// Configuración corregida de Stockfish
const stockfish = new Worker('./stockfish-worker.js');

$(document).ready(function() {
    // Configuración inicial
    const board = $('.chess-board');
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    
    // Símbolos Unicode para las piezas
    const pieces = {
        'r': '', 'n': '', 'b': '', 'q': '', 'k': '', 'p': '',
        'R': '', 'N': '', 'B': '', 'Q': '', 'K': '', 'P': ''
    };
    
    // Posición inicial (FEN)
    const initialPosition = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
    
    // Generar tablero con piezas
    let row = 8;
    for (const line of initialPosition.split('/')) {
        let col = 0;
        for (const char of line) {
            if (isNaN(char)) {
                // Es una pieza
                const isWhite = char === char.toUpperCase();
                const square = $(`<div class="square ${(row + col) % 2 === 0 ? 'white' : 'black'}" 
                                  data-row="${row}" data-col="${files[col]}">
                                  <span class="piece ${isWhite ? 'white-piece' : 'black-piece'}">
                                    ${pieces[char]}
                                  </span>
                                </div>`);
                board.append(square);
                col++;
            } else {
                // Es un número (espacios vacíos)
                col += parseInt(char);
            }
        }
        row--;
    }
    
    // Estado inicial del juego
    $('#status').text('Juego listo - Blancas comienzan');
});

// Firebase functions
function saveGame() {
    const gameData = {
        date: new Date().toISOString()
    };
    db.ref('games').push(gameData);
}
