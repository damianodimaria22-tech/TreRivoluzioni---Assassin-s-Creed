document.addEventListener('DOMContentLoaded', () => {
    const cards = Array.from(document.querySelectorAll('.dossier-card'));
    const filters = Array.from(document.querySelectorAll('.filter'));
    const emptyState = document.querySelector('.empty-state');
    const modals = Array.from(document.querySelectorAll('.modal'));
    const openButtons = document.querySelectorAll('.open-dossier-btn');
    const closeButtons = document.querySelectorAll('.modal-close');
    const backdrops = document.querySelectorAll('.modal-backdrop');

    let activeFilter = 'all';

    // Gestione filtri cronologici
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

    // Gestione apertura e chiusura modali dossier
    const openModal = (modalId) => {
        const targetModal = document.getElementById(modalId);
        if (!targetModal) return;

        // Chiude eventuali altre modali prima di aprirne una nuova
        closeAllModals();
        targetModal.hidden = false;
        document.body.style.overflow = 'hidden';
    };

    const closeModal = (modal) => {
        if (!modal) return;
        modal.hidden = true;
        document.body.style.overflow = '';
    };

    const closeAllModals = () => {
        modals.forEach(m => closeModal(m));
    };

    // Click sui pulsanti "Apri Dossier Confidenziale"
    openButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = btn.getAttribute('data-modal');
            openModal(modalId);
        });
    });

    // Click sul pulsante di chiusura (✕ ESC)
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            closeModal(modal);
        });
    });

    // Click sullo sfondo scuro (backdrop) per chiudere
    backdrops.forEach(backdrop => {
        backdrop.addEventListener('click', () => {
            const modal = backdrop.closest('.modal');
            closeModal(modal);
        });
    });

    // Scorciatoie da tastiera: ESC per chiudere, 1, 2, 3 per aprire i dossier
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
            return;
        }

        // Se l'utente sta digitando in un campo di testo non attivare scorciatoie
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

        if (e.key === '1') openModal('modalInglese');
        if (e.key === '2') openModal('modalAmericana');
        if (e.key === '3') openModal('modalIndustriale');
    });

    // Supporto per i link di navigazione rapida nel footer
    document.querySelectorAll('[data-shortcut]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const num = link.getAttribute('data-shortcut');
            if (num === '1') openModal('modalInglese');
            if (num === '2') openModal('modalAmericana');
            if (num === '3') openModal('modalIndustriale');
        });
    });

    // Inizializzazione visibilità
    updateCardVisibility();
});
