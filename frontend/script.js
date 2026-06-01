document.addEventListener('DOMContentLoaded', () => {


    gsap.registerPlugin(ScrollTrigger);

    // ---DATA ---
    const initialRequests = [
        { id: 1, category: 'Notes Writing', title: 'Advanced Calculus', pages: 15, budget: 75, status: 'Rate Fixed', postedBy: 'Alex009. • Mango', link: '#', color: 'blue', canDelete: false },
        { id: 2, category: 'Assignment', title: 'History Essay', pages: 4, budget: 40, status: 'Rate Fixed', postedBy: 'Sonali013. • Sakchi', link: '#', color: 'green', canDelete: false },
        { id: 3, category: 'Lab Manual', title: 'Physics Lab 101', pages: 'N/A', budget: 30, status: 'Acquire', postedBy: 'Aman999. • Mango', link: '#', color: 'purple', canDelete: false },
        { id: 4, category: 'Project', title: 'Web Dev Portfolio', pages: 'N/A', budget: 150, status: 'Rate Fixed', postedBy: 'Rohit69. • Dimna ', link: '#', color: 'orange', canDelete: false },
        { id: 5, category: 'Notes Writing', title: 'Organic Chemistry', pages: 10, budget: 60, status: 'Acquire', postedBy: 'Neha_22. • Sakchi', link: '#', color: 'blue', canDelete: false },

    ];

    let allRequests = JSON.parse(localStorage.getItem('notex_requests')) || initialRequests;

    const saveToLocalStorage = () => {
        localStorage.setItem('notex_requests', JSON.stringify(allRequests));
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

    // request card

    const createRequestCard = (request) => {
        const iconHtml = getIconSvg(request.category, request.color);

        const deleteBtnHtml = request.canDelete ? `<button class="btn-delete" onclick="deleteRequest(${request.id})">Delete</button>` : '';

        return `
            <div class="request-card" id="card-${request.id}">
                <div>
                    <div class="card-header">
                        <div class="header-left">${iconHtml} <span class="text-xs font-medium text-muted-foreground">${request.category}</span></div>
                        
                    </div>
                    <h3 class="text-xl font-bold mb-1" style="line-height:10px;">${request.title}</h3>
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
                        <button class="btn btn-text-link request-link">View Details</button>
                        <button class="btn btn-primaryy btn-sm">Acquire It</button>
                        
                    </div>
                </div>
            </div>`;
    };


    // filter 

    const renderRequests = (categoryFilter = null) => {
        if (!requestsGrid) return;
        requestsGrid.innerHTML = '';
        const filtered = categoryFilter
            ? allRequests.filter(req => req.category.toLowerCase().includes(categoryFilter.toLowerCase().split(' ')[0]))
            : allRequests;
        filtered.forEach(request => { requestsGrid.innerHTML += createRequestCard(request); });

        if (categoryFilter) {
            filterTitle.textContent = `${categoryFilter} Requests`;
            clearFilterBtn.classList.remove('hidden');

        } else {
            filterTitle.textContent = 'Active Requests Near You';
            clearFilterBtn.classList.add('hidden');
        }
    };

    // --- DELETE FUNCTION ---
    window.deleteRequest = (id) => {
        if (confirm('Are you sure you want to delete this request?')) {
            allRequests = allRequests.filter(req => req.id !== id);
            saveToLocalStorage();
            renderRequests();
        }
    };

    // --- login  ---
    const requestModal = document.getElementById('request-modal');
    const authModal = document.getElementById('auth-modal');

    const requestModalTL = gsap.timeline({ paused: true, defaults: { duration: 0.3, ease: "power2.out" } });
    requestModalTL.to(requestModal, { display: 'flex', opacity: 1, duration: 0.1 }).from(".modal-content.large", { y: 20, opacity: 0 });

    const authModalTL = gsap.timeline({ paused: true, defaults: { duration: 0.3, ease: "power2.out" } });
    authModalTL.to(authModal, { display: 'flex', opacity: 1, duration: 0.1 }).from(".modal-content.small", { y: 20, opacity: 0 });

    const openModal = (modal, timeline) => {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        timeline.play();
    };

    const closeModal = (modal, timeline) => {
        timeline.reverse().then(() => {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        });
    };

    // Click Closing 
    [requestModal, authModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                if (modal === requestModal) closeModal(requestModal, requestModalTL);
                else closeModal(authModal, authModalTL);
            }
        });
    });

    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            if (!requestModal.classList.contains('hidden')) closeModal(requestModal, requestModalTL);
            if (!authModal.classList.contains('hidden')) closeModal(authModal, authModalTL);
        });
    });

    // --- AUTH 
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
                form.id === targetFormId ? form.classList.remove('hidden') : form.classList.add('hidden');
            });
        });
    });


    // --- FORM SUBMISSION --
    const requestForm = document.getElementById('request-form');
    requestForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(requestForm);
        const pages = parseFloat(formData.get('pages')) || 0;
        const rate = parseFloat(formData.get('budget')) || 0;
        const totalBudget = pages > 0 ? (pages * rate) : rate;

        const categoryMap = { 'notes': { name: 'Notes Writing', color: 'blue' }, 'assignment': { name: 'Assignment', color: 'green' }, 'lab': { name: 'Lab Manual', color: 'purple' }, 'project': { name: 'Project', color: 'orange' } };
        const config = categoryMap[formData.get('category')] || { name: 'Other', color: 'blue' };

        const newEntry = {
            id: Date.now(),
            category: config.name,
            title: formData.get('subject'),
            pages: pages || 'N/A',
            budget: totalBudget,
            status: 'Rate Fixed',
            postedBy: 'You • Just now',
            link: '#',
            color: config.color,
            canDelete: true // Allow deleting items you just posted
        };

        allRequests.unshift(newEntry);
        saveToLocalStorage();
        renderRequests();
        requestForm.reset();
        closeModal(requestModal, requestModalTL);
    });


    document.getElementById('post-request-btn')?.addEventListener('click', () => openModal(requestModal, requestModalTL));
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => renderRequests(card.getAttribute('data-category')));
    });
    clearFilterBtn?.addEventListener('click', () => renderRequests(null));

    gsap.from(".hero-title", { y: 20, opacity: 0, duration: 0.8, ease: "power2.out" });
    gsap.from(".hero-description", { y: 20, opacity: 0, duration: 0.8, delay: 0.2, ease: "power2.out" });

    renderRequests();


});

// var filter = document.querySelector('.category-grid')

// filter.addEventListener('click',function(){
//     filter.style.color ="#df5d01"
// })










