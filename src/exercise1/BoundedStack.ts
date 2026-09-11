// Инвариант: количество элементов <= ограничение
abstract class AbstractBoundedStack<T> {
    // Предусловие: размер стека < ограничения
    // Постусловие: элемент добавлен в стек
    public abstract push(item: T): void;
    public abstract getPushStatus(): number;
    public PUSH_NIL = 0 as const;
    public PUSH_OK = 1 as const;
    public PUSH_ERROR = 2 as const;

    // Предусловие: стек не пустой
    // Постусловие: удален верхний элемент
    public abstract pop(): void;
    public abstract getPopStatus(): number;
    public POP_NIL = 0 as const;
    public POP_OK = 1 as const;
    public POP_ERROR = 2 as const;

    // Постусловие: удалены все элементы
    public abstract clear(): void;

    // Предусловие: стек не пустой
    public abstract peek(): T | undefined;
    public abstract getPeekStatus(): number;
    public PEEK_NIL = 0 as const;
    public PEEK_OK = 1 as const;
    public PEEK_ERROR = 2 as const;

    public abstract size(): number;
}

class BoundedStack<T> extends AbstractBoundedStack<T> {
    private max: number;
    private array: T[];
    private pushStatus: number;
    private popStatus: number;
    private peekStatus: number;

    constructor(max?: number) {
        super();
        const defaultMax = 32;
        this.max = max != null && max >= 0 ? max : defaultMax;
        this.array = [];
        this.pushStatus = this.PUSH_NIL;
        this.popStatus = this.POP_NIL;
        this.peekStatus = this.PEEK_NIL;
    }

    public push(this: BoundedStack<T>, item: T): void {
        if (this.array.length < this.max) {
            this.array.push(item);
            this.pushStatus = this.PUSH_OK;
        } else {
            this.pushStatus = this.PUSH_ERROR;
        }
    }

    public getPushStatus(this: BoundedStack<T>): number {
        return this.pushStatus;
    }

    public pop(this: BoundedStack<T>): void {
        if (this.array.length) {
            this.array.pop();
            this.popStatus = this.POP_OK;
        } else {
            this.popStatus = this.POP_ERROR;
        }
    }

    public getPopStatus(this: BoundedStack<T>): number {
        return this.popStatus;
    }

    public peek(this: BoundedStack<T>): T | undefined {
        let result: T | undefined;
        if (this.array.length) {
            result = this.array.at(-1);
            this.peekStatus = this.PEEK_OK;
        } else {
            result = undefined;
            this.peekStatus = this.PEEK_ERROR;
        }
        return result;
    }

    public getPeekStatus(this: BoundedStack<T>): number {
        return this.peekStatus;
    }

    public clear(this: BoundedStack<T>): void {
        this.array = [];
        this.pushStatus = this.PUSH_NIL;
        this.popStatus = this.POP_NIL;
        this.peekStatus = this.PEEK_NIL;
    }

    public size(this: BoundedStack<T>): number {
        return this.array.length;
    }
}

const boundedStack = new BoundedStack<number>(1);
console.log(boundedStack.getPeekStatus(), boundedStack.getPushStatus(), boundedStack.getPopStatus());
boundedStack.push(1);
console.log(boundedStack.size(), boundedStack.getPushStatus());
console.log(boundedStack.peek());
console.log(boundedStack.getPeekStatus());
boundedStack.pop();
console.log(boundedStack.getPopStatus());
boundedStack.peek();
console.log(boundedStack.getPeekStatus());
boundedStack.clear();
console.log(boundedStack.getPeekStatus(), boundedStack.getPushStatus(), boundedStack.getPopStatus());
