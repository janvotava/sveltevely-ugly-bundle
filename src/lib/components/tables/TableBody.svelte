<script lang="ts">
	import { useActions } from 'svelte-useactions';
	import type { ActionList } from 'svelte-useactions';

	export let use: ActionList<HTMLDivElement> = [];
</script>

<tbody class="divide-y divide-gray-200 dark:divide-gray-700" use:useActions={use}>
	<slot />
</tbody>
