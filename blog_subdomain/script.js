document.addEventListener('DOMContentLoaded', () => {
    const storiesGrid = document.getElementById('stories-grid');
    const featuredStoryContainer = document.getElementById('featured-story-container');
    const readerOverlay = document.getElementById('reader-overlay');
    const readerContent = document.getElementById('reader-content');
    const closeReader = document.getElementById('close-reader');

    // Load posts from JSON
    fetch('data/posts.json')
        .then(response => response.json())
        .then(posts => {
            renderPosts(posts);
        })
        .catch(err => {
            console.error('Error loading stories:', err);
            featuredStoryContainer.innerHTML = '<p>Unable to load stories. Please try again later.</p>';
        });

    function renderPosts(posts) {
        if (posts.length === 0) return;

        // 1. Render Featured Story (First post)
        const featured = posts[0];
        featuredStoryContainer.innerHTML = `
            <img src="${featured.image}" alt="${featured.title}">
            <div class="hero-overlay">
                <span class="category-tag">${featured.category}</span>
                <h1 class="hero-title">${featured.title}</h1>
                <p>Read full story →</p>
            </div>
        `;
        featuredStoryContainer.onclick = () => openReader(featured);

        // 2. Render Grid Stories (Remaining posts)
        storiesGrid.innerHTML = '';
        posts.slice(1).forEach(post => {
            const card = document.createElement('div');
            card.className = 'story-card';
            card.innerHTML = `
                <div class="card-img-container">
                    <img src="${post.image}" alt="${post.title}">
                </div>
                <div class="card-body">
                    <div class="card-date">${post.date} • ${post.category}</div>
                    <h3 class="card-title">${post.title}</h3>
                    <p class="card-excerpt">${post.excerpt}</p>
                </div>
            `;
            card.onclick = () => openReader(post);
            storiesGrid.appendChild(card);
        });
    }

    function openReader(post) {
        let galleryHTML = '';
        if (post.gallery && post.gallery.length > 0) {
            galleryHTML = `
                <div class="story-gallery" style="margin-top: 3.5rem; padding-top: 2.5rem; border-top: 1px solid rgba(27, 56, 37, 0.15);">
                    <h3 style="font-family: 'Merriweather', serif; font-size: 1.3rem; color: #1b3825; margin-bottom: 1.5rem; text-align: center;">Story Photo Gallery</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem;">
                        ${post.gallery.map(img => `
                            <div style="border-radius: 12px; overflow: hidden; height: 140px; border: 1px solid rgba(27, 56, 37, 0.1); cursor: pointer;" onclick="window.open('${img}', '_blank')">
                                <img src="${img}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; margin: 0; display: block;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        const formattedContent = post.content
            .split(/\n\s*\n/)
            .map(p => {
                const clean = p.trim();
                if (!clean) return '';
                const inlineBreaks = clean.replace(/\n/g, '<br>');
                return `<p>${inlineBreaks}</p>`;
            })
            .join('');

        readerContent.innerHTML = `
            <img src="${post.image}" alt="${post.title}">
            <div class="meta">${post.date} • By ${post.author}</div>
            <h1>${post.title}</h1>
            <div class="story-body">
                ${formattedContent}
            </div>
            ${galleryHTML}
        `;
        readerOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop scrolling background
    }

    closeReader.onclick = () => {
        readerOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && readerOverlay.classList.contains('active')) {
            readerOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});
