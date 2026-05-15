const WebSocket = require('ws');

const PAGE_ID = '58B8D2C9EB3185543797C2532DC2588E';
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
    const r = await send('Runtime.evaluate', { expression: code, returnByValue: true });
    return r.result.value;
}

async function waitMs(ms) {
    return new Promise(r => setTimeout(r, ms));
}

ws.on('open', async () => {
    try {
        // Step 1: Navigate to new repo page (it might already be there)
        console.log('Navigating to https://github.com/new ...');
        await send('Page.enable');
        await send('Page.navigate', { url: 'https://github.com/new' });
        await waitForLoad(20000);
        await waitMs(3000);

        // Step 2: Verify we're on the right page
        const title = await evalJS('document.title');
        console.log('Page title:', title);
        
        if (!title.includes('New repository') && !title.includes('Create')) {
            throw new Error('Not on the create repo page, got: ' + title);
        }

        // Step 3: Fill in repository name using the id
        console.log('Setting repo name to:', REPO_NAME);
        const setName = await evalJS(`
            (function() {
                const input = document.querySelector('#repository-name-input');
                if (!input) return 'input not found';
                const nativeSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
                nativeSetter.call(input, '${REPO_NAME}');
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
                return 'set to ${REPO_NAME}';
            })()
        `);
        console.log('Name result:', setName);

        await waitMs(1500);

        // Step 4: Set to private
        console.log('Setting to private...');
        const setPrivate = await evalJS(`
            (function() {
                // Try various ways to set private
                const privateRadio = document.querySelector('input[value="private"]');
                if (privateRadio) {
                    privateRadio.click();
                    return 'clicked private radio (value=private)';
                }
                // Try clicking the Private button/label
                const privateBtn = document.querySelector('#visibility-private');
                if (privateBtn) {
                    privateBtn.click();
                    return 'clicked #visibility-private';
                }
                // Try aria-label
                const privateAria = document.querySelector('[aria-label*="Private"]');
                if (privateAria) {
                    privateAria.click();
                    return 'clicked aria-label Private';
                }
                // Try clicking the second radio in the visibility group
                const allRadios = document.querySelectorAll('input[type="radio"]');
                if (allRadios.length >= 2) {
                    allRadios[1].click();
                    return 'clicked second radio';
                }
                return 'could not find private option';
            })()
        `);
        console.log('Private result:', setPrivate);

        await waitMs(2000);

        // Step 5: Check if create button is enabled and click it
        const btnCheck = await evalJS(`
            (function() {
                const btns = Array.from(document.querySelectorAll('button')).map(b => ({
                    text: b.textContent.trim().substring(0, 60),
                    disabled: b.disabled,
                    type: b.type,
                    visible: b.offsetParent !== null
                })).filter(b => b.visible && b.text.includes('Create'));
                return JSON.stringify(btns);
            })()
        `);
        console.log('Create buttons:', btnCheck);

        // Click the submit button
        const clickResult = await evalJS(`
            (function() {
                const btns = Array.from(document.querySelectorAll('button[type="submit"]'));
                for (const btn of btns) {
                    if (btn.textContent.includes('Create') && !btn.disabled && btn.offsetParent !== null) {
                        btn.click();
                        return 'clicked: ' + btn.textContent.trim();
                    }
                }
                return 'no clickable create button found';
            })()
        `);
        console.log('Click result:', clickResult);

        // Step 6: Wait for success/redirect
        await waitMs(5000);
        const finalUrl = await evalJS('window.location.href');
        console.log('Final URL:', finalUrl);

        const finalTitle = await evalJS('document.title');
        console.log('Final title:', finalTitle);

        // Check for quick setup box (confirms repo created)
        const setupInfo = await evalJS(`
            (function() {
                const quickSetup = document.querySelector('[data-url], .quick-setup');
                const urlBox = document.querySelector('input[value*="github.com"]');
                const cloneUrl = document.querySelector('input[value*=".git"]');
                return JSON.stringify({
                    quickSetup: !!quickSetup,
                    urlBoxValue: urlBox ? urlBox.value : null,
                    cloneUrlValue: cloneUrl ? cloneUrl.value : null,
                    bodySnippet: document.body ? document.body.innerText.substring(0, 300) : ''
                });
            })()
        `);
        console.log('Setup info:', setupInfo);

        console.log('\n=== SUCCESS ===');
        ws.close();
    } catch (err) {
        console.error('ERROR:', err.message);
        ws.close();
    }
});

ws.on('error', (err) => console.error('WS error:', err.message));
