const WebSocket = require('ws');

const PAGE_ID = '6BD5516BB93A97CE9A13FED90402652E';
const WS_URL = `ws://localhost:9222/devtools/page/${PAGE_ID}`;
const REPO_NAME = 'openclaw-agent-mazai';

const ws = new WebSocket(WS_URL);
const pending = new Map();
let msgId = 0;
let loadResolve = null;

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
    if (msg.method === 'Page.loadEventFired' && loadResolve) {
        loadResolve();
        loadResolve = null;
    }
});

function waitForLoad(timeoutMs = 15000) {
    return new Promise((resolve) => {
        loadResolve = resolve;
        setTimeout(() => {
            if (loadResolve) { loadResolve = null; resolve(); }
        }, timeoutMs);
    });
}

async function evalJS(code) {
    const r = await send('Runtime.evaluate', { expression: code, returnByValue: true, awaitPromise: true });
    return r.result.value;
}

async function waitMs(ms) {
    return new Promise(r => setTimeout(r, ms));
}

function setInput(id, value) {
    return evalJS(`
        (function() {
            const el = document.querySelector('#${id}');
            if (!el) return 'not found: #${id}';
            const nativeSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
            nativeSetter.call(el, '${value}');
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
            return 'set';
        })()
    `);
}

ws.on('open', async () => {
    try {
        await send('Page.enable');
        await waitMs(2000);

        // 1. Set repo name
        console.log('1. Setting repo name...');
        let r = await setInput('project_name', REPO_NAME);
        console.log('   ', r);

        // 2. Set path
        console.log('2. Setting path...');
        r = await setInput('project_path', REPO_NAME);
        console.log('   ', r);

        // 3. Click Private radio (value=0)
        console.log('3. Setting Private...');
        r = await evalJS(`
            (function() {
                const privateRadio = document.querySelector('#project_public_0');
                if (privateRadio) {
                    privateRadio.click();
                    return 'clicked private radio';
                }
                return 'private radio not found';
            })()
        `);
        console.log('   ', r);

        await waitMs(1000);

        // 4. Click submit button
        console.log('4. Clicking create...');
        r = await evalJS(`
            (function() {
                const btn = document.querySelector('#submit-project-new');
                if (btn && !btn.disabled) {
                    btn.click();
                    return 'clicked';
                }
                return 'not found or disabled';
            })()
        `);
        console.log('   ', r);

        // 5. Wait for redirect and get repo URL
        await waitMs(5000);
        const final = await evalJS(`
            JSON.stringify({
                title: document.title,
                url: location.href,
                bodySnippet: document.body ? document.body.innerText.substring(0, 500) : ''
            })
        `);
        console.log('\n5. Final state:', final);

        // Extract git URL
        const gitUrl = await evalJS(`
            (function() {
                // Look for clone URL on page
                const cloneInput = document.querySelector('input[value*=".git"], input[value*="gitee.com"]');
                if (cloneInput) return cloneInput.value;
                // Try to construct from URL
                const m = location.href.match(/gitee\\.com\\/([^/]+)\\/([^/]+)/);
                if (m) return 'https://gitee.com/' + m[1] + '/' + m[2] + '.git';
                return 'could not determine';
            })()
        `);
        console.log('Git URL:', gitUrl);

        ws.close();
    } catch (err) {
        console.error('ERROR:', err.message);
        ws.close();
    }
});

ws.on('error', (err) => console.error('WS error:', err.message));
