/**
 * 운세마루 - 운세 모듈 (fortune.js)
 * 
 * 역할:
 * - 오늘의 운세 (생년월일/시 기반)
 * - 띠별 운세 (12지신)
 * - 별자리 운세 (12별자리)
 * 
 * 특징:
 * - 같은 날 재접속 시 동일 결과 (날짜 + 입력값 기반 시드)
 * - JSON 데이터 기반 출력
 */

// =====================================================
// 운세 데이터
// =====================================================
const FortuneData = {
    // 운세 문장 풀 (카테고리별)
    messages: {
        overall: {
            excellent: [
                "오늘은 모든 일이 순조롭게 풀리는 날입니다. 자신감을 가지고 적극적으로 행동하세요.",
                "행운이 가득한 하루가 될 것입니다. 새로운 기회가 찾아올 수 있으니 놓치지 마세요.",
                "긍정적인 에너지가 넘치는 날입니다. 주변 사람들에게 좋은 영향을 줄 수 있어요.",
                "오래 기다리던 일이 성사될 조짐이 보입니다. 조금만 더 인내하세요.",
                "창의적인 아이디어가 빛을 발하는 날입니다. 새로운 시도를 두려워하지 마세요."
            ],
            good: [
                "대체로 좋은 하루가 예상됩니다. 작은 것에도 감사하는 마음을 가지세요.",
                "노력한 만큼 결과가 따라오는 날입니다. 꾸준함이 중요합니다.",
                "주변의 도움을 받을 수 있는 날입니다. 협력을 통해 더 큰 성과를 이룰 수 있어요.",
                "평소 계획했던 일을 실행에 옮기기 좋은 날입니다.",
                "차분하게 하루를 보내면 좋은 결과가 있을 것입니다."
            ],
            neutral: [
                "평범한 하루가 예상됩니다. 무리하지 않는 것이 좋겠습니다.",
                "큰 변화보다는 현재에 충실한 것이 좋은 날입니다.",
                "신중한 결정이 필요한 하루입니다. 급하게 일을 처리하지 마세요.",
                "조용히 자신을 돌아보는 시간을 가져보세요.",
                "작은 일에도 세심한 주의가 필요한 날입니다."
            ],
            caution: [
                "조심스러운 행동이 필요한 날입니다. 중요한 결정은 미루는 것이 좋겠습니다.",
                "예상치 못한 변수가 생길 수 있으니 여유 있게 일정을 잡으세요.",
                "대인관계에서 오해가 생길 수 있으니 말과 행동에 신중하세요.",
                "건강에 주의가 필요한 날입니다. 무리하지 마세요.",
                "인내심이 필요한 하루입니다. 감정적인 대응은 피하세요."
            ]
        },
        
        love: {
            excellent: [
                "로맨틱한 일이 일어날 수 있는 날입니다. 적극적으로 감정을 표현해 보세요.",
                "연인과의 관계가 더욱 깊어지는 날입니다. 소중한 시간을 함께 보내세요.",
                "새로운 인연을 만날 수 있는 날입니다. 열린 마음을 가지세요.",
                "사랑하는 사람에게 진심을 전하기 좋은 날입니다."
            ],
            good: [
                "안정적인 관계가 유지되는 날입니다. 서로에 대한 신뢰가 쌓이고 있어요.",
                "연인과 함께하는 소소한 일상이 행복을 가져다 줄 것입니다.",
                "상대방의 마음을 이해하려는 노력이 빛을 발하는 날입니다.",
                "대화를 통해 서로의 마음을 확인할 수 있는 날입니다."
            ],
            neutral: [
                "큰 변화 없이 평온한 하루가 예상됩니다.",
                "연애보다는 개인적인 시간에 집중하는 것이 좋겠습니다.",
                "급하게 관계를 발전시키려 하지 않는 것이 좋아요.",
                "조용히 상대방을 관찰하고 이해하는 시간을 가지세요."
            ],
            caution: [
                "감정적인 다툼이 생길 수 있으니 주의하세요.",
                "상대방의 입장에서 한 번 더 생각해 보세요.",
                "오해가 생기기 쉬운 날입니다. 명확한 소통이 중요합니다.",
                "혼자만의 시간이 필요할 수 있어요. 서로 공간을 존중하세요."
            ]
        },
        
        career: {
            excellent: [
                "업무에서 좋은 성과를 거둘 수 있는 날입니다. 자신의 능력을 발휘하세요.",
                "새로운 프로젝트나 기회가 찾아올 수 있습니다. 적극적으로 수용하세요.",
                "상사나 동료에게 인정받을 수 있는 날입니다.",
                "창의적인 아이디어로 업무 효율을 높일 수 있어요."
            ],
            good: [
                "맡은 일을 차근차근 처리하면 좋은 결과가 있을 것입니다.",
                "팀워크가 중요한 날입니다. 협업을 통해 시너지를 내세요.",
                "배움의 기회가 있을 수 있습니다. 새로운 지식에 열린 마음을 가지세요.",
                "꾸준한 노력이 빛을 발하는 날입니다."
            ],
            neutral: [
                "평소와 같이 업무에 임하면 무난한 하루가 될 것입니다.",
                "큰 변화보다는 안정적인 업무 처리에 집중하세요.",
                "새로운 도전보다는 기존 업무 마무리에 집중하는 것이 좋겠습니다.",
                "중요한 결정은 조금 미루는 것이 좋을 수 있어요."
            ],
            caution: [
                "업무에서 실수가 생길 수 있으니 꼼꼼하게 확인하세요.",
                "동료와의 갈등에 주의하세요. 감정적 대응은 피하는 것이 좋습니다.",
                "과도한 업무로 피로가 쌓일 수 있습니다. 적절한 휴식이 필요해요.",
                "중요한 서류나 계약은 여러 번 검토하세요."
            ]
        },
        
        money: {
            excellent: [
                "재물운이 좋은 날입니다. 예상치 못한 수입이 있을 수 있어요.",
                "투자나 금전 관련 일이 순조롭게 풀릴 것입니다.",
                "그동안의 노력에 대한 금전적 보상이 있을 수 있습니다.",
                "재테크에 관심을 가지면 좋은 정보를 얻을 수 있어요."
            ],
            good: [
                "안정적인 수입이 유지되는 날입니다.",
                "계획적인 소비로 재정 상태가 개선될 수 있어요.",
                "작은 절약이 큰 부가 되는 날입니다.",
                "금전 관련 좋은 소식이 있을 수 있습니다."
            ],
            neutral: [
                "큰 변화 없이 평범한 금전운이 예상됩니다.",
                "불필요한 지출에 주의하면 무난하게 보낼 수 있어요.",
                "고가의 물품 구매는 조금 미루는 것이 좋겠습니다.",
                "현재의 재정 상태를 점검해 보세요."
            ],
            caution: [
                "예상치 못한 지출이 있을 수 있으니 대비하세요.",
                "투자나 도박성 행위는 피하는 것이 좋겠습니다.",
                "금전 거래 시 신중함이 필요한 날입니다.",
                "충동구매를 주의하세요. 필요한 것만 구매하는 것이 좋아요."
            ]
        },
        
        health: {
            excellent: [
                "활력이 넘치는 하루가 될 것입니다. 운동을 시작하기 좋은 날이에요.",
                "몸과 마음이 건강한 날입니다. 에너지가 넘쳐요.",
                "새로운 건강 습관을 시작하기 좋은 날입니다.",
                "긍정적인 마인드가 건강에도 좋은 영향을 줄 것입니다."
            ],
            good: [
                "대체로 건강한 하루가 예상됩니다.",
                "규칙적인 생활 습관이 건강 유지에 도움이 됩니다.",
                "가벼운 산책이나 스트레칭이 좋은 날입니다.",
                "충분한 수면이 컨디션 유지에 도움이 됩니다."
            ],
            neutral: [
                "무리하지 않는 선에서 활동하면 좋겠습니다.",
                "건강에 특별한 변화는 없을 것으로 예상됩니다.",
                "평소 습관대로 생활하면 무난한 하루가 될 것입니다.",
                "적당한 휴식과 활동의 균형이 필요합니다."
            ],
            caution: [
                "피로가 누적될 수 있으니 충분한 휴식을 취하세요.",
                "과식이나 과음에 주의하세요.",
                "스트레스 관리가 필요한 날입니다. 마음의 여유를 가지세요.",
                "컨디션이 좋지 않을 수 있으니 무리한 활동은 피하세요."
            ]
        }
    },
    
    // 행운 아이템
    luckyItems: {
        colors: ['빨강', '주황', '노랑', '초록', '파랑', '남색', '보라', '분홍', '흰색', '검정', '금색', '은색'],
        numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 13, 15, 17, 21, 23, 27, 33, 37, 42, 77],
        directions: ['동쪽', '서쪽', '남쪽', '북쪽', '동남쪽', '서남쪽', '동북쪽', '서북쪽']
    },
    
    // 띠별 기본 운세
    zodiacBase: {
        rat: { name: '쥐', element: '수(水)', personality: '영리하고 사교적이며 적응력이 뛰어납니다.' },
        ox: { name: '소', element: '토(土)', personality: '성실하고 인내심이 강하며 책임감이 있습니다.' },
        tiger: { name: '호랑이', element: '목(木)', personality: '용감하고 자신감이 넘치며 리더십이 있습니다.' },
        rabbit: { name: '토끼', element: '목(木)', personality: '온화하고 섬세하며 예술적 감각이 있습니다.' },
        dragon: { name: '용', element: '토(土)', personality: '카리스마 있고 야심차며 열정적입니다.' },
        snake: { name: '뱀', element: '화(火)', personality: '지혜롭고 직관력이 뛰어나며 신비로운 매력이 있습니다.' },
        horse: { name: '말', element: '화(火)', personality: '활동적이고 자유로우며 사교성이 좋습니다.' },
        sheep: { name: '양', element: '토(土)', personality: '온순하고 창의적이며 예술적 재능이 있습니다.' },
        monkey: { name: '원숭이', element: '금(金)', personality: '재치있고 호기심이 많으며 다재다능합니다.' },
        rooster: { name: '닭', element: '금(金)', personality: '성실하고 용감하며 솔직합니다.' },
        dog: { name: '개', element: '토(土)', personality: '충실하고 정직하며 의리가 있습니다.' },
        pig: { name: '돼지', element: '수(水)', personality: '낙천적이고 관대하며 인내심이 있습니다.' }
    },
    
    // 별자리 기본 정보
    horoscopeBase: {
        aries: { name: '양자리', element: '불', planet: '화성', symbol: '♈' },
        taurus: { name: '황소자리', element: '땅', planet: '금성', symbol: '♉' },
        gemini: { name: '쌍둥이자리', element: '공기', planet: '수성', symbol: '♊' },
        cancer: { name: '게자리', element: '물', planet: '달', symbol: '♋' },
        leo: { name: '사자자리', element: '불', planet: '태양', symbol: '♌' },
        virgo: { name: '처녀자리', element: '땅', planet: '수성', symbol: '♍' },
        libra: { name: '천칭자리', element: '공기', planet: '금성', symbol: '♎' },
        scorpio: { name: '전갈자리', element: '물', planet: '명왕성', symbol: '♏' },
        sagittarius: { name: '사수자리', element: '불', planet: '목성', symbol: '♐' },
        capricorn: { name: '염소자리', element: '땅', planet: '토성', symbol: '♑' },
        aquarius: { name: '물병자리', element: '공기', planet: '천왕성', symbol: '♒' },
        pisces: { name: '물고기자리', element: '물', planet: '해왕성', symbol: '♓' }
    }
};

