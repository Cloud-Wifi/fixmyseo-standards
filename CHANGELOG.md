# Changelog — FixMySEO Standards Programme

All notable changes to this standards programme are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).  
Specifications use a `v{major}.{minor}` version scheme (see GOVERNANCE.md §3).

---

## [v0.2-draft] — 2026-10-10

Proposal. Pending ratification. Changes listed here represent the Phase D standard refinements and are open for review.

### Added

- **D5 — Scope guardrails (STANDARD.md §1.3):** Permanent out-of-scope list added to §1.3 Non-goals. The following are non-normative and MUST NOT become conformance requirements in any version: responsiveness targets, AFR loop mechanics, label bands, display rules, scan cadences, score-change comms.
- **D3 — Conformance profiles (STANDARD.md §2.4):** New §2.4 defines Core and Extended conformance profiles. Core = twenty lab checks, `sum(earned)/sum(possible) * 95`, pillar cap 95. Extended = sub-score families, field data, weight renormalisation, cap 100. `profile` field required at `standard` and `full` levels. Resolves two-model ambiguity (see ADR Decision 16 in `methodology-adr/v0.1.md`).
- **D4 — Core/Extended cap asymmetry (STANDARD.md §6.7):** Note added clarifying that 95 (Core) and 100 (Extended) are not equivalent claims. Implementations MUST NOT present them equivalently.
- **D2 — `confidence` and `methodology_ref` (STANDARD.md §7.4):** New §7.4 makes `confidence` (`"high"` | `"low"`) and `methodology_ref` (engine-id/version string) required fields at the `full` conformance level. `methodology_ref` MUST be incremented when the scoring methodology changes materially.
- **D1 — Per-check `measured_at` (STANDARD.md §8.5):** New §8.5 requires each check entry to include `measured_at` (ISO 8601) at the `full` level, recording when that check's evidence was collected.
- **D1 — Verdict validity windows (STANDARD.md §8.6):** New §8.6 defines validity windows by measurement type: lab 90 days, field/connected 60 days. Stale verdicts MUST be disclosed. Partial-freshness audits MUST declare `confidence: "low"`.
- **D3 — ADR Decision 16 (methodology-adr/v0.1.md):** Conformance profiles rationale, alternatives considered, consequences (profile-declared, fabricated-verdict extended, Core 95/Extended 100 asymmetry, stale-verdict rules).
- **VALIDATOR.md rules 3.11–3.13:** `stale-verdict` (warning, §8.6), `methodology-ref-present` (error, §7.4), `profile-declared` (error, §2.4). Rule summary table updated to 13 rules.
- **audit-report.schema.json:** `profile`, `confidence`, `methodology_ref`, `measured_at`, `scoring.sub_scores` properties added. `standard_version` extended to enum `["0.1", "0.2-draft"]`. Score maximums updated to 100 for Extended profile compatibility.

### Resolved

