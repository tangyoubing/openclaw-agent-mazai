const WebSocket = require('ws');

const PAGE_ID = '250C5F7C20E502EABB5C1B00F8F68AA7'; // GitHub profile tab
const WS_URL = `ws://localhost:9222/devtools/page/${PAGE_ID}`;
const REPO_NAME = 'openclaw-agent-mazai';

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

let loadResolve = null;

ws.on('message', (data) => {
    const msg = JSON.parse(data.toString());
    if (msg.id && pending.has(msg.id)) {
        const { resolve, reject } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) reject(new Error(JSON.stringify(msg.error)));
        else resolve(msg.result);
    }
    // Handle async events
    if (msg.method === 'Page.loadEventFired' && loadResolve) {
        loadResolve();
        loadResolve = null;
    }
});

function waitForLoad(timeoutMs = 15000) {
    return new Promise((resolve, reject) => {
        loadResolve = resolve;
        setTimeout(() => {
            if (loadResolve) {
                loadResolve = null;
                resolve(); // resolve anyway after timeout
            }
        }, timeoutMs);
    });
}

ws.on('open', async () => {
    try {
        // Step 1: Navigate to new repo page
        console.log('Navigating to https://github.com/new...');
        await send('Page.navigate', { url: 'https://github.com/new' });
        
        // Step 2: Enable Page domain and wait for load
        await send('Page.enable');
        await waitForLoad(15000);
        
        // Wait extra for React to render
        await new Promise(r => setTimeout(r, 5000));
        
        // Step 3: Full page debug
        const debug = await send('Runtime.evaluate', {
            expression: `
                (function() {
                    const bodyText = document.body ? document.body.innerText.substring(0, 2000) : 'no body';
                    const inputs = Array.from(document.querySelectorAll('input')).map(i => ({
                        name: i.name,
                        id: i.id,
                        type: i.type,
                        value: i.value,
                        placeholder: i.placeholder
                    }));
                    const buttons = Array.from(document.querySelectorAll('button')).map(b => ({
                        text: b.textContent.trim().substring(0, 50),
                        type: b.type
                    }));
                    return JSON.stringify({
                        title: document.title,
                        url: window.location.href,
                        inputs: inputs,
                        buttons: buttons,
                        bodySnippet: bodyText.substring(0, 1500)
                    });
                })()
            `,
            returnByValue: true
        });
        console.log('Page debug:', debug.result.value);
        
        console.log('DONE');
        ws.close();
    } catch (err) {
        console.error('Error:', err.message);
        ws.close();
    }
});

ws.on('error', (err) => {
    console.error('WebSocket error:', err.message);
});
