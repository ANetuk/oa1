abstract class DynArray<Item> {
    // Постусловие: создан пустой массив, count = 0
    constructor() {}

    // Команда
    // Предусловие: index >= 0 && index < count
    // Постусловие: по индексу index записан элемент item
    public abstract set(index: number, item: Item): void;

    // Запрос
    public abstract getSetStatus(): number;
    public SET_NIL = 0 as const;
    public SET_OK = 1 as const;
    public SET_ERROR = 2 as const;

    // Запрос
    // Предусловие: index >= 0 && index < count
    public abstract get(index: number): Item | undefined;

    // Запрос
    public abstract getGetStatus(): number;
    public GET_NIL = 0 as const;
    public GET_OK = 1 as const;
    public GET_ERROR = 2 as const;

    // Команда
    // Предусловие: index >= 0 && index < count
    // Постусловие: элемент с индексом index удален из массива, элементы c index + 1 сдвинуты влево на одну позицию
    // Постусловие: count уменьшен на 1
    public abstract remove(index: number): void;

    public abstract getRemoveStatus(): number;
    public REMOVE_NIL = 0 as const;
    public REMOVE_OK = 1 as const;
    public REMOVE_ERROR = 2 as const;

    // Команда
    // Предусловие: массив не пустой
    // Постусловие: удален последний элемент
    // Постусловие: count уменьшен на 1
    public abstract pop(): void;

    // Запрос
    public abstract getPopStatus(): number;
    public POP_NIL = 0 as const;
    public POP_OK = 1 as const;
    public POP_ERROR = 2 as const;

    // Команда
    // Предусловие: массив не пустой
    // Постусловие: удален элемент с индексом 0, элементы с 1 сдвинуты влево на одну позицию
    // Постусловие: count уменьшен на 1
    public abstract shift(): void;

    // Запрос
    public abstract getShiftStatus(): number;
    public SHIFT_NIL = 0 as const;
    public SHIFT_OK = 1 as const;
    public SHIFT_ERROR = 2 as const;

    // Команда
    // Предусловие: index >= 0 && index <= count
    // Постусловие: элементы с index сдвинуты вправо на одну позицию, по индексу index вставлен элемент item
    // Постусловие: count увеличен на 1
    public abstract insert(index: number, item: Item): void;

    // Запрос
    public abstract getInsertStatus(): number;
    public INSERT_NIL = 0 as const;
    public INSERT_OK = 1 as const;
    public INSERT_ERROR = 2 as const;

    // Команда
    // Постусловие: в конец массива добавлен элемент item
    // Постусловие: count увеличен на 1
    public abstract push(item: Item): void;

    // Команда
    // Постусловие: элементы с индекса 0 сдвинуты вправо на одну позицию, в индекс 0 добавлен элемент item
    // Постусловие: count увеличен на 1
    public abstract unshift(item: Item): void;

    // Запрос
    public abstract count(): number;

    // Команда
    // Постусловие: массив очищен, count = 0
    public abstract clear(): void;
}

abstract class BaseDynArray<Item> extends DynArray<Item> {
    private static readonly MIN_CAPACITY = 16;
    private static readonly DEFAULT_CAPACITY = 16;

    private _count: number;
    private _capacity: number;
    private _itemSize: number;
    private _array: Uint8Array;

    private _serialize: (item: Item) => Uint8Array;
    private _deserialize: (bytes: Uint8Array) => Item;

    private setStatus: number;
    private getStatus: number;
    private removeStatus: number;
    private popStatus: number;
    private shiftStatus: number;
    private insertStatus: number;

    public constructor(
        itemSize: number,
        serialize: (item: Item) => Uint8Array,
        deserialize: (bytes: Uint8Array) => Item,
    ) {
        super();
        this._count = 0;
        this._capacity = BaseDynArray.DEFAULT_CAPACITY;
        this._itemSize = itemSize;
        this._array = new Uint8Array(this._capacity * this._itemSize);

        this._serialize = serialize;
        this._deserialize = deserialize;

        this.setStatus = this.SET_NIL;
        this.getStatus = this.GET_NIL;
        this.removeStatus = this.REMOVE_NIL;
        this.popStatus = this.POP_NIL;
        this.shiftStatus = this.SHIFT_NIL;
        this.insertStatus = this.INSERT_NIL;
    }

