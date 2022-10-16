<script lang="ts">
    import {goto} from "$app/navigation";
    import * as Ably from "ably";
    import {Chasing} from "svelte-loading-spinners";
    import NavBar from "../../components/navbar/nav_1.svelte";

    let ably_key = import.meta.env.VITE_ABLY_PUBSUB_APIKEY // TODO: handle env better
    let channel = null;

    const ably = new Ably.Realtime({key: ably_key});

    let name = "";
    let isSessionCreating = false;

    // generate 2 letter extension
    const randomExt = Math.random().toString(36).slice(-2);

    async function connect() {
        const ably = new Ably.Realtime.Promise(ably_key);
        await ably.connection.once('connected');

        console.log('Connected to Ably!');
    }

    const handleSubmit = async (e: Event) => {
        isSessionCreating = true
        if (!sessionStorage.getItem('isTherapist')) {
            sessionStorage.setItem("isTherapist", JSON.stringify({value: true}));
        }
        await connect();
        channel = ably.channels.get("session");
        isSessionCreating = false
        goto(`s/${name}-${randomExt}`)
    }
    
</script>

<main>
    <NavBar />
    <div class="flex flex-col">
        <div class="mx-auto">
        <h1 class="text-5xl font-normal mb-8">Create a new session</h1>
        <div>
            <form on:submit|preventDefault={handleSubmit}>
                <label for="session-name">Session name (e.g. your name/pseudonym)</label>
                <div class="sm:flex mt-2 sm:w-full sm:max-w-lg">
                    <input 
                        type="text"
                        id="session-name"
                        bind:value={name}
                        placeholder="example-name"
                        minlength={3}
                        class="block w-full p-3 mr-3 border border-gray rounded-md placeholder-gray shadow-sm focus:border-green focus:ring-green"
                        required
                    />
                    <div class="flex w-full mt-4 sm:mt-0">
                        <button 
                            type="submit" 
                            class="block w-full bg-green py-3 px-8 mr-1 rounded-md border border-gray text-white disabled:text-gray disabled:bg-light-gray transition-all"
                            disabled={name.length < 3 || isSessionCreating}>
                            Create session
                        </button>
                        {#if isSessionCreating}
                            <Chasing size="20" color="#191a19" unit="px" duration="1s" />
                        {/if}
                    </div>
                </div>
                <ul class="list-disc ml-3 mt-2 text-gray">
                    <li>Only letters, numbers, and dashes</li>
                    <li>Minimum three characters</li>
                </ul>
            </form>
        </div>
        </div>
    </div>
</main>
