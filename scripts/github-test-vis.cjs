const WebSocket = require('ws');

const PAGE_ID = '58B8D2C9EB3185543797C2532DC2588E';
const WS_URL = `ws://localhost:9222/devtools/page/${PAGE_ID}`;

const ws = new WebSocket(WS_URL);
const pending = new Map();
let msgId = 0;

function send(method, params = {}) {
    return new Promise((resolve, reject) => {
        const id = ++msgId;
        pending.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params }));
        setTimeout(() => {
            if (pending.has(id)) {
                pending.delete(id);
                reject(new Error(`Timeout: ${method}`));
            }
        }, 30000);
    });
}

ws.on('message', (data) => {
    const msg = JSON.parse(data.toString());
    if (msg.id && pending.has(msg.id)) {
        const { resolve, reject } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) reject(new Error(JSON.stringify(msg.error)));
        else resolve(msg.result);
    }
});

async function evalJS(code) {
    const r = await send('Runtime.evaluate', { expression: code, returnByValue: true, awaitPromise: true });
    return r.result.value;
}

async function waitMs(ms) {
    return new Promise(r => setTimeout(r, ms));
}

ws.on('open', async () => {
    try {
        // Navigate to settings page first to get proper token and see form
        await send('Page.enable');
        await send('Page.navigate', { url: 'https://github.com/tangyoubing/openclaw-agent-mazai/settings' });
        await new Promise((resolve) => {
            const handler = (data) => {
                try {
                    const msg = JSON.parse(data.toString());
                    if (msg.method === 'Page.loadEventFired') {
                        ws.removeListener('message', handler);
                        resolve();
                    }
                } catch(e) {}
            };
            ws.on('message', handler);
            setTimeout(() => resolve(), 20000);
        });
        await waitMs(3000);
        console.log('Settings page loaded');

        // Try multiple visibility API variants
        const token = await evalJS('document.querySelector("meta[name=\\"csrf-token\\"]")?.content || ""');
        console.log('CSRF:', token.substring(0, 20) + '...');

        // Variant 1: Simple form data
        console.log('\nVariant 1: simple form...');
        const v1 = await evalJS(`
            (async function() {
                try {
                    const token = '${token}';
                    const form = new FormData();
                    form.append('authenticity_token', token);
                    form.append('_method', 'put');
                    form.append('repository[visibility]', 'private');
                    form.append('verify', 'tangyoubing/openclaw-agent-mazai');
                    
                    const resp = await fetch('/tangyoubing/openclaw-agent-mazai/settings/visibility', {
                        method: 'POST',
                        headers: { 'Accept': 'application/json, text/html' },
                        body: form
                    });
                    const text = await resp.text();
                    return JSON.stringify({ status: resp.status, ok: resp.ok, body: text.substring(0, 500) });
                } catch(e) {
                    return JSON.stringify({ error: e.message });
                }
            })()
        `);
        console.log('v1:', v1);

        // Variant 2: Without verify
        console.log('\nVariant 2: without verify...');
        const v2 = await evalJS(`
            (async function() {
                try {
                    const form = new FormData();
                    form.append('authenticity_token', '${token}');
                    form.append('_method', 'patch');
                    form.append('repository[visibility]', 'private');
                    
                    const resp = await fetch('/tangyoubing/openclaw-agent-mazai/settings/visibility', {
                        method: 'POST',
                        headers: { 'Accept': 'application/json' },
                        body: form
                    });
                    const text = await resp.text();
                    return JSON.stringify({ status: resp.status, ok: resp.ok, body: text.substring(0, 500) });
                } catch(e) {
                    return JSON.stringify({ error: e.message });
                }
            })()
        `);
        console.log('v2:', v2);

        // Variant 3: Use JSON body
        console.log('\nVariant 3: JSON body...');
        const v3 = await evalJS(`
            (async function() {
                try {
                    const resp = await fetch('/tangyoubing/openclaw-agent-mazai/settings/visibility', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'X-CSRF-Token': '${token}'
                        },
                        body: JSON.stringify({ repository: { visibility: 'private' }, verify: 'tangyoubing/openclaw-agent-mazai' })
                    });
                    const text = await resp.text();
                    return JSON.stringify({ status: resp.status, ok: resp.ok, body: text.substring(0, 500) });
                } catch(e) {
                    return JSON.stringify({ error: e.message });
                }
            })()
        `);
        console.log('v3:', v3);

        // Check final visibility
        const check = await evalJS(`
            (async function() {
                try {
                    const resp = await fetch('https://api.github.com/repos/tangyoubing/openclaw-agent-mazai', {
                        headers: { 'Accept': 'application/vnd.github+json' }
                    });
                    const data = await resp.json();
                    return JSON.stringify({ private: data.private, visibility: data.visibility });
                } catch(e) {
                    return JSON.stringify({ error: e.message });
                }
            })()
        `);
        console.log('\nFinal check:', check);

        ws.close();
    } catch (err) {
        console.error('ERROR:', err.message);
        ws.close();
    }
});

ws.on('error', (err) => console.error('WS error:', err.message));
