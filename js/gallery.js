// Immaculate Vibes — Final Gallery Interactions
// Supports: Featured + Collections + View All modes

const state = {
    currentView: 'featured',
    currentFilter: 'all',
    currentSort: 'default',
    searchQuery: '',
    images: [],
    currentLightboxIndex: 0,
};

// ===================================
// View Mode Switching
// ===================================

const switchView = (mode) => {
    // Update tabs
    document.querySelectorAll('.view-mode-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.mode === mode) {
            tab.classList.add('active');
        }
    });

    // Update views
    document.querySelectorAll('.view-section').forEach(view => {
        view.classList.remove('active');
    });

    const targetView = {
        'featured': 'featuredView',
        'latest': 'latestView',
        'collections': 'collectionsView',
        'all': 'allView'
    }[mode];

    document.getElementById(targetView).classList.add('active');
    
    state.currentView = mode;
    updateImagesList();
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
// Filter & Search (View All only)
// ===================================

const filterGallery = () => {
    const items = document.querySelectorAll('#allGalleryGrid .gallery-item');
    const emptyState = document.getElementById('emptyState');
    let visibleCount = 0;

    items.forEach(item => {
        const collection = item.dataset.collection;
        const title = item.dataset.title.toLowerCase();
        
        const matchesFilter = state.currentFilter === 'all' || collection === state.currentFilter;
        const matchesSearch = title.includes(state.searchQuery.toLowerCase());

        if (matchesFilter && matchesSearch) {
            item.classList.remove('hidden');
            visibleCount++;
        } else {
            item.classList.add('hidden');
        }
    });

    if (visibleCount === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
    }

    updateImagesList();
};

// ===================================
// Sorting
// ===================================

const sortGallery = () => {
    const grid = document.getElementById('allGalleryGrid');
    const items = Array.from(grid.querySelectorAll('.gallery-item'));

    items.sort((a, b) => {
        const titleA = a.dataset.title;
        const titleB = b.dataset.title;
        const collectionA = a.dataset.collection;
        const collectionB = b.dataset.collection;

        switch (state.currentSort) {
            case 'name-asc':
                return titleA.localeCompare(titleB);
            case 'name-desc':
                return titleB.localeCompare(titleA);
            case 'collection':
                return collectionA.localeCompare(collectionB) || titleA.localeCompare(titleB);
            default:
                return 0;
        }
    });

    items.forEach(item => grid.appendChild(item));
};

// ===================================
// Shuffle
// ===================================

const shuffleGallery = () => {
    // Determine which grid to shuffle based on current view
    let grid, items;
    
    if (state.currentView === 'featured') {
        grid = document.getElementById('latestGallery');
        items = Array.from(grid.querySelectorAll('.masonry-item'));
    } else if (state.currentView === 'latest') {
        grid = document.getElementById('latestMasonryGrid');
        items = Array.from(grid.querySelectorAll('.masonry-item'));
    } else if (state.currentView === 'all') {
        grid = document.getElementById('allGalleryGrid');
        items = Array.from(grid.querySelectorAll('.gallery-item'));
    } else {
        return; // Collections view doesn't shuffle
    }

    // Fisher-Yates shuffle
    for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
    }

    items.forEach(item => grid.appendChild(item));
};

// ===================================
// Lightbox
// ===================================

const updateImagesList = () => {
    // Get all visible images from current view
    if (state.currentView === 'featured') {
        state.images = Array.from(document.querySelectorAll('#latestGallery .masonry-image'));
    } else if (state.currentView === 'latest') {
        state.images = Array.from(document.querySelectorAll('#latestMasonryGrid .masonry-image'));
    } else if (state.currentView === 'collections') {
        state.images = Array.from(document.querySelectorAll('.collection-item img'));
    } else {
        state.images = Array.from(document.querySelectorAll('#allGalleryGrid .gallery-item:not(.hidden) .gallery-image'));
    }
};

