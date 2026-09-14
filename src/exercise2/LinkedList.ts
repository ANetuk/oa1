abstract class LinkedList<Value> {
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
    // Предусловие: список не пустой
    public abstract get(): Value;

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
    public abstract findStatus(): number;
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

// 2.2. Почему операция tail не сводима к другим операциям (если исходить из эффективной реализации)?
// С определенным в задании набором операций единственный вариант получить последний элемент в списке -
// это проходить по всему списку с помощью метода right, что в худшем случае будет иметь сложность N.

// 2.3. Операция поиска всех узлов с заданным значением, выдающая список таких узлов, уже не нужна. Почему?
// С помощью определенного в задании АТД клиенту больше не нужно знать о деталях реализации, таких как узлы.
// Теперь он может решить все свои задачи с помощью предоставленных ему методов.
