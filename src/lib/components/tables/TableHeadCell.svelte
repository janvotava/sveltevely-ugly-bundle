<script lang="ts">
  let clazz = ""

  export { clazz as class }
</script>

<th scope="col" class="pl-2 text-left {clazz}">
  <slot />
</th>
