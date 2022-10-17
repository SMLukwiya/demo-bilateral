import { writable } from "svelte/store";

export const isModalOpen = writable<boolean>(false);

export const isMobileMenuVisible = writable<boolean>(false);