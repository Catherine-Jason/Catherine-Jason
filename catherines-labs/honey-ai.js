    const patterns = [
        {
            label: 'ignore previous instructions',
            regex: /\b(?:ignore|disregard|forget|override)\s+(?:(?:all|any|your|the)\s+)?(?:previous|prior|earlier|above)\s+(?:instructions|rules|guidelines|prompts?)\b/
        },
        {
            label: 'reveal system prompt',
            regex: /\b(?:reveal|show|print|display|leak|repeat)\s+(?:me\s+)?(?:(?:your|the)\s+)?(?:(?:hidden|secret|system)\s+(?:prompt|instructions?)|prompt)\b/
        },
        {
            label: 'developer mode',
            regex: /\bdeveloper\s+mode\b/
        },
        {
            label: 'jailbreak',
            regex: /jailbreak/
        },
        {
            label: 'bypass safety',
            regex: /\b(?:bypass|disable|turn\s+off)\s+(?:(?:the|your)\s+)?(?:safety|restrictions|filters|guardrails)\b/
        }
    ];

    const REQUEST_TIMEOUT_MS = 8000;

    function getRiskLevel(score) {
        if (score >= 75) return 'Critical';
        if (score >= 50) return 'High';
        if (score >= 25) return 'Medium';
        return 'Low';
    }

    function normalizeText(text) {
        return String(text)
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function calculateRisk(input) {
        const prompt = normalizeText(input);
        let score = 0;
        const matches = [];

        patterns.forEach((pattern) => {
            if (pattern.regex.test(prompt)) {
                score += 25;
                matches.push(pattern.label);
            }
        });

        return {
            score: Math.min(score, 100),
            level: getRiskLevel(Math.min(score, 100)),
            matches
        };
    }
