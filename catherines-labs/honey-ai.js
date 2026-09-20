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

    document.querySelectorAll('.gh-live-warning').forEach((warning) => {
        const summary = warning.querySelector('[data-live-warning-toggle]');
        const label = warning.querySelector('[data-live-warning-label]');

        if (!summary || !label) {
            return;
        }

        const syncWarningState = () => {
            const isOpen = warning.hasAttribute('open');
            label.textContent = isOpen
                ? 'HTTP Warning (Expanded)'
                : 'HTTP Warning (Collapsed)';
            summary.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        };

        warning.addEventListener('toggle', syncWarningState);
        syncWarningState();
    });
 
    const patterns = [
        'ignore previous instructions',
        'ignore prior instructions',
        'disregard previous instructions',
        'disregard prior instructions',
        'reveal system prompt',
        'show me your instructions',
        'developer mode',
        'jailbreak',
        'pretend you are',
        'act as if you have no restrictions'
    ];
 
    const REQUEST_TIMEOUT_MS = 8000;
 
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
 
    const rawApiBase = demo.dataset.apiBase || window.HONEY_API_BASE || '';
    const apiBase = String(rawApiBase).trim().replace(/\/+$/, '');
    const rawApiField = String(demo.dataset.apiField || window.HONEY_API_FIELD || 'prompt').trim();
    const apiField = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(rawApiField) ? rawApiField : 'prompt';
 
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
 
    function normalizeMatches(candidate, fallback) {
        if (Array.isArray(candidate)) {
            return candidate.map((entry) => String(entry));
        }
        if (typeof candidate === 'string' && candidate.trim()) {
            return [candidate.trim()];
        }
        return Array.isArray(fallback) ? fallback.map((entry) => String(entry)) : [];
    }
 
    function getTrustedApiBase(base) {
        if (!base) {
            return '';
        }
 
        try {
            const parsed = new URL(base);
            const isHttps = parsed.protocol === 'https:';
            const isSameOrigin = parsed.origin === window.location.origin;
            const host = parsed.hostname.toLowerCase();
            const isLocalHost = host === 'localhost' || host === '127.0.0.1' || host === '::1';
            const isTrustedHttp = parsed.protocol === 'http:' && (isLocalHost || isSameOrigin);
 
            if (isHttps || isTrustedHttp) {
                return parsed.origin + parsed.pathname.replace(/\/+$/, '');
            }
 
            return '';
        } catch {
            return '';
        }
    }
 
    function parseServerResult(payload, fallbackPrompt) {
        const scoreValue = Number(
            payload?.risk_score ??
            payload?.score ??
            payload?.riskScore
        );
        const hasScore = Number.isFinite(scoreValue);
        const safeScore = hasScore ? Math.max(0, Math.min(100, scoreValue)) : null;
 
        const normalizedMatches = payload?.matches ?? payload?.matched_patterns ?? payload?.triggered_patterns;
 
        const promptText = String(payload?.prompt ?? fallbackPrompt ?? '');
        const localFallback = calculateRisk(promptText);
 
        const score = safeScore ?? localFallback.score;
        const responseText = payload?.response ?? payload?.model_response ?? payload?.answer ?? '';
 
        return {
            score,
            level: getRiskLevel(score),
            matches: normalizeMatches(normalizedMatches, localFallback.matches),
            responseText: String(responseText),
            source: 'Live backend'
        };
    }
 
    async function getRiskData(prompt) {
        const trustedApiBase = getTrustedApiBase(apiBase);
        if (!trustedApiBase) {
            return {
                ...calculateRisk(prompt),
                source: apiBase ? 'Local preview (untrusted backend URL)' : 'Local preview (no backend URL configured)',
                responseText: ''
            };
        }
 
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
 
        try {
            const response = await fetch(`${trustedApiBase}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ [apiField]: prompt }),
                signal: controller.signal
            });
 
            if (!response.ok) {
                throw new Error(`Backend request failed with status ${response.status}`);
            }
 
            const payload = await response.json();
            return parseServerResult(payload, prompt);
        } finally {
            clearTimeout(timeoutId);
        }
    }
 
    function setResultState(message) {
        result.className = 'risk-demo-result';
        result.replaceChildren();
        const text = document.createElement('p');
        text.className = 'risk-demo-empty';
        text.textContent = message;
        result.appendChild(text);
    }
 
    async function renderResult(options = {}) {
        const useLocalPreview = Boolean(options.useLocalPreview);
        const value = input.value.trim();
        if (!value) {
            setResultState('Enter a sample prompt to test the Honey-AI risk scoring flow.');
            return;
        }
 
        setResultState('Scoring prompt...');
 
        let data;
        try {
            if (useLocalPreview) {
                data = {
                    ...calculateRisk(value),
                    source: apiBase ? 'Local preview while typing' : 'Local preview (no backend URL configured)',
                    responseText: ''
                };
            } else {
                data = await getRiskData(value);
            }
        } catch (error) {
            const isTimeout = error && error.name === 'AbortError';
            console.warn(
                isTimeout
                    ? 'Honey-AI backend request timed out:'
                    : 'Honey-AI backend request failed:',
                error
            );
            const fallback = calculateRisk(value);
            data = {
                ...fallback,
                source: apiBase
                    ? (isTimeout ? 'Local fallback (backend timed out)' : 'Local fallback (backend unavailable)')
                    : 'Local preview',
                responseText: ''
            };
        }
 
        result.className = 'risk-demo-result risk-level-' + data.level.toLowerCase();
        result.replaceChildren();
        result.appendChild(renderParagraph('Result source:', data.source));
        result.appendChild(renderParagraph('Risk score:', `${data.score} / 100`));
        result.appendChild(renderParagraph('Risk level:', data.level));
 
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
 
    input.addEventListener('input', () => {
        void renderResult({ useLocalPreview: true });
    });
})();
