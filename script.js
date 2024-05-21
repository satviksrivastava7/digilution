const canvas = document.getElementById("life");
const m = canvas.getContext("2d");

const resizeCanvas = () => {
  if (window.innerWidth < 720) {
    canvas.width = window.innerWidth * 2.5;
    canvas.height = window.innerHeight; 
  } else {
    canvas.width = window.innerWidth * 0.75;
    canvas.height = window.innerHeight;
  }
};

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const draw = (x, y, c, s) => {
  m.fillStyle = c;
  m.fillRect(x, y, s, s);
};

let particles = [];

const particle = (x, y, c, movable = true) => {
  return {
    x: x,
    y: y,
    vx: 0,
    vy: 0,
    color: c,
    movable: movable,
  };
};

const random = (max) => {
  return Math.random() * (max - 100) + 50;
};

const create = (number, color) => {
  const group = [];
  for (let i = 0; i < number; i++) {
    group.push(particle(random(canvas.width), random(canvas.height), color));
    particles.push(group[i]);
  }
  return group;
};

const removeParticles = (color) => {
  particles = particles.filter((p) => p.color !== color);
};

const rule = (particles1, particles2, g) => {
  const speedFactor = parseFloat(document.getElementById("speedFactor").value);
  for (let i = 0; i < particles1.length; i++) {
    let fx = 0;
    let fy = 0;

    if (!particles1[i].movable) continue;

    for (let j = 0; j < particles2.length; j++) {
      const a = particles1[i];
      const b = particles2[j];

      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const d = Math.sqrt(dx * dx + dy * dy);

      if (d > 0 && d < 80) {
        const F = (g * 1) / d;
        fx += F * dx;
        fy += F * dy;
      }
    }

    const a = particles1[i];
    a.vx = (a.vx + fx) * speedFactor;
    a.vy = (a.vy + fy) * speedFactor;
    a.x += a.vx;
    a.y += a.vy;

    if (a.x <= 0 || a.x >= canvas.width) {
      a.vx *= -1;
    }

    if (a.y <= 0 || a.y >= canvas.height) {
      a.vy *= -1;
    }
  }
};

let red, green, blue, yellow, orange, purple, pink;

const initParticles = () => {
  particles = [];
  red = create(
    parseInt(document.getElementById("numRed").value),
    document.getElementById("colorRed").value
  );
  green = create(
    parseInt(document.getElementById("numGreen").value),
    document.getElementById("colorGreen").value
  );
  blue = create(
    parseInt(document.getElementById("numBlue").value),
    document.getElementById("colorBlue").value
  );
  yellow = create(
    parseInt(document.getElementById("numYellow").value),
    document.getElementById("colorYellow").value
  );
  orange = create(
    parseInt(document.getElementById("numOrange").value),
    document.getElementById("colorOrange").value
  );
  purple = create(
    parseInt(document.getElementById("numPurple").value),
    document.getElementById("colorPurple").value
  );
  pink = create(
    parseInt(document.getElementById("numPink").value),
    document.getElementById("colorPink").value
  );
};

const update = () => {
  const particleSize = parseInt(document.getElementById("particleSize").value);
  rule(green, green, -0.32);
  rule(green, red, -17);
  rule(green, blue, -20);
  rule(red, red, 50);
  rule(red, green, -0.34);
  rule(blue, blue, 0.15);
  rule(yellow, yellow, 12);
  rule(orange, orange, -10);
  rule(purple, purple, 8);
  rule(pink, pink, -5);

  m.clearRect(0, 0, canvas.width, canvas.height);
  draw(0, 0, "#0e0e0e", canvas.width);

  for (let i = 0; i < particles.length; i++) {
    draw(particles[i].x, particles[i].y, particles[i].color, particleSize);
  }
  requestAnimationFrame(update);
};

document.getElementById("applySettings").addEventListener("click", () => {
  removeParticles(document.getElementById("colorRed").value);
  removeParticles(document.getElementById("colorGreen").value);
  removeParticles(document.getElementById("colorBlue").value);
  removeParticles(document.getElementById("colorYellow").value);
  removeParticles(document.getElementById("colorOrange").value);
  removeParticles(document.getElementById("colorPurple").value);
  removeParticles(document.getElementById("colorPink").value);
  initParticles();
  if (window.innerWidth < 720) {
    document.getElementById("controls").style.display = "none";
  }
});

