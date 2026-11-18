# ChessLink

A static peer-to-peer chess website designed for GitHub Pages.

## Features
- PeerJS/WebRTC room codes for online matches (room creator is White, guest is Black).
- Chess.js legal move validation.
- Castling on either side, en passant, and all four promotion choices (queen, rook, bishop, knight).
- Check, checkmate, stalemate, repetition, insufficient-material and draw detection.
- Responsive board, move list, board flip, and local two-player mode.

## Publish with GitHub Pages
1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select **main** and **/(root)**, then Save.
4. Wait for the Pages deployment. The site URL will be `https://w3356jchooks-cloud.github.io/chesslink/`.

The site is static: GitHub Pages serves the files. PeerJS's public signaling service helps browsers discover each other; chess moves then use a WebRTC data connection. Some restrictive networks may require a TURN relay, so a direct peer connection is not guaranteed on every network.

## Dependencies
- [chess.js](https://github.com/jhlywa/chess.js) via esm.sh
- [PeerJS](https://peerjs.com/) via esm.sh
