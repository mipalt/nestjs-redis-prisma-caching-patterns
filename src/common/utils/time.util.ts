export class Time {
  static second(value: number): number {
    return value;
  }

  static minute(value: number): number {
    return value * 60;
  }

  static hour(value: number): number {
    return value * 60 * 60;
  }

  static day(value: number): number {
    return value * 60 * 60 * 24;
  }
}
