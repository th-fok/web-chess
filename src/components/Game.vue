<template>
    <div class="main-area">
      <div class="board">
        <div
            v-for="square in game.board.getSquares(isFlipped)"
            :key="square.index"
            :class="`square ${square.isBlack ? 'black' : 'white'}`"
            @click="handleSquareClick(square.index)"
            :data-coord="square.index"
        >
            <div :class="`${possibleMoves.includes(square.index) ? 'possible-move' : ''}`"></div>
            <img
                v-if="square.piece"
                :src="`/src/ico/${figuresSRC.get(figureSymbol(square.piece))}`"
                draggable="false"
            />
        </div>
      </div>
      <div class="controls">
        <button class="control-button flip-button" @click="flipBoard()">
          <img :src="getButtonIcon('swap')" />
        </button>
        <button class="control-button reset-button" @click="resetBoard()">
          <img :src="getButtonIcon('reset')" />
        </button>
      </div>
    </div>
  </template>

<script>
export default {
  data() {
    return {
        possibleMoves: [],
        game: new Game('white', 'black'), // Создаем экземпляр класса Game
        isFlipped: false, // Флаг для переворота доски
        selectedPiece: null, // Хранит выбранную фигуру
        startCoord: null, // Хранит начальную координату выбранной фигуры

        figuresSRC: new Map([
          ['R', 'wRook.png'],
          ['N', 'wKnight.png'],
          ['B', 'wBishop.png'],
          ['Q', 'wQueen.png'],
          ['K', 'wKing.png'],
          ['P', 'wPawn.png'],
          ['r', 'bRook.png'],
          ['n', 'bKnight.png'],
          ['b', 'bBishop.png'],
          ['q', 'bQueen.png'],
          ['k', 'bKing.png'],
          ['p', 'bPawn.png'],
        ]),
    };
  },
  created() {
    this.initializeGame();
  },
  computed: {
    playerColor() {
        return this.isFlipped ? 'black' : 'white'
    },
    botColor(){
        return this.isFlipped ? 'white' : 'black'
    }
  },
  methods: {
    initializeGame() {
        this.game = new Game(this.playerColorm, this.botColor);
        if (this.botColor === 'white') {
            this.game.makeBotMove();
        }
    },
    figureSymbol(piece) {
      if (!piece) return '.';
      const pieceSymbol = piece.constructor.name[0];
      return piece.color === 'white' ? pieceSymbol.toUpperCase() : pieceSymbol.toLowerCase();
    },
    handleSquareClick(index) {
        const piece = Utilites.findPiece(this.game.board, index);
        
        // Если фигура выбрана
        if (this.selectedPiece !== null) {
            // Если выбрана другая фигура
            if (piece && piece.color === this.selectedPiece.color) {
                this.selectedPiece = piece;
                this.startCoord = index;
                this.calculatePossibleMoves(this.startCoord); // Вычисляем возможные ходы для новой фигуры
                return;
            }
            const endCoord = index;
            try {
                // console.clear();
                this.game.makeMove(this.startCoord, endCoord);
                if (!this.isGameOver) {
                    this.game.makeBotMove();
                }
            } catch (error) {
                console.log(error.message);
            }
            this.selectedPiece = null;
            this.startCoord = null;
            this.possibleMoves = []; // Сбрасываем возможные ходы
        } else if (piece && piece.color) {
            this.selectedPiece = piece;
            this.startCoord = index;
            
            this.calculatePossibleMoves(this.startCoord); // Вычисляем возможные ходы
        }
    },
    calculatePossibleMoves(index) {
        const piece = Utilites.findPiece(this.game.board, index);
        if (piece) {
            this.possibleMoves = piece.validMoves(index, this.game.board); // Получаем возможные ходы
        }
    },
    flipBoard() {
      this.isFlipped = !this.isFlipped; // Переключаем флаг переворота доски
      this.game.updateColors(this.playerColor, this.botColor);
    },
    resetBoard() {
      this.game = new Game();
      this.possibleMoves = [];
      this.selectedPiece = null;
      this.startCoord = null;
      console.clear();
    },
    getButtonIcon(action) {
      const theme = this.$store.state.selectedTheme;
      return theme === 'dark' ? `/src/ico/${action}-dark.png` : `/src/ico/${action}-light.png`;
    },
  },
};

class Piece {
    constructor(color) {
        this.color = color;
    }
}

class Utilites {
    static isValidPosition(position) {
        return position >= 0 && position < 64;
    }

    static findPiece(board, pieceCoordinate) {
        return board.squares[Math.floor(pieceCoordinate / 8)][pieceCoordinate % 8];
    }
}

