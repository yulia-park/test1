/**
 * 운세마루 - 컴포넌트 모듈 (components.js)
 * 
 * 역할:
 * - 재사용 가능한 UI 컴포넌트 정의
 * - Header, Footer, Navigation 등 공통 요소 관리
 * - 컴포넌트 렌더링 및 이벤트 바인딩
 */

// =====================================================
// 컴포넌트 네임스페이스
// =====================================================
const Components = window.Components || {};

// =====================================================
// 메뉴 데이터 (중앙 관리)
// =====================================================
Components.menuData = [
    {
        id: 'today-fortune',
        label: '오늘의 운세',
        icon: 'fas fa-sun',
        description: '생년월일로 보는 오늘의 운세'
    },
    {
        id: 'zodiac',
        label: '띠별 운세',
        icon: 'fas fa-dragon',
        description: '12지신으로 보는 운세'
    },
    {
        id: 'horoscope',
        label: '별자리 운세',
        icon: 'fas fa-star',
        description: '12별자리로 보는 운세'
    },
    {
        id: 'tarot',
        label: '타로',
        icon: 'fas fa-cards',
        description: '카드가 전하는 메시지'
    },
    {
        id: 'mbti',
        label: 'MBTI 운세',
        icon: 'fas fa-brain',
        description: '성격 유형별 운세'
    },
    {
        id: 'dream',
        label: '꿈해몽',
        icon: 'fas fa-cloud-moon',
        description: '꿈이 전하는 의미'
    }
];

// =====================================================
// Header 컴포넌트
// =====================================================
Components.Header = {
    /**
     * 헤더 HTML 생성
     * @returns {string} - HTML 문자열
     */
    render() {
        const navItems = Components.menuData.map(item => `
            <li>
                <a href="#" data-section="${item.id}" class="nav-link">
                    <i class="${item.icon}" aria-hidden="true"></i>
                    <span>${item.label}</span>
                </a>
            </li>
        `).join('');

        return `
            <div class="container">
                <div class="header-inner">
                    <h1 class="logo">
                        <a href="#" data-section="home" aria-label="운세마루 홈으로 이동">
                            <i class="fas fa-moon" aria-hidden="true"></i>
                            <span>운세마루</span>
                        </a>
                    </h1>
                    
                    <button class="mobile-menu-btn" aria-label="메뉴 열기" aria-expanded="false">
                        <span class="hamburger"></span>
                    </button>
                    
                    <nav class="main-nav" role="navigation" aria-label="주 메뉴">
                        <ul class="nav-list">
                            ${navItems}
                        </ul>
                    </nav>
                </div>
            </div>
        `;
    },

    /**
     * 헤더 마운트 (DOM에 삽입)
     * @param {string} selector - 마운트할 요소 선택자
     */
    mount(selector) {
        const container = document.querySelector(selector);
        if (container) {
            container.innerHTML = this.render();
            this.bindEvents(container);
        }
    },

    /**
     * 이벤트 바인딩
     * @param {Element} container - 컨테이너 요소
     */
    bindEvents(container) {
        // 모바일 메뉴 토글
        const menuBtn = container.querySelector('.mobile-menu-btn');
        const nav = container.querySelector('.main-nav');

        if (menuBtn && nav) {
            menuBtn.addEventListener('click', () => {
                const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
                menuBtn.setAttribute('aria-expanded', !isExpanded);
                nav.classList.toggle('active');
                document.body.classList.toggle('menu-open');
            });
        }

        // 네비게이션 링크 클릭
        container.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (menuBtn) {
                    menuBtn.setAttribute('aria-expanded', 'false');
                }
                if (nav) {
                    nav.classList.remove('active');
                }
                document.body.classList.remove('menu-open');
            });
        });

        // 스크롤 시 헤더 스타일
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                container.classList.add('scrolled');
            } else {
                container.classList.remove('scrolled');
            }
        });
    },

    /**
     * 활성 메뉴 업데이트
     * @param {string} sectionId - 활성화할 섹션 ID
     */
    setActiveMenu(sectionId) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === sectionId) {
                link.classList.add('active');
            }
        });
    }
};

