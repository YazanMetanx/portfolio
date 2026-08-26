document.addEventListener('DOMContentLoaded', () => {

    // set current year in footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // typed text effect setup
    if (typeof Typed !== 'undefined') {
        new Typed('.typed-text', {
            strings: [
                'unterhaltsame Spiele.',
                'Apps, die den Alltag erleichtern.',
                'Software mit sauberem Code.',
            ],
            typeSpeed: 45,
            backSpeed: 25,
            backDelay: 2000,
            loop: true
        });
    }

    // mobile nav drawer
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const openIcon = document.getElementById('menu-open-icon');
    const closeIcon = document.getElementById('menu-close-icon');

    const toggleMobileMenu = () => {
        const isOpen = mobileMenu.classList.contains('opacity-100');
        openIcon.classList.toggle('hidden', !isOpen);
        closeIcon.classList.toggle('hidden', isOpen);

        if (isOpen) {
            mobileMenu.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
            mobileMenu.classList.add('opacity-0', '-translate-y-full', 'pointer-events-none');
        } else {
            mobileMenu.classList.remove('opacity-0', '-translate-y-full', 'pointer-events-none');
            mobileMenu.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
        }
    };

    mobileMenuBtn?.addEventListener('click', toggleMobileMenu);
    document.querySelectorAll('.mobile-nav-link').forEach(link => link.addEventListener('click', toggleMobileMenu));

    // sound mute state
    let isGloballyMuted = false;

    const createMuteToggleButton = (videoElement) => {
        const btn = document.createElement('button');

        btn.className = `
            absolute bottom-3 right-3 z-20
            bg-slate-950/80 hover:bg-slate-900
            text-slate-200
            border border-slate-700/80 hover:border-sky-500/50
            w-12 h-12 rounded-lg
            flex items-center justify-center
            backdrop-blur-md shadow-lg
            transition-all duration-200
        `;

        btn.setAttribute('aria-label', 'Toggle sound');
        btn.setAttribute('title', 'Toggle sound');

        const updateButtonState = () => {
            if (videoElement.muted) {
                btn.innerHTML = `
                    <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z">
                        </path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2">
                        </path>
                    </svg>
                `;
                btn.setAttribute('aria-label', 'Unmute video');
                btn.setAttribute('title', 'Unmute video');
            } else {
                btn.innerHTML = `
                    <svg class="w-4 h-4 text-sky-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.900a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z">
                        </path>
                    </svg>
                `;
                btn.setAttribute('aria-label', 'Mute video');
                btn.setAttribute('title', 'Mute video');
            }
        };

        updateButtonState();

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            videoElement.muted = !videoElement.muted;
            isGloballyMuted = videoElement.muted;
            updateButtonState();
        });

        return btn;
    };

    // lazyload preview videos in cards
    const lazyVideos = document.querySelectorAll('.project-trigger video');

    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;

            if (entry.isIntersecting) {
                if (video.dataset.loaded !== 'true') {
                    const source = video.querySelector('source');
                    if (source && source.dataset.src) {
                        source.src = source.dataset.src;
                        video.load();

                        video.addEventListener('loadeddata', () => {
                            video.classList.remove('opacity-0');
                            video.classList.add('opacity-100');
                        }, { once: true });
                    }
                    video.dataset.loaded = 'true';
                }
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        });
    }, {
        root: null,
        rootMargin: '150px',
        threshold: 0.2
    });

    lazyVideos.forEach(video => videoObserver.observe(video));

    // project details modal logic
    const modal = document.getElementById('project-modal');
    const modalMediaContainer = document.getElementById('modal-media-container');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalTechContainer = document.getElementById('modal-tech-container');
    const modalExtraContent = document.getElementById('modal-extra-content');
    const modalLink = document.getElementById('modal-link');
    const modalLinkWrapper = document.getElementById('modal-link-wrapper');
    const closeModalBtn = document.getElementById('modal-close-btn');

    const openModal = (trigger) => {
        const { title, videoSrc, description, tech, linkHref, linkText, aspect, features } = trigger.dataset;

        modalTitle.textContent = title;
        modalDescription.textContent = description;

        const hasValidLink = linkHref && linkHref !== '#' && linkHref.trim() !== '';

        if (hasValidLink) {
            modalLink.href = linkHref;
            modalLink.textContent = linkText || 'Öffnen';
            modalLink.style.display = 'inline-block';
            modalLink.classList.remove('hidden');
            if (modalLinkWrapper) {
                modalLinkWrapper.style.display = 'block';
                modalLinkWrapper.classList.remove('hidden');
            }
        } else {
            modalLink.href = '#';
            modalLink.textContent = '';
            modalLink.style.display = 'none';
            modalLink.classList.add('hidden');
            if (modalLinkWrapper) {
                modalLinkWrapper.style.display = 'none';
                modalLinkWrapper.classList.add('hidden');
            }
        }

        modalTechContainer.innerHTML = '';
        tech.split(',').forEach(tag => {
            const span = document.createElement('span');
            span.className = 'bg-slate-800/80 text-sky-400 border border-slate-700/60 px-2.5 py-1 rounded-md text-xs font-mono shadow-sm';
            span.textContent = tag.trim();
            modalTechContainer.appendChild(span);
        });

        const shouldBeMuted = isGloballyMuted;

        if (aspect === 'portrait') {
            modalMediaContainer.className = "bg-slate-950 flex justify-center items-center p-4 sm:p-6 w-full md:w-[320px] lg:w-[360px] flex-shrink-0 relative";
            modalMediaContainer.innerHTML = `
                <div class="relative w-full max-w-[200px] sm:max-w-[240px] md:max-w-none aspect-[9/16] rounded-xl overflow-hidden bg-black flex items-center justify-center border border-slate-800 shadow-2xl">
                    <video id="modal-active-video" class="w-full h-full object-cover opacity-0 transition-opacity duration-500" autoplay loop ${shouldBeMuted ? 'muted' : ''} playsinline>
                        <source src="${videoSrc}" type="video/mp4">
                    </video>
                </div>`;
        } else {
            modalMediaContainer.className = "bg-slate-950 flex justify-center items-center p-4 sm:p-6 w-full md:w-[480px] lg:w-[560px] flex-shrink-0 relative";
            modalMediaContainer.innerHTML = `
                <div class="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-black flex items-center justify-center border border-slate-800 shadow-2xl">
                    <video id="modal-active-video" class="w-full h-full object-cover opacity-0 transition-opacity duration-500" autoplay loop ${shouldBeMuted ? 'muted' : ''} playsinline>
                        <source src="${videoSrc}" type="video/mp4">
                    </video>
                </div>`;
        }

        const activeVid = document.getElementById('modal-active-video');
        if (activeVid) {
            activeVid.muted = shouldBeMuted;
            
            const muteButton = createMuteToggleButton(activeVid);
            modalMediaContainer.appendChild(muteButton);

            activeVid.addEventListener('loadeddata', () => {
                activeVid.classList.remove('opacity-0');
                activeVid.classList.add('opacity-100');
            });
        }

        if (features && modalExtraContent) {
            const parsedFeatures = JSON.parse(features);

            modalExtraContent.innerHTML = `
                <div class="space-y-4">
                    <p class="text-[10px] sm:text-xs font-mono text-slate-400 uppercase tracking-wider">// Key Features (Klicke zum Expandieren)</p>
                    <div class="space-y-2.5" id="features-accordion-container">
                        ${parsedFeatures.map((feat, index) => `
                            <div class="feature-accordion-item border rounded-xl overflow-hidden transition-all duration-300 ${index === 0 ? 'border-sky-500/40 bg-sky-500/5' : 'border-slate-800 bg-slate-950/60'}" data-clip="${feat.clip}">
                                <button class="feature-accordion-header w-full px-4 py-3 text-left flex justify-between items-center gap-3 transition-colors hover:bg-slate-900/60 focus:outline-none">
                                    <div class="flex items-center gap-2.5">
                                        <span class="w-1.5 h-1.5 rounded-full ${index === 0 ? 'bg-sky-400' : 'bg-slate-600'} feature-dot transition-colors"></span>
                                        <span class="text-xs sm:text-sm font-semibold text-slate-200">${feat.title}</span>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <span class="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">${feat.badge}</span>
                                        <svg class="w-4 h-4 text-slate-400 transform transition-transform duration-300 ${index === 0 ? 'rotate-180 text-sky-400' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </button>
                                <div class="feature-accordion-body accordion-body ${index === 0 ? 'accordion-open' : 'accordion-closed'}">
                                    <div class="overflow-hidden">
                                        <div class="p-4 pt-1 text-xs sm:text-sm text-slate-300 font-light leading-relaxed border-t border-slate-900/60">
                                            ${feat.desc}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;

            const accordionItems = modalExtraContent.querySelectorAll('.feature-accordion-item');

            accordionItems.forEach(item => {
                const header = item.querySelector('.feature-accordion-header');
                header.addEventListener('click', () => {
                    const isAlreadyOpen = item.classList.contains('border-sky-500/40');

                    accordionItems.forEach(otherItem => {
                        otherItem.classList.remove('border-sky-500/40', 'bg-sky-500/5');
                        otherItem.classList.add('border-slate-800', 'bg-slate-950/60');
                        
                        const body = otherItem.querySelector('.feature-accordion-body');
                        body.classList.remove('accordion-open');
                        body.classList.add('accordion-closed');
                        
                        otherItem.querySelector('svg').classList.remove('rotate-180', 'text-sky-400');
                        otherItem.querySelector('.feature-dot').classList.remove('bg-sky-400');
                        otherItem.querySelector('.feature-dot').classList.add('bg-slate-600');
                    });

                    if (!isAlreadyOpen) {
                        item.classList.add('border-sky-500/40', 'bg-sky-500/5');
                        item.classList.remove('border-slate-800', 'bg-slate-950/60');
                        
                        const body = item.querySelector('.feature-accordion-body');
                        body.classList.remove('accordion-closed');
                        body.classList.add('accordion-open');
                        
                        item.querySelector('svg').classList.add('rotate-180', 'text-sky-400');
                        item.querySelector('.feature-dot').classList.add('bg-sky-400');
                        item.querySelector('.feature-dot').classList.remove('bg-slate-600');

                        const videoPlayer = document.getElementById('modal-active-video');
                        const clipSrc = item.dataset.clip;
                        if (videoPlayer && clipSrc && !videoPlayer.src.endsWith(clipSrc)) {
                            videoPlayer.src = clipSrc;
                            videoPlayer.play().catch(() => {});
                        }
                    }
                });
            });

        } else if (modalExtraContent) {
            modalExtraContent.innerHTML = '';
        }

        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        modalMediaContainer.innerHTML = '';
        if (modalExtraContent) modalExtraContent.innerHTML = '';
        modalLink.href = '#';
        modalLink.textContent = '';
        modalLink.style.display = 'none';
        modalLink.classList.add('hidden');
        if (modalLinkWrapper) {
            modalLinkWrapper.style.display = 'none';
            modalLinkWrapper.classList.add('hidden');
        }
    };

    document.querySelectorAll('.project-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => openModal(trigger));
    });

    closeModalBtn?.addEventListener('click', closeModal);
    modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

    // interactive terminal drawer
    const terminalDrawer = document.getElementById('terminal-drawer');
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    const terminalCloseBtn = document.getElementById('terminal-close-btn');
    const toggleBtns = [
        document.getElementById('terminal-toggle-btn'),
        document.getElementById('terminal-toggle-btn-mobile')
    ];

    const toggleTerminal = () => {
        const isHidden = terminalDrawer.classList.contains('hidden');
        if (isHidden) {
            terminalDrawer.classList.remove('hidden');
            setTimeout(() => {
                terminalDrawer.classList.remove('-translate-y-[150%]', 'opacity-0');
                terminalInput.focus();
            }, 10);
        } else {
            terminalDrawer.classList.add('-translate-y-[150%]', 'opacity-0');
            setTimeout(() => terminalDrawer.classList.add('hidden'), 300);
        }
    };

    toggleBtns.forEach(btn => btn?.addEventListener('click', toggleTerminal));
    terminalCloseBtn?.addEventListener('click', toggleTerminal);

    const commands = {
        'help': 'Befehle: <span class="text-amber-400">skills</span>, <span class="text-amber-400">projects</span>, <span class="text-amber-400">contact</span>, <span class="text-amber-400">clear</span>',
        'skills': 'Navigiere zu Skills...',
        'projects': 'Navigiere zu Portfolio-Projekten...',
        'contact': 'Navigiere zu Kontakt...',
    };

    terminalInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const val = terminalInput.value.trim().toLowerCase();
            const p = document.createElement('p');
            p.innerHTML = `<span class="text-sky-400">$ ${val}</span>`;
            terminalOutput.appendChild(p);

            const responseP = document.createElement('p');

            if (val === 'clear') {
                terminalOutput.innerHTML = '';
            } else if (commands[val]) {
                responseP.innerHTML = commands[val];
                terminalOutput.appendChild(responseP);

                if (val === 'skills') {
                    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                } else if (val === 'projects') {
                    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                } else if (val === 'contact') {
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }
            } else if (val !== '') {
                responseP.innerHTML = `<span class="text-rose-400">Befehl '${val}' unbekannt. Tippe 'help' für Befehle.</span>`;
                terminalOutput.appendChild(responseP);
            }

            terminalInput.value = '';
            const terminalBody = document.getElementById('terminal-body');
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    });

    // 3d avatar mouse verfolgung
    const viewer = document.getElementById('avatarViewer');

    if (viewer) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;

        function updateAvatarOrbit() {
            const rect = viewer.getBoundingClientRect();
            const viewerCenterX = rect.left + rect.width / 2;
            const viewerCenterY = rect.top + rect.height / 2;

            const x = (mouseX - viewerCenterX) / (window.innerWidth / 2);
            const y = (mouseY - viewerCenterY) / (window.innerHeight / 2);

            const clampedX = Math.max(-1, Math.min(1, x));
            const clampedY = Math.max(-1, Math.min(1, y));

            const orbitX = clampedX * -20;
            const orbitY = 75 + (clampedY * -15);

            viewer.cameraOrbit = `${orbitX}deg ${orbitY}deg 55%`;
        }

        document.addEventListener('pointermove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            updateAvatarOrbit();
        });

        window.addEventListener('scroll', updateAvatarOrbit, { passive: true });
    }

});