class Board {
    constructor() {
        this.squares = this.createBoard();
    };

    clone() {
        const newBoard = new Board();
        newBoard.squares = this.squares.map(row => row.map(piece => {
            if (piece) {
                // Создаем новый экземпляр фигуры с теми же свойствами
                return this.clonePiece(piece);
            }
            return null;
        }));
        return newBoard;
    }

    clonePiece(piece) {
        // Создаем новый экземпляр фигуры в зависимости от ее типа
        switch (piece.constructor) {
            case King:
                return new King(piece.color);
            case Queen:
                return new Queen(piece.color);
            case Rook:
                return new Rook(piece.color);
            case Bishop:
                return new Bishop(piece.color);
            case Night:
                return new Night(piece.color);
            case Pawn:
                return new Pawn(piece.color);
            default:
                return null; // Если фигура не распознана
        }
    }

    createBoard() {
        const board = Array(8).fill(null).map(() => Array(8).fill(null));
        this.setupPieces(board);
        return board;
    };

    setupPieces(board) {
        board[0][0] = new Rook('black');
        board[0][1] = new Night('black');
        board[0][2] = new Bishop('black');
        board[0][3] = new Queen('black');
        board[0][4] = new King('black');
        board[0][5] = new Bishop('black');
        board[0][6] = new Night('black');
        board[0][7] = new Rook('black');
        for (let i = 0; i < 8; i++) {
            board[1][i] = new Pawn('black');            
        };

        board[7][0] = new Rook('white');
        board[7][1] = new Night('white');
        board[7][2] = new Bishop('white');
        board[7][3] = new Queen('white');
        board[7][4] = new King('white');
        board[7][5] = new Bishop('white');
        board[7][6] = new Night('white');
        board[7][7] = new Rook('white');
        for (let i = 0; i < 8; i++) {
            board[6][i] = new Pawn('white');
        };
    }
    getSquares(flipped) {
        const squares = this.squares.flat().map((piece, index) => ({
            piece, 
            index, 
            isBlack: (Math.floor(index / 8) + index) % 2 === 1,
        }));

        // Если flipped, разворачиваем массив
        return flipped ? squares.reverse() : squares;
    }

    movePiece(fromPosition, toPosition) {
        const fromRow = Math.floor(fromPosition / 8);
        const fromCol = fromPosition % 8;
        const toRow = Math.floor(toPosition / 8);
        const toCol = toPosition % 8;

        const piece = this.squares[fromRow][fromCol];

        if (piece && piece.validMoves(fromPosition, this).includes(toPosition)) {
            this.squares[toRow][toCol] = piece;
            this.squares[fromRow][fromCol] = null;
        }
    }
}

class Bot {
    constructor(depth) {
        this.depth = depth; // Глубина поиска для минимакс
        this.playerColor = '';
        this.botColor = '';
    }

    findBestMove(game, botColor) {
        let bestMove = null;
        let bestValue = botColor === 'black' ? -Infinity : Infinity;

        this.botColor = botColor;
        this.playerColor = botColor === 'white'? 'black' : botColor === 'black'? 'white': null ;
        
        const moves = game.getAllMoves(botColor); // Получаем все возможные ходы для текущего цвета
        
        for (const move of moves) {
            const gameClone = game.clone(); // Клонируем текущее состояние игры
            try {
                gameClone.makeMove(move.from, move.to);
                console.log('Основная развилка:', move.from, move.to);
            } catch(error){}
            const moveValue = this.minimax(gameClone, this.depth - 1, botColor === 'white'); // Вызываем minimax для следующего уровня
            if ((botColor === 'black' && moveValue > bestValue) || (botColor === 'white' && moveValue < bestValue)) {
                bestValue = moveValue; // Обновляем лучшее значение
                bestMove = move; // Сохраняем лучший ход
            }
        }
        return bestMove; // Возвращаем лучший ход
    }

    minimax(game, depth, isMaximizing) {
        console.log('Глубина = ',depth);
        if (depth === 0 || game.isGameOver) {
            return this.evaluateBoard(game); // Оценка текущей позиции
        }

        if (isMaximizing) {
            let bestValue = -Infinity;
            const moves = game.getAllMoves(this.botColor); // Ходы для черного игрока
            for (const move of moves) {
                const gameClone = game.clone(); // Клонируем текущее состояние игры
                try {
                    gameClone.makeMove(move.from, move.to);
                    console.log('Доп развилка:', move.from, move.to);
                } catch(error){}
                bestValue = Math.max(bestValue, this.minimax(gameClone, depth - 1, false));
            }
            return bestValue;
        } else {
            let bestValue = Infinity;
            const moves = game.getAllMoves(this.playerColor); // Ходы для белого игрока
            for (const move of moves) {
                const gameClone = game.clone(); // Клонируем текущее состояние игры
                try {
                    gameClone.makeMove(move.from, move.to);
                    console.log('Доп развилка:', move.from, move.to);
                } catch(error){}
                bestValue = Math.min(bestValue, this.minimax(gameClone, depth - 1, true));
            }
            return bestValue;
        }
    }

