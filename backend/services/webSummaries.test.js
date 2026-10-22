// node --test services/webSummaries.test.js
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'runqc-ws-'));
process.env.FASTQC_PATH = `${root}/FASTQ/`;
const { getWebSummaries } = require('./services');

const touch = (rel, when) => {
    const p = path.join(root, 'FASTQ', rel);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, '<html/>');
    fs.utimesSync(p, when, when);
};

test('lists a project\'s published web summaries, newest first, with their site paths', async () => {
    touch('CELLRANGER/18995/Rectal_C2_IGO_18995_1___ARC___BONO_0230_B23M3FMLT3_temporal.html', new Date('2026-10-22T18:00:00Z'));
    touch('CELLRANGER/18995/Rectal_C2_IGO_18995_2___ARC___BONO_0230_B23M3FMLT3_temporal.html', new Date('2026-10-22T19:00:00Z'));
    touch('CELLRANGER/18995/notes.txt', new Date('2026-10-22T20:00:00Z'));
    touch('CELLRANGER/19022/AS38_IGO_19022_1___GEX___BONO_0226_B23MMK2LT3_temporal.html', new Date());
    const list = await getWebSummaries('18995');
    assert.deepStrictEqual(list.map(s => [s.sample, s.kind, s.run]), [
        ['Rectal_C2_IGO_18995_2', 'ARC', 'BONO_0230_B23M3FMLT3'],
        ['Rectal_C2_IGO_18995_1', 'ARC', 'BONO_0230_B23M3FMLT3'],
    ]);
    assert.strictEqual(list[0].path,
        'static/html/FASTQ/CELLRANGER/18995/Rectal_C2_IGO_18995_2___ARC___BONO_0230_B23M3FMLT3_temporal.html');
});

test('a project with none: an empty list', async () => {
    assert.deepStrictEqual(await getWebSummaries('99999'), []);
});

test('a project id that would leave the folder is refused', async () => {
    await assert.rejects(() => getWebSummaries('../../etc'), /Invalid project id/);
});