const openLightbox = (index) => {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxCollection = document.getElementById('lightboxCollection');
    const lightboxCounter = document.getElementById('lightboxCounter');

    state.currentLightboxIndex = index;

    const img = state.images[index];
    const item = img.closest('[data-title]');
    
    // Get title and collection from data attributes or overlay
    let title, collection;
    if (item && item.dataset.title) {
        title = item.dataset.title;
        collection = formatCollectionName(item.dataset.collection);
    } else {
        // Fallback to overlay text
        const overlay = img.closest('.masonry-item, .collection-item, .collection-gallery-item, .gallery-item-inner');
        const titleEl = overlay?.querySelector('h3, h4, .masonry-title, .artwork-title');
        const collectionEl = overlay?.querySelector('p, .masonry-collection, .artwork-collection');
        title = titleEl?.textContent || 'Artwork';
        collection = collectionEl?.textContent || 'Collection';
    }
    
    lightboxImg.src = img.src || img.dataset.src;
    lightboxTitle.textContent = title;
    lightboxCollection.textContent = collection;
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
    const item = img.closest('[data-title]');

    lightboxImg.style.opacity = '0';
    
    setTimeout(() => {
        // Get title and collection from data attributes or overlay
        let title, collection;
        if (item && item.dataset.title) {
            title = item.dataset.title;
            collection = formatCollectionName(item.dataset.collection);
        } else {
            // Fallback to overlay text
            const overlay = img.closest('.masonry-item, .collection-item, .collection-gallery-item, .gallery-item-inner');
            const titleEl = overlay?.querySelector('h3, h4, .masonry-title, .artwork-title');
            const collectionEl = overlay?.querySelector('p, .masonry-collection, .artwork-collection');
            title = titleEl?.textContent || 'Artwork';
            collection = collectionEl?.textContent || 'Collection';
        }
        
        lightboxImg.src = img.src || img.dataset.src;
        lightboxTitle.textContent = title;
        lightboxCollection.textContent = collection;
        lightboxCounter.textContent = `${state.currentLightboxIndex + 1} / ${state.images.length}`;
        lightboxImg.style.opacity = '1';
    }, 150);
};

const formatCollectionName = (collection) => {
    return collection
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
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

    // View mode tabs
    document.querySelectorAll('.view-mode-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            switchView(tab.dataset.mode);
        });
    });

    // Filter pills (View All)
    document.querySelectorAll('.filter-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            state.currentFilter = pill.dataset.filter;
            filterGallery();
        });
    });

    // Search
    const searchInput = document.getElementById('searchInput');
    let searchDebounce;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(() => {
            state.searchQuery = e.target.value;
            if (state.currentView === 'all') {
                filterGallery();
            }
        }, 300);
    });

    // Sort
    const sortSelect = document.getElementById('sortSelect');
    sortSelect.addEventListener('change', (e) => {
        state.currentSort = e.target.value;
        if (state.currentSort === 'default') {
            location.reload();
        } else {
            sortGallery();
        }
    });

    // Shuffle
    document.getElementById('shuffleBtn').addEventListener('click', () => {
        shuffleGallery();
        updateImagesList();
    });

    // Click handlers for all gallery items
    setTimeout(() => {
        // Featured view
        document.querySelectorAll('#latestGallery .masonry-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                const visibleIndex = state.images.indexOf(img);
                if (visibleIndex !== -1) openLightbox(visibleIndex);
            });
        });

        // Latest view
        document.querySelectorAll('#latestMasonryGrid .masonry-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                const visibleIndex = state.images.indexOf(img);
                if (visibleIndex !== -1) openLightbox(visibleIndex);
            });
        });

        // Collections view
        document.querySelectorAll('.collection-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                const visibleIndex = state.images.indexOf(img);
                if (visibleIndex !== -1) openLightbox(visibleIndex);
            });
        });

        // View All
        document.querySelectorAll('#allGalleryGrid .gallery-item-inner').forEach((item, index) => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                const visibleIndex = state.images.indexOf(img);
                if (visibleIndex !== -1) openLightbox(visibleIndex);
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

    // Navbar scroll effect
    const nav = document.querySelector('.nav');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
            nav.style.background = 'rgba(10, 10, 15, 0.95)';
        } else {
            nav.style.background = 'rgba(10, 10, 15, 0.8)';
        }
    });

    // Smooth scroll for anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
