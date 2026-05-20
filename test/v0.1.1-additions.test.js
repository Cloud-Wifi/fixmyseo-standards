'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const Ajv = require('ajv/dist/2020');
const addFormats = require('ajv-formats');

const schema = require('../audit-report.schema.json');

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);

/** Build a minimal conformant audit report, optionally overriding the checks map. */
function makeMinimalAudit(checks) {
  return {
    standard_version: '0.1',
    audited_url: 'https://example.com',
    timestamp: '2026-05-20T10:30:00Z',
    checks: checks ?? { 'seo.https': { verdict: 'pass' } },
  };
}

/** Build a minimal audit with exactly one check, identified by checkId. */
function makeMinimalAuditWithCheck(checkId, extra = {}) {
  return makeMinimalAudit({ [checkId]: { verdict: 'not_checked', ...extra } });
}

/** Build a minimal audit whose seo.https check carries a measurement_type field. */
function makeMinimalAuditWithMeasurementType(value) {
  return makeMinimalAudit({
    'seo.https': { verdict: 'pass', measurement_type: value },
  });
}

/** Build a minimal audit whose seo.https check carries an action_category field. */
function makeMinimalAuditWithActionCategory(value) {
  return makeMinimalAudit({
    'seo.https': { verdict: 'pass', action_category: value },
  });
}

// ---------------------------------------------------------------------------
// Outcome 1 — New check IDs
// ---------------------------------------------------------------------------

