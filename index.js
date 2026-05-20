'use strict';

const path = require('path');

/**
 * @fixmyseo/standard — AI Visibility Audit Standard v0.1
 *
 * Exports the canonical JSON Schema for audit reports conformant to the
 * AI Visibility Audit Standard. Use `schemaPath` to reference the file
 * directly (e.g. for AJV or another JSON Schema validator), or use `schema`
 * to access the parsed object.
 *
 * @example
 * const { schema, schemaPath } = require('@fixmyseo/standard');
 * const Ajv = require('ajv/dist/2020');
 * const ajv = new Ajv();
 * const validate = ajv.compile(schema);
 */

const schemaPath = path.join(__dirname, 'audit-report.schema.json');

module.exports = {
  /** Absolute path to audit-report.schema.json */
  schemaPath,

  /** Parsed JSON Schema object (draft 2020-12) */
  schema: require('./audit-report.schema.json'),

  /** Standard version this package implements */
  standardVersion: '0.1.2',

  /** Package version */
  version: '0.1.2',
};
