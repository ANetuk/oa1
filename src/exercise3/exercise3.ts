abstract class AbstractParentList<Value> {
    // Постусловие: создан пустой связанный список
    // Постусловие: создан пустой курсор
    constructor() {}

    // Команда
    // Предусловие: список не пустой
    // Постусловие: курсор установлен на первый элемент в списке
    public abstract head(): void;

    // Запрос
    public abstract getHeadStatus(): number;
    public HEAD_NIL = 0 as const;
    public HEAD_OK = 1 as const;
    public HEAD_ERROR = 2 as const;

    // Команда
    // Предусловие: список не пустой
    // Постусловие: курсор установлен на последний элемент в списке
    public abstract tail(): void;

    // Запрос
    public abstract getTailStatus(): number;
    public TAIL_NIL = 0 as const;
    public TAIL_OK = 1 as const;
    public TAIL_ERROR = 2 as const;

    // Команда
    // Предусловие: список не пустой
    // Предусловие: курсор установлен на элемент
    // Предусловие: курсор установлен не на последний элемент списка
    // Постусловие: курсор установлен на один элемент правее
    public abstract right(): void;

    // Запрос
    public abstract getRightStatus(): number;
    public RIGHT_NIL = 0 as const;
    public RIGHT_OK = 1 as const;
    public RIGHT_ERROR = 2 as const;

    // Запрос
    // Предусловие: курсор установлен на элемент
    public abstract get(): Value | undefined;

    // Запрос
    public abstract getGetStatus(): number;
    public GET_NIL = 0 as const;
    public GET_OK = 1 as const;
    public GET_ERROR = 2 as const;

    // Команда
    // Предусловие: курсор установлен на элемент
    // Постусловие: добавлен элемент справа от курсора с переданным значением
    public abstract putRight(value: Value): void;

    // Запрос
    public abstract getPutRightStatus(): number;
    public PUT_RIGHT_NIL = 0 as const;
    public PUT_RIGHT_OK = 1 as const;
    public PUT_RIGHT_ERROR = 2 as const;

    // Команда
    // Предусловие: курсор установлен на элемент
    // Постусловие: добавлен элемент слева от курсора с переданным значением
    public abstract putLeft(value: Value): void;

    // Запрос
    public abstract getPutLeftStatus(): number;
    public PUT_LEFT_NIL = 0 as const;
    public PUT_LEFT_OK = 1 as const;
    public PUT_LEFT_ERROR = 2 as const;

    // Команда
    // Предусловие: курсор установлен на элемент
    // Постусловие: элемент удален
    // Постусловие: курсор перемещен на правый элемент, если он есть; или на левый элемент, если он есть;
    //              или курсор не установлен ни на какой элемент
    public abstract remove(): void;

    // Запрос
    public abstract getRemoveStatus(): number;
    public REMOVE_NIL = 0 as const;
    public REMOVE_OK = 1 as const;
    public REMOVE_ERROR = 2 as const;

    // Команда
    // Постусловие: список очищен
    // Постусловие: курсор очищен
    public abstract clear(): void;

    // Запрос
    public abstract size(): number;

    // Команда
    // Предусловие: список пустой
    // Постусловие: в список добавлен элемент с переданным значением
    // Постусловие: курсор установлен на созданный элемент
    public abstract addToEmpty(value: Value): void;

    // Запрос
    public abstract getAddToEmptyStatus(): number;
    public ADD_TO_EMPTY_NIL = 0 as const;
    public ADD_TO_EMPTY_OK = 1 as const;
    public ADD_TO_EMPTY_ERROR = 2 as const;

    // Команда
    // Предусловие: список не пустой
    // Постусловие: добавлен новый элемент в хвост списка с переданным значением
    public abstract addTail(value: Value): void;

    // Запрос
    public abstract getAddTailStatus(): number;
    public ADD_TAIL_NIL = 0 as const;
    public ADD_TAIL_OK = 1 as const;
    public ADD_TAIL_ERROR = 2 as const;

    // Команда
    // Предусловие: курсор установлен на элемент
    // Постусловие: значение элемента заменено на переданное
    public abstract replace(value: Value): void;

    // Запрос
    public abstract getReplaceStatus(): number;
    public REPLACE_NIL = 0 as const;
    public REPLACE_OK = 1 as const;
    public REPLACE_ERROR = 2 as const;

    // Команда
    // Предусловие: список не пустой
    // Предусловие: элемент с переданным значением существует в списке
    // Постусловие: курсор установлен на элемент с переданным значением
    public abstract find(value: Value): void;

    // Запрос
    public abstract getFindStatus(): number;
    public FIND_NIL = 0 as const;
    public FIND_OK = 1 as const;
    public FIND_ERROR = 2 as const;

    // Команда
    // Постусловие: список не содержит элементов с переданным значением
    public abstract removeAll(value: Value): void;

    // Запрос
    // Предусловие: список не пустой
    public abstract isHead(): boolean;

    // Запрос
    public abstract getIsHeadStatus(): number;
    public IS_HEAD_NIL = 0 as const;
    public IS_HEAD_OK = 1 as const;
    public IS_HEAD_ERROR = 2 as const;

    // Запрос
    // Предусловие: список не пустой
    public abstract isTail(): boolean;

    // Запрос
    public abstract getIsTailStatus(): number;
    public IS_TAIL_NIL = 0 as const;
    public IS_TAIL_OK = 1 as const;
    public IS_TAIL_ERROR = 2 as const;

    // Запрос
    public abstract isValue(): boolean;
}

