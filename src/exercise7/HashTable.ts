abstract class AbstractHashTable<Item> {
    // Постусловие: создана пустая таблица с заданным размером
    public constructor(_maxSize: number) {}

    // Команда
    // Предусловие: в таблице есть переданный элемент
    // Постусловие: переданный элемент удален из таблицы
    public abstract delete(item: Item): void;

    // Запрос
    public abstract getDeleteStatus(): number;

    // Статусы удаления
    public DELETE_NIL = 0 as const;
    public DELETE_OK = 1 as const;
    public DELETE_ERROR = 2 as const;

    // Команда
    // Предусловие: переданный элемент отсутствует в таблице
    // Предусловие: для переданного элемента есть свободный слот в таблице
    // Постусловие: в таблицу добавлен переданный элемент
    public abstract add(item: Item): void;

    // Запрос
    public abstract getAddStatus(): number;

    // Статусы добавления
    public ADD_NIL = 0 as const;
    public ADD_OK = 1 as const;
    public ADD_ERROR = 2 as const;

    // Запрос
    public abstract has(item: Item): boolean;
}

export class HashTable<Item> extends AbstractHashTable<Item> {
    private readonly maxSize: number;
    private readonly slots: Array<Item | null | undefined>;

    private addStatus: number;
    private deleteStatus: number;

    public constructor(maxSize: number) {
        super(maxSize);

        this.maxSize = maxSize;
        this.slots = new Array(this.maxSize);

        this.addStatus = this.ADD_NIL;
        this.deleteStatus = this.DELETE_NIL;
    }

    private hash(item: Item): number {
        return [...String(item)].reduce((hash, char) => (hash + char.charCodeAt(0)) % this.maxSize, 0);
    }

    private probe(item: Item): {foundIndex: number | null; freeIndex: number | null} {
        const start = this.hash(item);
        let foundIndex: number | null = null;
        let freeIndex: number | null = null;

        for (let i = 0; i < this.maxSize; i++) {
            const index = (start + i) % this.maxSize;
            const slot = this.slots[index];

            if (slot === item) {
                return {foundIndex: index, freeIndex};
            }
            if (slot == null && freeIndex === null) {
                freeIndex = index;
            }
            if (slot === undefined) {
                break;
            }
        }

        return {foundIndex, freeIndex};
    }

    public add(item: Item): void {
        const {foundIndex, freeIndex} = this.probe(item);
        if (foundIndex !== null || freeIndex === null) {
            this.addStatus = this.ADD_ERROR;
            return;
        }

        this.slots[freeIndex] = item;
        this.addStatus = this.ADD_OK;
    }

    public getAddStatus(): number {
        return this.addStatus;
    }

    public delete(item: Item): void {
        const {foundIndex} = this.probe(item);
        if (foundIndex === null) {
            this.deleteStatus = this.DELETE_ERROR;
            return;
        }

        this.slots[foundIndex] = null;
        this.deleteStatus = this.DELETE_OK;
    }

    public getDeleteStatus(): number {
        return this.deleteStatus;
    }

    public has(item: Item): boolean {
        return this.probe(item).foundIndex !== null;
    }
}
