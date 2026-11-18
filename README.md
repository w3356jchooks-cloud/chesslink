# ChessLink

A lightweight, static peer-to-peer chess website for GitHub Pages. No Firebase, Supabase, or hosted database is used.

## Architecture

- **GitHub Pages** serves the website and the small public JSON data files.
- **This GitHub repository** stores approved player profiles and completed match records in `data/players.json` and `data/matches.json`.
- **GitHub Actions** validates match records, calculates Elo ratings, and rebuilds `data/leaderboard.json`.
- **PeerJS/WebRTC** handles live room discovery and direct game traffic: moves, chat, draw offers, and resignations.
- **Browser local storage** keeps the current device's display name, cached leaderboard, and unsubmitted match exports.

## Important write-access limitation

GitHub Pages is static hosting, and GitHub Actions is not an anonymous public API. A browser visitor cannot safely write to this repository or trigger a workflow without GitHub authentication. **Never put a personal access token or Actions secret in the website's JavaScript.**

For this version, each player profile and finished online match can be exported from the website. To publish records to the shared leaderboard, an authorized maintainer reviews and adds the exported records to `data/players.json` and `data/matches.json` (or accepts a contribution/PR). A push to either data file automatically runs the leaderboard workflow. This avoids exposing repository credentials, but it is not automatic public account registration or instant rating updates.

## Data formats

`data/players.json`:
```json
{ "version": 1, "players": [{ "id": "p-example", "name": "Player" }] }
```

`data/matches.json`:
```json
{
  "version": 1,
  "matches": [{
    "id": "m-example",
    "whiteId": "p-white",
    "blackId": "p-black",
    "result": "1-0",
    "completedAt": "2026-11-18T12:00:00.000Z",
    "pgn": "optional PGN"
  }]
}
```

Allowed results are `1-0`, `0-1`, and `1/2-1/2`. The leaderboard script ignores duplicate match IDs, unknown players, and invalid results. It starts registered players at 1200 Elo and applies K=24 in match order.

## Publish with GitHub Pages

1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select **main** and **/(root)**, then Save.
4. The expected site URL is `https://w3356jchooks-cloud.github.io/chesslink/`.

## Current gameplay features

- PeerJS/WebRTC room codes (room creator is White, guest is Black).
- Chess.js legal move validation, including castling, en passant, and all four promotions.
- Checkmate, stalemate, repetition, insufficient material and draw detection.
- Three-minute clocks, draw offers, resign, move review, chat, board flip, zoom and fullscreen.
- Local profile, public leaderboard reader, and export of completed online match records.

PeerJS's public signaling service helps browsers discover each other; the game data then uses a WebRTC connection. Some restrictive networks may require TURN relay support, so direct peer connectivity is not guaranteed on every network. The site and JSON data are intentionally small to reduce downloads on slow connections.

## Dependencies

- [chess.js](https://github.com/jhlywa/chess.js) via esm.sh
- [PeerJS](https://peerjs.com/) via esm.sh