    evaluateBoard(game) {
        let score = 0;
        for (let i = 0; i < 64; i++) {
            const piece = Utilites.findPiece(game.board, i);
            if (piece) {
                score += piece.color === 'white' ? this.getPieceValue(piece) : -this.getPieceValue(piece);
                score += this.additionalEvaluation(game);
            }
        }
        return score; // Возвращаем оценку позиции
    }

    additionalEvaluation(game) {
        let score = 0;
        
        // Оценка контроля центра
        const centerSquares = [27, 28, 35, 36]; // D4, D5, E4, E5
        for (const square of centerSquares) {
            const piece = Utilites.findPiece(game.board, square);
            if (piece) {
                score += piece.color === 'white' ? 1 : -1; // +1 для белых, -1 для черных
            }
        }
    
        // Оценка безопасности короля
        score += this.evaluateKingSafety(game);
    
        // Оценка активности фигур
        score += this.evaluatePieceActivity(game);
    
        return score; // Возвращаем общую оценку
    }
    
    evaluateKingSafety(game) {
        let score = 0;
        const whiteKingPosition = game.findKing('white');
        const blackKingPosition = game.findKing('black');
    
        // Проверка пешек вокруг короля
        const kingPositions = [whiteKingPosition, blackKingPosition];
        for (const position of kingPositions) {
            const row = Math.floor(position / 8);
            const col = position % 8;
        
            // Проверяем клетки вокруг короля
            for (let r = row - 1; r <= row + 1; r++) {
                for (let c = col - 1; c <= col + 1; c++) {
                    if (r >= 0 && r < 8 && c >= 0 && c < 8) {
                        const square = r * 8 + c;
                        const piece = Utilites.findPiece(game.board, square);
                        if (piece && piece.constructor.name === 'Pawn' && piece.color === (position === whiteKingPosition ? 'white' : 'black')) {
                            score += 0.5; // Половина очка за каждую пешку вокруг короля
                        }
                    }
                }
            }
        }
    
        return score; // Возвращаем оценку безопасности короля
    }

    evaluatePieceActivity(game) {
        let score = 0;
    
        // Оценка активности фигур
        for (let i = 0; i < 64; i++) {
            const piece = Utilites.findPiece(game.board, i);
            if (piece) {
                const validMoves = piece.validMoves(i, game.board);
                score += validMoves.length; // +1 за каждую возможную активную позицию
            }
        }
    
        return score; // Возвращаем оценку активности фигур
    }

    getPieceValue(piece) {
        switch (piece.constructor.name) {
            case 'Pawn': return 1;
            case 'Knight': return 3;
            case 'Bishop': return 3;
            case 'Rook': return 5;
            case 'Queen': return 9;
            case 'King': return 0; // Король не имеет ценности в оценке
            default: return 0;
        }
    }
}

class Game {
    constructor(playerColor, botColor) {
        this.board = new Board();
        this.bot = new Bot(2);
        this.currentMovingIsColor = 'white';
        this.isGameOver = false;
        this.movesHistory = [];
        
        this.playerColor = playerColor;
        this.botColor = botColor;

    };

    updateColors(playerColor, botColor) {
        this.playerColor = playerColor;
        this.botColor = botColor;

        // Если бот играет за белых, делаем его ход сразу
        if (this.botColor === this.currentMovingIsColor) {
            this.makeBotMove();
        }
    }

    clone() {
        const newGame = new Game();
        newGame.board = this.board.clone(); // Клонируем доску
        newGame.currentMovingIsColor = this.currentMovingIsColor;
        newGame.playerColor = this.playerColor;
        newGame.isGameOver = this.isGameOver;
        newGame.movesHistory = [...this.movesHistory]; // Клонируем историю ходов
        return newGame;
    }

    makeBotMove() {
        const bestMove = this.bot.findBestMove(this, this.currentMovingIsColor);
        if (bestMove) {
            setTimeout(() => {
                try {
                    this.makeMove(bestMove.from, bestMove.to); // Выполняем лучший ход                    
                } catch (error) {}
            }, 500);
        }
    }

