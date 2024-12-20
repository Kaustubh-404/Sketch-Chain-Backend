// // // // // backend/server.js
// // // // const express = require('express');
// // // // const { createServer } = require('http');
// // // // const { Server } = require('socket.io');
// // // // const cors = require('cors');
// // // // require('dotenv').config();

// // // // const app = express();
// // // // app.use(cors());
// // // // const httpServer = createServer(app);
// // // // const io = new Server(httpServer, {
// // // //   cors: {
// // // //     origin: 'http://localhost:3000',
// // // //     methods: ['GET', 'POST']
// // // //   }
// // // // });

// // // // const WORD_CATEGORIES = {
// // // //   animals: [
// // // //     'dog', 'cat', 'elephant', 'giraffe', 'lion', 'tiger', 'penguin', 'zebra',
// // // //     'monkey', 'kangaroo', 'panda', 'koala', 'dolphin', 'whale', 'octopus'
// // // //   ],
// // // //   objects: [
// // // //     'chair', 'table', 'lamp', 'phone', 'computer', 'book', 'pencil', 'clock',
// // // //     'glasses', 'umbrella', 'camera', 'television', 'mirror', 'window', 'door'
// // // //   ],
// // // //   food: [
// // // //     'pizza', 'burger', 'sushi', 'pasta', 'sandwich', 'taco', 'cookie', 'cake',
// // // //     'ice cream', 'chocolate', 'banana', 'apple', 'carrot', 'broccoli'
// // // //   ],
// // // // };

// // // // const getRandomWord = () => {
// // // //   const categories = Object.keys(WORD_CATEGORIES);
// // // //   const randomCategory = categories[Math.floor(Math.random() * categories.length)];
// // // //   const words = WORD_CATEGORIES[randomCategory];
// // // //   return words[Math.floor(Math.random() * words.length)];
// // // // };

// // // // // Store games and drawings in memory
// // // // const games = new Map();
// // // // const drawings = new Map();

// // // // function startNewRound(gameCode) {
// // // //   const gameState = games.get(gameCode);
// // // //   if (!gameState) return;

// // // //   gameState.currentWord = getRandomWord();
// // // //   gameState.timeLeft = 90;
// // // //   gameState.isActive = true;

// // // //   const timer = setInterval(() => {
// // // //     gameState.timeLeft--;
// // // //     io.to(gameCode).emit('timeUpdate', gameState.timeLeft);

// // // //     if (gameState.timeLeft <= 0) {
// // // //       clearInterval(timer);
// // // //       endRound(gameCode);
// // // //     }
// // // //   }, 1000);

// // // //   drawings.set(gameCode, []);
  
// // // //   io.to(gameCode).emit('roundStart', {
// // // //     drawer: gameState.currentDrawer,
// // // //     word: gameState.currentWord
// // // //   });
// // // // }

// // // // function endRound(gameCode) {
// // // //   const gameState = games.get(gameCode);
// // // //   if (!gameState) return;

// // // //   gameState.isActive = false;
  
// // // //   const currentDrawerIndex = gameState.players.findIndex(p => p.address === gameState.currentDrawer);
// // // //   const nextDrawerIndex = (currentDrawerIndex + 1) % gameState.players.length;
// // // //   gameState.currentDrawer = gameState.players[nextDrawerIndex].address;

// // // //   const roundsPerPlayer = 2;
// // // //   if (currentDrawerIndex === gameState.players.length - 1 && 
// // // //       Object.values(gameState.points).some(points => points >= roundsPerPlayer * 100)) {
// // // //     endGame(gameCode);
// // // //   } else {
// // // //     games.set(gameCode, gameState);
// // // //     io.to(gameCode).emit('roundEnd', gameState);
// // // //   }
// // // // }

// // // // function endGame(gameCode) {
// // // //   const gameState = games.get(gameCode);
// // // //   if (!gameState) return;

// // // //   const winner = Object.entries(gameState.points).reduce((a, b) => 
// // // //     (b[1] > a[1] ? b : a)
// // // //   )[0];

// // // //   io.to(gameCode).emit('gameEnd', {
// // // //     winner,
// // // //     points: gameState.points
// // // //   });

// // // //   games.delete(gameCode);
// // // //   drawings.delete(gameCode);
// // // // }

// // // // function handlePlayerDisconnect(gameCode, address) {
// // // //   const gameState = games.get(gameCode);
// // // //   if (!gameState) return;

// // // //   gameState.players = gameState.players.filter(p => p.address !== address);
  
// // // //   if (gameState.players.length === 0) {
// // // //     games.delete(gameCode);
// // // //     drawings.delete(gameCode);
// // // //   } else {
// // // //     if (gameState.currentDrawer === address) {
// // // //       const nextDrawerIndex = Math.floor(Math.random() * gameState.players.length);
// // // //       gameState.currentDrawer = gameState.players[nextDrawerIndex].address;
// // // //     }
// // // //     games.set(gameCode, gameState);
// // // //     io.to(gameCode).emit('gameState', gameState);
// // // //   }
// // // // }

// // // // io.on('connection', (socket) => {
// // // //   const { gameCode, address, name } = socket.handshake.query;
  
// // // //   if (!gameCode || !address) return;

// // // //   socket.join(gameCode);
  