interface RightLeftNode<Value> {
    right: RightLeftNode<Value> | undefined;
    left: RightLeftNode<Value> | undefined;
    value: Value;
}

abstract class ParentList<Value> extends AbstractParentList<Value> {
    protected cursor: RightLeftNode<Value> | undefined;

    private headStatus: number = this.HEAD_NIL;

    public head() {
        if (this.cursor === undefined) {
            this.headStatus = this.HEAD_ERROR;
            return;
        }

        let nextCursor = this.cursor;
        while (nextCursor.left !== undefined) {
            nextCursor = nextCursor.left;
        }
        this.cursor = nextCursor;
        this.headStatus = this.HEAD_OK;
    }

    public getHeadStatus() {
        return this.headStatus;
    }

    private tailStatus: number = this.TAIL_NIL;

    public tail() {
        if (this.cursor === undefined) {
            this.tailStatus = this.TAIL_ERROR;
            return;
        } 

        let nextCursor = this.cursor;
        while (nextCursor.right !== undefined) {
            nextCursor = nextCursor.right;
        }
        this.cursor = nextCursor;
        this.tailStatus = this.TAIL_OK;
    }

    public getTailStatus() {
        return this.tailStatus;
    }

    private rightStatus: number = this.RIGHT_NIL;

    public right() {
        if (this.cursor === undefined || this.cursor.right === undefined) {
            this.rightStatus = this.RIGHT_ERROR;
            return;
        }

        this.cursor = this.cursor.right;
        this.rightStatus = this.RIGHT_OK;
    }

    public getRightStatus() {
        return this.rightStatus;
    }

    private getStatus: number = this.GET_NIL;

    public get() {
        if (this.cursor === undefined) {
            this.getStatus = this.GET_ERROR;
            return undefined;
        }
        this.getStatus = this.GET_OK;
        return this.cursor.value;
    }

    public getGetStatus() {
        return this.getStatus;
    }

    private putRightStatus: number = this.PUT_RIGHT_NIL;

    public putRight(value: Value) {
        if (this.cursor === undefined) {
            this.putRightStatus = this.PUT_RIGHT_ERROR;
            return;
        } 

        const newRightNode: RightLeftNode<Value> = {
            value: value,
            right: this.cursor.right,
            left: this.cursor
        };
        if (this.cursor.right !== undefined) {
            this.cursor.right.left = newRightNode;
        }
        this.cursor.right = newRightNode;
        this.putRightStatus = this.PUT_RIGHT_OK;
    }

    public getPutRightStatus() {
        return this.putRightStatus;
    }

    private putLeftStatus: number = this.PUT_LEFT_NIL;

    public putLeft(value: Value) {
        if (this.cursor === undefined) {
            this.putLeftStatus = this.PUT_LEFT_ERROR;
            return;
        }

        const newLeftNode: RightLeftNode<Value> = {
            value: value,
            right: this.cursor,
            left: this.cursor.left
        };
        if (this.cursor.left !== undefined) {
            this.cursor.left.right = newLeftNode;
        }
        this.cursor.left = newLeftNode;
        this.putLeftStatus = this.PUT_LEFT_OK;
    }

    public getPutLeftStatus() {
        return this.putLeftStatus;
    }

    private removeNode(node: RightLeftNode<Value>) {
        if (node.left !== undefined) {
            node.left.right = node.right;
        }
        if (node.right !== undefined) {
            node.right.left = node.left;
        }
        if (node === this.cursor) {
            this.cursor = node.right !== undefined ? node.right : node.left;
        }
    }

    private removeStatus: number = this.REMOVE_NIL;

    public remove() {
        if (this.cursor === undefined) {
            this.removeStatus = this.REMOVE_ERROR;
            return;
        }

        this.removeNode(this.cursor);
        this.removeStatus = this.REMOVE_OK;
    }

    public getRemoveStatus() {
        return this.removeStatus;
    }

    public clear() {
        this.cursor = undefined;
        this.headStatus = this.HEAD_NIL;
        this.tailStatus = this.TAIL_NIL;
        this.rightStatus = this.RIGHT_NIL;
        this.getStatus = this.GET_NIL;
        this.putRightStatus = this.PUT_RIGHT_NIL;
        this.putLeftStatus = this.PUT_LEFT_NIL;
        this.removeStatus = this.REMOVE_NIL;
        this.addToEmptyStatus = this.ADD_TO_EMPTY_NIL;
        this.addTailStatus = this.ADD_TAIL_NIL;
        this.replaceStatus = this.REPLACE_NIL;
        this.findStatus = this.FIND_NIL;
        this.isHeadStatus = this.IS_HEAD_NIL;
        this.isTailStatus = this.IS_TAIL_NIL;
    }