    private makeArray(newCapacity: number) {
        newCapacity = Math.floor(newCapacity);
        if (newCapacity < BaseDynArray.MIN_CAPACITY) {
            newCapacity = BaseDynArray.MIN_CAPACITY;
        }
        if (newCapacity === this._capacity) return;

        const newArray = new Uint8Array(newCapacity * this._itemSize);
        newArray.set(this._array.subarray(0, this._count * this._itemSize));
        this._array = newArray;
        this._capacity = newCapacity;
    }

    public set(index: number, item: Item) {
        if (index < 0 || index >= this._count) {
            this.setStatus = this.SET_ERROR;
            return;
        }
        this._array.set(this._serialize(item), index * this._itemSize);
        this.setStatus = this.SET_OK;
    }

    public getSetStatus(): number {
        return this.setStatus;
    }

    public get(index: number): Item | undefined {
        if (index < 0 || index >= this._count) {
            this.getStatus = this.GET_ERROR;
            return undefined;
        }
        this.getStatus = this.GET_OK;
        return this._deserialize(
            this._array.subarray(index * this._itemSize, (index + 1) * this._itemSize)
        );
    }

    public getGetStatus(): number {
        return this.getStatus;
    }

    private removeFromBuffer(index: number) {
        this._array.copyWithin(
            index * this._itemSize,
            (index + 1) * this._itemSize,
            this._count * this._itemSize,
        );
        this._count -= 1;
        if (this._count < this._capacity * 0.5 ) {
            this.makeArray(this._capacity / 1.5);
        }
    }

    public remove(index: number) {
        if (index < 0 || index >= this._count) {
            this.removeStatus = this.REMOVE_ERROR;
            return;
        }
        this.removeFromBuffer(index);
        this.removeStatus = this.REMOVE_OK;
    }

    public getRemoveStatus(): number {
        return this.removeStatus;
    }

    public pop() {
        if (this._count === 0) {
            this.popStatus = this.POP_ERROR;
            return;
        }
        this.removeFromBuffer(this._count - 1);
        this.popStatus = this.POP_OK;
    }

    public getPopStatus(): number {
        return this.popStatus;
    }

    public shift() {
        if (this._count === 0) {
            this.shiftStatus = this.SHIFT_ERROR;
            return;
        }
        this.removeFromBuffer(0);
        this.shiftStatus = this.SHIFT_OK;
    }

    public getShiftStatus(): number {
        return this.shiftStatus;
    }

    private insertIntoBuffer(index: number, item: Item) {
        if (this._count === this._capacity) {
            this.makeArray(this._capacity * 2);
        }
        this._array.copyWithin(
            (index + 1) * this._itemSize,
            index * this._itemSize,
            this._count * this._itemSize,
        );
        this._array.set(this._serialize(item), index * this._itemSize);
        this._count += 1;
    }
    
    public insert(index: number, item: Item) {
        if (index < 0 || index > this._count) {
            this.insertStatus = this.INSERT_ERROR;
            return;
        }
        this.insertIntoBuffer(index, item);
        this.insertStatus = this.INSERT_OK;
    }

    public getInsertStatus(): number {
        return this.insertStatus;
    }

    public push(item: Item): void {
        this.insertIntoBuffer(this._count, item);
    }

    public unshift(item: Item): void {
        this.insertIntoBuffer(0, item);
    }

    public count(): number {
        return this._count;
    }

    public clear(): void {
        this._count = 0;
        this._array = new Uint8Array(BaseDynArray.DEFAULT_CAPACITY * this._itemSize);
        this._capacity = BaseDynArray.DEFAULT_CAPACITY;
        this.setStatus = this.SET_NIL;
        this.getStatus = this.GET_NIL;
        this.removeStatus = this.REMOVE_NIL;
        this.popStatus = this.POP_NIL;
        this.shiftStatus = this.SHIFT_NIL;
        this.insertStatus = this.INSERT_NIL;
    }
}

export class NumberDynArray extends BaseDynArray<number> {
    public constructor() {
        const numberSize = 8;
        super(numberSize,
            (item: number) => {
                const bytes = new Uint8Array(numberSize);
                const dataView = new DataView(bytes.buffer);
                dataView.setFloat64(0, item);
                return bytes;
            },
            (bytes: Uint8Array) => (
                new DataView(bytes.buffer, bytes.byteOffset, numberSize).getFloat64(0)
            )
        );
    }
}
