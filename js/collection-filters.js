document.addEventListener('DOMContentLoaded', () => {
    const pills = document.querySelectorAll('.collection-pill[data-filter]');
    const items = document.querySelectorAll('.collection-gallery-item[data-tags]');

    if (!pills.length || !items.length) return;

    pills.forEach((pill) => {
        pill.addEventListener('click', () => {
            const filter = pill.dataset.filter;

            pills.forEach((item) => item.classList.remove('active'));
            pill.classList.add('active');

            items.forEach((item) => {
                const tags = (item.dataset.tags || '').split(/\s+/);
                const visible = filter === 'all' || tags.includes(filter);
                item.classList.toggle('hidden', !visible);
            });
        });
    });
});