// =====================================================
// 운세 생성기
// =====================================================
const FortuneGenerator = {
    /**
     * 오늘의 운세 생성 (생년월일 기반)
     * @param {number} year - 출생년도
     * @param {number} month - 출생월
     * @param {number} day - 출생일
     * @param {string} hour - 시간 (선택)
     * @returns {Object} - 운세 결과
     */
    generateDailyFortune(year, month, day, hour = '') {
        const utils = FortuneMaru.utils;
        const todayStr = utils.getTodayString();
        
        // 시드 생성: 생년월일 + 오늘 날짜
        const seedStr = `${year}-${month}-${day}-${hour}-${todayStr}`;
        const seed = utils.hashCode(seedStr);
        const random = utils.seededRandom(seed);
        
        // 점수 계산 (0~100)
        const overallScore = Math.floor(random() * 40) + 60; // 60~100
        const loveScore = Math.floor(random() * 50) + 50;
        const careerScore = Math.floor(random() * 50) + 50;
        const moneyScore = Math.floor(random() * 50) + 50;
        const healthScore = Math.floor(random() * 50) + 50;
        
        // 점수에 따른 레벨 결정
        const getLevel = (score) => {
            if (score >= 85) return 'excellent';
            if (score >= 70) return 'good';
            if (score >= 55) return 'neutral';
            return 'caution';
        };
        
        // 메시지 선택
        const pickMessage = (category, level) => {
            const messages = FortuneData.messages[category][level];
            const idx = Math.floor(random() * messages.length);
            return messages[idx];
        };
        
        // 행운 아이템 선택
        const luckyColor = utils.pickRandom(FortuneData.luckyItems.colors, random, 1)[0];
        const luckyNumber = utils.pickRandom(FortuneData.luckyItems.numbers, random, 2);
        const luckyDirection = utils.pickRandom(FortuneData.luckyItems.directions, random, 1)[0];
        
        // 띠와 별자리 정보
        const zodiac = utils.getZodiacByYear(year);
        const horoscope = utils.getHoroscopeByDate(month, day);
        
        return {
            date: todayStr,
            birthInfo: { year, month, day, hour },
            zodiac: FortuneData.zodiacBase[zodiac],
            horoscope: FortuneData.horoscopeBase[horoscope],
            scores: {
                overall: overallScore,
                love: loveScore,
                career: careerScore,
                money: moneyScore,
                health: healthScore
            },
            messages: {
                overall: pickMessage('overall', getLevel(overallScore)),
                love: pickMessage('love', getLevel(loveScore)),
                career: pickMessage('career', getLevel(careerScore)),
                money: pickMessage('money', getLevel(moneyScore)),
                health: pickMessage('health', getLevel(healthScore))
            },
            lucky: {
                color: luckyColor,
                numbers: luckyNumber,
                direction: luckyDirection
            }
        };
    },
    
    /**
     * 띠별 운세 생성
     * @param {string} zodiac - 띠 ID
     * @param {string} period - 기간 (today/week/year)
     * @returns {Object} - 운세 결과
     */
    generateZodiacFortune(zodiac, period = 'today') {
        const utils = FortuneMaru.utils;
        
        // 기간별 시드 문자열
        let periodStr;
        switch (period) {
            case 'week':
                periodStr = utils.getWeekString();
                break;
            case 'year':
                periodStr = utils.getYearString();
                break;
            default:
                periodStr = utils.getTodayString();
        }
        
        // 시드 생성: 띠 + 기간
        const seedStr = `zodiac-${zodiac}-${period}-${periodStr}`;
        const seed = utils.hashCode(seedStr);
        const random = utils.seededRandom(seed);
        
        // 점수 계산
        const overallScore = Math.floor(random() * 40) + 60;
        const loveScore = Math.floor(random() * 50) + 50;
        const careerScore = Math.floor(random() * 50) + 50;
        const moneyScore = Math.floor(random() * 50) + 50;
        
        const getLevel = (score) => {
            if (score >= 85) return 'excellent';
            if (score >= 70) return 'good';
            if (score >= 55) return 'neutral';
            return 'caution';
        };
        
        const pickMessage = (category, level) => {
            const messages = FortuneData.messages[category][level];
            const idx = Math.floor(random() * messages.length);
            return messages[idx];
        };
        
        // 행운 아이템
        const luckyColor = utils.pickRandom(FortuneData.luckyItems.colors, random, 1)[0];
        const luckyNumber = utils.pickRandom(FortuneData.luckyItems.numbers, random, 2);
        
        return {
            zodiac: zodiac,
            zodiacInfo: FortuneData.zodiacBase[zodiac],
            period: period,
            periodStr: periodStr,
            scores: {
                overall: overallScore,
                love: loveScore,
                career: careerScore,
                money: moneyScore
            },
            messages: {
                overall: pickMessage('overall', getLevel(overallScore)),
                love: pickMessage('love', getLevel(loveScore)),
                career: pickMessage('career', getLevel(careerScore)),
                money: pickMessage('money', getLevel(moneyScore))
            },
            lucky: {
                color: luckyColor,
                numbers: luckyNumber
            }
        };
    },
    
    /**
     * 별자리 운세 생성
     * @param {string} sign - 별자리 ID
     * @param {string} period - 기간 (today/week/month)
     * @returns {Object} - 운세 결과
     */
    generateHoroscopeFortune(sign, period = 'today') {
        const utils = FortuneMaru.utils;
        
        // 기간별 시드 문자열
        let periodStr;
        switch (period) {
            case 'week':
                periodStr = utils.getWeekString();
                break;
            case 'month':
                periodStr = utils.getMonthString();
                break;
            default:
                periodStr = utils.getTodayString();
        }
        
        // 시드 생성
        const seedStr = `horoscope-${sign}-${period}-${periodStr}`;
        const seed = utils.hashCode(seedStr);
        const random = utils.seededRandom(seed);
        
        // 점수 계산
        const overallScore = Math.floor(random() * 40) + 60;
        const loveScore = Math.floor(random() * 50) + 50;
        const careerScore = Math.floor(random() * 50) + 50;
        const moneyScore = Math.floor(random() * 50) + 50;
        
        const getLevel = (score) => {
            if (score >= 85) return 'excellent';
            if (score >= 70) return 'good';
            if (score >= 55) return 'neutral';
            return 'caution';
        };
        
        const pickMessage = (category, level) => {
            const messages = FortuneData.messages[category][level];
            const idx = Math.floor(random() * messages.length);
            return messages[idx];
        };
        
        // 행운 아이템
        const luckyColor = utils.pickRandom(FortuneData.luckyItems.colors, random, 1)[0];
        const luckyNumber = utils.pickRandom(FortuneData.luckyItems.numbers, random, 2);
        
        return {
            sign: sign,
            signInfo: FortuneData.horoscopeBase[sign],
            period: period,
            periodStr: periodStr,
            scores: {
                overall: overallScore,
                love: loveScore,
                career: careerScore,
                money: moneyScore
            },
            messages: {
                overall: pickMessage('overall', getLevel(overallScore)),
                love: pickMessage('love', getLevel(loveScore)),
                career: pickMessage('career', getLevel(careerScore)),
                money: pickMessage('money', getLevel(moneyScore))
            },
            lucky: {
                color: luckyColor,
                numbers: luckyNumber
            }
        };
    }
};

