# Cereal Kingdom

A 1-minute 3D score attack for the *Lessons from the Frontier* session, made with AI. Players scan a QR code, type a name and play on their phones (touch), a laptop (keyboard) or with a game controller. A live leaderboard on the big screen shows the top 10.

- **Play:** https://janvi618.github.io/cereal-kingdom/
- **Big-screen leaderboard (with the QR code):** https://janvi618.github.io/cereal-kingdom/board.html
- **QR code image:** `qr-code.png` in this repository

## How a run works

A 3-2-1 countdown, then 1 minute. Soggies keep coming to you, and your spoon swings by itself when they're close. A Golden Ring appears near you every few seconds, and the Great Sog arrives at the halfway mark.

| | Points |
|---|---|
| Soggy | 10 (Sog Knight 30) |
| Combo | Pop soggies quickly in a row for ×2, ×3 and ×4 |
| Crunch bit | 5 |
| Golden Ring (follow the gold arrows and walk into it) | 150 each, a new one every few seconds until the Great Sog arrives |
| The Great Sog (arrives with 30 seconds left) | 400 |

If you get soggy you're back in 2 seconds where you fell. Each phone's best run counts on the leaderboard.

Gold arrows on the ground and a golden beam lead each player to the next Golden Ring (and to the Great Sog when he appears). On iPhone, music plays even when the ring/silent switch is on; players can turn it off on the start screen.

## Controls

| | Phone | Laptop | Controller |
|---|---|---|---|
| Move | Arrow pad, bottom left (slide between arrows for diagonals) | WASD or arrows | Left stick |
| Attack (automatic when a soggy is close; every third hit spins) | Automatic | Automatic, or J / Space / click | Automatic, or A |
| Dash | Not on phones (kept simple) | K or Shift | B |
| Crunch Burst (when it glows) | Burst button | L or Q | X |
| Pause | Pause button | P or Esc | Start |

## Running the leaderboard

Open `board.html` on the presenting laptop and make it full screen. It updates every few seconds.

- **New round** (bottom right, click twice) clears the board, for example after a test run.
- **Add a score by hand**: if a phone can't connect, its results screen shows the name, score and a 5-character code. Type those in and the board checks the code.

Scores travel through **ntfy.sh**, a free public message relay, on a topic only this game uses. Nothing is stored for more than 12 hours, and only the name and score are sent, so ask people to use a first name or nickname. To run a separate leaderboard, add `?board=any-new-name` to both the game link and the board link.

## Files

`index.html`, `game.js`, `terrain.js`, `audio.js` (the game), `board.html` (the leaderboard), `qr-code.png`, and `vendor/three.module.min.js` (Three.js r169, MIT License). Adding `?debug` to the game address shows a frame counter and a `K` object in the browser console for testing.

## Credits

All characters, places and story are original. Fonts: Fraunces and DM Sans (SIL Open Font License 1.1). 3D engine: Three.js (MIT License). Score relay: ntfy.sh.

## Running the room (big screen)

1. Open `board.html` on the big screen and click **Full screen**. Click anywhere once so its sounds can play.
2. People scan the QR code, pick a knight (Frosted, Cocoa or Berry), type a name and press **Play**. Each phone says "You're in" and its name pops onto the big screen under **players ready**.
3. When most phones are in, click **Start the game for everyone**. The big screen and every phone count down 3-2-1 together, everyone gets the same 1 minute, and the Great Sog arrives for everyone at the same moment.
4. During the run the big screen shows a live top 10, a **NEW #1** banner with a fanfare when the lead changes, a feed of rings, power-ups and boss pops, and the room's total soggies popped. Final results appear about 1 minute 5 seconds after the start.
5. To play again: click **Open the lobby for another game**, have people tap **Play again**, then **Start** again. Best runs still count. **New round** clears the board.

Phones that open the game when no big screen is waiting start on their own after a few seconds, and anyone can tap **Start on my own** in the lobby.

**Network note.** The live features (lobby, shared start, live scores, feed) travel over two free public MQTT brokers on secure WebSockets (`broker.emqx.io:8084` and `broker.hivemq.com:8884`), so either can drop out. Final scores are also saved to ntfy.sh. If a network blocks the brokers' ports, phones fall back to ntfy for the start signal and scores, and the big screen shows "Live (scores only)". Test on the venue Wi-Fi beforehand.

## What's new in the game

- **Power-ups** (run over them): Sugar Rush (super speed with a rainbow trail), Giant Spoon (huge, double-power swings), Milk Magnet (coins fly to you). A Giant Spoon drops when the Great Sog arrives.
- **Boss entrance**: the clock stops, the camera swings round in slow motion and a title card slams in.
- **Polish**: confetti and slow motion on rings, crunchier pops, a big 10-second countdown at the end, bigger score pops.

## Round 1 live poll

- `poll.html` — phones vote on the Round 1 question (one vote per phone; changing it keeps the latest).
- `votes.html` — the big-screen view: live bars for each answer. **New poll** (click twice) clears test votes before the session.

Both use the same ntfy.sh relay as the leaderboard, on their own topic.
