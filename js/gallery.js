// Immaculate Vibes — Gallery Interactions
// Enhanced version with filtering, sorting, search, and smooth animations

// ===================================
// State Management
// ===================================

const state = {
    currentFilter: 'all',
    currentSort: 'default',
    searchQuery: '',
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
// Filter & Search
// ===================================

const filterGallery = () => {
    const items = document.querySelectorAll('.gallery-item');
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

    // Show/hide empty state
    if (visibleCount === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
    }

    // Update visible images array for lightbox
    updateImagesList();
};

// ===================================
// Sorting
// ===================================

const sortGallery = () => {
    const grid = document.getElementById('galleryGrid');
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
                return 0; // Default order
        }
    });

    // Reorder DOM
    items.forEach(item => grid.appendChild(item));
};

// ===================================
// Shuffle
// ===================================

const shuffleGallery = () => {
    const grid = document.getElementById('galleryGrid');
    const items = Array.from(grid.querySelectorAll('.gallery-item'));

    // Fisher-Yates shuffle
    for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
    }

    items.forEach(item => grid.appendChild(item));
    
    // Reset animations
    items.forEach((item, index) => {
        item.style.animation = 'none';
        setTimeout(() => {
            item.style.animation = '';
        }, 10);
    });
};

// ===================================
// Lightbox
// ===================================

const updateImagesList = () => {
    state.images = Array.from(document.querySelectorAll('.gallery-item:not(.hidden) img.loaded'));
};

const openLightbox = (index) => {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxCollection = document.getElementById('lightboxCollection');
    const lightboxCounter = document.getElementById('lightboxCounter');

    state.currentLightboxIndex = index;

    const img = state.images[index];
    const item = img.closest('.gallery-item');
    
    lightboxImg.src = img.src;
    lightboxTitle.textContent = item.dataset.title;
    lightboxCollection.textContent = formatCollectionName(item.dataset.collection);
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
    const item = img.closest('.gallery-item');

    lightboxImg.style.opacity = '0';
    
    setTimeout(() => {
        lightboxImg.src = img.src;
        lightboxTitle.textContent = item.dataset.title;
        lightboxCollection.textContent = formatCollectionName(item.dataset.collection);
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

    // Initialize images list for lightbox
    setTimeout(() => {
        updateImagesList();
    }, 1000);

    // Filter tabs
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            state.currentFilter = tab.dataset.filter;
            filterGallery();
        });
    });

    // Search
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        filterGallery();
    });

    // Sort
    const sortSelect = document.getElementById('sortSelect');
    sortSelect.addEventListener('change', (e) => {
        state.currentSort = e.target.value;
        if (state.currentSort === 'default') {
            // Restore default order by reloading
            location.reload();
        } else {
            sortGallery();
        }
    });

    // Shuffle
    const shuffleBtn = document.getElementById('shuffleBtn');
    shuffleBtn.addEventListener('click', () => {
        shuffleGallery();
        updateImagesList();
    });

    // Gallery item clicks
    const galleryItems = document.querySelectorAll('.gallery-item-inner');
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            // Find the index within visible images
            const img = item.querySelector('img');
            const visibleIndex = state.images.indexOf(img);
            if (visibleIndex !== -1) {
                openLightbox(visibleIndex);
            }
        });
    });

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
    let lastScroll = 0;
    const nav = document.querySelector('.nav');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Smooth scroll for anchor links
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

    // Secret: Double-click logo for surprise
    let logoClickCount = 0;
    let logoClickTimer;
    const logo = document.querySelector('.logo');
    
    logo.addEventListener('click', (e) => {
        logoClickCount++;
        
        if (logoClickCount === 1) {
            logoClickTimer = setTimeout(() => {
                logoClickCount = 0;
            }, 400);
        }
        
        if (logoClickCount === 2) {
            clearTimeout(logoClickTimer);
            logoClickCount = 0;
            
            // Shake the logo
            logo.classList.add('shaking');
            setTimeout(() => logo.classList.remove('shaking'), 500);
            
            // Show secret message
            const messages = [
                "✨ You found a secret!",
                "🎨 Quinn says hi!",
                "💜 Built with love",
                "⚒️ Forge was here",
                "🌈 Keep exploring!"
            ];
            const randomMsg = messages[Math.floor(Math.random() * messages.length)];
            
            const toast = document.createElement('div');
            toast.textContent = randomMsg;
            toast.style.cssText = `
                position: fixed;
                top: 100px;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(135deg, #8b5cf6, #ec4899);
                color: white;
                padding: 1rem 2rem;
                border-radius: 50px;
                font-weight: 600;
                z-index: 10000;
                box-shadow: 0 10px 40px rgba(139, 92, 246, 0.4);
                animation: slideDown 0.5s ease, fadeOut 0.5s ease 2.5s forwards;
            `;
            
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideDown {
                    from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
                    to { transform: translateX(-50%) translateY(0); opacity: 1; }
                }
                @keyframes fadeOut {
                    to { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                }
            `;
            document.head.appendChild(style);
            document.body.appendChild(toast);
            
            setTimeout(() => toast.remove(), 3000);
        }
    });
});

// ===================================
// Performance Optimizations
// ===================================

// Debounce search
let searchDebounce;
const originalSearchListener = document.getElementById('searchInput')?.addEventListener;

if (originalSearchListener) {
    document.getElementById('searchInput').addEventListener('input', (e) => {
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(() => {
            state.searchQuery = e.target.value;
            filterGallery();
        }, 300);
    });
}
