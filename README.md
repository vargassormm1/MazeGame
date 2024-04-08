# Maze Game Documentation

## Overview

This documentation covers the structure and functionality of a simple web-based maze game developed using HTML, CSS, and JavaScript. The game utilizes the Matter.js library for physics simulations, creating an interactive maze that the player can navigate with a ball. The objective of the game is to move the ball through the maze to reach a designated goal area.

## Files

The project consists of two main files:

- `index.html`: Contains the structure and styling of the game, including the game's canvas and UI elements for winning the game.
- `index.js`: The JavaScript file that implements the game's logic, physics, and interactivity using the Matter.js library.

## Game Features

- **Physics-based Maze**: The maze is generated with walls that the ball cannot pass through, and the game physics are handled by Matter.js.
- **Dynamic Maze Generation**: The maze layout is randomly generated on each game start, ensuring a unique experience every time.
- **Interactive Controls**: Players control the ball using the arrow keys or W, A, S, D keys on the keyboard.
- **Win Condition**: The game detects when the ball reaches the goal area, displaying a winning message and a "Play Again" button.

## How to Play

1. Open `index.html` in a web browser to start the game.
2. Use the arrow keys (↑, ↓, ←, →) or W, A, S, D keys to move the ball.
3. Navigate the ball through the maze to reach the green goal area.
4. Once the goal is reached, a message will appear, and you can click "Play Again" to restart the game.

## Development

### HTML Structure

- The HTML file includes basic setup with a `doctype`, `head`, and `body` tags.
- The `head` section references the Matter.js library and includes styles for the game.
- The `body` contains a `div` element for displaying the winning message and the "Play Again" button.

### CSS Styling

- Styling is defined within the `<style>` tag in the `head` section of `index.html`.
- It includes basic styles for the body, hidden elements, and the winning message UI.

### JavaScript (index.js)

- Initializes the Matter.js engine and world, setting gravity to zero for the maze environment.
- Generates a randomly configured maze with variable numbers of horizontal and vertical cells.
- Creates walls, a goal, and a controllable ball within the maze.
- Implements event listeners for keyboard inputs to control the ball's movement.
- Detects collision between the ball and the goal to trigger the win condition.

## Requirements

- A modern web browser with JavaScript enabled.
- No additional installations are required, as the Matter.js library is loaded from a CDN.

## Conclusion

This maze game is a simple yet engaging project demonstrating the use of HTML, CSS, and JavaScript to create an interactive browser game. It showcases basic game development concepts such as event handling, collision detection, and the use of physics for game mechanics.
