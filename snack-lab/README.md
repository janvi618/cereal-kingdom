# Snack Lab: invent a snack in 60 seconds

A quick booth game. A player gets a consumer brief, picks a flavor, a format and a package look, names the snack and launches it before the clock runs out. A taste tester scores how well it fits the brief, and the top scores go on a leaderboard.

- **Play (phone or tablet):** `https://janvi618.github.io/cereal-kingdom/snack-lab/`
- **Big screen (the snack shelf):** `https://janvi618.github.io/cereal-kingdom/snack-lab/board.html`
- `qr.svg` is a QR code for the play address.

## Running the booth

1. Open the big-screen page on the display, click **Full screen**, and click **Sound on** if you want a chime for each new snack. Check that the label at the bottom right says **Live**.
2. People scan the QR code and play on their own phones. Each round takes about a minute. Every snack lands on the shelf and the top 10 show on the leaderboard.
3. To clear the board before you start, click **Clear board** twice on the big screen. To take one entry off, click its row and then **Remove**.

A booth tablet works too. Add `?kiosk` to the play address and the game returns to the start screen a minute after each round. Add `?staff` to show a **Clear board** button on the start screen.

## What players get

- A brief card with a taste tester, then a 60-second round with a live package preview.
- **Ask the taste tester**: one hint per round that says which picks fit and which don't.
- A reveal at the end: the tester tastes the snack, stars pop in, the four scores count up, then the rank.
- **Save my snack**: a picture of the package to keep or share.
- Sound and haptics, with a mute button.

## Scoring

- Brief fit: 100 points for each tag on the chosen flavor, format and look that matches the brief.
- Name: 100 for a name the player typed (or a suggestion they edited), 40 for an unedited suggestion, 0 for none.
- Speed bonus: 5 points for each second left on the clock.
- Buzz: a random 0 to 50.
- Stars compare brief fit with the best fit available from that round's options.

## How scores are shared

Scores always save on the device. They are also shared between phones and the big screen over the same live relay Cereal Kingdom uses (three public MQTT brokers) and through ntfy.sh, so a screen opened later can catch up. Scores on ntfy.sh last about 12 hours.

Address options: `?room=name` runs a separate board (the QR code points at the main one), `?local` keeps scores on one device with no network, `?tools=0` hides the line about our tools on the results screen, and `?prize=Text` changes the prize line on the big screen.

Files: `index.html` (the game), `board.html` (the big screen), `core.js` (data, scoring, drawing and the shared leaderboard), `fonts.css`, `qr.svg`.
