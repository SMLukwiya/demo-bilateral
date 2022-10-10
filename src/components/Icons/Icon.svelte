<script>
    /* ONLY IF YOU DO NOT WANT OFFLINE SUPPORT */
     import Icon from '@iconify/svelte';
  
    export let label = 'icon';
    export let colour = 'inherit';
    export let ariaHidden = false;
    export let width = 28;
    export let icon = "ion:ios-construct";
  
    /* some libraries add an id which can result in duplicate ids and that can impact accessibility so
    you can override with a random id if you face this issue */
    const id = Date.now().toString(16) + ((Math.random() * 0x1000000) | 0).toString(16);
  
  </script>
  
  <Icon icon={icon} {ariaHidden} aria-label={label} color={colour} {width} {id} />