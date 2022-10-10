<script>
    import NavBar from "../components/navbar/nav_1.svelte";
</script>
<main>
    <NavBar />
    <div class="flex flex-col items-center mt-[50px]">
        <a href="/therapist" class="bg-light-gray border-2 border-dark-gray rounded w-[540px] py-8 my-10 group hover:bg-green">
            <h1 class="text-dark-gray md:text-[110px] sm:text-[65px] text-center group-hover:text-white">Therapist</h1>
        </a>
        <a href="client" class=" bg-light-gray border-2 border-dark-gray rounded w-[540px] py-8 my-10 group hover:bg-green">
            <h1 class="text-dark-gray md:text-[110px] sm:text-[65px] text-center group-hover:text-white">Client</h1>
        </a>
    </div>
</main>
