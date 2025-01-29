export type Optional<T> = {
    [K in Extract<keyof T, string> as K]?: T[K];
}
