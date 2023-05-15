<script lang="ts">
	let clazz = '';

	export { clazz as class };
</script>

<table
	class="w-full bg-white rounded divide-gray-200 shadow-md table-fixed dark:divide-gray-700 dark:bg-slate-800 {clazz}"
>
	<slot />
</table>
