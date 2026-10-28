/**
 * ARCHIVIO STORICO RIVOLUZIONI — SCRIPT CORE
 * Filtri reattivi, audio sintetizzato senza file esterni,
 * gestione dossier modali e tasti rapidi da tastiera.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Riferimenti DOM
    const cards = Array.from(document.querySelectorAll('.dossier-card'));
    const filters = Array.from(document.querySelectorAll('.filter'));
    const emptyState = document.querySelector('.empty-state');
    const modals = Array.from(document.querySelectorAll('.modal'));
    const soundToggle = document.getElementById('soundToggle');

    let activeFilter = 'all';
    let audioEnabled = false;
    let audioCtx = null;

    /* ==========================================================================
       AUDIO ARCHIVIO (Sintetizzatore Web Audio API: 100% leggero, zero mp3)
       ========================================================================== */
    const initAudio = () => {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    };

    const playClickTone = (freq = 440, type = 'sine', duration = 0.04) => {
        if (!audioEnabled || !audioCtx) return;
        try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) {
            // Silenzioso in caso di blocco policy del browser
        }
    };

    if (soundToggle) {
        soundToggle.addEventListener('click', () => {
            initAudio();
            audioEnabled = !audioEnabled;
            soundToggle.classList.toggle('active', audioEnabled);
            soundToggle.querySelector('.sound-icon').textContent = audioEnabled ? '🔊' : '🔈';
            if (audioEnabled) {
                playClickTone(600, 'triangle', 0.08);
            }
        });
    }

    /* ==========================================================================
       FILTRO SECOLI REATTIVO CON CONTEGGIO
       ========================================================================== */
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
            playClickTone(520, 'sine', 0.05);

            filters.forEach(btn => btn.classList.toggle('active', btn === button));
            updateCardVisibility();
        });
    });

    /* ==========================================================================
       GESTIONE MODALI (FASCICOLI CONFIDENZIALI)
       ========================================================================== */
    const openModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        playClickTone(350, 'triangle', 0.07);
        modal.hidden = false;
        document.body.style.overflow = 'hidden';

        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) closeBtn.focus();
    };

    const closeModal = (modal) => {
        if (!modal || modal.hidden) return;
        playClickTone(240, 'sine', 0.05);
        modal.hidden = true;
        document.body.style.overflow = '';
    };

    // Apertura al click sui pulsanti della card
    document.querySelectorAll('[data-modal]').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(button.dataset.modal);
        });
    });

    // Chiusura al click su backdrop, tasto X o area esterna
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.modal-close');
        const backdrop = modal.querySelector('.modal-backdrop');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => closeModal(modal));
        }

        if (backdrop) {
            backdrop.addEventListener('click', () => closeModal(modal));
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal);
        });
    });

    /* ==========================================================================
       SCORCIATOIE DA TASTIERA
       ESC = Chiudi dossier
       1, 2, 3 = Apri istantaneamente i dossier 1, 2 o 3
       ========================================================================== */
    document.addEventListener('keydown', (e) => {
        // Se si preme ESC, chiudi qualunque modale aperta
        if (e.key === 'Escape') {
            const openedModal = document.querySelector('.modal:not([hidden])');
            if (openedModal) closeModal(openedModal);
        }

        // Tasti rapidi 1, 2, 3 (se nessuna modale è aperta e non stiamo scrivendo)
        const isInputFocused = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);
        const hasOpenModal = document.querySelector('.modal:not([hidden])');

        if (!isInputFocused && !hasOpenModal) {
            if (e.key === '1') openModal('modalInglese');
            if (e.key === '2') openModal('modalAmericana');
            if (e.key === '3') openModal('modalIndustriale');
        }
    });

    // Inizializzazione corretta delle viste
    updateCardVisibility();
});
