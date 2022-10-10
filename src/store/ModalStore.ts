import { writable } from "svelte/store";

export const isModalOpen = writable<boolean>(false);