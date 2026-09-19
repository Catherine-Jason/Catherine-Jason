(() => {
    const toggles = document.querySelectorAll('.info-popover-toggle');
    const previewImage = document.querySelector('.honey-preview-image');
    const previewFallback = document.querySelector('.honey-preview-fallback');

    function closeAll(except) {
        toggles.forEach((toggle) => {
            const panel = toggle.parentElement ? toggle.parentElement.querySelector('.info-popover-panel') : null;
            if (!panel) {
                return;
            }
            if (toggle !== except) {
                toggle.setAttribute('aria-expanded', 'false');
                panel.setAttribute('hidden', 'hidden');
            }
        });
    }

    toggles.forEach((toggle) => {
        toggle.addEventListener('click', (event) => {
            event.stopPropagation();
            const panel = toggle.parentElement ? toggle.parentElement.querySelector('.info-popover-panel') : null;
            if (!panel) {
                return;
            }
            const willOpen = panel.hasAttribute('hidden');
            closeAll();
            if (willOpen) {
                panel.removeAttribute('hidden');
                toggle.setAttribute('aria-expanded', 'true');
            } else {
                panel.setAttribute('hidden', 'hidden');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    document.addEventListener('click', (event) => {
        if (!event.target.closest('.info-popover')) {
            closeAll();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeAll();
        }
    });

    if (previewImage && previewFallback) {
        const showPreviewFallback = () => {
            previewImage.setAttribute('aria-hidden', 'true');
            previewImage.hidden = true;
            previewFallback.hidden = false;
        };

        previewImage.addEventListener('error', showPreviewFallback, { once: true });

        if (previewImage.complete && previewImage.naturalWidth === 0) {
            showPreviewFallback();
        }
    }

    const patterns = [
        'ignore previous instructions',
        'reveal system prompt',
        'developer mode',
        'jailbreak'
    ];

    function getRiskLevel(score) {
        if (score >= 75) return 'Critical';
        if (score >= 50) return 'High';
        if (score >= 25) return 'Medium';
        return 'Low';
    }

    function calculateRisk(input) {
        const prompt = input.toLowerCase();
        let score = 0;
        const matches = [];

        patterns.forEach((pattern) => {
            if (prompt.includes(pattern)) {
                score += 25;
                matches.push(pattern);
            }
        });

        return {
            score: Math.min(score, 100),
            level: getRiskLevel(Math.min(score, 100)),
            matches
        };
    }

    const demo = document.querySelector('[data-risk-demo]');
    const form = document.querySelector('[data-risk-form]');
    const input = document.getElementById('risk-demo-input');
    const result = document.querySelector('[data-risk-result]');

    if (!demo || !form || !input || !result) {
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const queryApiBase = params.get('honeyApiBase');
    const rawApiBase = queryApiBase || demo.dataset.apiBase || window.HONEY_API_BASE || '';
    const apiBase = String(rawApiBase).trim().replace(/\/+$/, '');

    function renderParagraph(label, value) {
        const paragraph = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = label;
        paragraph.appendChild(strong);
        paragraph.append(' ' + value);
        return paragraph;
    }

    function renderList(title, items, emptyText) {
        const wrapper = document.createElement('div');
        const label = document.createElement('strong');
        label.textContent = title;
        wrapper.appendChild(label);

        if (Array.isArray(items) && items.length) {
            const list = document.createElement('ul');
            items.forEach((entry) => {
                const item = document.createElement('li');
                const code = document.createElement('code');
                code.textContent = String(entry);
                item.appendChild(code);
                list.appendChild(item);
            });
            wrapper.appendChild(list);
        } else {
            const noItems = document.createElement('p');
            noItems.textContent = emptyText;
            wrapper.appendChild(noItems);
        }

        return wrapper;
    }

    function parseServerResult(payload, fallbackPrompt) {
        const scoreValue = Number(
            payload?.risk_score ??
            payload?.score ??
            payload?.riskScore
        );
        const hasScore = Number.isFinite(scoreValue);
        const safeScore = hasScore ? Math.max(0, Math.min(100, scoreValue)) : null;

        const normalizedMatches =
            payload?.matches ||
            payload?.matched_patterns ||
            payload?.triggered_patterns ||
            [];

        const promptText = String(payload?.prompt ?? fallbackPrompt ?? '');
        const localFallback = calculateRisk(promptText);

        const score = safeScore ?? localFallback.score;
        const level = String(payload?.risk_level ?? payload?.level ?? getRiskLevel(score));
        const responseText = payload?.response ?? payload?.model_response ?? payload?.answer ?? '';

        return {
            score,
            level: level.charAt(0).toUpperCase() + level.slice(1).toLowerCase(),
            matches: Array.isArray(normalizedMatches) ? normalizedMatches : localFallback.matches,
            responseText: String(responseText),
            source: 'Live backend'
        };
    }

    async function getRiskData(prompt) {
        if (!apiBase) {
            return {
                ...calculateRisk(prompt),
                source: 'Local preview (no backend URL configured)',
                responseText: ''
            };
        }

        const response = await fetch(`${apiBase}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt,
                message: prompt
            })
        });

        if (!response.ok) {
            throw new Error(`Backend request failed with status ${response.status}`);
        }

        const payload = await response.json();
        return parseServerResult(payload, prompt);
    }

    function setResultState(message) {
        result.className = 'risk-demo-result';
        result.replaceChildren();
        const text = document.createElement('p');
        text.className = 'risk-demo-empty';
        text.textContent = message;
        result.appendChild(text);
    }

    async function renderResult() {
        const value = input.value.trim();
        if (!value) {
            setResultState('Enter a sample prompt to test the Honey-AI risk scoring flow.');
            return;
        }

        setResultState('Scoring prompt...');

        let data;
        try {
            data = await getRiskData(value);
        } catch (error) {
            const fallback = calculateRisk(value);
            data = {
                ...fallback,
                source: apiBase ? `Local fallback (could not reach ${apiBase})` : 'Local preview',
                responseText: ''
            };
        }

        result.className = 'risk-demo-result risk-level-' + data.level.toLowerCase();
        result.replaceChildren();
        result.appendChild(renderParagraph('Result source:', data.source));
        result.appendChild(renderParagraph('Risk score:', `${data.score} / 100`));
        result.appendChild(renderParagraph('Risk level:', data.level));
        if (apiBase) {
            result.appendChild(renderParagraph('API base URL:', apiBase));
        }

        if (data.responseText) {
            result.appendChild(renderParagraph('Model response:', data.responseText));
        }

        result.appendChild(
            renderList(
                'Matched patterns:',
                data.matches,
                'No suspicious phrases matched the current pattern list.'
            )
        );
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        void renderResult();
    });

    if (!apiBase) {
        input.addEventListener('input', () => {
            void renderResult();
        });
    }
})();
