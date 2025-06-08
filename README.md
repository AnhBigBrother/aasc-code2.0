# AASC code-2.0

## Getting Started

**Prerequisites:**

- `Nodejs` version >= 20

- [Postgresql](https://www.postgresql.org/download/)  or [Docker](https://www.docker.com/get-started/) installed

**Clone the repository:**

  ```bash
  git clone https://github.com/AnhBigBrother/aasc-code2.0
  cd aasc-code2.0
  ```

## My work

#### Ex2:Fibonacci100

- For more clearly explanation, read the `index.ts` file

- To run code and view result, run:
  
  ``` bash
  cd fibonacci100

  node index.js
  # Or if you have ts-node installed:
  ts-node index.ts
  ```

#### Ex3. Board-games

**Set up:**

- If you have Docker installed, just run one command:

```bash
  # ../aasc-code2.0/board-games
  docker compose up
```

- If not, following this:
  1. Set up your Postgres database first
  2. Go to ./board-games/server/src/app.module.ts, uncomment the code block from line 20 to line 29 and edit with your corresponding database configurations
  3. Comment the code block from line 33 to line 42
  4. Run the command `npm run start:dev`

**Feature:**

- Go to <http://localhost:3000> to start exploring.

- To sign up/log in, click on the avatar on the navigation bar.

- To play the Line98/Caro game, click the link on the navigation bar.

- In the Caro game, you first need to enter the room name and click `Enter room` button. If the room has 2 players, the game will start.

**Note:**

- Due to time constraints, I have not been able to optimize the application's performance, and it may still have some bugs. If you encounter any problems, please reload the page.

- In the Line98 game, the "hint" feature does not work very well. It can figure out how to blow up a line(if it is possible), but figuring out the chance to form a line is terrible (It can figure out a change, but not the best one).

- In the game Line 98, I still can't do the feature "animation when moving the ball along the shortest path on the map", I have no skill in this part.

- And yes, still in the Line 98 game, because I couldn't find a clean algorithm for this game, so my code for this part is a bit messy.