    public size() {
        if (this.cursor === undefined) {
            return 0;
        }

        let size = 1;

        let rightCursor = this.cursor.right;
        while (rightCursor !== undefined) {
            size++;
            rightCursor = rightCursor.right;
        }

        let leftCursor = this.cursor.left;
        while (leftCursor !== undefined) {
            size++;
            leftCursor = leftCursor.left;
        }

        return size;
    }

    private addToEmptyStatus: number = this.ADD_TO_EMPTY_NIL;

    public addToEmpty(value: Value) {
        if (this.cursor !== undefined) {
            this.addToEmptyStatus = this.ADD_TO_EMPTY_ERROR;
            return;
        }
        this.cursor = {
            value: value,
            right: undefined,
            left: undefined
        };
        this.addToEmptyStatus = this.ADD_TO_EMPTY_OK;
    }

    public getAddToEmptyStatus() {
        return this.addToEmptyStatus;
    }

    private addTailStatus: number = this.ADD_TAIL_NIL;

    public addTail(value: Value) {
        if (this.cursor === undefined) {
            this.addTailStatus = this.ADD_TAIL_ERROR;
            return;
        }

        let tail = this.cursor;
        while (tail.right !== undefined) {
            tail = tail.right;
        }
        const newTailNode: RightLeftNode<Value> = {
            value: value,
            right: undefined,
            left: tail
        };
        tail.right = newTailNode;

        this.addTailStatus = this.ADD_TAIL_OK;
    }

    public getAddTailStatus() {
        return this.addTailStatus;
    }

    private replaceStatus: number = this.REPLACE_NIL;

    public replace(value: Value) {
        if (this.cursor === undefined) {
            this.replaceStatus = this.REPLACE_ERROR;
            return;
        }
        this.cursor.value = value;
        this.replaceStatus = this.REPLACE_OK;
    }

    public getReplaceStatus() {
        return this.replaceStatus;
    }

    private findStatus: number = this.FIND_NIL;

    public find(value: Value) {
        if (this.cursor === undefined) {
            this.findStatus = this.FIND_ERROR;
            return;
        }


        if (this.cursor.value === value) {
            this.findStatus = this.FIND_OK;
            return;
        }

        let nextRightCursor = this.cursor.right;
        while (nextRightCursor !== undefined) {
            if (nextRightCursor.value === value) {
                this.cursor = nextRightCursor;
                this.findStatus = this.FIND_OK;
                return;
            }
            nextRightCursor = nextRightCursor.right;
        }

        let nextLeftCursor = this.cursor.left;
        while (nextLeftCursor !== undefined) {
            if (nextLeftCursor.value === value) {
                this.cursor = nextLeftCursor;
                this.findStatus = this.FIND_OK;
                return;
            }
            nextLeftCursor = nextLeftCursor.left;
        }

        this.findStatus = this.FIND_ERROR;
    }

    public getFindStatus() {
        return this.findStatus;
    }

    public removeAll(value: Value) {
        if (this.cursor === undefined) {
            return;
        }

        let left = this.cursor.left;

        let right: RightLeftNode<Value> | undefined = this.cursor;
        while (right !== undefined) {
            if (right.value === value) {
                this.removeNode(right);
            }
            right = right.right;
        }

        while (left !== undefined) {
            if (left.value === value) {
                this.removeNode(left);  
            }
            left = left.left;
        }
    }

    private isHeadStatus: number = this.IS_HEAD_NIL;

    public isHead() {
        if (this.cursor === undefined) {
            this.isHeadStatus = this.IS_HEAD_ERROR;
            return false;
        }
        this.isHeadStatus = this.IS_HEAD_OK;
        return this.cursor.left === undefined;
    }

    public getIsHeadStatus() {
        return this.isHeadStatus;
    }

    private isTailStatus: number = this.IS_TAIL_NIL;

    public isTail() {
        if (this.cursor === undefined) {
            this.isTailStatus = this.IS_TAIL_ERROR;
            return false;
        }
        this.isTailStatus = this.IS_TAIL_OK;
        return this.cursor.right === undefined;
    }

    public getIsTailStatus() {
        return this.isTailStatus;
    }

    public isValue() {
        return this.cursor !== undefined;
    }
}

export class LinkedList<Value> extends ParentList<Value> {
    constructor() {
        super();
    }
}

export class TwoWayList<Value> extends ParentList<Value> {
    constructor() {
        super();
    }

    public LEFT_NIL = 0 as const;
    public LEFT_OK = 1 as const;
    public LEFT_ERROR = 2 as const;

    private leftStatus: number = this.LEFT_NIL;

    public left() {
        if (this.cursor === undefined || this.cursor.left === undefined) {
            this.leftStatus = this.LEFT_ERROR;
            return;
        }
        this.cursor = this.cursor.left;
        this.leftStatus = this.LEFT_OK;
    }

    public getLeftStatus() {
        return this.leftStatus;
    }

    public clear(): void {
        super.clear();
        this.leftStatus = this.LEFT_NIL;
    }
}