// // // //   if (!games.has(gameCode)) {
// // // //     // Initialize new game
// // // //     games.set(gameCode, {
// // // //       currentDrawer: address,
// // // //       currentWord: '',
// // // //       players: [{ address, name }],
// // // //       points: {},
// // // //       timeLeft: 90,
// // // //       isActive: false
// // // //     });
// // // //   } else {
// // // //     // Add player to existing game
// // // //     const gameState = games.get(gameCode);
// // // //     if (!gameState.players.find(p => p.address === address)) {
// // // //       gameState.players.push({ address, name });
// // // //       games.set(gameCode, gameState);
// // // //     }
// // // //   }

// // // //   // Send current game state to all players
// // // //   io.to(gameCode).emit('gameState', games.get(gameCode));

// // // //   // Handle drawing
// // // //   socket.on('draw', (drawData) => {
// // // //     if (!gameCode) return;
    
// // // //     const gameState = games.get(gameCode);
// // // //     if (gameState?.currentDrawer !== address) return;

// // // //     drawings.set(gameCode, drawData.lines);
// // // //     socket.to(gameCode).emit('drawUpdate', drawData);
// // // //   });

// // // //   // Handle guesses
// // // //   socket.on('guess', (guess) => {
// // // //     if (!gameCode) return;
    
// // // //     const gameState = games.get(gameCode);
// // // //     if (!gameState || gameState.currentDrawer === address) return;

// // // //     if (guess.toLowerCase() === gameState.currentWord.toLowerCase()) {
// // // //       const points = Math.ceil((gameState.timeLeft / 90) * 100);
// // // //       gameState.points[address] = (gameState.points[address] || 0) + points;
      
// // // //       io.to(gameCode).emit('correctGuess', {
// // // //         player: address,
// // // //         points: gameState.points[address]
// // // //       });

// // // //       if (Object.keys(gameState.points).length === gameState.players.length - 1) {
// // // //         endRound(gameCode);
// // // //       }
// // // //     }
// // // //   });

// // // //   // Handle chat messages
// // // //   socket.on('chat', (message) => {
// // // //     if (!gameCode) return;
    
// // // //     io.to(gameCode).emit('message', {
// // // //       player: address,
// // // //       text: message,
// // // //       type: 'chat'
// // // //     });
// // // //   });

// // // //   // Handle round start
// // // //   socket.on('startRound', () => {
// // // //     if (!gameCode) return;
// // // //     startNewRound(gameCode);
// // // //   });

// // // //   // Handle disconnection
// // // //   socket.on('disconnect', () => {
// // // //     if (gameCode) {
// // // //       handlePlayerDisconnect(gameCode, address);
// // // //     }
// // // //   });

// // // //   // Handle clear canvas
// // // //   socket.on('clearCanvas', () => {
// // // //     if (!gameCode) return;
    
// // // //     const gameState = games.get(gameCode);
// // // //     if (gameState?.currentDrawer !== address) return;

// // // //     drawings.set(gameCode, []);
// // // //     socket.to(gameCode).emit('canvasCleared');
// // // //   });
// // // // });

// // // // const PORT = process.env.PORT || 4000;
// // // // httpServer.listen(PORT, () => {
// // // //   console.log(`WebSocket server running on port ${PORT}`);
// // // // });

// // // const express = require('express');
// // // const { createServer } = require('http');
// // // const { Server } = require('socket.io');
// // // const cors = require('cors');
// // // require('dotenv').config();

// // // const app = express();
// // // app.use(cors());

// // // // Add request logging middleware
// // // app.use((req, res, next) => {
// // //   console.log(`Incoming ${req.method} request to ${req.path}`);
// // //   next();
// // // });

// // // // Root path route
// // // app.get('/', (req, res) => {
// // //   res.send('Scribble Game Server is running');
// // // });

// // // const httpServer = createServer(app);
// // // const io = new Server(httpServer, {
// // //   cors: {
// // //     origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
// // //     methods: ['GET', 'POST']
// // //   }
// // // });

// // // const WORD_CATEGORIES = {
// // //   animals: [
// // //     'dog', 'cat', 'elephant', 'giraffe', 'lion', 'tiger', 'penguin', 'zebra',
// // //     'monkey', 'kangaroo', 'panda', 'koala', 'dolphin', 'whale', 'octopus'
// // //   ],
// // //   objects: [
// // //     'chair', 'table', 'lamp', 'phone', 'computer', 'book', 'pencil', 'clock',
// // //     'glasses', 'umbrella', 'camera', 'television', 'mirror', 'window', 'door'
// // //   ],
// // //   food: [
// // //     'pizza', 'burger', 'sushi', 'pasta', 'sandwich', 'taco', 'cookie', 'cake',
// // //     'ice cream', 'chocolate', 'banana', 'apple', 'carrot', 'broccoli'
// // //   ],
// // // };

// // // const getRandomWord = () => {
// // //   const categories = Object.keys(WORD_CATEGORIES);
// // //   const randomCategory = categories[Math.floor(Math.random() * categories.length)];
// // //   const words = WORD_CATEGORIES[randomCategory];
// // //   return words[Math.floor(Math.random() * words.length)];
// // // };

// // // // Store games and drawings in memory
// // // const games = new Map();
// // // const drawings = new Map();

// // // function startNewRound(gameCode) {
// // //   const gameState = games.get(gameCode);
// // //   if (!gameState) return;

// // //   gameState.currentWord = getRandomWord();
// // //   gameState.timeLeft = 90;
// // //   gameState.isActive = true;

// // //   const timer = setInterval(() => {
// // //     gameState.timeLeft--;
// // //     io.to(gameCode).emit('timeUpdate', gameState.timeLeft);

// // //     if (gameState.timeLeft <= 0) {
// // //       clearInterval(timer);
// // //       endRound(gameCode);
// // //     }
// // //   }, 1000);

