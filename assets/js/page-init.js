/**
 * 운세마루 - 페이지 초기화 모듈 (page-init.js)
 * 
 * 역할:
 * - 멀티 페이지 구조에서 컴포넌트 초기화
 * - 메뉴 링크를 실제 페이지 URL로 변환
 * - 현재 페이지 메뉴 활성화
 */

const PageInit = {
    // 페이지 매핑
    pageMap: {
        'home': 'index.html',
        'today-fortune': 'today.html',
        'zodiac': 'zodiac.html',
        'horoscope': 'star.html',
        'tarot': 'tarot.html',
        'mbti': 'mbti.html',
        'dream': 'dream.html'
    },

    /**
     * 초기화
     * @param {string} currentPage - 현재 페이지 ID
     */
    init(currentPage = 'home') {
        // 컴포넌트 초기화
        if (window.Components) {
            Components.init();
        }

        // 현재 페이지 메뉴 활성화 (링크 변환 전에 실행)
        this.setActivePage(currentPage);

        // 메뉴 링크를 실제 페이지 URL로 변환
        this.convertMenuLinks();

        // 푸터 링크도 변환
        this.convertFooterLinks();

        // 히어로 카드 링크 변환 (홈 페이지)
        this.convertHeroCardLinks();
    },

    /**
     * 메뉴 링크를 실제 페이지 URL로 변환
     */
    convertMenuLinks() {
        document.querySelectorAll('.nav-link[data-section]').forEach(link => {
            const section = link.dataset.section;
            if (this.pageMap[section]) {
                link.href = this.pageMap[section];
                // data-section 제거하여 기본 링크 동작 사용
                delete link.dataset.section;
            }
        });

        // 로고 링크
        document.querySelectorAll('.logo a[data-section]').forEach(link => {
            const section = link.dataset.section;
            if (this.pageMap[section]) {
                link.href = this.pageMap[section];
                delete link.dataset.section;
            }
        });
    },

    /**
     * 푸터 링크 변환
     */
    convertFooterLinks() {
        document.querySelectorAll('.footer-nav a[data-section]').forEach(link => {
            const section = link.dataset.section;
            if (this.pageMap[section]) {
                link.href = this.pageMap[section];
                delete link.dataset.section;
            }
        });
    },

    /**
     * 히어로 카드 링크 변환 (컴포넌트용)
     */
    convertHeroCardLinks() {
        document.querySelectorAll('.fortune-card[data-section]').forEach(card => {
            const section = card.dataset.section;
            if (this.pageMap[section]) {
                // 카드를 링크로 변환
                const link = document.createElement('a');
                link.href = this.pageMap[section];
                link.className = card.className;
                link.innerHTML = card.innerHTML;
                card.parentNode.replaceChild(link, card);
            }
        });
    },

    /**
     * 현재 페이지 메뉴 활성화
     * @param {string} currentPage - 현재 페이지 ID
     */
    setActivePage(currentPage) {
        // 모든 메뉴 비활성화
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // 현재 페이지 메뉴 활성화
        const activeLink = document.querySelector(`.nav-link[data-section="${currentPage}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
};

// 전역 내보내기
window.PageInit = PageInit;

