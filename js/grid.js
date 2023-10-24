import { Manipulator } from './helpers.js';

export default class extends Manipulator {
    constructor({ boxSize, gridCount, gridContainerSelector, gridCellCssClass }) {
        // Викликаємо конструктор батьківського класу (Manipulator)
        super();

        // Ініціалізуємо властивості класу на основі переданих параметрів
        this.boxSize = boxSize;
        this.gridCount = gridCount;
        this.gridContainer = this.find(gridContainerSelector);
        this.gridCellCssClass = gridCellCssClass;

        // Викликаємо метод build для створення сітки
        this.#build();
    }

    // Метод для створення сітки
    #build() {
        // Встановлюємо розмір контейнера сітки на основі розмірів комірок
        this.gridContainer.style.width = this.gridContainer.style.height = (this.boxSize * this.gridCount) + 'px';

        // Створюємо ряди та додаємо їх до контейнера
        for (let index = 0; index < this.gridCount; index++) {
            this.gridContainer.append(this.#createRow(index));
        }
    }

    // Метод для створення ряду
    #createRow(row) {
        let fragment = new DocumentFragment();
        // Додаємо комірки до ряду та об'єднуємо їх в DocumentFragment для оптимізації
        for (let index = 0; index < this.gridCount; index++) {
            fragment.append(this.#createCell(row, index));
        }

        return fragment;
    }

    // Метод для створення комірки
    #createCell(row, cell) {
        const div = document.createElement('div');
        // Додаємо CSS-клас комірки, а також атрибути для визначення її позиції
        div.classList.add(this.gridCellCssClass);
        div.setAttribute('data-cell', cell);
        div.setAttribute('data-row', row);
        // Встановлюємо розмір комірки на основі переданого розміру
        div.style.width = div.style.height = this.boxSize + 'px';

        return div;
    }
}