// =====================================================
// UI 렌더러
// =====================================================
const FortuneRenderer = {
    /**
     * 오늘의 운세 결과 렌더링
     * @param {Object} result - 운세 결과
     * @returns {string} - HTML 문자열
     */
    renderDailyFortune(result) {
        const periodLabels = {
            today: '오늘',
            week: '이번 주',
            month: '이번 달',
            year: '올해'
        };
        
        return `
            <div class="result-header">
                <h3>${result.birthInfo.year}년 ${result.birthInfo.month}월 ${result.birthInfo.day}일생의 오늘 운세</h3>
                <p class="result-date">${FortuneMaru.utils.formatDate(new Date(), 'YYYY년 MM월 DD일 (W요일)')}</p>
            </div>
            
            <div class="result-body">
                <div class="score-display">
                    <span class="score-label">오늘의 운세 점수</span>
                    <div class="score-bar">
                        <div class="score-fill" style="width: ${result.scores.overall}%"></div>
                    </div>
                    <span class="score-value">${result.scores.overall}점</span>
                </div>
                
                <div class="fortune-category">
                    <h4><i class="fas fa-star"></i> 총운</h4>
                    <p>${result.messages.overall}</p>
                </div>
                
                <div class="fortune-category">
                    <h4><i class="fas fa-heart"></i> 애정운</h4>
                    <p>${result.messages.love}</p>
                    <div class="score-display">
                        <span class="score-label">점수</span>
                        <div class="score-bar">
                            <div class="score-fill" style="width: ${result.scores.love}%"></div>
                        </div>
                        <span class="score-value">${result.scores.love}점</span>
                    </div>
                </div>
                
                <div class="fortune-category">
                    <h4><i class="fas fa-briefcase"></i> 직장운</h4>
                    <p>${result.messages.career}</p>
                    <div class="score-display">
                        <span class="score-label">점수</span>
                        <div class="score-bar">
                            <div class="score-fill" style="width: ${result.scores.career}%"></div>
                        </div>
                        <span class="score-value">${result.scores.career}점</span>
                    </div>
                </div>
                
                <div class="fortune-category">
                    <h4><i class="fas fa-coins"></i> 재물운</h4>
                    <p>${result.messages.money}</p>
                    <div class="score-display">
                        <span class="score-label">점수</span>
                        <div class="score-bar">
                            <div class="score-fill" style="width: ${result.scores.money}%"></div>
                        </div>
                        <span class="score-value">${result.scores.money}점</span>
                    </div>
                </div>
                
                <div class="fortune-category">
                    <h4><i class="fas fa-heart-pulse"></i> 건강운</h4>
                    <p>${result.messages.health}</p>
                    <div class="score-display">
                        <span class="score-label">점수</span>
                        <div class="score-bar">
                            <div class="score-fill" style="width: ${result.scores.health}%"></div>
                        </div>
                        <span class="score-value">${result.scores.health}점</span>
                    </div>
                </div>
                
                <div class="lucky-items">
                    <div class="lucky-item">
                        <span>행운의 색</span>
                        <span>${result.lucky.color}</span>
                    </div>
                    <div class="lucky-item">
                        <span>행운의 숫자</span>
                        <span>${result.lucky.numbers.join(', ')}</span>
                    </div>
                    <div class="lucky-item">
                        <span>행운의 방향</span>
                        <span>${result.lucky.direction}</span>
                    </div>
                </div>
            </div>
        `;
    },
    
    /**
     * 띠별 운세 결과 렌더링
     * @param {Object} result - 운세 결과
     * @returns {string} - HTML 문자열
     */
    renderZodiacFortune(result) {
        const periodLabels = {
            today: '오늘',
            week: '이번 주',
            year: '올해'
        };
        
        const zodiacEmoji = {
            rat: '🐀', ox: '🐂', tiger: '🐅', rabbit: '🐇',
            dragon: '🐉', snake: '🐍', horse: '🐎', sheep: '🐏',
            monkey: '🐒', rooster: '🐓', dog: '🐕', pig: '🐖'
        };
        
        return `
            <div class="result-header">
                <h3>${zodiacEmoji[result.zodiac]} ${result.zodiacInfo.name}띠 ${periodLabels[result.period]} 운세</h3>
                <p class="result-date">${result.zodiacInfo.personality}</p>
            </div>
            
            <div class="result-body">
                <div class="score-display">
                    <span class="score-label">운세 점수</span>
                    <div class="score-bar">
                        <div class="score-fill" style="width: ${result.scores.overall}%"></div>
                    </div>
                    <span class="score-value">${result.scores.overall}점</span>
                </div>
                
                <div class="fortune-category">
                    <h4><i class="fas fa-star"></i> 총운</h4>
                    <p>${result.messages.overall}</p>
                </div>
                
                <div class="fortune-category">
                    <h4><i class="fas fa-heart"></i> 애정운</h4>
                    <p>${result.messages.love}</p>
                </div>
                
                <div class="fortune-category">
                    <h4><i class="fas fa-briefcase"></i> 직장운</h4>
                    <p>${result.messages.career}</p>
                </div>
                
                <div class="fortune-category">
                    <h4><i class="fas fa-coins"></i> 재물운</h4>
                    <p>${result.messages.money}</p>
                </div>
                
                <div class="lucky-items">
                    <div class="lucky-item">
                        <span>행운의 색</span>
                        <span>${result.lucky.color}</span>
                    </div>
                    <div class="lucky-item">
                        <span>행운의 숫자</span>
                        <span>${result.lucky.numbers.join(', ')}</span>
                    </div>
                    <div class="lucky-item">
                        <span>오행</span>
                        <span>${result.zodiacInfo.element}</span>
                    </div>
                </div>
            </div>
        `;
    },
    
    /**
     * 별자리 운세 결과 렌더링
     * @param {Object} result - 운세 결과
     * @returns {string} - HTML 문자열
     */
    renderHoroscopeFortune(result) {
        const periodLabels = {
            today: '오늘',
            week: '이번 주',
            month: '이번 달'
        };
        
        return `
            <div class="result-header">
                <h3>${result.signInfo.symbol} ${result.signInfo.name} ${periodLabels[result.period]} 운세</h3>
                <p class="result-date">원소: ${result.signInfo.element} | 수호 행성: ${result.signInfo.planet}</p>
            </div>
            
            <div class="result-body">
                <div class="score-display">
                    <span class="score-label">운세 점수</span>
                    <div class="score-bar">
                        <div class="score-fill" style="width: ${result.scores.overall}%"></div>
                    </div>
                    <span class="score-value">${result.scores.overall}점</span>
                </div>
                
                <div class="fortune-category">
                    <h4><i class="fas fa-star"></i> 총운</h4>
                    <p>${result.messages.overall}</p>
                </div>
                
                <div class="fortune-category">
                    <h4><i class="fas fa-heart"></i> 애정운</h4>
                    <p>${result.messages.love}</p>
                </div>
                
                <div class="fortune-category">
                    <h4><i class="fas fa-briefcase"></i> 직장운</h4>
                    <p>${result.messages.career}</p>
                </div>
                
                <div class="fortune-category">
                    <h4><i class="fas fa-coins"></i> 재물운</h4>
                    <p>${result.messages.money}</p>
                </div>
                
                <div class="lucky-items">
                    <div class="lucky-item">
                        <span>행운의 색</span>
                        <span>${result.lucky.color}</span>
                    </div>
                    <div class="lucky-item">
                        <span>행운의 숫자</span>
                        <span>${result.lucky.numbers.join(', ')}</span>
                    </div>
                </div>
            </div>
        `;
    }
};