// // //   drawings.set(gameCode, []);
  
// // //   io.to(gameCode).emit('roundStart', {
// // //     drawer: gameState.currentDrawer,
// // //     word: gameState.currentWord
// // //   });
// // // }

// // // function endRound(gameCode) {
// // //   const gameState = games.get(gameCode);
// // //   if (!gameState) return;

// // //   gameState.isActive = false;
  
// // //   const currentDrawerIndex = gameState.players.findIndex(p => p.address === gameState.currentDrawer);
// // //   const nextDrawerIndex = (currentDrawerIndex + 1) % gameState.players.length;
// // //   gameState.currentDrawer = gameState.players[nextDrawerIndex].address;

// // //   const roundsPerPlayer = 2;
// // //   if (currentDrawerIndex === gameState.players.length - 1 && 
// // //       Object.values(gameState.points).some(points => points >= roundsPerPlayer * 100)) {
// // //     endGame(gameCode);
// // //   } else {
// // //     games.set(gameCode, gameState);
// // //     io.to(gameCode).emit('roundEnd', gameState);
// // //   }
// // // }

// // // function endGame(gameCode) {
// // //   const gameState = games.get(gameCode);
// // //   if (!gameState) return;

// // //   const winner = Object.entries(gameState.points).reduce((a, b) => 
// // //     (b[1] > a[1] ? b : a)
// // //   )[0];

// // //   io.to(gameCode).emit('gameEnd', {
// // //     winner,
// // //     points: gameState.points
// // //   });

// // //   games.delete(gameCode);
// // //   drawings.delete(gameCode);
// // // }

// // // function handlePlayerDisconnect(gameCode, address) {
// // //   const gameState = games.get(gameCode);
// // //   if (!gameState) return;

// // //   gameState.players = gameState.players.filter(p => p.address !== address);
  
// // //   if (gameState.players.length === 0) {
// // //     games.delete(gameCode);
// // //     drawings.delete(gameCode);
// // //   } else {
// // //     if (gameState.currentDrawer === address) {
// // //       const nextDrawerIndex = Math.floor(Math.random() * gameState.players.length);
// // //       gameState.currentDrawer = gameState.players[nextDrawerIndex].address;
// // //     }
// // //     games.set(gameCode, gameState);
// // //     io.to(gameCode).emit('gameState', gameState);
// // //   }
// // // }

// // // io.on('connection', (socket) => {
// // //   const { gameCode, address, name = 'Anonymous' } = socket.handshake.query;
  
// // //   console.log(`New socket connection: ${address} in game ${gameCode}`);

// // //   if (!gameCode || !address) {
// // //     console.log('Invalid connection attempt');
// // //     return;
// // //   }

// // //   socket.join(gameCode);
  
// // //   if (!games.has(gameCode)) {
// // //     // Initialize new game
// // //     games.set(gameCode, {
// // //       currentDrawer: address,
// // //       currentWord: '',
// // //       players: [{ address, name }],
// // //       points: {},
// // //       timeLeft: 90,
// // //       isActive: false
// // //     });
// // //   } else {
// // //     // Add player to existing game
// // //     const gameState = games.get(gameCode);
// // //     if (!gameState.players.find(p => p.address === address)) {
// // //       gameState.players.push({ address, name });
// // //       games.set(gameCode, gameState);
// // //     }
// // //   }

// // //   // Send current game state to all players
// // //   io.to(gameCode).emit('gameState', games.get(gameCode));

// // //   // Handle drawing
// // //   socket.on('draw', (drawData) => {
// // //     if (!gameCode) return;
    
// // //     const gameState = games.get(gameCode);
// // //     if (gameState?.currentDrawer !== address) return;

// // //     drawings.set(gameCode, drawData.lines);
// // //     socket.to(gameCode).emit('drawUpdate', drawData);
// // //   });

// // //   // Handle guesses
// // //   socket.on('guess', (guess) => {
// // //     if (!gameCode) return;
    
// // //     const gameState = games.get(gameCode);
// // //     if (!gameState || gameState.currentDrawer === address) return;

// // //     if (guess.toLowerCase() === gameState.currentWord.toLowerCase()) {
// // //       const points = Math.ceil((gameState.timeLeft / 90) * 100);
// // //       gameState.points[address] = (gameState.points[address] || 0) + points;
      
// // //       io.to(gameCode).emit('correctGuess', {
// // //         player: address,
// // //         points: gameState.points[address]
// // //       });

// // //       if (Object.keys(gameState.points).length === gameState.players.length - 1) {
// // //         endRound(gameCode);
// // //       }
// // //     }
// // //   });

// // //   // Handle chat messages
// // //   socket.on('chat', (message) => {
// // //     if (!gameCode) return;
    
// // //     io.to(gameCode).emit('message', {
// // //       player: address,
// // //       text: message,
// // //       type: 'chat'
// // //     });
// // //   });

// // //   // Handle round start
// // //   socket.on('startRound', () => {
// // //     if (!gameCode) return;
// // //     startNewRound(gameCode);
// // //   });

// // //   // Handle disconnection
// // //   socket.on('disconnect', () => {
// // //     if (gameCode) {
// // //       handlePlayerDisconnect(gameCode, address);
// // //     }
// // //   });

// // //   // Handle clear canvas
// // //   socket.on('clearCanvas', () => {
// // //     if (!gameCode) return;
    
// // //     const gameState = games.get(gameCode);
// // //     if (gameState?.currentDrawer !== address) return;

// // //     drawings.set(gameCode, []);
// // //     socket.to(gameCode).emit('canvasCleared');
// // //   });
// // // });

