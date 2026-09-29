abstract class AbstractNativeDictionary<Item> {
  // Постусловие: создан пустой словарь
  public constructor() { }

  // Команда
  // Постусловие: переданный элемент установлен в словарь с переданным ключом
  public abstract set(key: string, value: Item): void;

  // Запрос
  // Предусловие: элемент с переданным ключом существует в словаре
  public abstract get(key: string): Item | undefined;

  // Запрос
  public abstract getGetStatus(): number;
  public GET_NIL = 0 as const;
  public GET_OK = 1 as const;
  public GET_ERROR = 2 as const;

  // Команда
  // Предусловие: элемент с переданным ключом существует в словаре
  // Постусловие: элемент с переданным ключом удален из словаря
  public abstract delete(key: string): void;

  // Запрос
  public abstract getDeleteStatus(): number;
  public DELETE_NIL = 0 as const;
  public DELETE_OK = 1 as const;
  public DELETE_ERROR = 2 as const;

  // Запрос
  public abstract has(key: string): boolean;

  // Запрос
  public abstract getCount(): number;
}

interface DictionaryItem<Value> {
  key: string;
  value: Value;
}

export class NativeDictionary<Value> extends AbstractNativeDictionary<Value> {
  private static readonly INIT_SIZE = 16;
  private static readonly MIN_SIZE = 16;

  private size: number;
  private array: (DictionaryItem<Value> | undefined | null)[];
  private count: number;

  private getStatus: number;
  private deleteStatus: number;

  constructor() {
    super();
    this.size = NativeDictionary.INIT_SIZE;
    this.array = new Array(this.size);
    this.count = 0;
    this.getStatus = this.GET_NIL;
    this.deleteStatus = this.DELETE_NIL;
  }

  private hash(key: string): number {
    return [...key].reduce((hash, char) => (hash + char.charCodeAt(0)) % this.size, 0);
  }

  private probe(key: string): { foundIndex: number | null; freeIndex: number | null } {
      const start = this.hash(key);
      let foundIndex: number | null = null;
      let freeIndex: number | null = null;

      for (let i = 0; i < this.size; i++) {
          const index = (start + i) % this.size;
          const item = this.array[index];

          if (item?.key === key) {
              return {foundIndex: index, freeIndex};
          }
          if (item == null && freeIndex === null) {
              freeIndex = index;
          }
          if (item === undefined) {
              break;
          }
      }

      return {foundIndex, freeIndex};
  }

  private resize(newSize: number): void {
    const normalizedNewSize = Math.max(NativeDictionary.MIN_SIZE, Math.floor(newSize));
    if (this.size === normalizedNewSize) return;

    const oldArray = this.array;
    const oldSize = this.size;

    this.array = new Array(normalizedNewSize);
    this.size = normalizedNewSize;
    this.count = 0;

    for (let i = 0; i < oldSize; i++) {
      const item = oldArray[i];
      if (!item) continue;
      const { freeIndex } = this.probe(item.key);
      if (freeIndex === null) continue;
      this.array[freeIndex] = item;
      this.count++;
    }
  }

  public set(key: string, value: Value): void {
    if (this.count === this.size) {
      this.resize(this.size * 2);
    }

    const { foundIndex, freeIndex } = this.probe(key);

    if (foundIndex !== null) {
      this.array[foundIndex] = { key, value };
    } else if (freeIndex !== null) {
      this.array[freeIndex] = { key, value };
      this.count++;
    }
  }

  public get(key: string): Value | undefined {
    const { foundIndex } = this.probe(key);
    if (foundIndex === null) {
      this.getStatus = this.GET_ERROR;
      return undefined;
    }
    this.getStatus = this.GET_OK;
    return this.array[foundIndex]?.value;
  }

  public getGetStatus(): number {
    return this.getStatus;
  }

  public delete(key: string): void {
    const { foundIndex } = this.probe(key);

    if (foundIndex === null) {
      this.deleteStatus = this.DELETE_ERROR;
      return;
    }

    this.deleteStatus = this.DELETE_OK;
    this.array[foundIndex] = null;
    this.count--;

    if (this.count < this.size / 2) {
      this.resize(this.size / 1.5);
    }
  }

  public getDeleteStatus(): number {
    return this.deleteStatus;
  }

  public has(key: string): boolean {
    const { foundIndex } = this.probe(key);
    return foundIndex !== null;
  }

  public getCount(): number {
    return this.count;
  }
}
