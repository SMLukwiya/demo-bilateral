<script lang="ts">
    import {onMount} from "svelte";
    import Toggle from "svelte-toggle";
    import {isModalOpen} from "../../../store/ModalStore";
    import Modal from "../../../components/Modal/modal.svelte";
    import ClientInvite from "../../../components/UI/ClientInvite.svelte";
    import NavBar from "../../../components/navbar/nav_2.svelte";
    import Icon from "../../../components/Icons/Icon.svelte";

    onMount(() => isModalOpen.set(true));

    let toggled = false;
    let value = "5";
    let bg_size: number;
    

    $: {
        bg_size = (+value * 10);
    }

</script>

<main class="grid h-full grid-rows-auto gap-2 md:gap-3 bg-light-gray pb-2">
    <div class="grid">
        <NavBar />
    </div>
    <div class="grid px-4 gap-3 h-full">
        <div class="md:flex items-center justify-end h-fit">
            <div class="flex items-center">
                <div class={"h-4 w-4 rounded-full bg-red-800"} />
                <p class="text-md text-dark-gray mx-2">No client connected</p>
            </div>
            <button
                class="bg-white p-2 rounded-md border border-dark-gray text-dark-gray text-lg font-medium mx-2"
                >INVITE CLIENT
            </button>
            <button
                class="bg-white p-2 rounded-md border border-dark-gray text-dark-gray text-lg font-medium ml-2"
                >TERMINATE SESSION
            </button>
        </div>

        <div class="lg:grid lg:grid-cols-3 lg:grid-rows-1 md:gap-x-4 h-full">
            <div class="grid h-full lg:block grid-rows-auto">
                <section class="bg-white rounded-lg py-3 px-2">
                    <div class="flex items-center cursor-pointer mb-3">
                        <Icon label="Eye" colour="#191a19" icon="ion:eye" width={24} />
                        <p class="text-lg font-medium text-dark-gray mx-2">VISUAL</p>
                        <Toggle 
                            bind:toggled 
                            label=""
                            switchColor="#fff"
                            toggledColor="#329461"
                            untoggledColor="#919191"
                            disabled={false} />
                    </div>
                    <div class="grid grid-cols-2 lg:grid-cols-1 overflow-auto h-full">
                        <div class="grid my-4 lg:order-1">
                            <h2 class="text-base font-medium">BLS Color</h2>
                            <div class="flex flex-wrap items-center gap-4">
                                <button class="w-12 h-12 rounded-md bg-blue-800 border border-dark-gray"></button>
                                <button class="w-12 h-12 rounded-md bg-green border-dark-gray"></button>
                                <button class="w-12 h-12 rounded-md bg-yellow-500 border-dark-gray"></button>
                                <button class="w-12 h-12 rounded-md bg-red-800 border-dark-gray"></button>
                            </div>
                        </div>
                        <div class="my-4 lg:order-3">
                            <h2 class="text-base font-medium">Path</h2>
                            <div class="flex flex-wrap items-center gap-4">
                                <button class="flex items-center justify-center     w-12 h-12 rounded-md bg-light-gray border border-dark-gray">
                                    <Icon label="horizontal path" width={30} colour="#191a19" icon="mdi:arrow-left-right" />
                                </button>
                            </div>
                        </div>
                        <div class="my-4 lg:order-2">
                            <h2 class="text-base font-medium">Background Color</h2>
                            <div class="flex flex-wrap items-center gap-4">
                                <button class="w-12 h-12 rounded-md bg-light-gray border border-dark-gray"></button>
                                <button class="w-12 h-12 rounded-md bg-dark-gray border-dark-gray"></button>
                                <button class="w-12 h-12 rounded-md bg-medium-gray border-dark-gray"></button>
                            </div>
                        </div>
                        <div class="my-4 lg:order-4">
                            <h2 class="text-base font-medium">Position</h2>
                            <div class="flex flex-wrap items-center gap-4">
                                <button class="w-12 h-12 rounded-md bg-light-gray border flex border-dark-gray items-center justify-center">
                                    <Icon label="vertical-align" colour="#191a19" width={30} icon="ic:round-vertical-align-center" />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <!-- <div class="grid h-full md:block">Auditory</div> -->

            <!-- <div class="grid h-full md:block">Tactile</div> -->
        </div>
        <div class="grid grid-cols-[30%_auto] lg:grid-cols-4 auto-rows-auto gap-4 grid-flow-row md:gap-x-4 h-full">
            <div class="bg-white col-span-2 rounded-md">
                <div class="flex items-center p-6">
                    <div class="flex items-center mr-4">
                        <Icon label="speed" colour="#191a19" icon="fluent:top-speed-24-regular" width={28} />
                        <p class="text-lg font-medium text-dark-gray min-w-[90px] mx-2">SPEED - {value}</p>
                    </div>
                    <input 
                        type="range" 
                        min="0" 
                        max="10" 
                        bind:value 
                        id="range"
                        class="bg-light-gray w-full"
                        style={`background-size: ${bg_size}%`}>
                </div>
            </div>
            <div class="row-span-2 lg:col-start-3 lg:col-end-4">
                <div class="bg-medium-gray h-full flex flex-col justify-between items-center rounded-md">
                    <div>
                        <h2 class="text-dark-gray font-medium mt-2">What the client Sees</h2>
                    </div>
                    <div>
                        Preview
                    </div>
                    <div class="flex justify-between w-full">
                        <button class="border border-dark-gray p-2 rounded-md text-sm">Preview</button>
                        <button class="border border-dark-gray p-2 rounded-md text-sm">Hide</button>
                    </div>
                </div>
            </div>

            <div></div>
            
            <div class=" col-start-1 col-end-3 row-start-2 row-end-3 lg:col-start-1 lg:col-end-3">
                <div class="bg-white flex justify-around items-center rounded-md p-6">
                    <div class="text-center">
                        <p class="text-dark-gray font-medium text-lg">Timer</p>
                        <h1 class="text-3xl font-bold text-dark-gray">00:00</h1>
                    </div>
                    <div class="text-center">
                        <p class="text-dark-gray font-medium text-lg">Passes</p>
                        <div>0</div>
                    </div>
                    <div class="text-center">
                        <p class="text-dark-gray font-medium text-lg">Sets</p>
                        <div>0</div>
                    </div>
                    <div class="text-center">
                        <button class="border border-dark-gray p-3 rounded-md font-medium">RESET</button>
                    </div>
                </div>
            </div>
            <div class="grid col-start-2 lg:col-start-4 items-end">
                <button class="h-12 bg-green w-full rounded-md flex items-center justify-center">
                    <Icon label="play" width={26} colour="#fff" icon="ion:ios-play" />
                    <h1 class="text-3xl text-white font-bold">START BLS</h1>
                </button>
            </div>
        </div>
    </div>
    {#if $isModalOpen}
        <Modal><ClientInvite /></Modal>
    {/if}
</main>