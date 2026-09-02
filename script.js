document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll('.animus-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.style.transform = "scale(0.95)";
            setTimeout(() => {
                btn.style.transform = "none";
            }, 100);
        });
    });
});