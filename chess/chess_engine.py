import chess
import chess.engine

class ChessAI:
    def __init__(self):
        self.board = chess.Board()
        # Will later integrate Stockfish or other engine
        
    def make_move(self):
        """Generate a move using basic chess logic"""
        # For now using random moves, will replace with engine later
        move = list(self.board.legal_moves)[0]
        self.board.push(move)
        return move
    
    def opponent_move(self, move_uci):
        """Process opponent's move"""
        move = chess.Move.from_uci(move_uci)
        if move in self.board.legal_moves:
            self.board.push(move)
            return True
        return False

# Example usage
if __name__ == "__main__":
    ai = ChessAI()
    print("Initial board:")
    print(ai.board)
    
    print("\nAI's first move:")
    ai_move = ai.make_move()
    print(f"AI played: {ai_move}")
    print(ai.board)
    
    # Simulate opponent move (e.g. e2e4)
    print("\nAfter opponent moves e2e4:")
    ai.opponent_move("e2e4")
    print(ai.board)