    makeMove(fromPosition, toPosition) {
        const opponent = this.currentMovingIsColor === 'white' ? 'black' : 'white';

        if (this.isGameOver) {
            throw new Error("Игра окончена. Невозможно сделать ход.");
        }

        const piece = this.board.squares[Math.floor(fromPosition / 8)][fromPosition % 8];
        const target = this.board.squares[Math.floor(toPosition / 8)][toPosition % 8];

        if (!piece) {
            throw new Error("Нет фигуры.");
        }

        if (piece.color !== this.currentMovingIsColor) {
            throw new Error("Нельзя ходить чужой фигурой.");
        }

        if (!piece.validMoves(fromPosition, this.board).includes(toPosition)) {
            throw new Error("Недопустимый ход.");
        }

        const tempBoard = this.board.clone();
        this.board.movePiece(fromPosition, toPosition);

        if (this.isUnderCheck(this.currentMovingIsColor)) {
            this.board = tempBoard.clone();
            throw new Error("Нельзя делать ход, когда король под шахом.");
        }

        if (piece.constructor.name === 'King' && this.isCastling(fromPosition, toPosition) && piece.isMoved === false) {
            this.performCastling(fromPosition, toPosition); // Выполнение рокировки
        }

        if (piece.constructor.name === 'Pawn' && this.isEnPassant(fromPosition, toPosition)) {
            this.performEnPassant(fromPosition, toPosition);
        }

        if (piece.constructor.name === 'Pawn' && this.isPromote(toPosition)) {
            this.performPromote(toPosition);
        }

        let action = '';
        if (target !== null) {
            action = `x`;
        }

        this.movesHistory.push({
            from: fromPosition,
            to: toPosition,
            piece: piece,
            target: target,
            action: action
        });

        console.log('Ходы ', this.movesHistory);

        this.checkGameOver(opponent); // Проверка на окончание игры
        this.switchPlayer(); // Переключение игрока
    }

    isEnPassant(fromPosition, toPosition) {
        const piece = Utilites.findPiece(this.board, fromPosition);
        const targetPiece = Utilites.findPiece(this.board, toPosition);

        if (targetPiece !== null) return false;

        const direction = piece.color === 'white' ? -1 : 1;
        const adjacentPosition = fromPosition + direction * 8;

        const opponentPawn = Utilites.findPiece(this.board, adjacentPosition);
        return (
            opponentPawn && opponentPawn.constructor.name === 'Pawn'
            && opponentPawn.color !== piece.color && Math.abs(fromPosition - adjacentPosition) === 1 &&
            (this.lastMoveWasDoubleStep(adjacentPosition))
        );
    }

    performEnPassant(fromPosition, toPosition) {
        // console.log('Удар пешки на проходе с ', fromPosition, 'на', toPosition);
        const piece = Utilites.findPiece(this.board, fromPosition);
        const direction = piece.color === 'white' ? -1 : 1;
        const targetPiece = toPosition + direction * 8;

        this.board.squares[Math.floor(targetPiece / 8 )][targetPiece % 8] = null;
        this.board.movePiece(fromPosition, toPosition);
    }

    lastMoveWasDoubleStep() {
        // console.log('Проверяем, был ли последний ход пешкой и был ли он двойным');
        if (this.movesHistory.length > 0) {
            const lastMove = this.movesHistory[this.movesHistory.length - 1];
            if (lastMove.piece.constructor.name === 'Pawn') {
                const moveDistance = Math.abs(lastMove.from - lastMove.to);
                return moveDistance === 16;
            }
        }
        return false;
    }

    isPromote(position) {
        // console.log('Проверка продвижения на', position);
        const piece = Utilites.findPiece(this.board, position);
        if (piece.constructor.name !== 'Pawn') {return false;}

        const state = (Math.floor(position / 8) === 0 || Math.floor(position / 8) === 7);
        // console.log('Продвижение?', state);
        return state;
    }

    performPromote (position) {
        // console.log('Продвижение пешки на', position);
        const newPieceType = prompt("Фигура: (Q - ферзь, R - ладья, B - слон, N - конь)").toUpperCase();

        let newPiece;
        switch (newPieceType) {
            case 'Q':
                newPiece = new Queen(Utilites.findPiece(this.board, position).color);
                break;
                
            case 'R':
                newPiece = new Rook(Utilites.findPiece(this.board, position).color);
                break;
                
            case 'B':
                newPiece = new Bishop(Utilites.findPiece(this.board, position).color);
                break;
                
            case 'N':
                newPiece = new Night(Utilites.findPiece(this.board, position).color);
                break;
            default:
                newPiece = new Queen(Utilites.findPiece(this.board, position).color);
                break;
        }
        this.board.squares[Math.floor(position / 8)][position % 8] = newPiece;
        return newPiece;
    }

