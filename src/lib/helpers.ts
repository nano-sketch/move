import { writable } from "svelte/store";

/**
 * defines the available color themes for the application.
 * these match the css theme classes defined in global styles.
 */
export type Themes =
    | "default"
    | "light"
    | "corporate"
    | "ghibli"
    | "marshmallow"
    | "material"
    | "summer"
    | "sunset";

/**
 * a reactive store that holds the currently selected theme.
 * defaults to 'default' theme.
 */
export const selected_theme = writable<Themes>("default");
export const contact_popup_open = writable<boolean>(false);

/**
 * retrieves a list of all available theme identifiers.
 * useful for generating theme selection uis or validating theme names.
 *
 * @returns {Themes[]} an array of all valid theme strings.
 */
export function get_all_theme_names(): Themes[] {
    return [
        "default",
        "light",
        "corporate",
        "ghibli",
        "marshmallow",
        "material",
        "summer",
        "sunset",
    ];
}
