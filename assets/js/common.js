/**
 * 운세마루 - 공통 모듈 (common.js)
 * 
 * 역할:
 * - 다국어(i18n) 지원 구조
 * - 네비게이션 및 섹션 전환
 * - 유틸리티 함수
 * - 공통 UI 컴포넌트
 */

// =====================================================
// 전역 네임스페이스
// =====================================================
const FortuneMaru = window.FortuneMaru || {};

// =====================================================
// 다국어 지원 (i18n)
// =====================================================
FortuneMaru.i18n = {
    currentLang: 'ko',
    
    // 언어 데이터
    messages: {
        ko: {
            // 공통
            siteName: '운세마루',
            loading: '운세를 불러오는 중...',
            error: '오류가 발생했습니다.',
            retry: '다시 시도',
            close: '닫기',
            
            // 메뉴
            menu: {
                home: '홈',
                todayFortune: '오늘의 운세',
                zodiac: '띠별 운세',
                horoscope: '별자리 운세',
                tarot: '타로',
                mbti: 'MBTI 운세',
                dream: '꿈해몽'
            },
            
            // 기간
            period: {
                today: '오늘',
                week: '이번 주',
                month: '이번 달',
                year: '올해'
            },
            
            // 폼
            form: {
                year: '년도',
                month: '월',
                day: '일',
                birthHour: '태어난 시간',
                unknown: '모름',
                search: '검색',
                submit: '확인'
            },
            
            // 결과
            result: {
                overall: '총운',
                love: '애정운',
                career: '직장운',
                money: '재물운',
                health: '건강운',
                luckyColor: '행운의 색',
                luckyNumber: '행운의 숫자',
                luckyDirection: '행운의 방향'
            },
            
            // 고지문
            disclaimer: '본 서비스는 오락 및 참고용이며, 의료·법률·재정적 판단의 근거로 사용할 수 없습니다.',
            
            // 12지신 (띠)
            zodiac: {
                rat: '쥐',
                ox: '소',
                tiger: '호랑이',
                rabbit: '토끼',
                dragon: '용',
                snake: '뱀',
                horse: '말',
                sheep: '양',
                monkey: '원숭이',
                rooster: '닭',
                dog: '개',
                pig: '돼지'
            },
            
            // 12별자리
            horoscope: {
                aries: '양자리',
                taurus: '황소자리',
                gemini: '쌍둥이자리',
                cancer: '게자리',
                leo: '사자자리',
                virgo: '처녀자리',
                libra: '천칭자리',
                scorpio: '전갈자리',
                sagittarius: '사수자리',
                capricorn: '염소자리',
                aquarius: '물병자리',
                pisces: '물고기자리'
            }
        },
        
        // 영어 (확장용)
        en: {
            siteName: 'FortuneMaru',
            loading: 'Loading fortune...',
            // ... 추가 번역
        }
    },
    
    // 현재 언어로 메시지 가져오기
    t(key) {
        const keys = key.split('.');
        let value = this.messages[this.currentLang];
        
        for (const k of keys) {
            if (value && value[k] !== undefined) {
                value = value[k];
            } else {
                return key; // 키를 찾지 못하면 키 자체를 반환
            }
        }
        
        return value;
    },
    
    // 언어 변경
    setLanguage(lang) {
        if (this.messages[lang]) {
            this.currentLang = lang;
            document.documentElement.lang = lang;
            // 필요시 UI 업데이트 트리거
        }
    }
};