// =====================================================
// 이벤트 핸들러
// =====================================================
$(document).ready(function() {
    // ----- 오늘의 운세 폼 제출 -----
    $('#today-fortune-form').on('submit', function(e) {
        e.preventDefault();
        
        const year = parseInt($('#birth-year').val());
        const month = parseInt($('#birth-month').val());
        const day = parseInt($('#birth-day').val());
        const hour = $('#birth-hour').val();
        
        // 유효성 검사
        if (!year || !month || !day) {
            FortuneMaru.ui.showError('생년월일을 모두 입력해 주세요.', $(this));
            return;
        }
        
        if (!FortuneMaru.utils.isValidDate(year, month, day)) {
            FortuneMaru.ui.showError('올바른 날짜를 입력해 주세요.', $(this));
            return;
        }
        
        // 운세 생성 및 표시
        const result = FortuneGenerator.generateDailyFortune(year, month, day, hour);
        const html = FortuneRenderer.renderDailyFortune(result);
        FortuneMaru.ui.showResult('today-fortune-result', html);
    });
    
    // ----- 띠별 운세 -----
    let currentZodiacPeriod = 'today';
    
    // 기간 탭 클릭
    $('#zodiac .period-tabs .tab-btn').on('click', function() {
        $(this).siblings().removeClass('active').attr('aria-selected', 'false');
        $(this).addClass('active').attr('aria-selected', 'true');
        currentZodiacPeriod = $(this).data('period');
        
        // 이미 선택된 띠가 있으면 결과 업데이트
        const selectedZodiac = $('.zodiac-item.selected').data('zodiac');
        if (selectedZodiac) {
            const result = FortuneGenerator.generateZodiacFortune(selectedZodiac, currentZodiacPeriod);
            const html = FortuneRenderer.renderZodiacFortune(result);
            FortuneMaru.ui.showResult('zodiac-result', html);
        }
    });
    
    // 띠 선택
    $('.zodiac-item').on('click', function() {
        const zodiac = $(this).data('zodiac');
        
        // UI 업데이트
        $('.zodiac-item').removeClass('selected');
        $(this).addClass('selected');
        
        // 운세 생성 및 표시
        const result = FortuneGenerator.generateZodiacFortune(zodiac, currentZodiacPeriod);
        const html = FortuneRenderer.renderZodiacFortune(result);
        FortuneMaru.ui.showResult('zodiac-result', html);
    });
    
    // ----- 별자리 운세 -----
    let currentHoroscopePeriod = 'today';
    
    // 기간 탭 클릭
    $('#horoscope .period-tabs .tab-btn').on('click', function() {
        $(this).siblings().removeClass('active').attr('aria-selected', 'false');
        $(this).addClass('active').attr('aria-selected', 'true');
        currentHoroscopePeriod = $(this).data('period');
        
        // 이미 선택된 별자리가 있으면 결과 업데이트
        const selectedSign = $('.horoscope-item.selected').data('sign');
        if (selectedSign) {
            const result = FortuneGenerator.generateHoroscopeFortune(selectedSign, currentHoroscopePeriod);
            const html = FortuneRenderer.renderHoroscopeFortune(result);
            FortuneMaru.ui.showResult('horoscope-result', html);
        }
    });
    
    // 별자리 선택
    $('.horoscope-item').on('click', function() {
        const sign = $(this).data('sign');
        
        // UI 업데이트
        $('.horoscope-item').removeClass('selected');
        $(this).addClass('selected');
        
        // 운세 생성 및 표시
        const result = FortuneGenerator.generateHoroscopeFortune(sign, currentHoroscopePeriod);
        const html = FortuneRenderer.renderHoroscopeFortune(result);
        FortuneMaru.ui.showResult('horoscope-result', html);
    });
});

// 전역 내보내기
window.FortuneData = FortuneData;
window.FortuneGenerator = FortuneGenerator;
window.FortuneRenderer = FortuneRenderer;








