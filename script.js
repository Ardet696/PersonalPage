document.addEventListener('DOMContentLoaded', () => {
    const cvPhoto = document.getElementById('cv-photo');

    if (cvPhoto) {
        cvPhoto.addEventListener('click', () => {
            cvPhoto.classList.toggle('maximized');
        });
    }

    // Reveal the date next to each entry on hover.
    document.querySelectorAll('.date-hidden').forEach(dateSpan => {
        const target = dateSpan.parentElement;
        if (!target) return;

        target.addEventListener('mouseenter', () => {
            dateSpan.classList.add('date-visible');
        });
        target.addEventListener('mouseleave', () => {
            dateSpan.classList.remove('date-visible');
        });
    });
});
