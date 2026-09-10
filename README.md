# Puzzle Game

A browser-based **sliding tile puzzle game** inspired by a physical board game. Strategically move the colored tiles to recreate a target 3×3 pattern as quickly as possible.

## Play Online

**[Launch Puzzle Game](https://alinaaaw.github.io/puzzex/)**

No installation or account is required. The game supports keyboard controls and on-screen buttons.

## Features

- Randomized boards and target patterns for a new challenge each round
- Single-player time trials with a best-time record saved across browser sessions
- Local two-player races on one device
- Pause, replay, and show/hide timer controls
- Responsive layouts and on-screen controls for different screen sizes
- No dependencies, build tools, or backend services

## How to Play

### Objective

Rearrange the tiles so that the **center 3×3 area** of the 5×5 puzzle board matches the **target pattern** displayed beside it. Only one tile can move at a time, and it must slide into the empty space. Solving the puzzle quickly requires **strategy**, **foresight**, and **careful observation**.

When the center pattern matches the target, press **Enter** (or the on-screen **ENTER** button) to submit your solution.

### Controls

In single-player mode, use the arrow keys or the on-screen directional buttons.

| Input | Action |
| --- | --- |
| `↑` / `↓` / `←` / `→` | Slide a tile into the empty space in the selected direction |
| `Enter` | Submit the current center pattern |
| On-screen buttons | Move tiles or submit on touch-enabled devices |

> [!NOTE]
> The controls describe the direction in which the **tile moves**, not the direction in which the empty space moves. For example, pressing **Right** slides the tile immediately to the left of the empty space into the blank position.

> [!TIP]
> Think of the colored tiles as pieces on a **5×5 board**. Only a tile next to the empty space can move. To move the tile on the empty space's left to the right, press the **Right Arrow** key.

#### Two-player controls

| Player | Move | Submit |
| --- | --- | --- |
| Player 1 | `W` / `A` / `S` / `D` | `Enter` or Player 1's on-screen **ENTER** button |
| Player 2 | Arrow keys | `Enter` or Player 2's on-screen **ENTER** button |

### Game Modes

#### Single Player

- Solve the puzzle on your own.
- Try to beat your fastest completion time during the current page session.
- Replay randomized rounds to refine your strategy and improve your speed.

#### Two Player

- Compete locally on the same device using separate controls.
- Player 1 uses `W` / `A` / `S` / `D`; Player 2 uses the arrow keys.
- When a player finishes, press **Enter** to check both boards. The first completed pattern wins the race.

### Tips for Success

- Start with **corner and edge** tiles, as they are easier to lock in place first.
- Use **systematic patterns** instead of moving tiles at random.
- Work in sections by focusing on one row or column at a time.
- Be **patient**—most new players need several attempts to become comfortable with the movement mechanics.

## Run Locally

This is a static web project, so there are no packages to install or build steps to run.

1. Clone the repository:

   ```bash
   git clone https://github.com/alinaaaw/puzzex.git
   cd puzzex
   ```

2. Start a local web server. For example, with Python 3:

   ```bash
   python -m http.server 8000
   ```

3. Open <http://localhost:8000> in a modern browser.

You can also open `index.html` directly, although a local server more closely matches the deployed environment.

## Project Structure

```text
puzzex/
├── assets/
│   ├── css/                  # Page-specific styles
│   │   ├── choose.css
│   │   ├── index.css
│   │   ├── one-ex.css
│   │   └── two-race.css
│   └── js/                   # Tutorial and game behavior
│       ├── index.js
│       ├── one-ex.js
│       └── two-race.js
├── choose.html               # Game-mode selection
├── index.html                # GitHub Pages entry and landing page
├── one-ex.html               # Single-player interface
├── two-race.html             # Two-player interface
└── README.md                 # Project documentation
```

The root keeps the public HTML entry points so existing GitHub Pages URLs remain stable. Static resources live under `assets/`, grouped by type. Each page currently owns its stylesheet and script, which keeps this dependency-free project easy to trace without introducing a build step.

## Notes on Development

Built with **HTML5**, responsive **CSS3**, and vanilla **JavaScript**. The project intentionally has no runtime dependencies or compilation step, making it easy to host on any static site service. The live version is deployed with GitHub Pages.

## License

No license file is currently included in this repository. Unless a license is added, the repository's source code remains under the copyright holder's default rights.