- **OD3 — freshness floor:** 0.30 (spec value wins; supersedes ADR #9 which stated 0.40).

### Breaking changes

- `profile` field required at `standard` and `full` conformance levels. Existing v0.1.x audits lacking `profile` will fail the `profile-declared` validator rule.

### Migration guide

Add `"profile": "core"` to any existing audit report produced by an implementation using only the §6.4 formula. Implementations using sub-score families with weight renormalisation declare `"profile": "extended"`.

---

## [v0.1.2] — 2026-09-09

Spec erratum. No weight values, measurement procedures, or verdict definitions changed.

### Fixed

- **S1 — weight-sum annotation (seo-scoring/v0.1):** Non-local sub-score weights (0.30 + 0.25 + 0.22 + 0.10 + 0.08 + 0.03) sum to 0.98, not 1.00. The Total row in the weight table now reads "98% (nominal) — see Aggregation note for renormalisation".
- **S7 — missing renormalisation rule (seo-scoring/v0.1):** Added "Aggregation note — renormalisation when sub-scores are absent" section specifying that null sub-scores are excluded from aggregation and the pillar score is computed as `sum(weight_i × score_i for non-null) / sum(weight_i for non-null)`. Assigning a non-null default to an unmeasured sub-score is a fabricated verdict under STANDARD.md §3.1.
- **S6 — legacy MakeitSEO branding (seo-scoring/v0.1):** Fixed "MakeitSEO Standards Programme" references in Contributing section, footer, and references. Corrected repo URL from `makeitseo-standards` to `fixmyseo-standards`.
- **S3 — broken README links:** Fixed two links that pointed to a non-existent `fixmyseo-standard/` subdirectory. Corrected to `STANDARD.md` and `VALIDATOR.md` at the repository root.
- **S4 — wrong repository org/slug in STANDARD.md and VALIDATOR.md:** All URLs used the stale `cloud-wifi/fixmyseo-standard` path. Corrected to `Cloud-Wifi/fixmyseo-standards` throughout both files (4 occurrences each).

### Noted (pending decision)

- **S2 — freshness floor conflict (content-freshness/v0.1):** This document specifies a floor of 0.30; CHANGELOG v0.1 and ADR #9 state 0.40. A conflict note has been added to the "Freshness multiplier" definition. The value will be corrected once OD3 is resolved; no implementation change is made at this patch.

### Already resolved (no change required)

- **S5:** Package references already use `@fixmyseo/standard`.

---

## [v0.1.1] — 2026-05-20

Documentation updates.

---

## [v0.1] — 2026-05-12

### Initial publication of the FixMySEO Standards Programme

This release publishes the first set of normative specifications for measuring website visibility across traditional search, answer engines, and AI-generated responses.

#### Specifications published

| Specification | Path | Summary |
|---------------|------|---------|
| FixMySEO Standard | `STANDARD.md` | Three-pillar framework (SEO / AEO / GEO) with overall score = arithmetic mean |
| SEO Scoring | `seo-scoring/v0.1.md` | 6 sub-scores: content quality (30%), technical health (25%), authority signals (22%), content freshness (10%), runtime compatibility (8%), brand mentions (3%) |
| AEO Scoring | `aeo-scoring/v0.1.md` | 5 sub-scores: AIO presence (40%), featured snippet (25%), knowledge panel (15%), PAA (10%), runtime compatibility (10%) |
| GEO Scoring | `geo-scoring/v0.1.md` | 8 sub-scores: citation rate (20%), brand mentions (15%), mention share (10%), content freshness (10%), platform affinity (10%), structured content (10%), AI crawler (10%), runtime compatibility (15%) |
| Methodology ADR | `methodology-adr/v0.1.md` | 15 Architectural Decision Records covering pillar design, scoring formulae, and measurement protocols |
| Methodology Overview | `methodology-overview/v0.1.md` | Readable guide to all three pillars + Retrievability derived view |
| Agent Runtime Compatibility | `agent-runtime-compatibility/v0.1.md` | ARC protocol — machine-readable runtime capability declarations |
| AI Crawler Accessibility | `ai-crawler-accessibility/v0.1.md` | robots.txt, sitemap, structured-data crawlability signals |
| Brand Web Mentions | `brand-web-mentions/v0.1.md` | Off-domain brand mention measurement (weighted mention score) |
| Cascade Monitoring | `cascade-monitoring/v0.1.md` | Event-based threshold anomaly detection |
| Content Freshness | `content-freshness/v0.1.md` | Per-page freshness multiplier (0.4–1.0) derivation |
| Local SEO Signals | `local-seo-signals/v0.1.md` | GBP/NAP completeness (v0.2 active measurement milestone) |
| Per-Platform Source Affinity | `per-platform-source-affinity/v0.1.md` | Platform-level citation affinity score |
| Structured Content Density | Not yet published | Schema type coverage × field completeness × multi-schema diversity |

#### Structural artefacts published

- `audit-report.schema.json` — JSON Schema for conformant audit output
- `STANDARD.md` — human-readable overview of the FixMySEO Standard
- `VALIDATOR.md` — documentation for the `@fixmyseo/standard` CLI validator
- `README.md` — programme introduction and quick-start
- `CONTRIBUTING.md` — contribution guide (editor-led model at v0.1)
- `CODE_OF_CONDUCT.md` — Contributor Covenant 2.1
- `GOVERNANCE.md` — governance model, versioning policy, Stage 2 transition path
- `CHANGELOG.md` — this file

#### Key architectural decisions (from methodology-adr/v0.1)

| Decision | ADR | Summary |
|----------|-----|---------|
| Three outcome pillars only (no composite pillar) | #1 | SEO / AEO / GEO; no "AI visibility" meta-pillar |
| Overall = arithmetic mean | #6 | (SEO + AEO + GEO) / 3; no pillar weighting |
| FAQ/HowTo schema removed from AEO | #2 | Schema annotation ≠ answer-engine surface; moved to SEO content proxy |
| ARC findings route to pillars | #3 | Per `relevant_outcome_pillar` with even distribution for multi-pillar runtimes |
| Retrievability = derived view | #15 | (agent_runtime_readiness + geo_ai_crawler) / 2; NOT a fourth pillar |
| Freshness multiplier approach | #9 | Multiplier-as-modifier (0.4–1.0) over freshness as an additive signal |

#### Reference implementation

The FixMySEO audit engine at [fixmyseo.com](https://fixmyseo.com) is the designated reference implementation of this standard as of v0.1.

---

## Notes on pre-v1.0 versioning

- Versions `v0.x` are pre-stable. Normative text may change between minor versions.
- Implementations conformant with `v0.1` should be re-validated when `v0.2` is published.
- `v1.0` marks the first stable release; breaking changes from that point require TAB approval and 90 days notice.
