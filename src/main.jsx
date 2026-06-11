import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

async function deferRender () {
    const {worker} = await import('./mocks/browser.js');
    return worker.start({
        serviceWorker: {
            url: "/mockServiceWorker.js"
        },
        onUnhandledRequest(req) {

            if (req.url.includes("/api/")) {
                console.warn(
                    `Unhandled API request: ${req.method} ${req.url}`
                );
            }

        }
    });
}

deferRender().then(()=>{
    createRoot(document.getElementById('root')).render(
        <StrictMode>
            <App />
        </StrictMode>,
    )
});
