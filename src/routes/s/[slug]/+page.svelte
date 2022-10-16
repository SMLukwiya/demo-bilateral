<script lang="ts">
    import {onMount} from "svelte";
    import {page} from "$app/stores";
    import {goto} from "$app/navigation";
    import Toggle from "svelte-toggle";
    import * as Ably from "ably";
    import {isModalOpen} from "../../../store/ModalStore";
    import sessionData from "../../../store/blsStore";
    import Modal from "../../../components/Modal/modal.svelte";
    import ClientInvite from "../../../components/UI/ClientInvite.svelte";
    import NavBar from "../../../components/navbar/nav_2.svelte";
    import Icon from "../../../components/Icons/Icon.svelte";
    import ClientScreen from "../../../components/UI/ClientScreen.svelte";

    let toggled = true;
    let value = "4";
    let bgColor = "#919191";
    let color = "#1e40af";
    let bg_size: number;
    let timer = 0;
    let timerInterval: ReturnType<typeof setInterval>
    let slidingInterval: ReturnType<typeof setInterval>;
    let minutes: number;
    let seconds: number;
    let stopping = false;
    let addStoppingTransform = false;
    let left = 50;
    let increment = false;
    let numberOfPasses = 0;
    let preview = false;
    let isSessionRunning= false;
    let isTherapist = JSON.parse($sessionData)
    let ably_key = import.meta.env.VITE_ABLY_PUBSUB_APIKEY // TODO: handle env safer
    let channel: Ably.Types.RealtimeChannelCallbacks;
    let ably: Ably.Types.RealtimeCallbacks;
    let presenceData: Ably.Types.PresenceMessage[] | undefined = [];

    onMount(() => {
        isModalOpen.set(true);
        ably = new Ably.Realtime({key: ably_key});
        channel = ably.channels.get('session');

        channel.presence.subscribe(() => {
            channel.presence.get((err, members) => {
                presenceData = members
            })
        })

        channel.publish("color", color);
        channel.publish("bgColor", bgColor);
        channel.publish("left", left.toString());
        channel.publish("start", {value: isSessionRunning});
        channel.publish("speed", {value, changed: false});
        channel.publish("stop", {value: false});

        return () => {
            channel.presence.leave();
            channel.presence.unsubscribe();
            presenceData = [];
        }
    });

    const startTimer = () => {
        timerInterval = setInterval(() => {
            timer += 1000
        }, 1000)
    }

    const stopTimer = () => {
        clearInterval(timerInterval)
    }

    const slidePosition = () => {
        if (increment === false) {
            left--;
            if (left < 1) {
                increment = true
            }
        } else {
            left++;
            if (left >= 99) {
                increment = false
            }
        }
    }

    const startSession = () => {
        channel.publish("start", {value: true});

        isSessionRunning = true;
        startTimer();
        slidingInterval = setInterval(() => {
            slidePosition();
            if (left >= 99) {
                numberOfPasses += 1;
            }
        }, (1000/60)/(+value/2)) // 60Fps 
    }

    const stopSession = () => {
        channel.publish("stop", {value: true});

        stopping = true;
        stopTimer();
        clearInterval(slidingInterval);
        if (!increment) {
            slidingInterval = setInterval(() => {
                if (left < 1) {
                    clearInterval(slidingInterval);
                    addStoppingTransform = true;
                    setTimeout(() => {
                        addStoppingTransform = false;
                        stopping = false;
                        increment = false;
                        isSessionRunning = false;
                        left = 50
                    }, 1750);
                } else {
                    left--;
                }
                
            }, (1000/60)/(+value/2));
        } else {
            slidingInterval = setInterval(() => {
                if (left >= 98) {
                    clearInterval(slidingInterval);
                    addStoppingTransform = true;
                    setTimeout(() => {
                        addStoppingTransform = false;
                        stopping = false;
                        increment = false;
                        isSessionRunning = false;
                        left = 50
                    }, 1750);
                } else {
                    left++;
                }
                
            }, (1000/60)/(+value/2));
        }
    }
    
    const onResetHandler = () => {
        timer = 0;
        numberOfPasses = 0
    }

    const changeBLSColor = (hex: string) => {
        channel.publish("color", hex);
        color = hex
    }

    const changePreviewBgColor = (hex: string) => {
        channel.publish("bgColor", hex);
        bgColor = hex
    }

    const changeSpeed = (e: Event) => {
        const target = e.target as HTMLInputElement;
        channel.publish("speed", {value: target.value, changed: true});
        if (isSessionRunning) {
            clearInterval(slidingInterval);
            slidingInterval = setInterval(slidePosition, (1000/60)/(+target.value/2))
        }
    }

    const previewHandler = () => {
        preview = !preview
    };

    const inviteClientHandler = () => isModalOpen.set(true);

    const terminateSessionHandler = () => {
        ably.close()
        goto(`/therapist`)
    }

    $: {
        bg_size = (+value * 10);
        minutes = Math.floor((timer % (1000 * 60 * 60)) / (1000 * 60));
        seconds = Math.floor((timer % (1000 * 60)) / 1000);
    }

