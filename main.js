import { Engine, 
  Render, 
  Runner, 
  Bodies, 
  World, 
  Body, 
  Sleeping 
} from "matter-js";
import { FRUITS } from "./fruits";

const engine = Engine.create();
const render = Render.create({
  engine,
  element: document.body,
  options: {
    wireframes: false,
    background: "#F7F4C8",
    width: 620,
    height: 850,
  },
});

const world = engine.world

const ground = Bodies.rectangle(310, 820, 620, 60, {
  isStatic: true,
  render: {
    fillStyle: "#E6B143",
  }
});

const leftWall = Bodies.rectangle(15, 395, 30, 790, {
  isStatic: true,
  render: {
    fillStyle: "#E6B143",
  }
});

const rightWall = Bodies.rectangle(605, 395, 30, 790, {
  isStatic: true,
  render: {
    fillStyle: "#E6B143",
  }
});

// const box = Bodies.circle(100, 50, 50, {
//   restitution: 0.15,
// });

World.add(world, [ground, leftWall, rightWall]);

Render.run(render);
Runner.run(engine);

let currentBody = null;
let currentFruit = null;
let interval = null;
let disableAction = false;

function addCurrentFruit() {
  const randomFruit = getRandomFruit();
  const body = Bodies.circle(300, 50, randomFruit.radius, {
    label: randomFruit.label,
    isSleeping: true,
    render: {
      fillStyle: randomFruit.color,
    }
  });

  currentBody = body;
  currentFruit = randomFruit;

  World.add(world, body);
}

function getRandomFruit () {
  const randomIndex = Math.floor(Math.random() * 5);
  const fruit = FRUITS[randomIndex];

  if (currentFruit.label === fruit.label)
    return getRandomFruit()

  return fruit;
}

window.onkeydown = (event) => {
  console.log(event);
  switch (event.code) {
    case "ArrowLeft":
      if (interval) return;
      interval = setInterval(() => {
        if (currentBody.position.x - 20 > 30)
        Body.setPosition(currentBody, {
          x: currentBody.position.x - 1, 
          y: currentBody.position.y})
      }, 5);
      break;
    case "ArrowRight":
      if (interval) return;
      interval = setInterval(() => {
        if (currentBody.position.x + 20 < 590)
        Body.setPosition(currentBody, {
          x: currentBody.position.x + 1, 
          y: currentBody.position.y})
      }, 5);
      break;
    case "Space":
      if (disableAction) return;
      disableAction = true;
      Sleeping.set(currentBody, false);
      setTimeout(() => {
        addCurrentFruit();
        disableAction = false;
      }, 1000);
  }
};

window.onkeyup = (event) => {
  switch (event.code) {
    case "ArrowLeft":
    case "ArrowRight":
      clearInterval(interval);
      interval = null;
  }
};


addCurrentFruit();