// // // // Add error handling middleware
// // // app.use((err, req, res, next) => {
// // //   console.error(err.stack);
// // //   res.status(500).send('Something broke!');
// // // });

// // // const PORT = process.env.PORT || 4000;
// // // httpServer.listen(PORT, () => {
// // //   console.log(`WebSocket server running on port ${PORT}`);
// // // });

// // // backend/server.js
// // const express = require('express');
// // const { createServer } = require('http');
// // const { Server } = require('socket.io');
// // const cors = require('cors');
// // require('dotenv').config();

// // const app = express();

// // // Basic route to check server status
// // app.get('/', (req, res) => {
// //   res.send('Web3 Scribble Game Server Running');
// // });

// // app.use(cors({
// //   origin: process.env.FRONTEND_URL || 'http://localhost:3000',
// //   methods: ['GET', 'POST'],
// //   credentials: true
// // }));

// // const httpServer = createServer(app);
// // const io = new Server(httpServer, {
// //   cors: {
// //     origin: process.env.FRONTEND_URL || 'http://localhost:3000',
// //     methods: ['GET', 'POST'],
// //     credentials: true
// //   },
// //   transports: ['websocket', 'polling']
// // });

// // const WORD_CATEGORIES = {
// //   animals: ['dog', 'cat', 'elephant', 'giraffe', 'lion', 'tiger', 'penguin'],
// //   objects: ['chair', 'table', 'lamp', 'phone', 'computer', 'book', 'pencil'],
// //   food: ['pizza', 'burger', 'sushi', 'pasta', 'sandwich', 'taco', 'cookie']
// // };

// // const games = new Map();
// // const drawings = new Map();

// // function getRandomWord() {
// //   const categories = Object.keys(WORD_CATEGORIES);
// //   const randomCategory = categories[Math.floor(Math.random() * categories.length)];
// //   const words = WORD_CATEGORIES[randomCategory];
// //   return words[Math.floor(Math.random() * words.length)];
// // }

// // io.on('connection', (socket) => {
// //   console.log('Client connected:', socket.id);
  
// //   const { gameCode, address, name } = socket.handshake.query;
  
// //   if (!gameCode || !address) {
// //     console.log('Missing gameCode or address, disconnecting');
// //     socket.disconnect();
// //     return;
// //   }

// //   console.log(`Player ${address} joining game ${gameCode}`);
  
// //   socket.join(gameCode);
  
// //   if (!games.has(gameCode)) {
// //     console.log('Creating new game:', gameCode);
// //     games.set(gameCode, {
// //       currentDrawer: address,
// //       currentWord: '',
// //       players: [{ address, name }],
// //       points: {},
// //       timeLeft: 90,
// //       isActive: false
// //     });
// //   } else {
// //     const gameState = games.get(gameCode);
// //     if (!gameState.players.find(p => p.address === address)) {
// //       gameState.players.push({ address, name });
// //       games.set(gameCode, gameState);
// //     }
// //   }

// //   // Emit initial game state
// //   const gameState = games.get(gameCode);
// //   io.to(gameCode).emit('gameState', gameState);
// //   console.log('Emitted game state:', gameState);

// //   // Handle drawing
// //   socket.on('draw', (drawData) => {
// //     console.log(`Draw data received from ${address}`);
// //     if (!gameCode) return;
    
// //     const gameState = games.get(gameCode);
// //     if (gameState?.currentDrawer !== address) return;

// //     drawings.set(gameCode, drawData.lines);
// //     socket.to(gameCode).emit('drawUpdate', drawData);
// //   });

// //   // Handle guesses
// //   socket.on('guess', (guess) => {
// //     console.log(`Guess received from ${address}: ${guess}`);
// //     if (!gameCode) return;
    
// //     const gameState = games.get(gameCode);
// //     if (!gameState || gameState.currentDrawer === address) return;

// //     if (guess.toLowerCase() === gameState.currentWord.toLowerCase()) {
// //       const points = Math.ceil((gameState.timeLeft / 90) * 100);
// //       gameState.points[address] = (gameState.points[address] || 0) + points;
      
// //       io.to(gameCode).emit('correctGuess', {
// //         player: address,
// //         points: gameState.points[address]
// //       });
// //     }
// //   });

// //   // Handle round start
// //   socket.on('startRound', () => {
// //     console.log(`Starting round for game ${gameCode}`);
// //     if (!gameCode) return;
    
// //     const gameState = games.get(gameCode);
// //     if (!gameState || gameState.currentDrawer !== address) return;

// //     gameState.currentWord = getRandomWord();
// //     gameState.timeLeft = 90;
// //     gameState.isActive = true;

// //     games.set(gameCode, gameState);
    
// //     io.to(gameCode).emit('roundStart', {
// //       drawer: gameState.currentDrawer,
// //       word: gameState.currentWord
// //     });
// //   });

// //   // Handle disconnection
// //   socket.on('disconnect', () => {
// //     console.log('Client disconnected:', socket.id);
// //     if (!gameCode) return;
    
// //     const gameState = games.get(gameCode);
// //     if (!gameState) return;

// //     gameState.players = gameState.players.filter(p => p.address !== address);
    
// //     if (gameState.players.length === 0) {
// //       games.delete(gameCode);
// //       drawings.delete(gameCode);
// //     } else {
// //       if (gameState.currentDrawer === address) {
// //         gameState.currentDrawer = gameState.players[0].address;
// //       }
// //       games.set(gameCode, gameState);
// //       io.to(gameCode).emit('gameState', gameState);
// //     }
// //   });
// // });

