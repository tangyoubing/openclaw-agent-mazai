const WebSocket = require('ws');

const PAGE_ID = '58B8D2C9EB3185543797C2532DC2588E';
const WS_URL = `ws://localhost:9222/devtools/page/${PAGE_ID}`;

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
    const r = await send('Runtime.evaluate', { expression: code, returnByValue: true });
    return r.result.value;
}

async function waitMs(ms) {
    return new Promise(r => setTimeout(r, ms));
}

async function clickByText(text) {
    return await evalJS(`
        (function() {
            const btns = Array.from(document.querySelectorAll('button'));
            const btn = btns.find(b => {
                const t = b.textContent.trim();
                return t === '${text}' && b.offsetParent !== null && !b.disabled;
            });
            if (btn) { btn.click(); return 'clicked'; }
            return 'not found';
        })()
    `);
}

ws.on('open', async () => {
    try {
        // Step 1: Nav to settings
        console.log('1. Navigate...');
        await send('Page.enable');
        await send('Page.navigate', { url: 'https://github.com/tangyoubing/openclaw-agent-mazai/settings' });
        await waitForLoad(20000);
        await waitMs(3000);

        // Step 2: Click Change visibility
        console.log('2. Change visibility...');
        await clickByText('Change visibility'); await waitMs(3000);

        // Step 3: Click Change to private
        console.log('3. Change to private...');
        await clickByText('Change to private'); await waitMs(3000);

        // Step 4: Click I want to make this repository private
        console.log('4. I want to make private...');
        await clickByText('I want to make this repository private'); await waitMs(2000);

        // Step 5: Click I have read and understand these effects
        console.log('5. I have read...');
        await clickByText('I have read and understand these effects'); await waitMs(2000);

        // Step 6: Look for final confirmation button
        console.log('6. Looking for final button...');
        const finalBtns = await evalJS(`
            (function() {
                const btns = Array.from(document.querySelectorAll('button'))
                    .filter(b => b.offsetParent !== null)
                    .map(b => JSON.stringify({ text: b.textContent.trim().substring(0, 80), disabled: b.disabled }))
                    .filter(t => t.includes('private') || t.includes('Private') || t.includes('Make') || t.includes('Change'));
                return JSON.stringify(btns);
            })()
        `);
        console.log('   ', finalBtns);

        // Step 7: Try all variants of final make private
        const makePriv = await evalJS(`
            (function() {
                const tries = ['Make private', 'Change to private', 'I understand, make this repository private'];
                for (const text of tries) {
                    const btn = Array.from(document.querySelectorAll('button'))
                        .find(b => b.textContent.trim() === text && b.offsetParent !== null && !b.disabled);
                    if (btn) { btn.click(); return 'clicked: ' + text; }
                }
                // Try contains
                const allBtns = Array.from(document.querySelectorAll('button'))
                    .filter(b => b.offsetParent !== null && !b.disabled);
                for (const b of allBtns) {
                    if (b.textContent.trim().includes('Make') && b.textContent.trim().includes('private')) {
                        b.click(); return 'clicked contains: ' + b.textContent.trim();
                    }
                }
                return 'no final button';
            })()
        `);
        console.log('7. Make private:', makePriv);

        await waitMs(5000);
        const final = await evalJS(`
            JSON.stringify({
                url: location.href,
                body: document.body ? document.body.innerText.substring(0, 400) : ''
            })
        `);
        console.log('Final:', final);

        ws.close();
    } catch (err) {
        console.error('ERROR:', err.message);
        ws.close();
    }
});

ws.on('error', (err) => console.error('WS error:', err.message));
