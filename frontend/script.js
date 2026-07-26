// Restored frontend script: modal handling, premium request rendering, and GSAP hooks
document.addEventListener('DOMContentLoaded', () => {
    const gsap = window.gsap;

    // Sample requests (fallback) and localStorage persistence
    const seed = [
        { id: 1, category: 'Notes Writing', title: 'Advanced Calculus', pages: 15, budget: 75, postedBy: 'Alex009 • Mango' },
        { id: 2, category: 'Assignment', title: 'History Essay', pages: 4, budget: 40, postedBy: 'Sonali013 • Sakchi' },
        { id: 3, category: 'Lab Manual', title: 'Physics Lab 101', pages: 'N/A', budget: 30, postedBy: 'Aman999 • Mango' },
        { id: 4, category: 'Project', title: 'Web Dev Portfolio', pages: 'N/A', budget: 150, postedBy: 'Rohit69 • Dimna' },
        { id: 5, category: 'Notes Writing', title: 'Organic Chemistry', pages: 10, budget: 60, postedBy: 'Neha_22 • Sakchi' }
    ];

    let requests = JSON.parse(localStorage.getItem('notex_requests')) || seed;
    const save = () => localStorage.setItem('notex_requests', JSON.stringify(requests));

    const requestsGrid = document.getElementById('requests-grid');
    const filterTitle = document.getElementById('filter-title');
    const clearFilterBtn = document.getElementById('clear-filter-btn');

    function renderRequests(filter = null) {
        if (!requestsGrid) return;
        requestsGrid.innerHTML = '';
        const list = filter
            ? requests.filter(r => r.category.toLowerCase().includes(filter.toLowerCase()))
            : requests;

        if (list.length === 0) {
            requestsGrid.innerHTML = `
                <div class="browse-empty" style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
                    <div style="font-size: 3.5rem; margin-bottom: 0.5rem;">🎓</div>
                    <h3 style="font-size: 1.3rem; font-weight: 700; color: #1c1917; margin-bottom: 0.25rem;">No results found</h3>
                    <p style="font-size: 0.9rem; color: #6b7280;">Try choosing a different category or post a new request.</p>
                </div>
            `;
            return;
        }

        list.forEach(r => {
            const el = document.createElement('div');

            // Map category to a class color and standard names
            let catClass = 'cat-other';
            let catIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>`;

            const lowerCat = (r.category || '').toLowerCase();
            if (lowerCat.includes('note')) {
                catClass = 'cat-notes';
                catIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>`;
            } else if (lowerCat.includes('assign')) {
                catClass = 'cat-assignment';
                catIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`;
            } else if (lowerCat.includes('lab') || lowerCat.includes('manual')) {
                catClass = 'cat-lab';
                catIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v7.527a2 2 0 0 1 .211.896v2.667a2 2 0 0 1-.586 1.414L5 19"/><path d="M14 2v7.527a2 2 0 0 1-.211.896v2.667a2 2 0 0 1 .586 1.414L19 19"/><path d="M8.5 2h7"/><path d="M14 21h-4"/><path d="M5 19h14"/></svg>`;
            } else if (lowerCat.includes('project')) {
                catClass = 'cat-project';
                catIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>`;
            }

            el.className = `tc-card ${catClass}`;
            el.id = `card-${r.id}`;

            const postedParts = (r.postedBy || '').split('•');
            const posterName = postedParts[0] ? postedParts[0].trim() : 'Anonymous';
            const collegeName = postedParts[1] ? postedParts[1].trim() : '';
            const isSelf = posterName.toLowerCase() === 'you';

            el.innerHTML = `
                <div class="tc-top">
                    <span class="tc-badge ${catClass}">
                        ${catIcon}
                        ${r.category}
                    </span>
                    <span class="tc-price">₹${Math.floor(r.budget)}</span>
                </div>
                <h3 class="tc-title">${r.title}</h3>
                <div class="tc-meta">
                    <span class="tc-meta-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                        Pages: ${r.pages || 'N/A'}
                    </span>
                    <span class="tc-meta-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        Deadline: ${r.deadline || '15 Jun 2026'}
                    </span>
                </div>
                <div class="tc-poster">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    <span>Posted by ${posterName}</span>
                    ${collegeName ? `<span class="tc-dot">•</span><span class="tc-college">${collegeName}</span>` : ''}
                    <span class="tc-dot">•</span>
                    <span class="tc-time">${isSelf ? 'Just now' : '1d ago'}</span>
                </div>
                <hr class="tc-hr" />
                <div class="tc-footer" style="margin-left: 0; display: flex; justify-content: flex-end; align-items: center; width: 100%;">
                    ${isSelf ? `<button class="btn-delete" data-id="${r.id}" style="position: relative; margin-left: 0; margin-right: auto; padding: 6px 12px; height: auto;">Delete</button>` : ''}
                    <button class="tc-link" data-id="${r.id}">View Details</button>
                    <button class="tc-acquire-btn">Acquire It</button>
                </div>
            `;
            requestsGrid.appendChild(el);
        });

        if (filter) {
            filterTitle.textContent = `${filter} Requests`;
            clearFilterBtn.classList.remove('hidden');
        } else {
            filterTitle.textContent = 'Active Requests Near You';
            clearFilterBtn.classList.add('hidden');
        }
    }

    // Modal helpers (use GSAP if available for nice open/close)
    const requestModal = document.getElementById('request-modal');
    const authModal = document.getElementById('auth-modal');
    let requestTl = null;
    let authTl = null;
    if (gsap) {
        try { gsap.registerPlugin(window.ScrollTrigger); } catch (e) { }
        requestTl = gsap.timeline({ paused: true }).to(requestModal, { display: 'flex', opacity: 1, duration: 0.12 }).from('.modal-content.large', { y: 20, opacity: 0 });
        authTl = gsap.timeline({ paused: true }).to(authModal, { display: 'flex', opacity: 1, duration: 0.12 }).from('.modal-content.small', { y: 20, opacity: 0 });
    }

    const openModal = (el, tl) => {
        if (!el) return;
        el.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        if (tl) tl.play();
    };
    const closeModal = (el, tl) => {
        if (!el) return;
        if (tl) {
            tl.reverse().then(() => { el.classList.add('hidden'); document.body.style.overflow = ''; });
        } else {
            el.classList.add('hidden'); document.body.style.overflow = '';
        }
    };

    // Click outside to close
    [requestModal, authModal].forEach(m => {
        if (!m) return;
        m.addEventListener('click', e => {
            if (e.target === m) {
                if (m === requestModal) closeModal(requestModal, requestTl);
                else closeModal(authModal, authTl);
            }
        });
    });

    // Close buttons
    document.querySelectorAll('.close-modal').forEach(btn => btn.addEventListener('click', () => { closeModal(requestModal, requestTl); closeModal(authModal, authTl); }));

    // Login / Signup buttons
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    if (loginBtn) loginBtn.addEventListener('click', () => { const tab = document.querySelector('.auth-tab[data-target="login-form"]'); tab && tab.click(); openModal(authModal, authTl); });
    if (signupBtn) signupBtn.addEventListener('click', () => { const tab = document.querySelector('.auth-tab[data-target="signup-form"]'); tab && tab.click(); openModal(authModal, authTl); });

    // Post request button
    const postBtn = document.getElementById('post-request-btn');
    if (postBtn) postBtn.addEventListener('click', () => openModal(requestModal, requestTl));

    // Auth tab switching
    document.querySelectorAll('.auth-tab').forEach(tab => tab.addEventListener('click', (e) => {
        const target = e.currentTarget.getAttribute('data-target');
        document.querySelectorAll('.auth-tab').forEach(t => t.setAttribute('data-state', 'inactive'));
        e.currentTarget.setAttribute('data-state', 'active');
        document.querySelectorAll('.auth-form').forEach(f => f.id === target ? f.classList.remove('hidden') : f.classList.add('hidden'));
    }));

    // Category card filters
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const isAlreadyActive = card.classList.contains('active');
            document.querySelectorAll('.category-card').forEach(c => c.classList.remove('active'));
            if (isAlreadyActive) {
                renderRequests(null);
            } else {
                card.classList.add('active');
                const cat = card.getAttribute('data-category');
                renderRequests(cat);
            }
        });
    });

    if (clearFilterBtn) {
        clearFilterBtn.addEventListener('click', () => {
            document.querySelectorAll('.category-card').forEach(c => c.classList.remove('active'));
            renderRequests(null);
        });
    }

    // Grid Event Delegation for Delete and Details
    if (requestsGrid) {
        requestsGrid.addEventListener('click', (e) => {
            const deleteBtn = e.target.closest('.btn-delete');
            if (deleteBtn) {
                const id = parseInt(deleteBtn.getAttribute('data-id'));
                requests = requests.filter(r => r.id !== id);
                save();
                const activeCard = document.querySelector('.category-card.active');
                const cat = activeCard ? activeCard.getAttribute('data-category') : null;
                renderRequests(cat);
                return;
            }

            const detailsBtn = e.target.closest('.tc-link');
            if (detailsBtn) {
                const id = parseInt(detailsBtn.getAttribute('data-id'));
                const item = requests.find(r => r.id === id);
                if (item) {
                    alert(`Request Title: ${item.title}\nCategory: ${item.category}\nBudget: ₹${item.budget}\nPages: ${item.pages}\nPosted By: ${item.postedBy}`);
                }
            }
        });
    }

    // Request form submit (add to list)
    const requestForm = document.getElementById('request-form');
    if (requestForm) {
        requestForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const form = new FormData(requestForm);

            // Map form value to category display name
            const formCategory = form.get('category') || 'other';
            let catName = 'Other';
            if (formCategory === 'notes') catName = 'Notes Writing';
            else if (formCategory === 'assignment') catName = 'Assignment';
            else if (formCategory === 'lab') catName = 'Lab Manual';
            else if (formCategory === 'project') catName = 'Project';

            const subject = form.get('subject') || 'Untitled Subject';
            const pages = form.get('pages') || 'N/A';
            const budget = form.get('budget') || 0;
            const item = {
                id: Date.now(),
                category: catName,
                title: subject,
                pages: pages,
                budget: budget,
                postedBy: 'You • Just now'
            };
            requests.unshift(item);
            save();

            // Remove active category card highlights
            document.querySelectorAll('.category-card').forEach(c => c.classList.remove('active'));

            renderRequests(null);
            closeModal(requestModal, requestTl);
            requestForm.reset();
        });
    }

    // GSAP hero animations
    renderRequests(null);
    if (gsap) {
        try {
            gsap.from('.hero-title', { y: 20, opacity: 0, duration: 0.8, ease: 'power2.out' });
            gsap.from('.hero-description', { y: 20, opacity: 0, duration: 0.8, delay: 0.2, ease: 'power2.out' });
            gsap.from('.hero-actions', { y: 20, opacity: 0, duration: 0.8, delay: 0.4, ease: 'power2.out' });
        } catch (e) { }
    }
});