// // const PORT = process.env.PORT || 4000;
// // httpServer.listen(PORT, () => {
// //   console.log(`Server running on port ${PORT}`);
// // });

// // backend/server.js
// const express = require('express');
// const { createServer } = require('http');
// const { Server } = require('socket.io');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();

// // Basic route to check server status
// app.get('/', (req, res) => {
//   res.send('Web3 Scribble Game Server Running');
// });

// app.use(cors({
//   origin: process.env.FRONTEND_URL || 'http://localhost:3000',
//   methods: ['GET', 'POST'],
//   credentials: true
// }));

// const httpServer = createServer(app);
// const io = new Server(httpServer, {
//   cors: {
//     origin: process.env.FRONTEND_URL || 'http://localhost:3000',
//     methods: ['GET', 'POST'],
//     credentials: true
//   },
//   transports: ['websocket', 'polling']
// });

// const WORD_CATEGORIES = {
//   animals: ['dog', 'cat', 'elephant', 'giraffe', 'lion', 'tiger', 'penguin'],
//   objects: ['chair', 'table', 'lamp', 'phone', 'computer', 'book', 'pencil'],
//   food: ['pizza', 'burger', 'sushi', 'pasta', 'sandwich', 'taco', 'cookie']
// };

// const games = new Map();
// const drawings = new Map();

// function getRandomWord() {
//   const categories = Object.keys(WORD_CATEGORIES);
//   const randomCategory = categories[Math.floor(Math.random() * categories.length)];
//   const words = WORD_CATEGORIES[randomCategory];
//   return words[Math.floor(Math.random() * words.length)];
// }

// function startNewRound(gameCode) {
//   const gameState = games.get(gameCode);
//   if (!gameState) return;

//   gameState.currentWord = getRandomWord();
//   gameState.timeLeft = 90;
//   gameState.roundActive = true;

//   // Clear previous drawings
//   drawings.set(gameCode, []);

//   io.to(gameCode).emit('roundStart', {
//     drawer: gameState.currentDrawer,
//     word: gameState.currentWord,
//     timeLeft: gameState.timeLeft
//   });

//   // Start the timer
//   const timer = setInterval(() => {
//     const currentState = games.get(gameCode);
//     if (!currentState || !currentState.roundActive) {
//       clearInterval(timer);
//       return;
//     }

//     currentState.timeLeft--;
//     io.to(gameCode).emit('timeUpdate', currentState.timeLeft);

//     if (currentState.timeLeft <= 0) {
//       clearInterval(timer);
//       endRound(gameCode);
//     }
//   }, 1000);
// }

// function endRound(gameCode) {
//   const gameState = games.get(gameCode);
//   if (!gameState) return;

//   gameState.roundActive = false;
  
//   // Select next drawer
//   const currentDrawerIndex = gameState.players.findIndex(p => p.address === gameState.currentDrawer);
//   const nextDrawerIndex = (currentDrawerIndex + 1) % gameState.players.length;
//   gameState.currentDrawer = gameState.players[nextDrawerIndex].address;

//   games.set(gameCode, gameState);

//   io.to(gameCode).emit('roundEnd', {
//     scores: gameState.points
//   });

//   // Start new round after a short delay
//   setTimeout(() => {
//     if (games.has(gameCode)) {
//       startNewRound(gameCode);
//     }
//   }, 3000);
// }

// io.on('connection', (socket) => {
//   console.log('Client connected:', socket.id);
  
//   const { gameCode, address, name } = socket.handshake.query;
  
//   if (!gameCode || !address) {
//     console.log('Missing gameCode or address, disconnecting');
//     socket.disconnect();
//     return;
//   }

//   console.log(`Player ${address} joining game ${gameCode}`);
  
//   socket.join(gameCode);
  
//   if (!games.has(gameCode)) {
//     console.log('Creating new game:', gameCode);
//     games.set(gameCode, {
//       currentDrawer: address,
//       currentWord: '',
//       players: [{ address, name }],
//       points: {},
//       timeLeft: 90,
//       isActive: false,
//       isGameStarted: false,
//       roundActive: false
//     });
//   } else {
//     const gameState = games.get(gameCode);
//     if (!gameState.players.find(p => p.address === address)) {
//       gameState.players.push({ address, name });
//       games.set(gameCode, gameState);
//     }
//   }

//   // Emit initial game state
//   const gameState = games.get(gameCode);
//   io.to(gameCode).emit('gameState', gameState);
//   console.log('Emitted game state:', gameState);

//   // Handle game start
//   socket.on('startGame', () => {
//     console.log(`Starting game in room ${gameCode}`);
//     if (!gameCode) return;

//     const gameState = games.get(gameCode);
//     if (!gameState || gameState.isGameStarted) return;

//     if (gameState.players.length < 2) {
//       socket.emit('error', { message: 'Not enough players to start game' });
//       return;
//     }

//     gameState.isGameStarted = true;
//     gameState.isActive = true;
//     games.set(gameCode, gameState);

//     io.to(gameCode).emit('gameStarted', {
//       drawer: gameState.currentDrawer,
//       timeLeft: gameState.timeLeft
//     });

//     startNewRound(gameCode);
//   });

//   // Handle drawing
//   socket.on('draw', (drawData) => {
//     if (!gameCode) return;
    
//     const gameState = games.get(gameCode);
//     if (!gameState?.roundActive || gameState.currentDrawer !== address) return;

//     drawings.set(gameCode, drawData.lines);
//     socket.to(gameCode).emit('drawUpdate', drawData);
//   });

