import { writable } from "svelte/store";
import {browser} from "$app/environment";

const defaultValue = JSON.stringify({value: false});

const value = browser ? window.sessionStorage.getItem("isTherapist") ?? defaultValue : defaultValue;

const sessionData = writable(value);

sessionData.subscribe((value) => {
    if (browser) {
        window.sessionStorage.setItem("isTherapist", value);
    }
});

export default sessionData;