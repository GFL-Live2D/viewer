<script lang="ts">
    import { page } from '$app/state';

    const codeTokens = ['PUBLIC_CDN_URL', 'static/assets/', 'bun install', 'bun run dev', 'README.md'];
    const splitPattern = new RegExp(`(${codeTokens.map((t) => t.replace(/[/.]/g, '\\$&')).join('|')})`, 'g');

    let parts = $derived((page.error?.message ?? 'Unknown error').split(splitPattern).filter((part) => part !== ''));
</script>

<div class="bg-background flex min-h-screen items-center justify-center px-6">
    <div class="max-w-lg text-center">
        <h1 class="mb-2 text-2xl font-bold text-red-400">{page.status}</h1>
        <p class="text-foreground-tertiary text-sm leading-relaxed">
            {#each parts as part}
                {#if codeTokens.includes(part)}
                    <code class="bg-background-secondary rounded px-1 py-0.5 text-xs">{part}</code>
                {:else}
                    {part}
                {/if}
            {/each}
        </p>
    </div>
</div>
