document.addEventListener('DOMContentLoaded', () => {
    const cards = [...document.querySelectorAll('.revolution-card')];
    const filters = [...document.querySelectorAll('.filter')];
    const emptyState = document.querySelector('.empty-state');
    let activeFilter = 'all';

    const updateCards = () => {
        let visible = 0;
        cards.forEach(card => {
            const isVisible = activeFilter === 'all' || card.dataset.period === activeFilter;
            card.hidden = !isVisible;
            if (isVisible) visible += 1;
        });
        if (emptyState) emptyState.hidden = visible !== 0;
    };

    filters.forEach(filter => filter.addEventListener('click', () => {
        activeFilter = filter.dataset.filter;
        filters.forEach(item => item.classList.toggle('active', item === filter));
        updateCards();
    }));

    document.querySelectorAll('[data-modal]').forEach(button => {
        button.addEventListener('click', () => {
            const modal = document.getElementById(button.dataset.modal);
            modal.hidden = false;
            modal.querySelector('.modal-close').focus();
            document.body.style.overflow = 'hidden';
        });
    });

    document.querySelectorAll('.modal').forEach(modal => {
        const close = () => { modal.hidden = true; document.body.style.overflow = ''; };
        modal.querySelector('.modal-close').addEventListener('click', close);
        modal.addEventListener('click', event => { if (event.target === modal) close(); });
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') document.querySelectorAll('.modal:not([hidden]) .modal-close').forEach(button => button.click());
    });
});