    isCastling(fromPosition, toPosition) { 
        const piece = Utilites.findPiece(this.board, fromPosition); 
        if (!piece || piece.constructor.name !== 'King' || piece.isMoved) {
            return false
        } 
    
        if (Math.floor(toPosition / 8) !== Math.floor(fromPosition / 8)) {
            return false
        } 
    
        const direction = toPosition > fromPosition ? 1 : -1; 
        const rookPosition = direction === 1 ? fromPosition + 3 : fromPosition - 4; 
        const rook = Utilites.findPiece(this.board, rookPosition); 
    
        if (!rook || rook.constructor.name !== 'Rook' || rook.isMoved) {
            return false
        } 
    
        const step = direction === 1 ? 1 : -1; 
        for (let i = fromPosition + step; i !== rookPosition; i += step) {
            let piece = Utilites.findPiece(this.board, i);
            if (piece !== null) { 
                return false
            } 
        } 
    
        return true; 
    }

    performCastling(fromPosition, toPosition) {
        const direction = toPosition > fromPosition ? 1 : -1; // Определяем направление
        const rookPosition = direction === 1 ? fromPosition + 3 : fromPosition - 4; // Позиция ладьи
        const rookTargetPosition = toPosition - direction; // Целевая позиция для ладьи

        // Грубое перемещение короля
        this.board.movePiece(fromPosition, toPosition); // Перемещение короля
        
        // Грубое перемещение ладьи
        const piece = Utilites.findPiece(this.board, toPosition);
        const rook = Utilites.findPiece(this.board, rookPosition);
        this.board.squares[Math.floor(rookTargetPosition /  8)][rookTargetPosition % 8] = rook;
        this.board.squares[Math.floor(rookPosition / 8)][rookPosition % 8] = null;

        // Проверка на шах после рокировки
        if (this.isUnderCheck(this.currentMovingIsColor)) {
            // Если король под шахом, вернуть фигуры на место
            this.board.movePiece(toPosition, fromPosition); // Возврат короля
            this.board.squares[Math.floor(rookTargetPosition / 8)][rookTargetPosition % 8] = null; // Удаление ладьи с целевой позиции
            this.board.squares[Math.floor(rookPosition / 8)][rookPosition % 8] = rook; // Возврат ладьи на исходную позицию
            throw new Error("Нельзя рокироваться, когда король под шахом.");
        }

        rook.isMoved = true;
        piece.isMoved = true;
    }

    switchPlayer() {
        this.currentMovingIsColor = this.currentMovingIsColor === 'white' ? 'black': this.currentMovingIsColor === 'black' ? 'white': null;
        if (this.currentMovingIsColor === null) {
            throw new Error('ебать');
        }
    }

    checkGameOver(playerColor) {        
        if (this.isCheckmate(playerColor)) {
            this.isGameOver = true;
            alert('Победа')
            // Модалка с победой
        } else
        if (this.isStalemate (playerColor)) {
            this.isGameOver = true;
            alert('Ничья')
            // Модалка с ничьей
        }
    }

    isGiveCheck(playerColor) {
        const kingPosition = this.findKing(playerColor);
        const opponentColor = playerColor === 'white' ? 'black' : 'white';
        const opponentMoves = this.getAllMoves(opponentColor); // Получаем все ходы противника

        // Проверяем, находится ли король под шахом
        return opponentMoves.some(move => move.to === kingPosition);
    }

    isUnderCheck(playerColor) {
        const kingPosition = this.findKing(playerColor);
        const opponetsMoves = this.getAllMoves(playerColor === 'white' ? 'black' : 'white');
        const state = opponetsMoves.some(move => move.to === kingPosition);
        if (state) {
            //достать клетку короля и дать ей стиль .check, который дает анимацию мигания клетки красным пару раз
            return state;
        }
    }

    isCheckmate(playerColor) {
        if (!this.isUnderCheck(playerColor)) {return false;}
        
        return (!this.canMove(playerColor));
    }

    isStalemate(playerColor) {
        if (this.isUnderCheck(playerColor)) {return false;}
        
        return (!this.canMove(playerColor));
    }

    canMove(playerColor) {
        const moves = this.getAllMoves(playerColor);
        
        // Сохраняем текущее состояние доски
        const tempBoard = this.board.clone();
        
        for (const move of moves) {
            const fromPosition = move.from; // Исходная позиция
            const toPosition = move.to; // Целевая позиция
        
            // Временное перемещение фигуры
            this.board.movePiece(fromPosition, toPosition);
        
            // Проверка на шах после хода
            if (!this.isUnderCheck(playerColor)) {
                // Если король не под шахом, восстанавливаем доску и возвращаем true
                this.board = tempBoard.clone();
                return true;
            }
        
            // Восстанавливаем доску для следующей проверки
            this.board = tempBoard.clone();
        }
    
        // Если все ходы приводят к шаху, возвращаем false
        return false;
    }