//   // Handle guesses
//   socket.on('guess', (guess) => {
//     if (!gameCode) return;
    
//     const gameState = games.get(gameCode);
//     if (!gameState?.roundActive || gameState.currentDrawer === address) return;

//     if (guess.toLowerCase() === gameState.currentWord.toLowerCase()) {
//       const points = Math.ceil((gameState.timeLeft / 90) * 100);
//       gameState.points[address] = (gameState.points[address] || 0) + points;
      
//       io.to(gameCode).emit('correctGuess', {
//         player: address,
//         points: gameState.points[address]
//       });

//       // End round if everyone except drawer has guessed correctly
//       const guessers = Object.keys(gameState.points).length;
//       const totalPlayers = gameState.players.length;
//       if (guessers >= totalPlayers - 1) {
//         endRound(gameCode);
//       }
//     }
//   });

//   // Handle disconnection
//   socket.on('disconnect', () => {
//     console.log('Client disconnected:', socket.id);
//     if (!gameCode) return;
    
//     const gameState = games.get(gameCode);
//     if (!gameState) return;

//     gameState.players = gameState.players.filter(p => p.address !== address);
    
//     if (gameState.players.length === 0) {
//       games.delete(gameCode);
//       drawings.delete(gameCode);
//     } else {
//       if (gameState.currentDrawer === address) {
//         gameState.currentDrawer = gameState.players[0].address;
//         if (gameState.roundActive) {
//           endRound(gameCode);
//         }
//       }
//       games.set(gameCode, gameState);
//       io.to(gameCode).emit('gameState', gameState);
//     }
//   });
// });

// const PORT = process.env.PORT || 4000;
// httpServer.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });



// // backend/server.js
// const express = require('express');
// const { createServer } = require('http');
// const { Server } = require('socket.io');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();

// app.get('/', (req, res) => {
//   res.send('Web3 Scribble Game Server Running');
// });

// app.use(cors({
//   origin: process.env.FRONTEND_URL || 'http://localhost:3000',
//   methods: ['GET', 'POST'],
//   credentials: true
// }));

// const httpServer = createServer(app);
// const io = new Server(httpServer, {
//   cors: {
//     origin: process.env.FRONTEND_URL || 'http://localhost:3000',
//     methods: ['GET', 'POST'],
//     credentials: true
//   },
//   transports: ['websocket', 'polling']
// });

// const WORD_CATEGORIES = {
//   animals: ['dog', 'cat', 'elephant', 'giraffe', 'lion', 'tiger', 'penguin'],
//   objects: ['chair', 'table', 'lamp', 'phone', 'computer', 'book', 'pencil'],
//   food: ['pizza', 'burger', 'sushi', 'pasta', 'sandwich', 'taco', 'cookie']
// };

// const games = new Map();
// const drawings = new Map();
// const timers = new Map();

// function getRandomWord() {
//   const categories = Object.keys(WORD_CATEGORIES);
//   const randomCategory = categories[Math.floor(Math.random() * categories.length)];
//   const words = WORD_CATEGORIES[randomCategory];
//   return words[Math.floor(Math.random() * words.length)];
// }

// function startNewRound(gameCode) {
//   const gameState = games.get(gameCode);
//   if (!gameState || !gameState.isGameStarted) return;

//   // Clear any existing timer
//   if (timers.has(gameCode)) {
//     clearInterval(timers.get(gameCode));
//   }

//   // Reset game state for new round
//   gameState.currentWord = getRandomWord();
//   gameState.timeLeft = 90;
//   gameState.roundActive = true;
//   games.set(gameCode, gameState);

//   // Clear previous drawings
//   drawings.set(gameCode, []);

//   console.log(`Starting new round for ${gameCode}:`, {
//     drawer: gameState.currentDrawer,
//     word: gameState.currentWord
//   });

//   // Notify all players of round start
//   io.to(gameCode).emit('roundStart', {
//     drawer: gameState.currentDrawer,
//     word: gameState.currentWord,
//     timeLeft: gameState.timeLeft
//   });

//   // Start round timer
//   const timer = setInterval(() => {
//     const currentState = games.get(gameCode);
//     if (!currentState || !currentState.roundActive) {
//       clearInterval(timer);
//       timers.delete(gameCode);
//       return;
//     }

//     currentState.timeLeft--;
//     games.set(gameCode, currentState);
//     io.to(gameCode).emit('timeUpdate', currentState.timeLeft);

//     if (currentState.timeLeft <= 0) {
//       clearInterval(timer);
//       timers.delete(gameCode);
//       endRound(gameCode);
//     }
//   }, 1000);

//   timers.set(gameCode, timer);
// }

// function endRound(gameCode) {
//   const gameState = games.get(gameCode);
//   if (!gameState) return;

//   // Clear timer if exists
//   if (timers.has(gameCode)) {
//     clearInterval(timers.get(gameCode));
//     timers.delete(gameCode);
//   }

//   gameState.roundActive = false;
  
//   // Select next drawer
//   const currentDrawerIndex = gameState.players.findIndex(p => p.address === gameState.currentDrawer);
//   const nextDrawerIndex = (currentDrawerIndex + 1) % gameState.players.length;
//   gameState.currentDrawer = gameState.players[nextDrawerIndex].address;

//   games.set(gameCode, gameState);

//   console.log(`Ending round for ${gameCode}, next drawer: ${gameState.currentDrawer}`);

//   io.to(gameCode).emit('roundEnd', {
//     scores: gameState.points,
//     nextDrawer: gameState.currentDrawer
//   });