// =====================================================
// Footer 컴포넌트
// =====================================================
Components.Footer = {
    /**
     * 푸터 HTML 생성
     * @returns {string} - HTML 문자열
     */
    render() {
        const currentYear = new Date().getFullYear();
        
        const navLinks = [
            { id: 'home', label: '홈' },
            ...Components.menuData.map(item => ({
                id: item.id,
                label: item.label
            }))
        ];

        const navHtml = navLinks.map(link => `
            <a href="#" data-section="${link.id}">${link.label}</a>
        `).join('');

        return `
            <div class="container">
                <div class="footer-content">
                    <div class="footer-logo">
                        <i class="fas fa-moon"></i>
                        <span>운세마루</span>
                    </div>
                    
                    <nav class="footer-nav" aria-label="푸터 메뉴">
                        ${navHtml}
                    </nav>
                    
                    <div class="footer-disclaimer">
                        <p><strong>안내:</strong> 본 서비스는 오락 및 참고용이며, 의료·법률·재정적 판단의 근거로 사용할 수 없습니다.</p>
                    </div>
                    
                    <div class="footer-copy">
                        <p>&copy; ${currentYear} 운세마루. All rights reserved.</p>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * 푸터 마운트
     * @param {string} selector - 마운트할 요소 선택자
     */
    mount(selector) {
        const container = document.querySelector(selector);
        if (container) {
            container.innerHTML = this.render();
        }
    }
};

// =====================================================
// Hero Cards 컴포넌트 (홈 화면 카드)
// =====================================================
Components.HeroCards = {
    /**
     * 히어로 카드 HTML 생성
     * @returns {string} - HTML 문자열
     */
    render() {
        return Components.menuData.map(item => `
            <div class="fortune-card" data-section="${item.id}" role="button" tabindex="0">
                <div class="card-icon"><i class="${item.icon}"></i></div>
                <h3>${item.label}</h3>
                <p>${item.description}</p>
            </div>
        `).join('');
    },

    /**
     * 히어로 카드 마운트
     * @param {string} selector - 마운트할 요소 선택자
     */
    mount(selector) {
        const container = document.querySelector(selector);
        if (container) {
            container.innerHTML = this.render();
            this.bindEvents(container);
        }
    },

    /**
     * 이벤트 바인딩
     * @param {Element} container - 컨테이너 요소
     */
    bindEvents(container) {
        container.querySelectorAll('.fortune-card').forEach(card => {
            // 클릭 이벤트
            card.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                if (window.FortuneMaru && window.FortuneMaru.ui) {
                    window.FortuneMaru.ui.showSection(section);
                }
            });

            // 키보드 접근성 (Enter, Space)
            card.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const section = e.currentTarget.dataset.section;
                    if (window.FortuneMaru && window.FortuneMaru.ui) {
                        window.FortuneMaru.ui.showSection(section);
                    }
                }
            });
        });
    }
};

// =====================================================
// Back to Top 버튼 컴포넌트
// =====================================================
Components.BackToTop = {
    /**
     * 버튼 HTML 생성
     * @returns {string} - HTML 문자열
     */
    render() {
        return `
            <button class="back-to-top" aria-label="페이지 상단으로 이동" hidden>
                <i class="fas fa-chevron-up"></i>
            </button>
        `;
    },

    /**
     * 버튼 마운트
     * @param {string} selector - 마운트할 요소 선택자 (또는 body)
     */
    mount(selector = 'body') {
        const container = document.querySelector(selector);
        if (container) {
            container.insertAdjacentHTML('beforeend', this.render());
            this.bindEvents();
        }
    },

    /**
     * 이벤트 바인딩
     */
    bindEvents() {
        const btn = document.querySelector('.back-to-top');
        if (!btn) return;

        // 스크롤 시 표시/숨김
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                btn.hidden = false;
            } else {
                btn.hidden = true;
            }
        });

        // 클릭 시 상단으로 스크롤
        btn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
};

// =====================================================
// Loading Overlay 컴포넌트
// =====================================================
Components.LoadingOverlay = {
    /**
     * 로딩 오버레이 HTML 생성
     * @returns {string} - HTML 문자열
     */
    render() {
        return `
            <div class="loading-overlay" aria-hidden="true" hidden>
                <div class="loading-spinner">
                    <i class="fas fa-moon fa-spin"></i>
                    <p>운세를 불러오는 중...</p>
                </div>
            </div>
        `;
    },

    /**
     * 로딩 오버레이 마운트
     * @param {string} selector - 마운트할 요소 선택자
     */
    mount(selector = 'body') {
        const container = document.querySelector(selector);
        if (container) {
            container.insertAdjacentHTML('beforeend', this.render());
        }
    },

    /**
     * 로딩 표시
     */
    show() {
        const overlay = document.querySelector('.loading-overlay');
        if (overlay) {
            overlay.hidden = false;
            overlay.setAttribute('aria-hidden', 'false');
        }
    },

    /**
     * 로딩 숨김
     */
    hide() {
        const overlay = document.querySelector('.loading-overlay');
        if (overlay) {
            overlay.hidden = true;
            overlay.setAttribute('aria-hidden', 'true');
        }
    }
};

// =====================================================
// Skip Link 컴포넌트
// =====================================================
Components.SkipLink = {
    /**
     * Skip Link HTML 생성
     * @returns {string} - HTML 문자열
     */
    render() {
        return `<a href="#main-content" class="skip-link">본문 바로가기</a>`;
    },

    /**
     * Skip Link 마운트
     * @param {string} selector - 마운트할 요소 선택자
     */
    mount(selector = 'body') {
        const container = document.querySelector(selector);
        if (container) {
            container.insertAdjacentHTML('afterbegin', this.render());
        }
    }
};

// =====================================================
// Ad Space 컴포넌트
// =====================================================
Components.AdSpace = {
    /**
     * 광고 영역 HTML 생성
     * @param {string} position - 위치 식별자 (선택)
     * @returns {string} - HTML 문자열
     */
    render(position = '') {
        return `
            <aside class="ad-space" aria-label="광고 영역" data-position="${position}">
                <div class="container">
                    <div class="ad-placeholder">
                        <!-- 광고 코드 삽입 영역 -->
                    </div>
                </div>
            </aside>
        `;
    },

    /**
     * 광고 영역 마운트
     * @param {string} selector - 마운트할 요소 선택자
     * @param {string} position - 위치 식별자
     */
    mount(selector, position = '') {
        const container = document.querySelector(selector);
        if (container) {
            container.insertAdjacentHTML('beforeend', this.render(position));
        }
    }
};

// =====================================================
// 컴포넌트 초기화 함수
// =====================================================
Components.init = function() {
    // Skip Link
    Components.SkipLink.mount('body');
    
    // Header
    Components.Header.mount('#header-component');
    
    // Hero Cards
    Components.HeroCards.mount('#hero-cards-component');
    
    // Footer
    Components.Footer.mount('#footer-component');
    
    // Back to Top
    Components.BackToTop.mount('body');
    
    // Loading Overlay
    Components.LoadingOverlay.mount('body');
    
    console.log('Components initialized');
};

// =====================================================
// 메뉴 관리 유틸리티
// =====================================================
Components.Menu = {
    /**
     * 메뉴 항목 추가
     * @param {Object} menuItem - 메뉴 항목 객체
     * @param {number} position - 삽입 위치 (선택)
     */
    addItem(menuItem, position = -1) {
        if (position >= 0 && position < Components.menuData.length) {
            Components.menuData.splice(position, 0, menuItem);
        } else {
            Components.menuData.push(menuItem);
        }
    },

    /**
     * 메뉴 항목 제거
     * @param {string} id - 메뉴 ID
     */
    removeItem(id) {
        const index = Components.menuData.findIndex(item => item.id === id);
        if (index > -1) {
            Components.menuData.splice(index, 1);
        }
    },

    /**
     * 메뉴 항목 업데이트
     * @param {string} id - 메뉴 ID
     * @param {Object} updates - 업데이트할 속성들
     */
    updateItem(id, updates) {
        const item = Components.menuData.find(item => item.id === id);
        if (item) {
            Object.assign(item, updates);
        }
    },

    /**
     * 전체 메뉴 데이터 가져오기
     * @returns {Array} - 메뉴 데이터 배열
     */
    getItems() {
        return Components.menuData;
    },

    /**
     * 메뉴 다시 렌더링
     */
    refresh() {
        Components.Header.mount('#header-component');
        Components.Footer.mount('#footer-component');
        Components.HeroCards.mount('#hero-cards-component');
    }
};

// 전역 내보내기
window.Components = Components;





