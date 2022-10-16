<script lang="ts">
    import Icon from "../Icons/Icon.svelte";
    import {copy} from "svelte-copy";

    export let name: string;
    let copyText = "Copy";
</script>

<div class="flex">
    <div class="flex items-center border border-gray bg-light-gray p-2 rounded-l-md w-full">
        <Icon label="copy-link" colour="#919191" width={28} icon="ion:ios-link" />
        <p class="text-sm text-dark-gray font-bold ml-2">{name}</p>
    </div>
    <div class=" bg-green border border-dark-gray rounded-r-md px-5">
        <button 
            use:copy={name}
            on:svelte-copy={() => copyText = "Copied"}
            class="h-full text-white flex items-center"
            >
            <Icon label="copy" colour="#fff" width={26} icon="ion:copy-outline" />
            <p class="ml-4">{copyText}</p>
        </button>
    </div>
</div>