</script>

{#if !isTherapist.value}
    <ClientScreen />
{:else}
    <main class="grid h-full grid-rows-auto gap-2 md:gap-3 bg-light-gray pb-2">
        <div class="grid">
            <NavBar />
        </div>
        <div class="grid px-4 gap-3 h-full">
            <div class="md:flex items-center justify-end h-fit">
                <div class="flex items-center">
                    <div class={`h-4 w-4 rounded-full ${presenceData?.length ? "bg-green" : "bg-red-800"}`} />
                    {#if presenceData?.length}
                        <p class="text-md text-dark-gray mx-2">Client connected</p>
                    {:else}
                        <p class="text-md text-dark-gray mx-2">No client connected</p>
                    {/if}
                </div>
                <button
                    on:click={inviteClientHandler}
                    class="bg-white p-2 rounded-md border border-dark-gray text-dark-gray text-lg font-medium mx-2 hover:scale-105 transition-all"
                    >INVITE CLIENT
                </button>
                <button
                    on:click={terminateSessionHandler}
                    class="bg-white p-2 rounded-md border border-dark-gray text-dark-gray text-lg font-medium ml-2 hover:scale-105 transition-all"
                    >TERMINATE SESSION
                </button>
            </div>

            <div class="lg:grid lg:grid-cols-3 lg:grid-rows-1 md:gap-x-4 h-full">
                <div class={`grid h-full lg:block grid-rows-auto`}>
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
                        <div class={`grid grid-cols-2 lg:grid-cols-1 overflow-auto h-full ${!toggled ? "pointer-events-none opacity-40" : ""}`}>
                            <div class="grid my-4 lg:order-1">
                                <h2 class="text-base font-medium">BLS Color</h2>
                                <div class="flex flex-wrap items-center gap-4">
                                    <button 
                                        class={`w-12 h-12 rounded-md bg-blue-800 border border-dark-gray hover:scale-105 transition-all ${color === "#1e40af" ? "shadow-active" : ""}`}
                                        on:click={e => changeBLSColor("#1e40af")}></button>
                                    <button 
                                        class="w-12 h-12 rounded-md bg-green border-dark-gray hover:scale-105 transition-all"
                                        on:click={e => changeBLSColor("#329461")}></button>
                                    <button 
                                        class="w-12 h-12 rounded-md bg-yellow-500 border-dark-gray hover:scale-105 transition-all"
                                        on:click={e => changeBLSColor("#eab308")}></button>
                                    <button 
                                        class="w-12 h-12 rounded-md bg-red-800 border-dark-gray hover:scale-105 transition-all"
                                        on:click={e => changeBLSColor("#991b1b")}></button>
                                </div>
                            </div>
                            <div class="my-4 lg:order-3">
                                <h2 class="text-base font-medium">Path</h2>
                                <div class="flex flex-wrap items-center gap-4">
                                    <button class="flex items-center justify-center w-12 h-12 rounded-md bg-light-gray border border-dark-gray">
                                        <Icon label="horizontal path" width={30} colour="#191a19" icon="mdi:arrow-left-right" />
                                    </button>
                                </div>
                            </div>
                            <div class="my-4 lg:order-2">
                                <h2 class="text-base font-medium">Background Color</h2>
                                <div class="flex flex-wrap items-center gap-4">
                                    <button 
                                        class="w-12 h-12 rounded-md bg-medium-gray border-dark-gray hover:scale-105 transition-all"
                                        on:click={e => changePreviewBgColor("#919191")}></button>
                                    <button 
                                        class="w-12 h-12 rounded-md bg-pink-200 border-dark-gray hover:scale-105 transition-all"
                                        on:click={e => changePreviewBgColor("#fbcfe8")}></button>
                                    <button
                                        class="w-12 h-12 rounded-md bg-light-gray border border-dark-gray hover:scale-105 transition-all"
                                        on:click={e => changePreviewBgColor("#e3e3e3")}></button>
                                    <button 
                                        class="w-12 h-12 rounded-md bg-dark-gray border-dark-gray hover:scale-105 transition-all"
                                        on:click={e => changePreviewBgColor("#191a19")}></button>
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
                            <p class="text-lg font-medium text-dark-gray min-w-[100px] mx-2">SPEED - {value}</p>
                        </div>
                        <input 
                            type="range" 
                            min="0.5" 
                            max="10" 
                            step="0.5"
                            bind:value
                            on:input={changeSpeed}
                            disabled={stopping}
                            id="range"
                            class="bg-light-gray w-full cursor-pointer transition: all .5s linear"
                            style={`background-size: ${bg_size}%;`}>
                    </div>
                </div>

                <div 
                    class={`row-span-2 lg:col-start-3 lg:col-end-4 ${preview ? "invisible" : ""}`}>
                    <div  
                        class="h-full min-h-[170px] flex flex-col justify-between items-center rounded-md relative"
                        style={`background-color: ${bgColor}`}>
                        <div>
                            <h2 class="text-dark-gray font-medium mt-2">What the client Sees</h2>
                        </div>
                        <div>
                            <div 
                                id="client"
                                style={`left: 48%; top: 49%; transform: translate(${(left-50)}%) translate3d(0px,0px,0px); ${addStoppingTransform ? `transform: translate(0%); transition: transform 1.5s ease-out` : ""}`}
                                class="absolute w-full will-change-transform"
                                
                                >
                                <div class="absolute rounded-full w-6 h-6" style={`background-color: ${color}`}></div>
                            </div>
                        </div>
                        <div class="flex justify-between w-full">
                            <button 
                                class="border border-dark-gray p-2 rounded-md text-sm"
                                on:click={previewHandler}>Preview</button>
                            <button class="border border-dark-gray p-2 rounded-md text-sm">Hide</button>
                        </div>
                    </div>
                </div>

                {#if preview}
                    <div class="w-full h-3/5 absolute top-0 left-0 bg-gray">
                        <button 
                            class="absolute right-4 top-4"
                            on:click={previewHandler}>
                            <Icon label="close" colour="#191a19" width={50} icon="ion:md-close" />
                        </button>
                        <div 
                            id="client"
                            style={`left: 48%; top: 49%; transform: translate(${(left-50)}%) translate3d(0px,0px,0px); ${addStoppingTransform ? `transform: translate(0%); transition: transform 1s ease-out` : ""}`}
                            class="absolute w-full will-change-transform">
                            <div class="absolute rounded-full w-16 h-16" style={`background-color: ${color}`}></div>
                        </div>
                    </div>
                {/if}

                <div></div>
                
                <div class=" col-start-1 col-end-3 row-start-2 row-end-3 lg:col-start-1 lg:col-end-3">
                    <div class="bg-white flex justify-around items-center rounded-md p-6">
                        <div class="text-center">
                            <p class="text-dark-gray font-medium text-lg">Timer</p>
                            <h1 class="text-3xl font-bold text-dark-gray">
                                {minutes >= 10 ? `${minutes}` : `0${minutes}`}: {seconds >= 10 ? `${seconds}` : `0${seconds}`}
                            </h1>
                        </div>
                        <div class="text-center">
                            <p class="text-dark-gray font-medium text-lg">Passes</p>
                            <h1 class="text-3xl font-bold text-dark-gray">{numberOfPasses}</h1>
                        </div>
                        <div class="text-center">
                            <p class="text-dark-gray font-medium text-lg">Sets</p>
                            <div>0</div>
                        </div>
                        <div class="text-center">
                            <button 
                                class="border border-dark-gray p-3 rounded-md font-medium"
                                on:click={onResetHandler}>
                                RESET
                            </button>
                        </div>
                    </div>
                </div>

                <div class="grid col-start-2 lg:col-start-4 items-end">
                    {#if isSessionRunning}
                        <div class="flex items-center">
                            {#if !stopping}
                                <button 
                                    disabled 
                                    class="h-12 w-1/4 mr-2 bg-green rounded-md flex items-center justify-center">
                                    <Icon label="pause" colour="#fff" width={30} icon="ion:ios-pause" />
                                </button>
                            {/if}
                            {#if stopping}
                                <button 
                                    class="h-12 w-full bg-gray rounded-md flex items-center justify-center"
                                    disabled>
                                    <h1 class="text-3xl text-white font-bold">Stopping...</h1>
                                </button>
                            {:else}
                                <button 
                                    class="h-12 w-3/4 bg-green rounded-md flex items-center justify-center"
                                    on:click={stopSession}>
                                    <Icon label="pause" colour="#fff" width={30} icon="ion:stop" />
                                    <h1 class="text-3xl text-white font-bold">STOP</h1>
                                </button>
                            {/if}
                        </div>
                    {:else}
                    <button 
                        class="h-12 bg-green w-full rounded-md flex items-center justify-center"
                        on:click={startSession}>
                        <Icon label="play" width={26} colour="#fff" icon="ion:ios-play" />
                        <h1 class="text-3xl text-white font-bold">START BLS</h1>
                    </button>
                    {/if}
                </div>
            </div>
        </div>
        {#if $isModalOpen}
            <Modal><ClientInvite name={$page.url.toString()} /></Modal>
        {/if}
    </main>
{/if}