(() => {
    const toggles = document.querySelectorAll('.info-popover-toggle');
    const previewImage = document.querySelector('.honey-preview-image');
    const previewFallback = document.querySelector('.honey-preview-fallback');

    function closeAll(except) {
        toggles.forEach((toggle) => {
            const panel = toggle.nextElementSibling;
            const isMatch = toggle === except;
            toggle.setAttribute('aria-expanded', isMatch ? String(!panel.hasAttribute('hidden')) : 'false');
            if (!isMatch) {
                panel.setAttribute('hidden', 'hidden');
            }
        });
    }

    toggles.forEach((toggle) => {
        toggle.addEventListener('click', (event) => {
            event.stopPropagation();
            const panel = toggle.nextElementSibling;
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
        previewImage.addEventListener('error', () => {
            previewImage.setAttribute('aria-hidden', 'true');
            previewImage.hidden = true;
            previewFallback.hidden = false;
        }, { once: true });
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

    const form = document.querySelector('[data-risk-form]');
    const input = document.getElementById('risk-demo-input');
    const result = document.querySelector('[data-risk-result]');

    if (!form || !input || !result) {
        return;
    }

    function renderParagraph(label, value) {
        const paragraph = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = label;
        paragraph.appendChild(strong);
        paragraph.append(' ' + value);
        return paragraph;
    }

    function renderResult() {
        const value = input.value.trim();
        if (!value) {
            result.className = 'risk-demo-result';
            result.replaceChildren();
            const empty = document.createElement('p');
            empty.className = 'risk-demo-empty';
            empty.textContent = 'Enter a sample prompt to see how the educational scoring logic works.';
            result.appendChild(empty);
            return;
        }

        const data = calculateRisk(value);
        result.className = 'risk-demo-result risk-level-' + data.level.toLowerCase();
        result.replaceChildren();
        result.appendChild(renderParagraph('Risk score:', `${data.score} / 100`));
        result.appendChild(renderParagraph('Risk level:', data.level));

        const matchesWrapper = document.createElement('div');
        const matchesLabel = document.createElement('strong');
        matchesLabel.textContent = 'Matched patterns:';
        matchesWrapper.appendChild(matchesLabel);

        if (data.matches.length) {
            const list = document.createElement('ul');
            data.matches.forEach((match) => {
                const item = document.createElement('li');
                const code = document.createElement('code');
                code.textContent = match;
                item.appendChild(code);
                list.appendChild(item);
            });
            matchesWrapper.appendChild(list);
        } else {
            const noMatches = document.createElement('p');
            noMatches.textContent = 'No suspicious phrases matched the current pattern list.';
            matchesWrapper.appendChild(noMatches);
        }

        result.appendChild(matchesWrapper);
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        renderResult();
    });
})();
