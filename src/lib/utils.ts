import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * merges tailwind css classes with clsx logic.
 *
 * @param inputs - class values to conditionally merge.
 * @returns a merged, deduplicated class string.
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

/**
 * helper type to strip 'child' property from a type.
 * used in component prop definitions.
 */
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;

/**
 * helper type to strip 'children' property from a type.
 * used in component prop definitions.
 */
export type WithoutChildren<T> = T extends { children?: any }
    ? Omit<T, "children">
    : T;

/**
 * helper type to strip both 'child' and 'children' properties.
 */
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;

/**
 * helper type to add an optional 'ref' property for element binding.
 */
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & {
    ref?: U | null;
};