const ruleContainer = document.getElementById("rules");
const addRuleButton = document.getElementById("addRule");

const addRule = (type1 = "green", type2 = "green", g = -0.32) => {
  const ruleDiv = document.createElement("div");
  ruleDiv.classList.add("rule");

  const type1Select = document.createElement("select");
  type1Select.innerHTML = `
    <option value="red">Red</option>
    <option value="green">Green</option>
    <option value="blue">Blue</option>
    <option value="yellow">Yellow</option>
    <option value="orange">Orange</option>
    <option value="purple">Purple</option>
    <option value="pink">Pink</option>`;
  type1Select.value = type1;
  ruleDiv.appendChild(type1Select);

  const type2Select = document.createElement("select");
  type2Select.innerHTML = `
    <option value="red">Red</option>
    <option value="green">Green</option>
    <option value="blue">Blue</option>
    <option value="yellow">Yellow</option>
    <option value="orange">Orange</option>
    <option value="purple">Purple</option>
    <option value="pink">Pink</option>`;
  type2Select.value = type2;
  ruleDiv.appendChild(type2Select);

  const gInput = document.createElement("input");
  gInput.type = "number";
  gInput.value = g;
  ruleDiv.appendChild(gInput);

  const removeButton = document.createElement("button");
  removeButton.textContent = "Remove";
  removeButton.addEventListener("click", () => {
    ruleContainer.removeChild(ruleDiv);
  });
  ruleDiv.appendChild(removeButton);

  ruleContainer.appendChild(ruleDiv);
};

addRuleButton.addEventListener("click", () => {
  addRule();
});

const initRules = () => {
  addRule("green", "green", -0.32);
  addRule("green", "red", -17);
  addRule("green", "blue", -20);
  addRule("red", "red", 50);
  addRule("red", "green", -0.34);
  addRule("blue", "blue", 0.15);
  addRule("yellow", "yellow", 12);
  addRule("orange", "orange", -10);
  addRule("purple", "purple", 8);
  addRule("pink", "pink", -5);
};

const initControls = () => {
  document.getElementById("numRed").value = red.length;
  document.getElementById("numGreen").value = green.length;
  document.getElementById("numBlue").value = blue.length;
  document.getElementById("numYellow").value = yellow.length;
  document.getElementById("numOrange").value = orange.length;
  document.getElementById("numPurple").value = purple.length;
  document.getElementById("numPink").value = pink.length;
};

initParticles();
initControls();
initRules();
update();

const toggleMovable = (color) => {
  const index = particles.findIndex((p) => p.color === color);
  if (index !== -1) {
    particles[index].movable = !particles[index].movable;
  }
};

document.getElementById("toggleGreen").addEventListener("click", () => {
  toggleMovable("green");
});

document.getElementById("toggleRed").addEventListener("click", () => {
  toggleMovable("red");
});

document.getElementById("toggleBlue").addEventListener("click", () => {
  toggleMovable("blue");
});

document.getElementById("toggleYellow").addEventListener("click", () => {
  toggleMovable("yellow");
});

document.getElementById("toggleOrange").addEventListener("click", () => {
  toggleMovable("orange");
});

document.getElementById("togglePurple").addEventListener("click", () => {
  toggleMovable("purple");
});

document.getElementById("togglePink").addEventListener("click", () => {
  toggleMovable("pink");
});

document.getElementById("particleSpeed").addEventListener("input", () => {
  const speed = parseFloat(document.getElementById("particleSpeed").value);
  document.getElementById("speedValue").textContent = speed.toFixed(2);
});

document.getElementById("particleSize").addEventListener("input", () => {
  const size = parseInt(document.getElementById("particleSize").value);
  document.getElementById("sizeValue").textContent = size;
});

const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-menu");

hamburger.addEventListener("click", () => {
  navMenu.classList.toggle("open");
  if (navMenu.classList.contains("open")) {
    navMenu.style.display = "block";
  } else {
    navMenu.style.display = "none";
  }
});

document.querySelectorAll("#nav-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    navMenu.style.display = "none";
  });
});

if (window.innerWidth < 720) {
  navMenu.style.display = "none";
}
