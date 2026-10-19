abstract class AbstractBloomFilter {
  // Постусловие: создан пустой фильтр Блума
  public constructor() {}

  // Команда
  // Постусловие: установлены биты наличия строки
  public abstract add(str: string): void;

  // Запрос
  public abstract isValue(str: string): boolean;
}

export class BloomFilter extends AbstractBloomFilter {
  private bitArray = 0;
  private arraySize = 32;

  private hash(str: string, rand: number): number {
    let version = 0;
    for (let i = 0; i < str.length; i++) {
      version = (version*rand + str.charCodeAt(i)) % this.arraySize;
    }
    return version;
  }

  private hash1(str: string): number {
    return this.hash(str, 17);
  }

  private hash2(str: string): number {
    return this.hash(str, 223);
  }

  private setBit(position: number): void {
    this.bitArray = this.bitArray | (1 << position);
  }

  private getBit(position: number): number {
    return (this.bitArray >> position) & 1;
  }

  public add(str: string): void {
    this.setBit(this.hash1(str));
    this.setBit(this.hash2(str));
  }

  public isValue(str: string): boolean {
    return Boolean(
      this.getBit(this.hash1(str)) && this.getBit(this.hash2(str))
    );
  }
}
