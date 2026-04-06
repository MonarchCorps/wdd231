document.addEventListener("DOMContentLoaded", () => {
    const timestampField = document.getElementById("timestamp");
    if (timestampField) {
        timestampField.value = new Date().toISOString();
    }

    const modalPairs = [
        { btnId: "btn-modal-np", modalId: "modal-np", closeId: "close-modal-np" },
        { btnId: "btn-modal-bronze", modalId: "modal-bronze", closeId: "close-modal-bronze" },
        { btnId: "btn-modal-silver", modalId: "modal-silver", closeId: "close-modal-silver" },
        { btnId: "btn-modal-gold", modalId: "modal-gold", closeId: "close-modal-gold" },
    ];

    modalPairs.forEach(({ btnId, modalId, closeId }) => {
        const openBtn = document.getElementById(btnId);
        const modal = document.getElementById(modalId);
        const closeBtn = document.getElementById(closeId);

        if (!openBtn || !modal || !closeBtn) return;

        openBtn.addEventListener("click", () => {
            modal.showModal();
        });

        closeBtn.addEventListener("click", () => {
            modal.close();
        });

        modal.addEventListener("click", (e) => {
            const rect = modal.getBoundingClientRect();
            const clickedOutside =
                e.clientX < rect.left ||
                e.clientX > rect.right ||
                e.clientY < rect.top ||
                e.clientY > rect.bottom;
            if (clickedOutside) {
                modal.close();
            }
        });

    });
});
