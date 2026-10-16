export abstract class AbstractPowerSetIterator<Item> {
    // Постусловие: создан итератор, не установленный на элемент
    public constructor() {}

    // Запрос
    public abstract hasNext(): boolean;

    // Команда
    // Предусловие: есть следующий элемент
    // Постусловие: итератор установлен на следующий элемент
    public abstract next(): void;

    // Запрос
    public abstract getNextStatus(): number;
    public NEXT_NIL = 0 as const;
    public NEXT_OK = 1 as const;
    public NEXT_ERROR = 2 as const;

    // Запрос
    // Предусловие: итератор установлен на элемент
    public abstract get(): Item | undefined | null;

    // Запрос
    public abstract getGetStatus(): number;
    public GET_NIL = 0 as const;
    public GET_OK = 1 as const;
    public GET_ERROR = 2 as const;
}

class PowerSetIterator<Item> extends AbstractPowerSetIterator<Item> {
    private readonly slots: Array<Item | null | undefined>;
    private readonly maxSize: number;
    private index: number | undefined;

    private nextStatus: number;
    private getStatus: number;

    public constructor(slots: Array<Item | null | undefined>, maxSize: number) {
        super();

        this.slots = slots;
        this.maxSize = maxSize;
        this.index = undefined;

        this.nextStatus = this.NEXT_NIL;
        this.getStatus = this.GET_NIL;
    }

    private nextItemIndex(from: number): number | undefined {
        for (let i = from; i < this.maxSize; i++) {
            if (this.slots[i] != null) {
                return i;
            }
        }
        return undefined;
    }

    public hasNext(): boolean {
        const from = this.index === undefined ? 0 : this.index + 1;
        return this.nextItemIndex(from) !== undefined;
    }

    public next(): void {
        const from = this.index === undefined ? 0 : this.index + 1;
        const index = this.nextItemIndex(from);
        if (index === undefined) {
            this.nextStatus = this.NEXT_ERROR;
            return;
        }
        this.index = index;
        this.nextStatus = this.NEXT_OK;
    }

    public getNextStatus(): number {
        return this.nextStatus;
    }

    public get() {
        if (this.index === undefined || this.slots[this.index] == null) {
            this.getStatus = this.GET_ERROR;
            return undefined;
        }
        this.getStatus = this.GET_OK;
        return this.slots[this.index];
    }

    public getGetStatus(): number {
        return this.getStatus;
    }
}

abstract class AbstractPowerSet<Item> {
    // Постусловие: создано пустое множество с заданным размером
    public constructor(_maxSize: number) {}

    // Команда
    // Предусловие: во множестве есть переданный элемент
    // Постусловие: переданный элемент удален из множества
    public abstract delete(item: Item): void;

    // Запрос
    public abstract getDeleteStatus(): number;

    // Статусы удаления
    public DELETE_NIL = 0 as const;
    public DELETE_OK = 1 as const;
    public DELETE_ERROR = 2 as const;

    // Команда
    // Предусловие: переданный элемент отсутствует во множестве
    // Предусловие: для переданного элемента есть свободный слот в множестве
    // Постусловие: во множество добавлен переданный элемент
    public abstract add(item: Item): void;

    // Запрос
    public abstract getAddStatus(): number;

    // Статусы добавления
    public ADD_NIL = 0 as const;
    public ADD_OK = 1 as const;
    public ADD_ERROR = 2 as const;

    // Запрос
    public abstract has(item: Item): boolean;

    // Запрос
    public abstract size(): number;

    // Запрос
    // Постусловие: создан новый итератор по элементам множества
    public abstract iterator(): AbstractPowerSetIterator<Item>;

    // Запрос
    public abstract intersection(set: AbstractPowerSet<Item>): AbstractPowerSet<Item>;

    // Запрос
    public abstract union(set: AbstractPowerSet<Item>): AbstractPowerSet<Item>;

    // Запрос
    public abstract difference(set: AbstractPowerSet<Item>): AbstractPowerSet<Item>;

    // Запрос
    public abstract isSubset(set: AbstractPowerSet<Item>): boolean;

    // Запрос
    public abstract equals(set: AbstractPowerSet<Item>): boolean;
}

export class PowerSet<Item> extends AbstractPowerSet<Item> {
    private readonly maxSize: number;
    private readonly slots: Array<Item | null | undefined>;
    private count: number;

    private addStatus: number;
    private deleteStatus: number;

    public constructor(maxSize: number) {
        super(maxSize);

        this.maxSize = maxSize;
        this.slots = new Array(this.maxSize);
        this.count = 0;

        this.addStatus = this.ADD_NIL;
        this.deleteStatus = this.DELETE_NIL;
    }

    private hash(item: Item): number {
        return [...String(item)].reduce((hash, char) => (hash + char.charCodeAt(0)) % this.maxSize, 0);
    }

    private probe(item: Item): {foundIndex: number | null; freeIndex: number | null} {
        if (this.maxSize === 0) {
            return {foundIndex: null, freeIndex: null};
        }

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
        this.count++;
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
        this.count--;
        this.deleteStatus = this.DELETE_OK;
    }

    public getDeleteStatus(): number {
        return this.deleteStatus;
    }

    public has(item: Item): boolean {
        return this.probe(item).foundIndex !== null;
    }

    public size(): number {
        return this.count;
    }

    public iterator(): AbstractPowerSetIterator<Item> {
        return new PowerSetIterator(this.slots, this.maxSize);
    }

    public intersection(set: AbstractPowerSet<Item>): AbstractPowerSet<Item> {
        const thisSetSize = this.size();
        const setSize = set.size();
        if (thisSetSize === 0 || setSize === 0) {
            return new PowerSet<Item>(0);
        }
        const minSize = Math.min(thisSetSize, setSize);
        const result = new PowerSet<Item>(minSize);
        const iterator = this.iterator();
        while (iterator.hasNext()) {
            iterator.next();
            const item = iterator.get();
            if (item != undefined && set.has(item)) {
                result.add(item);
            }
        }
        return result;
    }

    private addToSet(targetSet: PowerSet<Item>, sourceSet: AbstractPowerSet<Item>): void {
        const iterator = sourceSet.iterator();
        while (iterator.hasNext()) {
            iterator.next();
            const item = iterator.get();
            if (item != undefined) {
                targetSet.add(item);
            }
        }
    }

    public union(set: AbstractPowerSet<Item>): AbstractPowerSet<Item> {
        const result = new PowerSet<Item>(this.size() + set.size());
        this.addToSet(result, this);
        this.addToSet(result, set);
        return result;
    }

    public difference(set: AbstractPowerSet<Item>): AbstractPowerSet<Item> {
        const result = new PowerSet<Item>(this.size());
        const iterator = this.iterator();
        while (iterator.hasNext()) {
            iterator.next();
            const item = iterator.get();
            if (item != undefined && !set.has(item)) {
                result.add(item);
            }
        }
        return result;
    }

    public isSubset(set: AbstractPowerSet<Item>): boolean {
        if (set.size() > this.size()) {
            return false;
        }
        const iterator = set.iterator();
        while (iterator.hasNext()) {
            iterator.next();
            const item = iterator.get();
            if (item != undefined && !this.has(item)) {
                return false;
            }
        }
        return true;
    }

    public equals(set: AbstractPowerSet<Item>): boolean {
        return this.size() === set.size() && this.isSubset(set);
    }
}
