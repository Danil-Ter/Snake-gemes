import Grid from "./grid.js";
import { DIRECTIONS as DR } from "./helpers.js";

class Snake extends Grid {
  static snakeCellCssClass = "snake-cell";
  static snakeCssClass = "snake";
  static snakeHeadCssClass = "snake-head";
  static snakeBodyCssClass = "snake-body";
  static gridContainerCssSelector = "#snake-container";

  #snake = [];
  #process = null;
  #score = 0;
  #speed = 0;
  #food = null;
  #controls = this.find("#snake-controls-form");
  #startBtn = this.find("#snake-start-game");
  #endBtn = this.find("#snake-end-game");
  #messageContainer = this.find("#snake-message");
  #scoreContainer = this.find("#snake-score");

  constructor({ boxSize, gridCount }) {
    super({
      boxSize,
      gridCount,
      gridCellCssClass: Snake.snakeCellCssClass,
      gridContainerSelector: Snake.gridContainerCssSelector,
    });
    this.direction = DR.LEFT;

    this.#init();
  }

  #init() {
    // Додаємо обробник подій для відстеження натискання клавіш
    document.addEventListener("keydown", (event) =>
      this.#updateDirection(event)
    );

    // Додаємо обробники подій для кнопок "Start" і "End"
    this.#startBtn.addEventListener("click", (event) => this.#start(event));
    this.#endBtn.addEventListener("click", (event) => this.#end(event));
  }

  #generateFood() {
    // Генеруємо випадкові координати для їжі
    let randomRow = Math.floor(Math.random() * this.gridCount);
    let randomCell = Math.floor(Math.random() * this.gridCount);

    // Перевіряємо, чи не збігаються координати їжі із координатами змійки
    while (
      this.#snake.some(
        (snakeData) =>
          snakeData.cell === randomCell && snakeData.row === randomRow
      )
    ) {
      randomRow = Math.floor(Math.random() * this.gridCount);
      randomCell = Math.floor(Math.random() * this.gridCount);
    }

    // Зберігаємо координати їжі та відображаємо її на полі
    this.#food = { row: randomRow, cell: randomCell };
    let foodCell = this.#findByCoords(this.#food);
    foodCell.innerHTML = '<img src="img/apple.png" alt="food">';
    console.log(foodCell);
  }

  #start() {
    // Ініціалізуємо гру
    this.#snake = this.#buildSnake(0, 0);
    this.direction = DR.RIGHT;

    // Генеруємо першу їжу та встановлюємо швидкість гри
    this.#generateFood();
    this.#speed = +this.#controls.speed.value;
    this.#messageContainer.innerHTML = "Welcome to Snake !";

    // Приховуємо кнопку "Start" і показуємо кнопку "End"
    document.querySelector("#snake-start-game").style.display = "none";
    document.querySelector("#snake-end-game").style.display = "inline-block";

    // Встановлюємо інтервал для переміщення змійки
    this.#process = setInterval(() => {
      let { cell, row } = this.#snake[0];

      switch (this.direction) {
        case DR.LEFT:
          {
            cell = cell === 0 ? this.gridCount - 1 : cell - 1;
            this.#snake.unshift({ cell, row });
          }
          break;

        case DR.RIGHT:
          {
            cell = cell === this.gridCount - 1 ? 0 : cell + 1;
            this.#snake.unshift({ cell, row });
          }
          break;

        case DR.UP:
          {
            row = row === 0 ? this.gridCount - 1 : row - 1;
            this.#snake.unshift({ cell, row });
          }
          break;

        case DR.DOWN:
          {
            row = row === this.gridCount - 1 ? 0 : row + 1;
            this.#snake.unshift({ cell, row });
          }
          break;
      }

      this.#clear();
      this.#update();
    }, this.#speed);
  }

  #clearFood() {
    // Очищаємо їжу з поля
    let foodCell = this.#findByCoords(this.#food);
    foodCell.innerHTML = "";
  }

  #checkHasFoodEaten() {
    // Перевіряємо, чи змійка з'їла їжу
    if (
      this.#snake[0].cell === this.#food.cell &&
      this.#snake[0].row === this.#food.row
    ) {
      this.#clearFood();
      this.#generateFood();
      this.#score += 1;
      document.querySelector("#snake-score b").innerHTML = this.#score;
    } else {
      this.#snake.pop();
    }
  }

  #checkOnTailCrash() {
    // Перевіряємо, чи змійка врізалася у власний хвіст
    for (let i = 1; i < this.#snake.length; i++) {
      if (
        this.#snake[0].cell === this.#snake[i].cell &&
        this.#snake[0].row === this.#snake[i].row
      ) {
        clearInterval(this.#process);
        this.#messageContainer.innerHTML =
          "Game Over. Your score is " + this.#score;
        document.querySelector("#snake-end-game").style.display = "inline-block";
        return;
      }
    }
  }

  #update() {
    // Оновлюємо стан гри
    this.#checkHasFoodEaten();
    this.#checkOnTailCrash();

    for (const [index, snakeData] of this.#snake.entries()) {
      let cellElement = this.#findByCoords(snakeData);
      console.log(cellElement);
      if (index === 0) {
        cellElement.classList.add(Snake.snakeHeadCssClass, Snake.snakeCssClass);
      } else {
        cellElement.classList.add(Snake.snakeBodyCssClass, Snake.snakeCssClass);
      }
    }
  }

  #clear() {
    // Очищаємо старий стан змійки на полі
    let cells = this.find(`.${Snake.snakeCssClass}`, this.gridContainer);

    cells.forEach((cell) => {
      cell.className = Snake.snakeCellCssClass;
      console.log("cell", cell.className);
    });
  }

  #updateDirection(event) {
    // Оновлюємо напрямок руху змійки в залежності від натисканої клавіші
    let key = event.key;
    console.log(event);

    if (key === "ArrowLeft" && this.direction != DR.RIGHT)
      this.direction = DR.LEFT;
    else if (key === "ArrowUp" && this.direction != DR.DOWN)
      this.direction = DR.UP;
    else if (key === "ArrowRight" && this.direction != DR.LEFT)
      this.direction = DR.RIGHT;
    else if (key === "ArrowDown" && this.direction != DR.UP)
      this.direction = DR.DOWN;
  }

  #end() {
    // Завершуємо гру і скидаємо стан
    clearInterval(this.#process);

    // Приховуємо кнопку "End" і показуємо кнопку "Start"
    document.querySelector("#snake-start-game").style.display = "inline-block";
    document.querySelector("#snake-end-game").style.display = "none";

    // Очищаємо поле і скидаємо рахунок та змійку
    this.#clear();
    this.#score = 0;
    document.querySelector("#snake-score b").innerHTML = this.#score;
    this.#snake = [];

    if (this.#food) {
      this.#clearFood();
      this.#food = null;
    }

    this.#messageContainer.innerHTML = "Welcome to Snake !";
  }

  #findByCoords({ cell, row }) {
    // Знаходимо елемент за заданими координатами
    return this.find(
      `[data-cell="${cell}"][data-row="${row}"]`,
      this.gridContainer
    );
  }

  #buildSnake(startCell, startRow, size = 5) {
    // Генеруємо змійку заданого розміру
    return new Array(size)
      .fill(null)
      .map((value, index) => ({ row: startRow, cell: startCell - index }));
  }
}

new Snake({
  boxSize: 30,
  gridCount: 25,
});
