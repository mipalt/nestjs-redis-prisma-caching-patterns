export class Ttl {
  private static readonly MS_IN_SECOND = 1000;

  static minutes(minutes: number): number {
    return minutes * 60 * Ttl.MS_IN_SECOND;
  }

  static minutesInSeconds(minutes: number): number {
    return minutes * 60;
  }
}
