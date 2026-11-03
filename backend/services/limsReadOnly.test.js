// node --test services/limsReadOnly.test.js
const test = require('node:test');
const assert = require('node:assert');
const axios = require('axios');

process.env.LIMS_URL = 'https://lims.invalid/LimsRest';
const { setQCStatus, requestRepool, limsReadOnly } = require('./services');

const posts = [];
axios.post = async (url) => {
    posts.push(url);
    return { data: { ok: true } };
};

test('LIMS_READ_ONLY=true refuses QC status changes and repools without calling LIMS', async () => {
    process.env.LIMS_READ_ONLY = 'true';
    posts.length = 0;
    await assert.rejects(setQCStatus('123', 'Passed', '19000', 'HumanWholeGenome', 'Seq'),
        /LIMS is read-only here \(LIMS_READ_ONLY\), so the QC status change was not sent/);
    await assert.rejects(requestRepool('123', 'Passed', 'HumanWholeGenome'), /the repool request was not sent/);
    assert.deepStrictEqual(posts, []);
});

test('writes go to LIMS when LIMS_READ_ONLY is unset, empty or false', async () => {
    for (const value of [undefined, '', 'false', '0']) {
        if (value === undefined) delete process.env.LIMS_READ_ONLY; else process.env.LIMS_READ_ONLY = value;
        posts.length = 0;
        assert.strictEqual(limsReadOnly(), false, `LIMS_READ_ONLY=${value}`);
        assert.deepStrictEqual(await setQCStatus('123', 'Passed', '19000', 'HumanWholeGenome', 'Seq'), { ok: true });
        assert.deepStrictEqual(posts, ['https://lims.invalid/LimsRest/setQcStatus']);
    }
});

test('accepts 1, yes and TRUE as read-only', () => {
    for (const value of ['1', 'yes', 'TRUE', ' true ']) {
        process.env.LIMS_READ_ONLY = value;
        assert.strictEqual(limsReadOnly(), true, `LIMS_READ_ONLY=${value}`);
    }
});
