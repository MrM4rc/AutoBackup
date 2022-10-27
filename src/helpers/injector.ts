import { NotFoundError } from "../errors/injector";

interface Dependencies {
  [key: string]: unknown;
}

function guard<T>(value: unknown, type: T): value is T {
  if (type instanceof Function && value instanceof type) return true;

  if (value === type) return true;

  return false;
}

export class Injector {
  constructor(private dependencies: Dependencies = {}) {}

  add(key: string, value: unknown) {
    this.dependencies[key] = value;
  }

  inject<T>(key: string): T;
  inject<T>(type: T): T;
  inject<T>(type: T): T {
    for (const key in this.dependencies) {
      const value = this.dependencies[key];
      if (typeof type === "string" && key === type) return value as T;
      if (guard(value, type)) return value;
    }

    throw new NotFoundError();
  }
}

export const injector = new Injector();