// =====================================================
// 유틸리티 함수
// =====================================================
FortuneMaru.utils = {
    /**
     * 오늘 날짜 문자열 (YYYY-MM-DD)
     */
    getTodayString() {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    },
    
    /**
     * 이번 주 시작일 문자열
     */
    getWeekString() {
        const today = new Date();
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(today.setDate(diff));
        return `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, '0')}-${String(monday.getDate()).padStart(2, '0')}`;
    },
    
    /**
     * 이번 달 문자열 (YYYY-MM)
     */
    getMonthString() {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    },
    
    /**
     * 올해 문자열 (YYYY)
     */
    getYearString() {
        return String(new Date().getFullYear());
    },
    
    /**
     * 해시 기반 시드 생성 (동일 입력 → 동일 출력)
     * @param {string} str - 입력 문자열
     * @returns {number} - 시드 값
     */
    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 32비트 정수로 변환
        }
        return Math.abs(hash);
    },
    
    /**
     * 시드 기반 난수 생성기 (Mulberry32)
     * @param {number} seed - 시드 값
     * @returns {function} - 0~1 사이 난수 생성 함수
     */
    seededRandom(seed) {
        return function() {
            let t = seed += 0x6D2B79F5;
            t = Math.imul(t ^ t >>> 15, t | 1);
            t ^= t + Math.imul(t ^ t >>> 7, t | 61);
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };
    },
    
    /**
     * 배열 섞기 (Fisher-Yates, 시드 기반)
     * @param {Array} array - 배열
     * @param {function} randomFn - 난수 함수
     * @returns {Array} - 섞인 배열
     */
    shuffleArray(array, randomFn) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(randomFn() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    },
    
    /**
     * 배열에서 랜덤 요소 선택 (시드 기반)
     * @param {Array} array - 배열
     * @param {function} randomFn - 난수 함수
     * @param {number} count - 선택 개수
     * @returns {Array} - 선택된 요소들
     */
    pickRandom(array, randomFn, count = 1) {
        const shuffled = this.shuffleArray(array, randomFn);
        return shuffled.slice(0, count);
    },
    
    /**
     * 생년으로 띠 계산
     * @param {number} year - 출생년도
     * @returns {string} - 띠 ID
     */
    getZodiacByYear(year) {
        const zodiacOrder = ['monkey', 'rooster', 'dog', 'pig', 'rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake', 'horse', 'sheep'];
        return zodiacOrder[year % 12];
    },
    
    /**
     * 생일로 별자리 계산
     * @param {number} month - 월 (1-12)
     * @param {number} day - 일
     * @returns {string} - 별자리 ID
     */
    getHoroscopeByDate(month, day) {
        const signs = [
            { sign: 'capricorn', endMonth: 1, endDay: 19 },
            { sign: 'aquarius', endMonth: 2, endDay: 18 },
            { sign: 'pisces', endMonth: 3, endDay: 20 },
            { sign: 'aries', endMonth: 4, endDay: 19 },
            { sign: 'taurus', endMonth: 5, endDay: 20 },
            { sign: 'gemini', endMonth: 6, endDay: 21 },
            { sign: 'cancer', endMonth: 7, endDay: 22 },
            { sign: 'leo', endMonth: 8, endDay: 22 },
            { sign: 'virgo', endMonth: 9, endDay: 22 },
            { sign: 'libra', endMonth: 10, endDay: 22 },
            { sign: 'scorpio', endMonth: 11, endDay: 21 },
            { sign: 'sagittarius', endMonth: 12, endDay: 21 },
            { sign: 'capricorn', endMonth: 12, endDay: 31 }
        ];
        
        for (const s of signs) {
            if (month < s.endMonth || (month === s.endMonth && day <= s.endDay)) {
                return s.sign;
            }
        }
        return 'capricorn';
    },
    
    /**
     * 날짜 포맷
     * @param {Date} date - 날짜 객체
     * @param {string} format - 포맷 문자열
     * @returns {string} - 포맷된 날짜 문자열
     */
    formatDate(date, format = 'YYYY년 MM월 DD일') {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
        const weekday = weekdays[date.getDay()];
        
        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day)
            .replace('W', weekday);
    },
    
    /**
     * 유효성 검사 - 필수 입력
     * @param {*} value - 값
     * @returns {boolean}
     */
    isRequired(value) {
        return value !== null && value !== undefined && value !== '';
    },
    
    /**
     * 날짜 유효성 검사
     * @param {number} year - 년
     * @param {number} month - 월
     * @param {number} day - 일
     * @returns {boolean}
     */
    isValidDate(year, month, day) {
        const date = new Date(year, month - 1, day);
        return date.getFullYear() === year &&
               date.getMonth() === month - 1 &&
               date.getDate() === day;
    }
};

