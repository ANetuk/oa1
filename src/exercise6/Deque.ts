abstract class AbstractQueue<Item> {
    // Постусловие: создана пустая очередь
    public constructor() {}

    // Команда
    // Постусловие: элемент добавлен в конец очереди
    public abstract addTail(item: Item): void;

    // Команда
    // Предусловие: очередь не пуста
    // Постусловие: из начала очереди удален элемент
    public abstract removeFront(): void;

    // Запрос
    public abstract getRemoveFrontStatus(): number;

    public REMOVE_FRONT_NIL = 0 as const;
    public REMOVE_FRONT_OK = 1 as const;
    public REMOVE_FRONT_ERROR = 2 as const;

    // Запрос
    // Предусловие: очередь не пуста
    public abstract front(): Item | undefined;

    // Запрос
    public abstract getFrontStatus(): number;

    public FRONT_NIL = 0 as const;
    public FRONT_OK = 1 as const;
    public FRONT_ERROR = 2 as const;

    // Запрос
    public abstract size(): number;

    // Команда
    // Постусловие: очередь очищена
    public abstract clear(): void;
}

abstract class ParentQueue<Item> extends AbstractQueue<Item> {
    protected list: Array<Item>;

    private removeFrontStatus: number;
    private frontStatus: number;

    constructor() {
        super();
        this.list = new Array<Item>();
        this.removeFrontStatus = this.REMOVE_FRONT_NIL;
        this.frontStatus = this.FRONT_NIL;
    }

    clear() {
        this.list.length = 0;
        this.removeFrontStatus = this.REMOVE_FRONT_NIL;
        this.frontStatus = this.FRONT_NIL;
    }

    removeFront() {
        if (this.list.length === 0) {
            this.removeFrontStatus = this.REMOVE_FRONT_ERROR;
            return;
        }
        this.list.splice(0, 1);
        this.removeFrontStatus = this.REMOVE_FRONT_OK;
    }

    addTail(item: Item): void {
        this.list.push(item);
    }

    front(): Item | undefined {
        if (this.list.length === 0) {
            this.frontStatus = this.FRONT_ERROR;
            return undefined;
        }
        this.frontStatus = this.FRONT_OK;
        return this.list[0];
    }

    getRemoveFrontStatus(): number {
        return this.removeFrontStatus;
    }

    getFrontStatus(): number {
        return this.frontStatus;
    }

    size(): number {
        return this.list.length;
    }
}

export class Queue<Item> extends ParentQueue<Item> {}

export class Deque<Item> extends ParentQueue<Item> {
    private removeTailStatus: number;

    public REMOVE_TAIL_NIL = 0 as const;
    public REMOVE_TAIL_OK = 1 as const;
    public REMOVE_TAIL_ERROR = 2 as const;

    private tailStatus: number;

    public TAIL_NIL = 0 as const;
    public TAIL_OK = 1 as const;
    public TAIL_ERROR = 2 as const;


    public constructor() {
        super();
        this.removeTailStatus = this.REMOVE_TAIL_NIL;
        this.tailStatus = this.TAIL_NIL;
    }

    public clear() {
        super.clear();
        this.removeTailStatus = this.REMOVE_TAIL_NIL;
        this.tailStatus = this.TAIL_NIL;
    }

    // Команда
    // Постусловие: элемент добавлен в начало очереди
    public addFront(item: Item): void {
        this.list.unshift(item);
    }

    // Команда
    // Предусловие: очередь не пуста
    // Постусловие: из конца очереди удален элемент
    public removeTail(): void {
        if (this.list.length === 0) {
            this.removeTailStatus = this.REMOVE_TAIL_ERROR;
            return;
        }
        this.removeTailStatus = this.REMOVE_TAIL_OK;
        this.list.splice(this.list.length - 1, 1);
    }

    // Запрос
    public getRemoveTailStatus(): number {
        return this.removeTailStatus;
    }

    // Запрос
    // Предусловие: очередь не пуста
    public tail(): Item | undefined {
        if (this.list.length === 0) {
            this.tailStatus = this.TAIL_ERROR;
            return undefined;
        }
        this.tailStatus = this.TAIL_OK;
        return this.list[this.list.length - 1];
    }

    // Запрос
    public getTailStatus(): number {
        return this.tailStatus;
    }
}
