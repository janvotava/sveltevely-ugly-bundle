import type { ZodIssue } from 'zod';
import { tick } from 'svelte';

type DotPrefix<T extends string> = T extends '' ? '' : `.${T}`;

type NestedKeyOf<T> = (
  T extends object
  ? {
    [K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<NestedKeyOf<T[K]>>}`;
  }[Exclude<keyof T, symbol>]
  : ''
) extends infer D
  ? Extract<D, string>
  : never;

/**
 * Represents a flattened object of validation errors.
 *
 * @typeParam T - The type of the object for which errors are being flattened.
 *
 * @example
 * ```typescript
 * import type { FlattenedErrors } from 'sveltevely-ugly-bundle';
 *
 * const errors: FlattenedErrors<MyFormType> = {
 *   'name': ['Name is required'],
 *   'address.street': ['Street is required'],
 *   'address.city': ['City is required']
 * };
 * ```
 */
export type FlattenedErrors<T extends object> = {
  [property in NestedKeyOf<T>]?: string[];
};

interface ErrorsBundle<T extends object> {
  errors: FlattenedErrors<T>;
}

export type WithErrors<T extends object> = T & ErrorsBundle<T>;

/**
 * Flattens Zod validation errors into an object representing nested properties and their associated error messages.
 *
 * @remarks
 * This function takes an array of Zod issues and returns an object that maps the nested property paths to an array of error messages.
 * The error messages can be optionally generated by providing a translator function.
 *
 * @typeParam Input - The type of the input object for which errors are being flattened.
 * @param errors - An array of Zod issues or null representing the validation errors to be flattened.
 * @param translator - (Optional) A function that translates a ZodIssue into a string error message.
 *                     If not provided, the error message from the ZodIssue will be used by default.
 * @returns An object that maps the nested property paths to an array of error messages.
 *
 * @example
 * ```typescript
 * import { flattenErrors } from "sveltevely-ugly-bundle";
 *
 * const errors = [
 *   { path: ["name"], message: "Name is required" },
 *   { path: ["address", "street"], message: "Street is required" },
 *   { path: ["address", "city"], message: "City is required" }
 * ];
 *
 * const errorList = flattenErrors(errors);
 *
 * console.log(errorList);
 * // Output: {
 * //   "name": ["Name is required"],
 * //   "address.street": ["Street is required"],
 * //   "address.city": ["City is required"]
 * // }
 * ```
 */
export function flattenErrors<Input extends object>(
  errors: ZodIssue[] | null,
  translator: (error: ZodIssue) => string = (error) => error.message
): FlattenedErrors<Input> {
  if (!errors) {
    return {};
  }

  const result = errors.reduce((result, error) => {
    const path = error.path.join('.') as keyof FlattenedErrors<Input>;
    const message = translator(error);

    const existing = result[path] || [];
    result[path] = [...existing, message];

    return result;
  }, {} as FlattenedErrors<Input>);

  return result;
}

/**
 * Scrolls an error wrapper into view if found, otherwise returns false.
 *
 * @returns A promise with boolean indicating whether the error wrapper was found and scrolled into view.
 *
 * @example
 * ```typescript
 * import { scrollErrorIntoView } from "sveltevely-ugly-bundle";
 *
 * const errorScrolled = await scrollErrorIntoView();
 * if (errorScrolled) {
 *   console.log("Error wrapper scrolled into view");
 * } else {
 *   console.log("No error wrapper found");
 * }
 * ```
 */
export async function scrollErrorIntoView() {
  await tick();

  const errorEl = document.querySelector('.error');

  if (errorEl) {
    errorEl.scrollIntoView({ block: 'center' });

    return true;
  } else {
    return false;
  }
}
