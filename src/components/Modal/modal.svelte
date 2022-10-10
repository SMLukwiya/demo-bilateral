<script>
    import {isModalOpen} from "../../store/ModalStore";
</script>

<div 
    class="w-screen h-screen flex justify-center items-center bg-neutral-500 opacity-95 fixed top-0 left-0 z-10"
    on:click={() => isModalOpen.set(false)}>
    <div 
        class="bg-white p-4 relative max-w-lg rounded-md"
        on:click|stopPropagation
        >
        <button 
            class="absolute top-2 right-3 text-4xl text-gray"
            on:click={() => isModalOpen.set(false)}
            >&times;</button>
        <slot />
    </div>
</div>