// =====================================================
// UI 컨트롤러
// =====================================================
FortuneMaru.ui = {
    currentSection: 'home',
    
    /**
     * 초기화
     */
    init() {
        this.setupMobileMenu();
        this.setupBackToTop();
        this.setupDateSelects();
        this.updateYear();
    },
    
    /**
     * 모바일 메뉴 설정
     */
    setupMobileMenu() {
        const $menuBtn = $('.mobile-menu-btn');
        const $nav = $('.main-nav');
        
        $menuBtn.on('click', () => {
            const isExpanded = $menuBtn.attr('aria-expanded') === 'true';
            $menuBtn.attr('aria-expanded', !isExpanded);
            $nav.toggleClass('active');
            
            // 메뉴 열릴 때 스크롤 방지
            $('body').toggleClass('menu-open');
        });
        
        // 메뉴 항목 클릭 시 모바일 메뉴 닫기
        $('.nav-link').on('click', () => {
            $menuBtn.attr('aria-expanded', 'false');
            $nav.removeClass('active');
            $('body').removeClass('menu-open');
        });
    },
    
    /**
     * Back to Top 버튼 설정
     */
    setupBackToTop() {
        const $btn = $('.back-to-top');
        
        $(window).on('scroll', () => {
            if ($(window).scrollTop() > 300) {
                $btn.prop('hidden', false);
            } else {
                $btn.prop('hidden', true);
            }
            
            // 헤더 스크롤 효과
            if ($(window).scrollTop() > 50) {
                $('.header').addClass('scrolled');
            } else {
                $('.header').removeClass('scrolled');
            }
        });
        
        $btn.on('click', () => {
            $('html, body').animate({ scrollTop: 0 }, 400);
        });
    },
    
    /**
     * 날짜 선택 드롭다운 설정
     */
    setupDateSelects() {
        const currentYear = new Date().getFullYear();
        const $year = $('#birth-year');
        const $month = $('#birth-month');
        const $day = $('#birth-day');
        
        // 년도 (현재년도 ~ 1920년)
        for (let y = currentYear; y >= 1920; y--) {
            $year.append(`<option value="${y}">${y}년</option>`);
        }
        
        // 월
        for (let m = 1; m <= 12; m++) {
            $month.append(`<option value="${m}">${m}월</option>`);
        }
        
        // 일
        for (let d = 1; d <= 31; d++) {
            $day.append(`<option value="${d}">${d}일</option>`);
        }
        
        // 월 변경 시 일수 조정
        $year.add($month).on('change', () => {
            this.updateDays();
        });
    },
    
    /**
     * 월에 따른 일수 업데이트
     */
    updateDays() {
        const year = parseInt($('#birth-year').val()) || new Date().getFullYear();
        const month = parseInt($('#birth-month').val()) || 1;
        const $day = $('#birth-day');
        const currentDay = parseInt($day.val()) || 1;
        
        // 해당 월의 마지막 날
        const lastDay = new Date(year, month, 0).getDate();
        
        // 옵션 재생성
        $day.find('option:not(:first)').remove();
        for (let d = 1; d <= lastDay; d++) {
            $day.append(`<option value="${d}">${d}일</option>`);
        }
        
        // 기존 선택값 복원 (범위 내면)
        if (currentDay <= lastDay) {
            $day.val(currentDay);
        }
    },
    
    
    /**
     * 푸터 연도 업데이트
     */
    updateYear() {
        $('#current-year').text(new Date().getFullYear());
    },
    
    /**
     * 로딩 표시
     * @param {boolean} show - 표시 여부
     */
    showLoading(show = true) {
        $('.loading-overlay').prop('hidden', !show);
    },
    
    /**
     * 결과 영역 표시
     * @param {string} containerId - 컨테이너 ID
     * @param {string} html - HTML 내용
     */
    showResult(containerId, html) {
        const $container = $(`#${containerId}`);
        $container.html(html).prop('hidden', false);
        
        // 결과 영역으로 스크롤
        setTimeout(() => {
            $('html, body').animate({
                scrollTop: $container.offset().top - 100
            }, 400);
        }, 100);
    },
    
    /**
     * 결과 영역 숨기기
     * @param {string} containerId - 컨테이너 ID
     */
    hideResult(containerId) {
        $(`#${containerId}`).prop('hidden', true).empty();
    },
    
    /**
     * 에러 표시
     * @param {string} message - 에러 메시지
     * @param {jQuery} $element - 에러 표시할 요소
     */
    showError(message, $element) {
        $element.addClass('error');
        setTimeout(() => $element.removeClass('error'), 500);
        alert(message);
    }
};

// =====================================================
// jQuery 문서 준비
// =====================================================
$(document).ready(function() {
    // 전역 객체로 내보내기 (컴포넌트에서 사용)
    window.FortuneMaru = FortuneMaru;
    
    // UI 초기화
    FortuneMaru.ui.init();
});




