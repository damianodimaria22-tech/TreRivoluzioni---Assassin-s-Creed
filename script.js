document.addEventListener('DOMContentLoaded', () => {
    const cards = Array.from(document.querySelectorAll('.dossier-card'));
    const filters = Array.from(document.querySelectorAll('.filter'));
    const emptyState = document.querySelector('.empty-state');
    const modals = Array.from(document.querySelectorAll('.modal'));

    let activeFilter = 'all';

    const updateCardVisibility = () => {
        let visibleCount = 0;

        cards.forEach(card => {
            const matches = activeFilter === 'all' || card.dataset.period === activeFilter;
            
            if (matches) {
                card.hidden = false;
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                visibleCount++;
            } else {
                card.hidden = true;
                card.style.opacity = '0';
            }
        });

        if (emptyState) {
            emptyState.hidden = visibleCount !== 0;
        }
    };

    filters.forEach(button => {
        button.addEventListener('click', () => {
            activeFilter = button.dataset.filter;
            filters.forEach(btn => btn.classList.toggle('active', btn === button));
            updateCardVisibility();
        });
    });

    const openModal = (modalId) => {