describe('v0.1.1 vocabulary additions', () => {
  describe('Outcome 1 — new check IDs are accepted', () => {
    it('accepts seo.review_signals check ID', () => {
      const audit = makeMinimalAuditWithCheck('seo.review_signals');
      const valid = validate(audit);
      assert.equal(valid, true, JSON.stringify(validate.errors));
    });

    it('accepts geo.review_platform_presence check ID', () => {
      const audit = makeMinimalAuditWithCheck('geo.review_platform_presence');
      const valid = validate(audit);
      assert.equal(valid, true, JSON.stringify(validate.errors));
    });

    it('accepts geo.inbound_citation_velocity check ID', () => {
      const audit = makeMinimalAuditWithCheck('geo.inbound_citation_velocity');
      const valid = validate(audit);
      assert.equal(valid, true, JSON.stringify(validate.errors));
    });
  });

  // ---------------------------------------------------------------------------
  // Outcome 2 — measurement_type: connected
  // ---------------------------------------------------------------------------

  describe('Outcome 2 — measurement_type: connected is accepted', () => {
    it('accepts measurement_type: lab (pre-existing value)', () => {
      const audit = makeMinimalAuditWithMeasurementType('lab');
      const valid = validate(audit);
      assert.equal(valid, true, JSON.stringify(validate.errors));
    });

    it('accepts measurement_type: field (pre-existing value)', () => {
      const audit = makeMinimalAuditWithMeasurementType('field');
      const valid = validate(audit);
      assert.equal(valid, true, JSON.stringify(validate.errors));
    });

    it('accepts measurement_type: connected (new v0.1.1 value)', () => {
      const audit = makeMinimalAuditWithMeasurementType('connected');
      const valid = validate(audit);
      assert.equal(valid, true, JSON.stringify(validate.errors));
    });

    it('rejects an unknown measurement_type value', () => {
      const audit = makeMinimalAuditWithMeasurementType('live');
      const valid = validate(audit);
      assert.equal(valid, false, 'Expected validation to fail for unknown measurement_type');
      const matchingError = (validate.errors ?? []).find(
        (e) =>
          e.instancePath.includes('measurement_type') ||
          (e.keyword === 'enum' && e.schemaPath.includes('measurement_type'))
      );
      assert.ok(matchingError, `Expected an error mentioning measurement_type, got: ${JSON.stringify(validate.errors)}`);
    });
  });

  // ---------------------------------------------------------------------------
  // Outcome 3 — action_category field
  // ---------------------------------------------------------------------------

  describe('Outcome 3 — action_category field is accepted and validated', () => {
    it('accepts action_category: auto_deployable on findings', () => {
      const audit = makeMinimalAuditWithActionCategory('auto_deployable');
      const valid = validate(audit);
      assert.equal(valid, true, JSON.stringify(validate.errors));
    });

    it('accepts action_category: draft_handoff on findings', () => {
      const audit = makeMinimalAuditWithActionCategory('draft_handoff');
      const valid = validate(audit);
      assert.equal(valid, true, JSON.stringify(validate.errors));
    });

    it('accepts action_category: advisory on findings', () => {
      const audit = makeMinimalAuditWithActionCategory('advisory');
      const valid = validate(audit);
      assert.equal(valid, true, JSON.stringify(validate.errors));
    });

    it('accepts all three action_category values', () => {
      for (const cat of ['auto_deployable', 'draft_handoff', 'advisory']) {
        const audit = makeMinimalAuditWithActionCategory(cat);
        const valid = validate(audit);
        assert.equal(valid, true, `Expected valid for action_category: ${cat}, got: ${JSON.stringify(validate.errors)}`);
      }
    });

    it('rejects an invalid action_category value', () => {
      const audit = makeMinimalAuditWithActionCategory('not_a_real_category');
      const valid = validate(audit);
      assert.equal(valid, false, 'Expected validation to fail for unknown action_category');
      const matchingError = (validate.errors ?? []).find(
        (e) =>
          e.instancePath.includes('action_category') ||
          (e.keyword === 'enum' && e.schemaPath.includes('action_category'))
      );
      assert.ok(matchingError, `Expected an error mentioning action_category, got: ${JSON.stringify(validate.errors)}`);
    });

    it('action_category is optional — omitting it is valid', () => {
      const audit = makeMinimalAudit({ 'seo.https': { verdict: 'pass' } });
      const valid = validate(audit);
      assert.equal(valid, true, JSON.stringify(validate.errors));
    });
  });

  // ---------------------------------------------------------------------------
  // Outcome 4 — full §7.1 example from STANDARD.md validates cleanly
  // ---------------------------------------------------------------------------

  describe('Outcome 4 — §7.1 example audit with new vocabulary validates cleanly', () => {
    it('validates the §7.1 STANDARD.md example audit report', () => {
      const audit = {
        standard_version: '0.1',
        audited_url: 'https://example.com/page',
        timestamp: '2026-05-20T10:30:00Z',
        implementation: { name: 'FixMySEO Reference Engine', version: '1.0.0' },
        checks: {
          'seo.https': {
            verdict: 'pass',
            action_category: 'auto_deployable',
            measurement_type: 'lab',
            evidence: { final_url: 'https://example.com/page', final_protocol: 'https' },
          },
          'seo.review_signals': {
            verdict: 'not_checked',
            action_category: 'advisory',
            measurement_type: 'connected',
            truncation_reason: 'GBP not connected — unauthenticated audit mode.',
          },
          'geo.review_platform_presence': {
            verdict: 'warning',
            action_category: 'advisory',
            measurement_type: 'field',
            evidence: {
              platforms_checked: ['Yelp', 'Trustpilot', 'Google Maps'],
              platforms_present: ['Google Maps'],
              platforms_missing: ['Yelp', 'Trustpilot'],
            },
          },
          'geo.inbound_citation_velocity': {
            verdict: 'pass',
            action_category: 'advisory',
            measurement_type: 'field',
            evidence: {
              citation_count_current: 142,
              citation_count_prior_period: 118,
              velocity_direction: 'positive',
              top_citing_domains: ['example-news.com', 'industry-blog.org'],
            },
          },
        },
      };
      const valid = validate(audit);
      assert.equal(valid, true, JSON.stringify(validate.errors));
    });
  });
});
