//index.js
const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

//Number of cells
const cellsHorizontal = 10;
const cellsVertical = 6;
//Height and width of canvas
const width = window.innerWidth;
const height = window.innerHeight;

//Length of one cell
const unitLengthX = width / cellsHorizontal;
const unitLengthY = height / cellsVertical;

//Boailer Plate Code
const engine = Engine.create();
//turns off gravity
engine.world.gravity.y = 0;
//get access to a world created by the engine
const { world } = engine;
//this object will show content on our screen
const render = Render.create({
  //we tell render where we want to show everything
  element: document.body,
  //specify what engine to use
  engine: engine,
  //options object specify our height and width of canvas elemnt
  options: {
    wireframes: false,
    width: width,
    height: height,
  },
});

//tell our render object to draw all updates of our world to screen
Render.run(render);
//coordinate all changes of our engine
Runner.run(Runner.create(), engine);

//Walls
const walls = [
  Bodies.rectangle(width / 2, 0, width, 2, { isStatic: true }),
  Bodies.rectangle(width / 2, height, width, 2, { isStatic: true }),
  Bodies.rectangle(0, height / 2, 2, height, { isStatic: true }),
  Bodies.rectangle(width, height / 2, 2, height, { isStatic: true }),
];

//adds all all rectangles from walls array
World.add(world, walls);

//Shuffle cell neighbor so our maze always looks different
const shuffle = (arr) => {
  let counter = arr.length;

  while (counter > 0) {
    const index = Math.floor(Math.random() * counter);

    counter--;

    //switches element at arr[counter] with element at arr[index](random)
    const temp = arr[counter];
    arr[counter] = arr[index];
    arr[index] = temp;
  }
  return arr;
};

// grid
//creates an array of false cells
const grid = Array(cellsVertical)
  .fill(null)
  .map(() => Array(cellsHorizontal).fill(false));

//verticals array (walls)
const verticals = Array(cellsVertical)
  .fill(null)
  .map(() => Array(cellsHorizontal - 1).fill(false));

//horizontals array (walls)
const horizontals = Array(cellsVertical - 1)
  .fill(null)
  .map(() => Array(cellsHorizontal).fill(false));

//Random x,y coordinates for starting cell
const startRow = Math.floor(Math.random() * cellsVertical);
const startColumn = Math.floor(Math.random() * cellsHorizontal);

//function to go through all cells and make the maze
const stepThroughCell = (row, column) => {
  //if i have visited cell at [row, column], then return
  if (grid[row][column]) {
    return;
  }
  //mark this cell as being visited
  grid[row][column] = true;

  //list of neighbors around cell
  const neighbors = shuffle([
    [row - 1, column, "up"],
    [row, column + 1, "right"],
    [row + 1, column, "down"],
    [row, column - 1, "left"],
  ]);
  //For each neighbor...
  for (let neighbor of neighbors) {
    const [nextRow, nextColumn, direction] = neighbor;

    // Check if that neighbor is out of bounce of the grid
    if (
      nextRow < 0 ||
      nextRow >= cellsVertical ||
      nextColumn < 0 ||
      nextColumn >= cellsHorizontal
    ) {
      //if true continue to next neighbor
      continue;
    }
    // check if we have visited that neighbor, continue to next neighbor
    if (grid[nextRow][nextColumn]) {
      //if true iterate to next neighbor
      continue;
    }
    //remove wall from horizontal array or vertical array
    if (direction === "left") {
      verticals[row][column - 1] = true;
    } else if (direction === "right") {
      verticals[row][column] = true;
    } else if (direction === "up") {
      horizontals[row - 1][column] = true;
    } else if (direction === "down") {
      horizontals[row][column] = true;
    }
    //visit next cell
    stepThroughCell(nextRow, nextColumn);
  }
};

stepThroughCell(startRow, startColumn);

//make all horizontal walls
horizontals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) {
      return;
    }

    const wall = Bodies.rectangle(
      columnIndex * unitLengthX + unitLengthX / 2,
      rowIndex * unitLengthY + unitLengthY,
      unitLengthX,
      5,
      { label: "wall", isStatic: true, render: { fillStyle: "red" } }
    );
    World.add(world, wall);
  });
});

//make all the vertical walls
verticals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) {
      return;
    }

    const wall = Bodies.rectangle(
      columnIndex * unitLengthX + unitLengthX,
      rowIndex * unitLengthY + unitLengthY / 2,
      5,
      unitLengthY,
      { label: "wall", isStatic: true, render: { fillStyle: "red" } }
    );
    World.add(world, wall);
  });
});

//Goal
const goal = Bodies.rectangle(
  //goal located at bottom right
  width - unitLengthX / 2,
  height - unitLengthY / 2,
  //half the size of a cell
  unitLengthY * 0.7,
  unitLengthY * 0.7,
  { label: "goal", isStatic: true, render: { fillStyle: "green" } }
);
World.add(world, goal);

//Ball
const ballRadius = Math.min(unitLengthX, unitLengthY) / 4;
const ball = Bodies.circle(unitLengthX / 2, unitLengthY / 2, ballRadius, {
  label: "ball",
  render: { fillStyle: "blue" },
});
World.add(world, ball);

//Event listeners for key buttons
document.addEventListener("keydown", (event) => {
  const { x, y } = ball.velocity;
  if (event.keyCode === 87 || event.keyCode === 38) {
    Body.setVelocity(ball, { x, y: y - 5 });
  }
  if (event.keyCode === 68 || event.keyCode === 39) {
    Body.setVelocity(ball, { x: x + 5, y });
  }
  if (event.keyCode === 83 || event.keyCode === 40) {
    Body.setVelocity(ball, { x, y: y + 5 });
  }
  if (event.keyCode === 65 || event.keyCode === 37) {
    Body.setVelocity(ball, { x: x - 5, y });
  }
});

//Win Condition
Events.on(engine, "collisionStart", (event) => {
  event.pairs.forEach((collision) => {
    const labels = ["ball", "goal"];
    //keeps track of ball and goal only and check if they collide
    if (
      labels.includes(collision.bodyA.label) &&
      labels.includes(collision.bodyB.label)
    ) {
      document.querySelector(".winner").classList.remove("hidden");
      //turn gravity back on after winning
      world.gravity.y = 1;
      world.bodies.forEach((body) => {
        if (body.label === "wall") {
          Body.setStatic(body, false);
        }
      });
    }
  });
});

document.querySelector(".playAgain").addEventListener("click", () => {
  window.location.reload();
});
