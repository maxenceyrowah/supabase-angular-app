export interface Iregister {
  email: string;
  password: string;
  options?: { data: Record<any, any> } | Record<string, string>;
}