    findKing(playerColor) {
        for (let i = 0; i < 64; i++) {
            const piece = Utilites.findPiece(this.board, i);
            if (piece && piece.constructor.name === 'King' && piece.color === playerColor) {
                return i;
            }
        }
        throw new Error ('Вы как короля проебали?');
    }

    getAllMoves(playerColor) {
        const moves = [];
        for (let i = 0; i < 64; i++) {
            const piece = Utilites.findPiece(this.board, i);
            if (piece && piece.color === playerColor) {
                const validMoves = piece.validMoves(i, this.board);
                for (const move of validMoves) {
                    moves.push({ from: i, to: move }); // Добавляем объект с исходной и целевой позицией
                }

                // Если это пешка и она может продвинуться, добавляем варианты превращения
                if (piece instanceof Pawn) {
                    const promotionMoves = this.getPromotionMoves(i, piece);
                    moves.push(...promotionMoves); // Добавляем все варианты превращения
                }
            }
        }
        return moves; // Возвращаем массив объектов с ходами
    }

    getPromotionMoves(position, pawn) {
        const promotionMoves = [];
        const promotionRow = pawn.color === 'white' ? 0 : 7; // 0 для белых, 7 для черных

        // Проверяем, находится ли пешка на последней линии
        if (Math.floor(position / 8) === promotionRow) {
            // Добавляем все возможные варианты превращения
            const pieceTypes = ['Q', 'R', 'B', 'N']; // Ферзь, Ладья, Слон, Конь
            for (const type of pieceTypes) {
                promotionMoves.push({
                    from: position,
                    to: position, // Позиция не меняется, но мы добавляем информацию о превращении
                    promoteTo: type // Указываем, в какую фигуру превращается пешка
                });
            }
        }

        return promotionMoves; // Возвращаем все варианты превращения
    }
}

class Pawn extends Piece {
    validMoves(position, board, lastMove) {
        const moves = [];
        const direction = this.color === 'white' ? -1 : 1; // Направление движения
        const startRow = this.color === 'white' ? 6 : 1; // Начальная строка для белых и черных

        // Обычное движение вперед
        this.addForwardMoves(position, board, moves, direction, startRow);

        // Захваты вражеских фигур
        this.addCaptureMoves(position, board, moves, direction);

        // Проверка на взятие на проходе
        this.addEnPassantMove(position, board, moves, lastMove, direction);

        return moves; // Возвращаем все возможные ходы
    }

    addForwardMoves(position, board, moves, direction, startRow) {
        const forward = position + direction * 8;
        if (Utilites.isValidPosition(forward) && Utilites.findPiece(board, forward) === null) {
            moves.push(forward); // Пустая клетка
            // Проверка первого хода (движение на 2 клетки)
            if (Math.floor(position / 8) === startRow) {
                const doubleForward = position + direction * 16;
                if (Utilites.isValidPosition(doubleForward) && Utilites.findPiece(board, doubleForward) === null) {
                    moves.push(doubleForward); // Двойное движение вперед
                }
            }
        }
    }

    addCaptureMoves(position, board, moves, direction) {
        const captureLeft = position + direction * 8 - 1; // Левый захват
        const captureRight = position + direction * 8 + 1; // Правый захват

        this.checkCapture(position, board, moves, captureLeft);
        this.checkCapture(position, board, moves, captureRight);
    }

    checkCapture(position, board, moves, capturePosition) {
        if (Utilites.isValidPosition(capturePosition)) {
            const piece = Utilites.findPiece(board, capturePosition);
            if (piece && piece.color !== this.color) {
                const rowDiff = Math.abs(Math.floor(position / 8) - Math.floor(capturePosition / 8));
                const colDiff = Math.abs((position) % 8 - (capturePosition) % 8);

                // Проверка, что пешка захватывает по диагонали
                if (rowDiff === 1 && colDiff === 1) {
                    moves.push(capturePosition); // Взятие фигуры
                }
            }
        }
    }

    addEnPassantMove(position, board, moves, lastMove, direction) {
        if (lastMove) {
            const lastPiece = Utilites.findPiece(board, lastMove.to);
            if (lastPiece && lastPiece instanceof Pawn && lastPiece.color !== this.color) {
                const lastRow = Math.floor(lastMove.to / 8);
                if (Math.abs(lastMove.from - lastMove.to) === 16 && // Проверка, что вражеская пешка сделала двойной ход
                    (lastRow === Math.floor(position / 8) + direction)) { // Проверка, что пешка находится на одной линии
                    const enPassantCapture = lastMove.to + (this.color === 'white' ? -1 : 1); // Позиция для взятия на проходе
                    moves.push(enPassantCapture); // Добавляем возможность взятия на проходе
                }
            }
        }
    }
}

