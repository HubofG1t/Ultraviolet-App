"use strict";

const form = document.getElementById("uv-form");
const address = document.getElementById("uv-address");
const searchEngine = document.getElementById("uv-search-engine");
const error = document.getElementById("uv-error");
const errorCode = document.getElementById("uv-error-code");

const connection = new BareMux.BareMuxConnection("/baremux/worker.js");

async function forceLaunch() {
    try {
        await registerSW();
        let frame = document.getElementById("uv-frame");
        if (frame) {
            frame.style.display = "block";
            let wispUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/";
            if ((await connection.getTransport()) !== "/epoxy/index.mjs") {
                await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
            }
            frame.src = __uv$config.prefix + __uv$config.encodeUrl("https://geforcenow.com");
        }
    } catch (err) {
        console.error(err);
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", forceLaunch);
} else {
    forceLaunch();
}

if (form) {
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        try {
            await registerSW();
        } catch (err) {
            error.textContent = "Failed to register service worker.";
            errorCode.textContent = err.toString();
            throw err;
        }

        let frame = document.getElementById("uv-frame");
        frame.style.display = "block";
        let wispUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/";
        if ((await connection.getTransport()) !== "/epoxy/index.mjs") {
            await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
        }
        
        frame.src = __uv$config.prefix + __uv$config.encodeUrl("https://geforcenow.com");
    });
}

