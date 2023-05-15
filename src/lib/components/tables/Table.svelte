<script lang="ts">
	let clazz = '';

	export { clazz as class };
	export let disabled = false;
</script>

<table
	class="w-full bg-white rounded divide-gray-200 shadow-md table-fixed dark:divide-gray-700 dark:bg-slate-800 {clazz}"
	class:opacity-50={disabled}
	class:pointer-events-none={disabled}
>
	<slot />
</table>