class Rook extends Piece {
    constructor(color) {
        super(color);
        this.isMoved = false; // Изначально ладья не перемещалась
    }

    validMoves(position, board) {
        const moves = [];
        const directions = [-1, 1, -8, 8]; // Горизонтальные и вертикальные направления

        for (const direction of directions) {
            let current = position;
            while (true) {
                current += direction;

                // Проверка границ доски
                if (!Utilites.isValidPosition(current)) break;

                const targetPiece = Utilites.findPiece(board, current);
                
                const rowDiff = Math.abs(Math.floor((position) / 8) - Math.floor((current) / 8));
                const colDiff = Math.abs((position) % 8 - (current) % 8);

                // Проверка, что движется по горизонтали, вертикали или диагонали
                if (direction === 1 || direction === -1 || direction === 8 || direction === -8) {
                    // Горизонтальные и вертикальные движения
                    if (rowDiff !== 0 && colDiff !== 0) {
                        continue; // Пропускаем недопустимый ход
                    }
                }

                // Если клетка пуста, добавляем в возможные ходы
                if (targetPiece === null) {
                    moves.push(current);
                } else if (targetPiece.color !== this.color) {
                    // Если клетка занята фигурой противника, добавляем в возможные ходы и выходим из цикла
                    moves.push(current);
                    break;
                } else {
                    // Если клетка занята своей фигурой, выходим из цикла
                    break;
                }
            }
        }

        return moves; // Возвращаем все возможные ходы
    }
}

class Night extends Piece {
    validMoves(position, board){
        const moves = [];
        const directions = [15, 17, 10, 6, -15, -17, -10, -6];

        for (const move of directions) {

            const target = position + move;
            if (!Utilites.isValidPosition (target)) continue;

            const rowDiff = Math.abs(Math.floor((position) / 8) - Math.floor((target) / 8));
            const colDiff = Math.abs((position) % 8 - (target) % 8);

            // Проверка, что конь движется в форме буквы "Г"
            if (!((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2))) {
              continue; // Недопустимый ход
            }

            const targetSquare = Utilites.findPiece(board, target);
            if (!targetSquare || targetSquare.color !== this.color) {
                moves.push(target);
            }
        }
        return moves;
    }
}

class Bishop extends Piece {
    validMoves(position, board) {
        const moves = [];
        const directions = [9, 7, -9, -7]; // Диагональные направления


        for (const direction of directions) {
            let current = position;
            while (true) {
                current += direction;
                if (!Utilites.isValidPosition(current)) break; // Проверка границ

                const targetSquare = Utilites.findPiece(board, current);
                const rowDiff = Math.abs(Math.floor((position) / 8) - Math.floor((current) / 8));
                const colDiff = Math.abs((position) % 8 - (current) % 8);

                // Проверка, что слон движется по диагонали
                if (rowDiff !== colDiff) {
                    continue; // Пропускаем недопустимый ход
                }

                if (targetSquare === null) {
                    moves.push(current); // Пустая клетка
                } else if (targetSquare.color !== this.color) {
                    moves.push(current); // Взятие фигуры
                    break; // Остановить движение, если встретили фигуру
                } else {
                    break; // Остановить движение, если встретили свою фигуру
                }
            }
        }

        return moves; // Возвращаем только допустимые ходы
    }
}

class Queen extends Piece {
    validMoves(position, board) {
        const moves = [];
        const directions = [1, -1, 8, -8, 9, -9, 7, -7]; // Горизонтальные, вертикальные и диагональные направления


        for (const direction of directions) {
            let current = position;
            while (true) {
                current += direction;
                if (!Utilites.isValidPosition(current)) break; // Проверка границ

                const targetSquare = Utilites.findPiece(board, current);
                const rowDiff = Math.abs(Math.floor((position) / 8) - Math.floor((current) / 8));
                const colDiff = Math.abs((position) % 8 - (current) % 8);

                // Проверка, что ферзь движется по горизонтали, вертикали или диагонали
                if (direction === 1 || direction === -1 || direction === 8 || direction === -8) {
                    // Горизонтальные и вертикальные движения
                    if (rowDiff !== 0 && colDiff !== 0) {
                        continue; // Пропускаем недопустимый ход
                    }
                } else if (rowDiff !== colDiff)
                {
                    continue; // Пропускаем недопустимый ход
                }

                if (targetSquare === null) {
                    moves.push(current); // Пустая клетка
                } else if (targetSquare.color !== this.color) {
                    moves.push(current); // Взятие фигуры
                    break; // Остановить движение, если встретили фигуру
                } else {
                    break; // Остановить движение, если встретили свою фигуру
                }
            }
        }

        return moves; // Возвращаем только допустимые ходы
    }
}

