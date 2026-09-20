import {LinkedList} from './List';

abstract class AbstractQueue<Item> {
    // Постусловие: создана пустая очередь
    public constructor() {}

    // Команда
    // Постусловие: элемент добавлен в конец очереди
    public abstract enqueue(item: Item): void;

    // Команда
    // Предусловие: очередь не пуста
    // Постусловие: элемент удален из начала очереди
    public abstract dequeue(): void;

    // Запрос
    public abstract getDequeueStatus(): number;

    public DEQUEUE_NIL = 0 as const;
    public DEQUEUE_OK = 1 as const;
    public DEQUEUE_ERROR = 2 as const;

    // Запрос
    // Предусловие: очередь не пуста
    public abstract head(): Item | undefined;

    // Запрос
    public abstract getHeadStatus(): number;

    public HEAD_NIL = 0 as const;
    public HEAD_OK = 1 as const;
    public HEAD_ERROR = 2 as const;

    // Запрос
    public abstract size(): number;

    // Команда
    // Постусловие: очередь очищена
    public abstract clear(): void;
}

export class Queue<Item> extends AbstractQueue<Item> {
    private list: LinkedList<Item>;

    private dequeueStatus: number;
    private headStatus: number;

    constructor() {
        super();
        this.list = new LinkedList();
        this.dequeueStatus = this.DEQUEUE_NIL;
        this.headStatus = this.HEAD_NIL;
    }

    clear() {
        this.list.clear();
        this.dequeueStatus = this.DEQUEUE_NIL;
        this.headStatus = this.HEAD_NIL;
    }

    dequeue() {
        if (this.list.size() === 0) {
            this.dequeueStatus = this.DEQUEUE_ERROR;
            return;
        }
        this.list.head();
        this.list.remove();
        this.dequeueStatus = this.DEQUEUE_OK;
    }

    enqueue(item: Item): void {
        if (this.list.size() === 0) {
            this.list.addToEmpty(item);
        } else {
            this.list.addTail(item);
        }
    }

    head(): Item | undefined {
        if (this.list.size() === 0) {
            this.headStatus = this.HEAD_ERROR;
            return undefined;
        }
        this.headStatus = this.HEAD_OK;
        this.list.head();
        return this.list.get();
    }

    getDequeueStatus(): number {
        return this.dequeueStatus;
    }

    getHeadStatus(): number {
        return this.headStatus;
    }

    size(): number {
        return this.list.size();
    }
}
