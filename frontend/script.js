// ✅ UPDATED frontend/script.js (copy-paste whole file)

// ✅ Change this if your Spring Boot runs on a different URL/port
const API_BASE = "http://localhost:8080";

const btnSignIn = document.getElementById("btnSignIn");
const btnSignUp = document.getElementById("btnSignUp");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const goToSignUp = document.getElementById("goToSignUp");
const goToSignIn = document.getElementById("goToSignIn");

const toast = document.getElementById("toast");

function showToast(message, type = "") {
    toast.textContent = message;
    toast.className = "toast";
    if (type) toast.classList.add(type);

    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => {
        toast.textContent = "";
        toast.className = "toast";
    }, 3500);
}

function setView(view) {
    const isSignIn = view === "signin";

    btnSignIn.classList.toggle("is-active", isSignIn);
    btnSignUp.classList.toggle("is-active", !isSignIn);

    loginForm.classList.toggle("is-visible", isSignIn);
    registerForm.classList.toggle("is-visible", !isSignIn);
}

btnSignIn.addEventListener("click", () => setView("signin"));
btnSignUp.addEventListener("click", () => setView("signup"));
goToSignUp.addEventListener("click", () => setView("signup"));
goToSignIn.addEventListener("click", () => setView("signin"));

setView("signin");

// Helpers
async function postJSON(url, data) {
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    let payload = null;
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
        payload = await res.json();
    } else {
        payload = await res.text();
    }

    if (!res.ok) {
        const msg =
            (payload && payload.message) ||
            (typeof payload === "string" && payload) ||
            `Request failed (${res.status})`;
        throw new Error(msg);
    }

    return payload;
}

// LOGIN submit
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    try {
        showToast("Signing in...", "");
        const data = await postJSON(`${API_BASE}/api/auth/login`, { email, password });

        const token = data?.token || data?.accessToken || null;

        if (token) {
            localStorage.setItem("auth_token", token);
            showToast("Login success! Token saved to localStorage.", "success");
            console.log("✅ Login response:", data);
        } else {
            showToast("Login success! (No token found in response)", "success");
            console.log("✅ Login response:", data);
        }
    } catch (err) {
        showToast(`Login failed: ${err.message}`, "error");
        console.error("❌ Login error:", err);
    }
});

// REGISTER submit (with confirm password + redirect to Sign In)
registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value;
    const confirmPassword = document.getElementById("regConfirmPassword").value;

    // ✅ Confirm password validation
    if (password !== confirmPassword) {
        showToast("Passwords do not match. Please re-type them.", "error");
        return;
    }

    try {
        showToast("Creating account...", "");
        const data = await postJSON(`${API_BASE}/api/auth/register`, { name, email, password });

        console.log("✅ Register response:", data);

        // ✅ Redirect (switch view) to Sign In immediately after success
        showToast("Registered successfully! Redirecting to Sign In...", "success");
        setView("signin");

        // Auto-fill login email and clear password field
        document.getElementById("loginEmail").value = email;
        document.getElementById("loginPassword").value = "";

        // Clear sign up form fields
        registerForm.reset();
    } catch (err) {
        showToast(`Registration failed: ${err.message}`, "error");
        console.error("❌ Register error:", err);
    }
});