class King extends Piece {
    constructor(color) {
        super(color);
        this.isMoved = false; // Изначально король не перемещался
    }

    validMoves(position, board) {
        const moves = [];
        const directions = [
            -1, 1, -8, 8, -9, 9, -7, 7 // Все возможные направления движения короля
        ];

        for (const direction of directions) {
            const newPosition = position + direction;

            // Проверка на допустимость новой позиции
            if (Utilites.isValidPosition(newPosition)) {
                const targetPiece = Utilites.findPiece(board, newPosition);
                
                // Вычисляем разницу в строках и столбцах
                const rowDiff = Math.abs(Math.floor(position / 8) - Math.floor(newPosition / 8));
                const colDiff = Math.abs((position % 8) - (newPosition % 8));

                // Проверка, что король не захватывает свою фигуру и перемещается на одну клетку
                if ((!targetPiece || targetPiece.color !== this.color) && (rowDiff <= 1 && colDiff <= 1)) {
                    moves.push(newPosition); // Добавляем допустимый ход
                }
            }
        }

        return moves; // Возвращаем все возможные ходы
    }
}

</script>

<style scoped>
.main-area {
  width: -webkit-fill-available;
  display: flex;
}

.board {
  box-sizing: border-box;
  max-width: 640px; /* Максимальная ширина для больших экранов */
  width: 70vw; /* Используйте относительные единицы для ширины доски */
  aspect-ratio: 1;
  border: 20px solid var(--border-color); /* Используем переменную для цвета границы */
  margin: 0;
}

.square {
  position: relative;
  float: left;
  width: 12.5%; /* Измените размер квадратов в зависимости от ширины доски */
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.black {
  background-color: var(--cell-background-black); /* Используем переменную для темного фона */
}

.white {
  background-color: var(--cell-background-white); /* Используем переменную для светлого фона */
}

.possible-move {
  width: 75%;
  aspect-ratio: 1;
  background-color: rgba(40, 65, 65, 0.5); /* Можно оставить как есть, если не нужно менять */
  border-radius: 50%;
  position: absolute;
  z-index: 1;
}

.controls {
   display: flex;
   flex-direction: column; /* Вертикальное расположение кнопок */
   max-height: calc(640px - 20px);
   height: calc(70vw - 20px);
   gap: 10px; /* Отступ между кнопками */
   padding: 10px; /* Отступ внутри блока управления */
   background-color: var(--background-color); /* Используем переменную для фона блока управления */
   border: 1px solid var(--border-color); /* Используем переменную для цвета границы */
   border-radius: 2px; /* Скругление углов */
}

.control-button {
  width: 50px; /* Установите желаемую ширину */
  height: 50px; /* Установите фиксированную высоту */
  display: flex; /* Используйте flex для выравнивания содержимого */
  align-items: center; /* Центрирование по вертикали */
  justify-content: center; /* Центрирование по горизонтали */
  background-color: var(--background-color-light);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.control-button img {
  width: 100%; /* Установите ширину изображения на 100% от кнопки */
  height: auto; /* Автоматическая высота для сохранения пропорций */
}

.control-button:hover {
  background-color: var(--background-color-dark); /* Используем переменную для цвета фона при наведении */
  transform: scale(1.01); /* Увеличение кнопки при наведении */
}

/* Адаптация для фигур */
.square img {
  width: 70%; /* Устанавливаем ширину фигур относительно квадрата */
  height: auto; /* Автоматическая высота для сохранения пропорций */
}

/* Медиазапросы для мобильных устройств */
@media (max-width: 768px) {
  .main-area {
    align-items: center;
      flex-direction: column;
  }
  .board {
    width: 90vw; /* Увеличьте ширину доски на мобильных устройствах */
    height: 90vw; /* Высота равна ширине для квадратной формы */
  }

   .square {
       width: 12.5%; /* Измените размер квадратов для лучшего отображения на мобильных */
       height: 12.5%; /* Высота равна ширине для квадратной формы */
   }

   .controls {
       flex-direction: row; /* Измените направление кнопок на ряд для мобильных устройств */
       justify-content: space-around; /* Распределите кнопки равномерно */
   }

   .square img {
       width: 70%; /* Уменьшите размер фигур для мобильных устройств */
   }
}
</style>
