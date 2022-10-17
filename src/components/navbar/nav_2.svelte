<script>
    import {isMobileMenuVisible} from "../../store/ModalStore";
    import Icon from "../Icons/Icon.svelte";
</script>

<nav class="flex items-center justify-between sm:w-full py-2 px-4 border-b bg-white border-b-dark-gray">
    <div class="flex items-center">
        <h1 class="text-3xl text-dark-gray font-medium mr-4">DemoBilateral.io</h1>
        <ul class="hidden lg:flex items-center h-full">
            <li class="text-md text-dark-gray font-medium mx-4">
                <a href="/tutorial" target="_blank">TUTORIAL</a>
            </li>
            <li class="text-md text-dark-gray font-medium mx-4">
                <a href="/faqs" target="_blank">FAQ</a>
            </li>
            <li class="text-md text-dark-gray font-medium mx-4">
                <a href="/settings" target="_blank">SETTING</a>
            </li>
            <li class="text-md text-dark-gray font-medium mx-4">
                <a href="/contact" target="_blank">CONTACT</a>
            </li>
        </ul>
    </div>
    <div class="flex items-center">
        <div class="hidden sm:flex">
            <button 
                class="bg-white border border-dark-gray rounded-md py-2 px-4 font-medium text-dark-gray hover:scale-105 transition-all"
                >LOGIN
            </button>
            <button
                class="bg-green rounded-md border border-green py-2 px-12 font-medium text-white ml-2 hover:scale-105 transition-all">
                SIGN UP
            </button>
        </div>
        <button
            class="lg:hidden flex ml-3"
            on:click={() => isMobileMenuVisible.set(!$isMobileMenuVisible)}>
            <Icon label="Menu" colour="#191a19" icon="ion:menu-sharp" width={30} />
        </button>
    </div>
    {#if $isMobileMenuVisible}
        <div class="absolute right-0 top-[60px] w-56 bg-white py-3 px-2 shadow-md rounded-md">
            <ul>
                <li class="text-sm text-dark-gray font-normal my-1">
                    <a href="/tutorial" target="_blank">TUTORIAL</a>
                </li>
                <li class="text-sm text-dark-gray font-normal my-1">
                    <a href="/faqs" target="_blank">FAQ</a>
                </li>
                <li class="text-sm text-dark-gray font-normal my-1">
                    <a href="/settings" target="_blank">SETTING</a>
                </li>
                <li class="text-sm text-dark-gray font-normal my-1">
                    <a href="/contact" target="_blank">CONTACT</a>
                </li>
            </ul>
        </div>
    {/if}
</nav>