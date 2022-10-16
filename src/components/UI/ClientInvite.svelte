<script lang="ts">
    import CopyClipBoard from "./CopyClipBoard.svelte";
    import Icon from '../Icons/Icon.svelte';
    
    export let name: string;
</script>

<div>
    <div class="flex items-center my-4">
        <div class="mr-4">
            <button class="bg-green p-2 rounded-full cursor-auto">
                <Icon label="client-add" colour="#0b290d" width={28} icon="ion:person-add-sharp" />
            </button>
        </div>
        <div>
            <h1 class="text-black text-lg font-medium">Invite Your Client</h1>
            <p class=" text-dark-gray text-sm">Share a link with your client for them to join your session:</p>
        </div>
    </div>
    <div class="my-8">
        <CopyClipBoard name={name} />
    </div>
    <div class="bg-medium-gray p-6 rounded-md">
        <button
            class="text-sm underline text-black font-medium"
            type="button"
            on:click={() => console.log("redirect")}
            >How does this tool work?
        </button>
        <div class="mt-3">
            <h2 class="text-sm text-black mb-2">Did you know:</h2>
            <p class="text-[11px] text-black">You can get your own personal fixed link (which you can reuse across clients) by upgrading to our Professional Plan.</p>
        </div>
        <div class="flex justify-between items-center mt-4">
            <div>
                <h2 class="text-[11px] text-black font-bold">Example</h2>
                <p class="text-[11px] text-black font-medium">www.demobilateral.io/wizzyf</p>
            </div>
            <button
                class="bg-white text-[11px] text-black font-bold p-3 rounded-md border border-dark-gray"
            >Claim Personal Link
            </button>
        </div>
    </div>
</div>