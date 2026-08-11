document.addEventListener('DOMContentLoaded', () => {

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // --- BASE & BACKEND API SETUP ---
    const BASE_URL = window.location.origin;
    let currentUser = JSON.parse(localStorage.getItem('user') || 'null');
    let currentToken = localStorage.getItem('token') || null;

    // Toast helper
    function showToast(message, isError = false) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            z-index: 99999;
            background: ${isError ? '#ef4444' : '#ea580c'};
            color: #ffffff;
            padding: 0.8rem 1.4rem;
            border-radius: 12px;
            font-weight: 700;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
            font-family: 'Space Grotesk', sans-serif;
            transition: all 0.3s ease;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    // API fetch helper
    async function apiFetch(endpoint, options = {}) {
        const headers = { 'Content-Type': 'application/json', ...options.headers };
        if (currentToken) headers['Authorization'] = `Bearer ${currentToken}`;
        if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
            options.body = JSON.stringify(options.body);
        }
        try {
            const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
            if (res.status === 401) {
                logout();
            }
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || data.message || 'API Error');
            return data;
        } catch (err) {
            throw err;
        }
    }

    // --- DATA & TASKS ---
    const initialRequests = [
        { id: 1, category: 'Notes Writing', title: 'Advanced Calculus', pages: 15, budget: 75, status: 'Rate Fixed', postedBy: 'Alex009. • Mango', link: '#', color: 'blue', canDelete: false },
        { id: 2, category: 'Assignment', title: 'History Essay', pages: 4, budget: 40, status: 'Rate Fixed', postedBy: 'Sonali013. • Sakchi', link: '#', color: 'green', canDelete: false },
        { id: 3, category: 'Lab Manual', title: 'Physics Lab 101', pages: 'N/A', budget: 30, status: 'Acquire', postedBy: 'Aman999. • Mango', link: '#', color: 'purple', canDelete: false },
        { id: 4, category: 'Project', title: 'Web Dev Portfolio', pages: 'N/A', budget: 150, status: 'Rate Fixed', postedBy: 'Rohit69. • Dimna ', link: '#', color: 'orange', canDelete: false },
        { id: 5, category: 'Notes Writing', title: 'Organic Chemistry', pages: 10, budget: 60, status: 'Acquire', postedBy: 'Neha_22. • Sakchi', link: '#', color: 'blue', canDelete: false },
    ];

    let allRequests = JSON.parse(localStorage.getItem('notex_requests')) || initialRequests;
    let selectedCategoryFilter = null;

    const saveToLocalStorage = () => {
        localStorage.setItem('notex_requests', JSON.stringify(allRequests));
    };

    const fetchTasksFromBackend = async () => {
        try {
            const res = await apiFetch('/api/tasks');
            if (Array.isArray(res) && res.length > 0) {
                const apiTasks = res.map(t => ({
                    id: t.id,
                    category: t.category || 'Assignment',
                    title: t.title,
                    pages: 'N/A',
                    budget: Math.floor(t.budget),
                    status: t.status === 'open' ? 'Acquire' : 'In Progress',
                    postedBy: t.client ? `${t.client.firstName} • Student` : 'Student',
                    color: t.category?.toLowerCase().includes('note') ? 'blue' : t.category?.toLowerCase().includes('assign') ? 'green' : 'purple',
                    canDelete: false
                }));
                const localPosts = JSON.parse(localStorage.getItem('notex_requests')) || [];
                allRequests = [...localPosts, ...apiTasks];
            }
        } catch (e) {
            console.log('Using local cached requests');
        }
    };

    const requestsGrid = document.getElementById('requests-grid');
    const filterTitle = document.getElementById('filter-title');
    const clearFilterBtn = document.getElementById('clear-filter-btn');

    const getIconSvg = (category, color) => {
        let pathData = '';
        switch (category) {
            case 'Notes Writing':
                pathData = `<path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.586 7.586"/><circle cx="11" cy="11" r="2"/>`;
                break;
            case 'Assignment':
                pathData = `<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>`;
                break;
            case 'Lab Manual':
                pathData = `<path d="M10 2v7.527a2 2 0 0 1 .211.896v2.667a2 2 0 0 1-.586 1.414L5 19"/><path d="M14 2v7.527a2 2 0 0 1-.211.896v2.667a2 2 0 0 1 .586 1.414L19 19"/><path d="M8.5 2h7"/><path d="M14 21h-4"/><path d="M5 19h14"/>`;
                break;
            case 'Project':
                pathData = `<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>`;
                break;
            default: pathData = `<circle cx="12" cy="12" r="10"/>`;
        }
        return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6 request-icon ${color}">${pathData}</svg>`;
    };

    const createRequestCard = (request) => {
        const iconHtml = getIconSvg(request.category, request.color);
        const deleteBtnHtml = request.canDelete ? `<button class="btn-delete" onclick="deleteRequest('${request.id}')">Delete</button>` : '';

        return `
            <div class="request-card" id="card-${request.id}">
                <div>
                    <div class="card-header">
                        <div class="header-left">${iconHtml} <span class="text-xs font-medium text-muted-foreground">${request.category}</span></div>
                    </div>
                    <h3 class="text-xl font-bold mb-1" style="line-height:22px;">${request.title}</h3>
                    <div class="card-details">
                        <p class="text-sm text-muted-foreground">Pages: ${request.pages}</p>
                        <p class="text-sm text-muted-foreground">Posted by ${request.postedBy}</p>
                    </div>
                </div>
                <div class="price-group">
                    <span class="request-price">₹${request.budget}</span>
                </div>
                <hr>   
                <div class="request-footer">
                    ${deleteBtnHtml}
                    <div class="action-group">
                        <button class="btn btn-text-link request-link" onclick="acquireItem('${request.id}')">View Details</button>
                        <button class="btn btn-primaryy btn-sm" onclick="acquireItem('${request.id}')">Acquire It</button>
                    </div>
                </div>
            </div>`;
    };

    const renderRequests = (categoryFilter = null) => {
        selectedCategoryFilter = categoryFilter;
        if (!requestsGrid) return;
        requestsGrid.innerHTML = '';
        const filtered = categoryFilter
            ? allRequests.filter(req => req.category.toLowerCase().includes(categoryFilter.toLowerCase().split(' ')[0]))
            : allRequests;

        if (!filtered.length) {
            requestsGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #64748b; font-weight: 600;">No requests available in this category.</div>`;
        } else {
            filtered.forEach(request => { requestsGrid.innerHTML += createRequestCard(request); });
        }

        if (categoryFilter) {
            if (filterTitle) filterTitle.textContent = `${categoryFilter} Requests`;
            if (clearFilterBtn) clearFilterBtn.classList.remove('hidden');
        } else {
            if (filterTitle) filterTitle.textContent = 'Active Requests Near You';
            if (clearFilterBtn) clearFilterBtn.classList.add('hidden');
        }
    };

    window.deleteRequest = (id) => {
        if (confirm('Are you sure you want to delete this request?')) {
            allRequests = allRequests.filter(req => String(req.id) !== String(id));
            saveToLocalStorage();
            renderRequests(selectedCategoryFilter);
            showToast('Request deleted');
        }
    };

    window.acquireItem = (id) => {
        if (!currentUser) {
            showToast('Please log in to acquire requests');
            document.getElementById('login-btn')?.click();
            return;
        }
        showToast('Request acquired successfully!');
    };

    // --- MODALS & GSAP ---
    const requestModal = document.getElementById('request-modal');
    const authModal = document.getElementById('auth-modal');

    let requestModalTL, authModalTL;

    if (typeof gsap !== 'undefined') {
        requestModalTL = gsap.timeline({ paused: true, defaults: { duration: 0.3, ease: "power2.out" } });
        if (requestModal) requestModalTL.to(requestModal, { display: 'flex', opacity: 1, duration: 0.1 }).from("#request-modal .modal-content.large", { y: 20, opacity: 0 });

        authModalTL = gsap.timeline({ paused: true, defaults: { duration: 0.3, ease: "power2.out" } });
        if (authModal) authModalTL.to(authModal, { display: 'flex', opacity: 1, duration: 0.1 }).from("#auth-modal .modal-content.small", { y: 20, opacity: 0 });
    }

    const openModal = (modal, timeline) => {
        if (!modal) return;
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        if (timeline) timeline.play();
        else modal.style.display = 'flex';
    };

    const closeModal = (modal, timeline) => {
        if (!modal) return;
        if (timeline) {
            timeline.reverse().then(() => {
                modal.classList.add('hidden');
                document.body.style.overflow = '';
            });
        } else {
            modal.classList.add('hidden');
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    };

    [requestModal, authModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    if (modal === requestModal) closeModal(requestModal, requestModalTL);
                    else closeModal(authModal, authModalTL);
                }
            });
        }
    });

    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            if (requestModal && !requestModal.classList.contains('hidden')) closeModal(requestModal, requestModalTL);
            if (authModal && !authModal.classList.contains('hidden')) closeModal(authModal, authModalTL);
        });
    });

    // AUTH TABS
    document.getElementById('login-btn')?.addEventListener('click', () => {
        document.querySelector('.auth-tab[data-target="login-form"]')?.click();
        openModal(authModal, authModalTL);
    });

    document.getElementById('signup-btn')?.addEventListener('click', () => {
        document.querySelector('.auth-tab[data-target="signup-form"]')?.click();
        openModal(authModal, authModalTL);
    });

    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');

    authTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            const targetFormId = e.currentTarget.getAttribute('data-target');
            authTabs.forEach(t => t.setAttribute('data-state', 'inactive'));
            e.currentTarget.setAttribute('data-state', 'active');
            authForms.forEach(form => {
                if (form.id === targetFormId) form.classList.remove('hidden');
                else form.classList.add('hidden');
            });
        });
    });

    // BACKEND LOGIN SUBMIT
    const loginForm = document.getElementById('login-form');
    loginForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email-input').value;
        const password = document.getElementById('login-pass-input').value;

        try {
            const res = await apiFetch('/api/auth/login', {
                method: 'POST',
                body: { email, password }
            });
            currentToken = res.access_token;
            currentUser = res.user;
            localStorage.setItem('token', currentToken);
            localStorage.setItem('user', JSON.stringify(currentUser));
            showToast(`Welcome back, ${currentUser.firstName}!`);
            closeModal(authModal, authModalTL);
            updateUserNav();
        } catch (err) {
            showToast(err.message || 'Login failed', true);
        }
    });

    // BACKEND SIGNUP SUBMIT
    const signupForm = document.getElementById('signup-form');
    signupForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const firstName = document.getElementById('signup-first-input').value;
        const lastName = document.getElementById('signup-last-input').value;
        const email = document.getElementById('signup-email-input').value;
        const password = document.getElementById('signup-pass-input').value;

        try {
            const res = await apiFetch('/api/auth/register', {
                method: 'POST',
                body: { firstName, lastName, email, password, role: 'client' }
            });
            currentToken = res.access_token;
            currentUser = res.user;
            localStorage.setItem('token', currentToken);
            localStorage.setItem('user', JSON.stringify(currentUser));
            showToast('Account created successfully!');
            closeModal(authModal, authModalTL);
            updateUserNav();
        } catch (err) {
            showToast(err.message || 'Registration failed', true);
        }
    });

    function logout() {
        currentToken = null;
        currentUser = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        updateUserNav();
        showToast('Logged out');
    }

    function updateUserNav() {
        const navContainer = document.getElementById('nav-auth-container');
        if (currentUser && navContainer) {
            navContainer.innerHTML = `
                <span style="font-weight: 700; color: #ea580c; font-size: 0.95rem; font-family: 'Space Grotesk', sans-serif;">Hi, ${currentUser.firstName}</span>
                <button id="logout-btn" class="btn btn-secondary" style="padding: 0.4rem 0.9rem; font-size: 0.85rem;">Logout</button>
            `;
            document.getElementById('logout-btn')?.addEventListener('click', logout);
        } else if (navContainer) {
            navContainer.innerHTML = `
                <button id="login-btn" class="btn btn-secondary">Log In</button>
                <button id="signup-btn" class="btn btn-primary">Sign Up</button>
            `;
            document.getElementById('login-btn')?.addEventListener('click', () => {
                document.querySelector('.auth-tab[data-target="login-form"]')?.click();
                openModal(authModal, authModalTL);
            });
            document.getElementById('signup-btn')?.addEventListener('click', () => {
                document.querySelector('.auth-tab[data-target="signup-form"]')?.click();
                openModal(authModal, authModalTL);
            });
        }
    }

    updateUserNav();

    // BACKEND POST REQUEST SUBMIT
    const requestForm = document.getElementById('request-form');
    requestForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(requestForm);
        const pages = parseFloat(formData.get('pages')) || 0;
        const rate = parseFloat(formData.get('budget')) || 0;
        const totalBudget = pages > 0 ? (pages * rate) : rate;

        const categoryMap = {
            'notes': { name: 'Notes Writing', color: 'blue' },
            'assignment': { name: 'Assignment', color: 'green' },
            'lab': { name: 'Lab Manual', color: 'purple' },
            'project': { name: 'Project', color: 'orange' }
        };
        const config = categoryMap[formData.get('category')] || { name: 'Other', color: 'blue' };

        const title = formData.get('subject');
        const newEntry = {
            id: Date.now(),
            category: config.name,
            title: title,
            pages: pages || 'N/A',
            budget: totalBudget,
            status: 'Rate Fixed',
            postedBy: currentUser ? `${currentUser.firstName} • Just now` : 'You • Just now',
            link: '#',
            color: config.color,
            canDelete: true
        };

        try {
            await apiFetch('/api/tasks', {
                method: 'POST',
                body: { title, category: config.name, budget: totalBudget, description: formData.get('details') || '' }
            });
        } catch (err) {}

        allRequests.unshift(newEntry);
        saveToLocalStorage();
        renderRequests(selectedCategoryFilter);
        requestForm.reset();
        closeModal(requestModal, requestModalTL);
        showToast('Request posted successfully!');
    });

    document.getElementById('post-request-btn')?.addEventListener('click', () => {
        if (!currentUser) {
            showToast('Please log in to post a request');
            openModal(authModal, authModalTL);
            return;
        }
        openModal(requestModal, requestModalTL);
    });

    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => renderRequests(card.getAttribute('data-category')));
    });

    clearFilterBtn?.addEventListener('click', () => renderRequests(null));

    // GSAP Animations
    if (typeof gsap !== 'undefined') {
        gsap.from("#hero-title", { y: 20, opacity: 0, duration: 0.8, ease: "power2.out" });
        gsap.from("#hero-desc", { y: 20, opacity: 0, duration: 0.8, delay: 0.2, ease: "power2.out" });
    }

    // Initial load from backend API
    fetchTasksFromBackend().then(() => {
        renderRequests();
    });
});
