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
    const r = await send('Runtime.evaluate', { 
        expression: code, 
        returnByValue: true,
        awaitPromise: true 
    });
    return r.result.value;
}

ws.on('open', async () => {
    try {
        // Make it private via GitHub API
        console.log('Making repo private via API...');
        const result = await evalJS(`
            (async function() {
                try {
                    const token = document.querySelector('meta[name="csrf-token"]')?.content || '';
                    const resp = await fetch('https://api.github.com/repos/tangyoubing/openclaw-agent-mazai', {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/vnd.github+json'
                        },
                        credentials: 'include',
                        body: JSON.stringify({ private: true })
                    });
                    const text = await resp.text();
                    return JSON.stringify({ status: resp.status, ok: resp.ok, body: text.substring(0, 300) });
                } catch(e) {
                    return JSON.stringify({ error: e.message });
                }
            })()
        `);
        console.log('API result:', result);

        // Verify
        const verify = await evalJS(`
            (async function() {
                try {
                    const resp = await fetch('https://api.github.com/repos/tangyoubing/openclaw-agent-mazai', {
                        headers: { 'Accept': 'application/vnd.github+json' }
                    });
                    const data = await resp.json();
                    return JSON.stringify({ private: data.private, visibility: data.visibility, name: data.full_name });
                } catch(e) {
                    return JSON.stringify({ error: e.message });
                }
            })()
        `);
        console.log('Verify:', verify);

        console.log('\n=== DONE ===');
        ws.close();
    } catch (err) {
        console.error('ERROR:', err.message);
        ws.close();
    }
});

ws.on('error', (err) => console.error('WS error:', err.message));
