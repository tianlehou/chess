import { database } from '../environment/firebase-config.js';

const db = database;

// Configuración corregida de Stockfish
const stockfish = new Worker('./stockfish-worker.js');

$(document).ready(function() {
    // Configuración inicial
    const board = $('#chess-board');
    board.empty(); // Limpiar el tablero

    // Generar todas las casillas (64)
    for (let row = 8; row >= 1; row--) {
        for (let col = 0; col < 8; col++) {
            const isWhite = (row + col) % 2 === 0;
            const square = $(`<div class="square ${isWhite ? 'white' : 'black'}" 
                              data-row="${row}" data-col="${String.fromCharCode(97 + col)}"></div>`);
            board.append(square);
        }
    }

    // Símbolos Unicode para las piezas (CORREGIDOS)
    const pieces = {
        'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
        'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
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
                const square = $(`[data-row="${row}"][data-col="${String.fromCharCode(97 + col)}"]`);
                const piece = $(`<span class="piece ${isWhite ? 'white-piece' : 'black-piece'}">
                                  ${pieces[char]}
                                </span>`);
                square.append(piece);
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

    // Variables para el movimiento
    let selectedPiece = null;
    let originalSquare = null;
    let currentTurn = 'white'; // Blancas comienzan

    // Función para manejar inicio de arrastre
    function handleDragStart(e) {
        const pieceColor = e.target.classList.contains('white-piece') ? 'white' : 'black';
        if (pieceColor !== currentTurn) {
            e.preventDefault();
            return;
        }
        selectedPiece = e.target;
        originalSquare = selectedPiece.parentElement;
    }

    // Función para validar movimiento de peón
    function isValidPawnMove(piece, fromSquare, toSquare) {
        const fromRow = parseInt(fromSquare.dataset.row);
        const fromCol = fromSquare.dataset.col.charCodeAt(0);
        const toRow = parseInt(toSquare.dataset.row);
        const toCol = toSquare.dataset.col.charCodeAt(0);
        
        const isWhite = piece.classList.contains('white-piece');
        const direction = isWhite ? 1 : -1;
        
        // Movimiento hacia adelante
        if (fromCol === toCol) {
            // Movimiento normal (1 casilla)
            if (toRow === fromRow + direction) {
                return !toSquare.firstChild; // Solo si la casilla está vacía
            }
            // Movimiento inicial (2 casillas)
            if ((isWhite && fromRow === 2) || (!isWhite && fromRow === 7)) {
                if (toRow === fromRow + 2*direction) {
                    return !toSquare.firstChild; // Solo si la casilla está vacía
                }
            }
        }
        
        // Captura en diagonal
        if (Math.abs(toCol - fromCol) === 1 && toRow === fromRow + direction) {
            return toSquare.firstChild && 
                   toSquare.firstChild.classList.contains(isWhite ? 'black-piece' : 'white-piece');
        }
        
        return false;
    }

    // Función para manejar soltar pieza
    function handleDrop(e) {
        e.preventDefault();
        if (!selectedPiece) return;
        
        const targetSquare = e.target.closest('.square');
        if (targetSquare && targetSquare !== originalSquare) {
            // Validar movimiento según tipo de pieza
            const pieceChar = selectedPiece.textContent.trim();
            const isPawn = ['♙', '♟'].includes(pieceChar);
            
            if (isPawn && !isValidPawnMove(selectedPiece, originalSquare, targetSquare)) {
                return; // Movimiento inválido
            }
            
            // Verificar si hay pieza en casilla destino
            if (targetSquare.firstChild) {
                // Validación básica de captura
                const targetPiece = targetSquare.querySelector('.piece');
                const isSameColor = selectedPiece.classList.contains('white-piece') === 
                                   targetPiece.classList.contains('white-piece');
                if (isSameColor) return; // No capturar piezas del mismo color
            }
            
            targetSquare.appendChild(selectedPiece);
            currentTurn = currentTurn === 'white' ? 'black' : 'white';
            $('#status').text(`Turno: ${currentTurn === 'white' ? 'Blancas' : 'Negras'}`);
        }
        selectedPiece = null;
    }

    // Función para permitir soltar
    function handleDragOver(e) {
        e.preventDefault();
    }

    // Asignar event listeners
    document.querySelectorAll('.piece').forEach(piece => {
        piece.draggable = true;
        piece.addEventListener('dragstart', handleDragStart);
    });

    document.querySelectorAll('.square').forEach(square => {
        square.addEventListener('dragover', handleDragOver);
        square.addEventListener('drop', handleDrop);
    });
});

// Firebase functions
function saveGame() {
    const gameData = {
        date: new Date().toISOString()
    };
    db.ref('games').push(gameData);
}
