<script lang="ts">
    import {onMount} from "svelte";
    import * as Ably from "ably";
    import {page} from "$app/stores";

    let ably_key = import.meta.env.VITE_ABLY_PUBSUB_APIKEY // TODO: handle env better

    let left = 50;
    let color: string;
    let bgColor: string;
    let speed : string;
    let speedChange = false;
    let increment = false;
    let start = false;
    let started = false;
    let stop = false;
    let addStoppingTransform = false;
    let channel: Ably.Types.RealtimeChannelPromise;
    let slidingInterval: ReturnType<typeof setInterval>;

    // generate unique clientId
    const randomId = Math.random().toString(36).slice(-10);
    const url = $page.url.pathname.split("/");

    onMount(() => {
        // TODO
        // - change to token authentication
        if (randomId) {
            const ably = new Ably.Realtime.Promise({key: ably_key, clientId: randomId});
            channel = ably.channels.get(url[url.length - 1]);

            (async() => {
                await channel.attach();
                await channel.presence.enter()
            })();

            channel.subscribe('bgColor', (message) => {
                bgColor = message.data
            });
            channel.subscribe('color', (message) => {
                color = message.data
            });

            channel.subscribe('start', (message) => {
                start = message.data.value;
            });

            channel.subscribe('stop', (message) => {
                stop = message.data.value;
            });

            channel.subscribe('speed', (message) => {
                speed = message.data.value;
                speedChange = message.data.changed
            });
        }
        
        return () => {
            channel.presence.leave();
            channel.unsubscribe('session');
            channel.detach();
        }
    });

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
        stop = false;
        started = true;
        slidingInterval = setInterval(() => {
            slidePosition();
        }, (1000/60)/(+speed/2));
    }

    const stopSession = () => {
        speedChange = false;
        start = false;
        started = false;
        clearInterval(slidingInterval);
        if (!increment) {
            slidingInterval = setInterval(() => {
                if (left < 1) {
                    clearInterval(slidingInterval);
                    addStoppingTransform = true;
                    setTimeout(() => {
                        addStoppingTransform = false;
                        increment = false;
                        left = 50
                    }, 1750);
                } else {
                    left--;
                }
                
            }, (1000/60)/(+speed/2));
        } else {
            slidingInterval = setInterval(() => {
                if (left >= 98) {
                    clearInterval(slidingInterval);
                    addStoppingTransform = true;
                    setTimeout(() => {
                        addStoppingTransform = false;
                        increment = false;
                        left = 50
                    }, 1750);
                } else {
                    left++;
                }
                
            }, (1000/60)/(+speed/2));
        }
    }

    $: {
        if (start && !speedChange && !started) {
            startSession()
        }

        if (speedChange && start) {
            clearInterval(slidingInterval);
            slidingInterval = setInterval(slidePosition, (1000/60)/(+speed/2));
        }

        if (stop && started) {
            stopSession();
        }
    }

</script>

<main>
    <div class="w-full h-full overflow-hidden absolute top-0 left-0 bg-gray" style={`background-color: ${bgColor}`}>
        <div 
            id="client"
            style={`left: 48%; top: 49%; transform: translate(${(left-50)}%) translate3d(0px,0px,0px); ${addStoppingTransform ? `transform: translate(0%); transition: transform 1.5s ease-out` : ""}`}
            class="absolute w-full will-change-transform bg-red-500">
            <div class="absolute rounded-full w-16 h-16" style={`background-color: ${color}`}></div>
        </div>
    </div>
</main>