//   // Start new round after delay
//   setTimeout(() => {
//     if (games.has(gameCode)) {
//       startNewRound(gameCode);
//     }
//   }, 3000);
// }

// io.on('connection', (socket) => {
//   console.log('Client connected:', socket.id);
  
//   const { gameCode, address, name } = socket.handshake.query;
  
//   if (!gameCode || !address) {
//     console.log('Missing gameCode or address, disconnecting');
//     socket.disconnect();
//     return;
//   }

//   console.log(`Player ${address} joining game ${gameCode}`);
//   socket.join(gameCode);
  
//   if (!games.has(gameCode)) {
//     games.set(gameCode, {
//       currentDrawer: address,
//       currentWord: '',
//       players: [{ address, name }],
//       points: {},
//       timeLeft: 90,
//       isActive: false,
//       isGameStarted: false,
//       roundActive: false
//     });
//   } else {
//     const gameState = games.get(gameCode);
//     if (!gameState.players.find(p => p.address === address)) {
//       gameState.players.push({ address, name });
//       games.set(gameCode, gameState);
//     }
//   }

//   // Send initial state
//   const gameState = games.get(gameCode);
//   io.to(gameCode).emit('gameState', gameState);

//   // Game start handler
//   socket.on('startGame', () => {
//     console.log(`Starting game in room ${gameCode}`);
//     const gameState = games.get(gameCode);
    
//     if (!gameState || gameState.isGameStarted) return;
//     if (gameState.players.length < 2) {
//       socket.emit('error', { message: 'Not enough players' });
//       return;
//     }

//     gameState.isGameStarted = true;
//     gameState.isActive = true;
//     games.set(gameCode, gameState);

//     io.to(gameCode).emit('gameStarted', {
//       drawer: gameState.currentDrawer,
//       timeLeft: gameState.timeLeft
//     });

//     startNewRound(gameCode);
//   });

//   // Drawing handler
//   socket.on('draw', (drawData) => {
//     const gameState = games.get(gameCode);
//     if (!gameState?.roundActive || gameState.currentDrawer !== address) return;

//     drawings.set(gameCode, drawData.lines);
//     socket.to(gameCode).emit('drawUpdate', drawData);
//   });

//   // Guess handler
//   socket.on('guess', (guess) => {
//     const gameState = games.get(gameCode);
//     if (!gameState?.roundActive || gameState.currentDrawer === address) return;

//     if (guess.toLowerCase() === gameState.currentWord.toLowerCase()) {
//       const points = Math.ceil((gameState.timeLeft / 90) * 100);
//       gameState.points[address] = (gameState.points[address] || 0) + points;
      
//       io.to(gameCode).emit('correctGuess', {
//         player: address,
//         points: gameState.points[address]
//       });

//       // Check if everyone has guessed
//       const correctGuessers = Object.keys(gameState.points).length;
//       if (correctGuessers >= gameState.players.length - 1) {
//         endRound(gameCode);
//       }
//     }
//   });

//   // Disconnect handler
//   socket.on('disconnect', () => {
//     console.log(`Client disconnected: ${socket.id}`);
//     const gameState = games.get(gameCode);
//     if (!gameState) return;

//     gameState.players = gameState.players.filter(p => p.address !== address);
    
//     if (gameState.players.length === 0) {
//       games.delete(gameCode);
//       drawings.delete(gameCode);
//       if (timers.has(gameCode)) {
//         clearInterval(timers.get(gameCode));
//         timers.delete(gameCode);
//       }
//     } else {
//       if (gameState.currentDrawer === address) {
//         gameState.currentDrawer = gameState.players[0].address;
//         if (gameState.roundActive) {
//           endRound(gameCode);
//         }
//       }
//       games.set(gameCode, gameState);
//       io.to(gameCode).emit('gameState', gameState);
//     }
//   });
// });

// const PORT = process.env.PORT || 4000;
// httpServer.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


// backend/server.js
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true
}));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Word categories
const WORD_CATEGORIES = {
  animals: ['dog', 'cat', 'elephant', 'giraffe', 'lion', 'tiger', 'penguin'],
  objects: ['chair', 'table', 'lamp', 'phone', 'computer', 'book', 'pencil'],
  food: ['pizza', 'burger', 'sushi', 'pasta', 'sandwich', 'taco', 'cookie']
};

const games = new Map();
const drawings = new Map();
const timers = new Map();

function getRandomWord() {
  const categories = Object.keys(WORD_CATEGORIES);
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const words = WORD_CATEGORIES[randomCategory];
  return words[Math.floor(Math.random() * words.length)];
}

function checkGameEnd(gameCode) {
  const gameState = games.get(gameCode);
  if (!gameState) return false;

  // Check if all players have drawn
  const allPlayersHaveDrawn = gameState.players.every(player => 
    gameState.playersWhoDrawn.includes(player.address)
  );

  if (allPlayersHaveDrawn) {
    endGame(gameCode);
    return true;
  }
  return false;
}

function startNewRound(gameCode) {
  const gameState = games.get(gameCode);
  if (!gameState || !gameState.isGameStarted) return;

  // Clear existing timer
  if (timers.has(gameCode)) {
    clearInterval(timers.get(gameCode));
  }

  gameState.currentWord = getRandomWord();
  gameState.timeLeft = 90;
  gameState.roundActive = true;
  gameState.correctGuessers = [];
  games.set(gameCode, gameState);

  drawings.set(gameCode, []);

  io.to(gameCode).emit('roundStart', {
    drawer: gameState.currentDrawer,
    word: gameState.currentWord,
    timeLeft: gameState.timeLeft
  });

  const timer = setInterval(() => {
    const currentState = games.get(gameCode);
    if (!currentState || !currentState.roundActive) {
      clearInterval(timer);
      timers.delete(gameCode);
      return;
    }

    currentState.timeLeft--;
    games.set(gameCode, currentState);
    io.to(gameCode).emit('timeUpdate', currentState.timeLeft);

    if (currentState.timeLeft <= 0) {
      clearInterval(timer);
      timers.delete(gameCode);
      endRound(gameCode);
    }
  }, 1000);

  timers.set(gameCode, timer);
}

