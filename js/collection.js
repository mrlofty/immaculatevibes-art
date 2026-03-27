// Collection Page — Filtering + Lightbox

const state = {
    currentFilter: 'all',
    images: [],
    currentLightboxIndex: 0,
};

// ===================================
// Lazy Loading
// ===================================

const lazyLoadImages = () => {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });

    lazyImages.forEach(img => imageObserver.observe(img));
};

// ===================================
// Filter
// ===================================

const filterGallery = () => {
    const items = document.querySelectorAll('.collection-gallery-item');
    
    items.forEach(item => {
        const tags = item.dataset.tags || '';
        
        if (state.currentFilter === 'all' || tags.includes(state.currentFilter)) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });

    updateImagesList();
};

// ===================================
// Lightbox
// ===================================

const updateImagesList = () => {
    state.images = Array.from(document.querySelectorAll('.collection-gallery-item:not(.hidden) .collection-gallery-image.loaded'));
};

const openLightbox = (index) => {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxCollection = document.getElementById('lightboxCollection');
    const lightboxCounter = document.getElementById('lightboxCounter');

    state.currentLightboxIndex = index;

    const img = state.images[index];
    const item = img.closest('.collection-gallery-item');
    const overlay = item.querySelector('.collection-gallery-overlay');
    
    lightboxImg.src = img.src;
    lightboxTitle.textContent = overlay.querySelector('h3').textContent;
    lightboxCollection.textContent = overlay.querySelector('p').textContent;
    lightboxCounter.textContent = `${index + 1} / ${state.images.length}`;

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
};

const closeLightbox = () => {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
};

const showPrevImage = () => {
    state.currentLightboxIndex = (state.currentLightboxIndex - 1 + state.images.length) % state.images.length;
    updateLightboxImage();
};

const showNextImage = () => {
    state.currentLightboxIndex = (state.currentLightboxIndex + 1) % state.images.length;
    updateLightboxImage();
};

const updateLightboxImage = () => {
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxCollection = document.getElementById('lightboxCollection');
    const lightboxCounter = document.getElementById('lightboxCounter');

    const img = state.images[state.currentLightboxIndex];
    const item = img.closest('.collection-gallery-item');
    const overlay = item.querySelector('.collection-gallery-overlay');

    lightboxImg.style.opacity = '0';
    
    setTimeout(() => {
        lightboxImg.src = img.src;
        lightboxTitle.textContent = overlay.querySelector('h3').textContent;
        lightboxCollection.textContent = overlay.querySelector('p').textContent;
        lightboxCounter.textContent = `${state.currentLightboxIndex + 1} / ${state.images.length}`;
        lightboxImg.style.opacity = '1';
    }, 150);
};

// ===================================
// Event Listeners
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Lazy load images
    lazyLoadImages();

    // Initialize images list
    setTimeout(() => {
        updateImagesList();
    }, 1000);

    // Filter pills
    document.querySelectorAll('.collection-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            document.querySelectorAll('.collection-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            state.currentFilter = pill.dataset.filter;
            filterGallery();
        });
    });

    // Gallery item clicks
    setTimeout(() => {
        document.querySelectorAll('.collection-gallery-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                const visibleIndex = state.images.indexOf(img);
                if (visibleIndex !== -1) {
                    openLightbox(visibleIndex);
                }
            });
        });
    }, 1500);

    // Lightbox controls
    const lightbox = document.getElementById('lightbox');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxImg = document.getElementById('lightboxImg');

    lightboxClose.addEventListener('click', (e) => {
        e.stopPropagation();
        closeLightbox();
    });

    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        showPrevImage();
    });

    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        showNextImage();
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    lightboxImg.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
    });
});