function endRound(gameCode) {
  const gameState = games.get(gameCode);
  if (!gameState) return;

  if (timers.has(gameCode)) {
    clearInterval(timers.get(gameCode));
    timers.delete(gameCode);
  }

  gameState.roundActive = false;
  gameState.playersWhoDrawn.push(gameState.currentDrawer);
  
  const currentDrawerIndex = gameState.players.findIndex(p => p.address === gameState.currentDrawer);
  const nextDrawerIndex = (currentDrawerIndex + 1) % gameState.players.length;
  gameState.currentDrawer = gameState.players[nextDrawerIndex].address;

  games.set(gameCode, gameState);

  io.to(gameCode).emit('roundEnd', {
    scores: gameState.points,
    nextDrawer: gameState.currentDrawer,
    word: gameState.currentWord // Send the word that was being drawn
  });

  // Check if game should end
  if (!checkGameEnd(gameCode)) {
    setTimeout(() => {
      if (games.has(gameCode)) {
        startNewRound(gameCode);
      }
    }, 3000);
  }
}

function endGame(gameCode) {
  const gameState = games.get(gameCode);
  if (!gameState) return;

  // Find winner
  const winner = Object.entries(gameState.points)
    .reduce((a, b) => (b[1] > a[1] ? b : a));

  io.to(gameCode).emit('gameEnd', {
    winner: winner[0],
    points: gameState.points,
    totalPrize: gameState.wagerAmount * gameState.players.length
  });

  // Cleanup
  games.delete(gameCode);
  drawings.delete(gameCode);
  if (timers.has(gameCode)) {
    clearInterval(timers.get(gameCode));
    timers.delete(gameCode);
  }
}

io.on('connection', (socket) => {
  const { gameCode, address, name } = socket.handshake.query;
  
  if (!gameCode || !address) {
    socket.disconnect();
    return;
  }

  socket.join(gameCode);
  
  if (!games.has(gameCode)) {
    games.set(gameCode, {
      currentDrawer: address,
      currentWord: '',
      players: [{ address, name }],
      points: {},
      timeLeft: 90,
      isActive: false,
      isGameStarted: false,
      roundActive: false,
      playersWhoDrawn: [],
      correctGuessers: [],
      wagerAmount: 0
    });
  } else {
    const gameState = games.get(gameCode);
    if (!gameState.players.find(p => p.address === address)) {
      gameState.players.push({ address, name });
      games.set(gameCode, gameState);
    }
  }

  const gameState = games.get(gameCode);
  io.to(gameCode).emit('gameState', gameState);

  socket.on('startGame', () => {
    const gameState = games.get(gameCode);
    if (!gameState || gameState.isGameStarted) return;

    if (gameState.players.length < 2) {
      socket.emit('error', { message: 'Not enough players' });
      return;
    }

    gameState.isGameStarted = true;
    gameState.isActive = true;
    games.set(gameCode, gameState);

    io.to(gameCode).emit('gameStarted', {
      drawer: gameState.currentDrawer,
      timeLeft: gameState.timeLeft
    });

    startNewRound(gameCode);
  });

  socket.on('guess', (guess) => {
    const gameState = games.get(gameCode);
    if (!gameState?.roundActive || gameState.currentDrawer === address) return;

    // Emit the guess to all players for chat
    io.to(gameCode).emit('chatMessage', {
      player: address,
      text: guess,
      type: 'guess'
    });

    if (guess.toLowerCase() === gameState.currentWord.toLowerCase()) {
      if (!gameState.correctGuessers.includes(address)) {
        const points = Math.ceil((gameState.timeLeft / 90) * 100);
        gameState.points[address] = (gameState.points[address] || 0) + points;
        gameState.correctGuessers.push(address);
        
        io.to(gameCode).emit('correctGuess', {
          player: address,
          points: gameState.points[address]
        });

        // End round if all players have guessed correctly
        if (gameState.correctGuessers.length >= gameState.players.length - 1) {
          endRound(gameCode);
        }
      }
    } else {
      socket.emit('wrongGuess', { guess });
    }
  });

  socket.on('draw', (drawData) => {
    const gameState = games.get(gameCode);
    if (!gameState?.roundActive || gameState.currentDrawer !== address) return;
    socket.to(gameCode).emit('drawUpdate', drawData);
  });

  socket.on('disconnect', () => {
    const gameState = games.get(gameCode);
    if (!gameState) return;

    gameState.players = gameState.players.filter(p => p.address !== address);
    
    if (gameState.players.length === 0) {
      games.delete(gameCode);
      drawings.delete(gameCode);
      if (timers.has(gameCode)) {
        clearInterval(timers.get(gameCode));
        timers.delete(gameCode);
      }
    } else {
      if (gameState.currentDrawer === address) {
        gameState.currentDrawer = gameState.players[0].address;
        if (gameState.roundActive) {
          endRound(gameCode);
        }
      }
      games.set(gameCode, gameState);
      io.to(gameCode).emit('gameState', gameState);
    }
  });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));