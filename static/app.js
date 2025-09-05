// ===== Config =====
const API_BASE = ""; // Set to "" for same-origin, or e.g. "http://localhost:8000"

//pop//
const dashboardState = {};
let currentPage = null;
//pop//

// ===== State =====
let token = localStorage.getItem("token") || null;

// ===== Utilities =====
const qs = (sel, el = document) => el.querySelector(sel);
const qsa = (sel, el = document) => Array.from(el.querySelectorAll(sel));

document.addEventListener("DOMContentLoaded", () => {
  const userButton = document.getElementById("userButton");
  const userDropdown = document.getElementById("userDropdown");
  const logoutBtn = document.getElementById("dropdownlogoutBtn");

  async function loadUserInfo() {
    try {
      const me = await apiFetch("/auth/me");
      document.getElementById("hoverUsername").textContent = me.username || "User";
      document.getElementById("hoverEmail").textContent = me.email || "";
      document.getElementById("detailUsername").textContent = me.username || "User";
      document.getElementById("detailEmail").textContent = me.email || "";
    } catch (err) {
      console.error("Error loading user info:", err);
    }
  }

  if (userButton) {
    userButton.addEventListener("click", () => {
      if (userDropdown.style.display === "block") {
        userDropdown.style.display = "none";
      } else {
        userDropdown.style.display = "block";
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "index.html";
    });
  }

  // Close dropdown if clicking outside of it
  window.addEventListener("click", (e) => {
    if (!userButton.contains(e.target) && !userDropdown.contains(e.target)) {
      userDropdown.style.display = "none";
    }
  });

  // Load the user info on page load
  loadUserInfo();
});


document.addEventListener("DOMContentLoaded", () => {
  const userButton = document.getElementById("userButton");
  if (userButton) {
    userButton.addEventListener("click", () => {
      // your code here
    });
  }
});

//pop//
function saveCurrentPageState(page) {
  if (!page) return;
  let state = {};

  switch (page) {
    case "ingestMetadata":
      const sel = qs("#connSelect");
      if (sel) state.selectedConnection = sel.value;
      if (dashboardState.ingestMetadata?.ingestResultData) {
        state.ingestResultData = dashboardState.ingestMetadata.ingestResultData;
      }
      break;
    case "createConnection":
      state.host = qs("#host")?.value || "";
      state.port = qs("#port")?.value || "";
      state.username = qs("#dbuser")?.value || "";
      state.password = qs("#dbpass")?.value || "";
      state.database = qs("#database")?.value || "";
      break;
    case "enrichCollection":
      state.metadataId = qs("#metadataId")?.value || "";
      state.description = qs("#colDesc")?.value || "";
      state.tags = qs("#colTags")?.value || "";
      state.owner = qs("#colOwner")?.value || "";
      break;
    case "enrichField":
      state.metadataId = qs("#f_metadataId")?.value || "";
      state.fieldName = qs("#f_fieldName")?.value || "";
      state.description = qs("#f_desc")?.value || "";
      state.tags = qs("#f_tags")?.value || "";
      break;
    case "autoPII":
      state.metadataId = qs("#piiMetadataId")?.value || "";
      break;
    case "viewMetadata":
      state.metadataId = qs("#view_metadataId")?.value || "";
      break;

    // Add other pages as needed
    default:
      return;  // no state saved
  }
  dashboardState[page] = state;
}

function restorePageState(page) {
  if (!page || !dashboardState[page]) return;
  let state = dashboardState[page];

  switch (page) {
    case "ingestMetadata":
      if (state.selectedConnection) {
        const sel = qs("#connSelect");
        if (sel) sel.value = state.selectedConnection;
      }
      if (state.ingestResultData) {
        dashboardState.ingestMetadata = dashboardState.ingestMetadata || {};
        dashboardState.ingestMetadata.ingestResultData = state.ingestResultData;
      }
      break;
    case "createConnection":
      if (state.host) qs("#host").value = state.host;
      if (state.port) qs("#port").value = state.port;
      if (state.username) qs("#dbuser").value = state.username;
      if (state.password) qs("#dbpass").value = state.password;
      if (state.database) qs("#database").value = state.database;
      break;
    case "enrichCollection":
      if (state.metadataId) qs("#metadataId").value = state.metadataId;
      if (state.description) qs("#colDesc").value = state.description;
      if (state.tags) qs("#colTags").value = state.tags;
      if (state.owner) qs("#colOwner").value = state.owner;
      break;
    case "enrichField":
      if (state.metadataId) qs("#f_metadataId").value = state.metadataId;
      if (state.fieldName) qs("#f_fieldName").value = state.fieldName;
      if (state.description) qs("#f_desc").value = state.description;
      if (state.tags) qs("#f_tags").value = state.tags;
      break;
    case "autoPII":
      if (state.metadataId) qs("#piiMetadataId").value = state.metadataId;
      break;
    case "viewMetadata":
      if (state.metadataId) qs("#view_metadataId").value = state.metadataId;
      break;

    // Add other pages as needed
    default:
      return;
  }
}
//pop//
// ----- Router & Page Renderers -----
async function route(page) {
  saveCurrentPageState(currentPage);
  currentPage = page;

  switch (page) {
    case "getUser":
      await renderGetUser();
      restorePageState(page);
      break;
    case "createConnection":
      await renderCreateConnection();
      restorePageState(page);
      break;
    case "listConnections":
      await renderListConnections();
      restorePageState(page);
      break;
    case "ingestMetadata":
      await renderIngestMetadata();
      restorePageState(page);
      break;
    case "enrichCollection":
      await renderEnrichCollection();
      restorePageState(page);
      break;
    case "enrichField":
      await renderEnrichField();
      restorePageState(page);
      break;
    case "autoPII":
      await renderAutoPII();
      restorePageState(page);
      break;
     case "viewMetadata":
      await renderViewMetadata();
      restorePageState(page);
      break;
    default:
      qs("#mainContent").innerHTML = `<div class="p-4"><h5>Unknown page</h5></div>`;
  }
}

function toast(msg) {
  const el = document.getElementById('appToast');
  if (!el) return alert(msg);
  document.getElementById('toastBody').textContent = msg;
  const t = new bootstrap.Toast(el, { delay: 2500 });
  t.show();
}

function setPageTitle(text) {
  const el = document.getElementById('pageTitle');
  if (el) el.textContent = text;
}

// Generic fetch with JSON + auth & errors
async function apiFetch(path, options = {}) {
  const headers = options.headers || {};
  if (!headers["Content-Type"] && options.body) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = "Bearer " + token;

  const res = await fetch(API_BASE + path, { ...options, headers });
  let data = null;
  try { data = await res.json(); } catch (e) { }
  if (!res.ok) {
    const msg = data?.detail || data?.msg || res.statusText || "Request failed";
    throw new Error(msg);
  }
  return data;
}

function renderIngestResult(data) {
  let html = `
    <h5 class="mb-4">📂 MongoDB Ingestion Result</h5>
    <div class="table-responsive mb-4">
      <table class="table table-bordered table-hover align-middle">
        <thead class="table-light">
          <tr>
            <th>ID</th>
            <th>Database</th>
            <th>Collection</th>
            <th>Created By</th>
            <th>Total Fields</th>
          </tr>
        </thead>
        <tbody>
  `;

  data.forEach((item, idx) => {
    html += `
      <tr data-bs-toggle="collapse" data-bs-target="#fields-${idx}" style="cursor:pointer">
        <td><code>${item.id || item._id || "-"}</code></td>
        <td>${item.database}</td>
        <td>${item.collection}</td>
        <td>${item.created_by}</td>
        <td>${item.fields.length}</td>
      </tr>
      <tr class="collapse" id="fields-${idx}">
        <td colspan="5">
          <div class="table-responsive">
            <table class="table table-bordered table-sm table-striped mb-0">
              <thead class="table-light">
                <tr>
                  <th>Field Name</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                ${item.fields.map(f => `
                  <tr>
                    <td>${f.name}</td>
                    <td><span class="badge bg-secondary">${f.type}</span></td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </td>
      </tr>
    `;
  });

  html += `</tbody></table></div>`;
  document.getElementById("ingestResult").innerHTML = html;


}

function pretty(obj) {
  return `<pre class="pretty mb-0">${escapeHtml(JSON.stringify(obj, null, 2))}</pre>`;
}
function escapeHtml(str) {
  return str.replace(/[&<>"'`=\/]/g, s => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;",
    '"': "&quot;", "'": "&#39;", "/": "&#x2F;",
    "`": "&#x60;", "=": "&#x3D;"
  })[s]);
}

function loadingBtn(btn, isLoading) {
  if (!btn) return;
  if (isLoading) {
    btn.dataset._text = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner me-2"></span> Working...`;
  } else {
    btn.disabled = false;
    if (btn.dataset._text) btn.innerHTML = btn.dataset._text;
  }
}

// ===== Auth Page (index.html) =====
if (qs("#authForm")) {
  const formTitle = qs("#formTitle");
  const toggleAuth = qs("#toggleAuth");
  const emailField = qs("#emailField");
  const authBtn = qs("#authButton");

  let isLogin = true;
  toggleAuth.addEventListener("click", (e) => {
    e.preventDefault();
    isLogin = !isLogin;
    formTitle.textContent = isLogin ? "Login" : "Register";
    authBtn.textContent = isLogin ? "Login" : "Register";
    emailField.style.display = isLogin ? "none" : "block";
    toggleAuth.textContent = isLogin ? "Don't have an account? Register" : "Already have an account? Login";
  });

  qs("#authForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = qs("#username").value.trim();
    const password = qs("#password").value;
    const email = qs("#email").value.trim();

    const endpoint = isLogin ? "/auth/login" : "/auth/register";
    const body = isLogin ? { username, password } : { username, email, password };

    try {
      loadingBtn(authBtn, true);
      const data = await apiFetch(endpoint, { method: "POST", body: JSON.stringify(body) });
      if (isLogin) {
        localStorage.setItem("token", data.access_token);
        token = data.access_token;
        window.location.href = "dashboard.html";
      } else {
        toast("Registration successful. Please login.");
        // swap back to login
        toggleAuth.click();
      }
    } catch (err) {
      toast(err.message);
    } finally {
      loadingBtn(authBtn, false);
    }
  });
}

// ===== Dashboard (dashboard.html) =====
if (qs("#logoutBtn")) {
  if (!token) window.location.href = "index.html";

  // Sidebar active state + routing
  qsa("[data-page]").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      qsa("[data-page]").forEach(a => a.classList.remove("active"));
      link.classList.add("active");
      const page = link.getAttribute("data-page");
      route(page);
    });
  });

  // Load user chip
  (async () => {
    try {
      const me = await apiFetch("/auth/me");
      const chip = qs("#userChip");
      if (chip) {
        chip.textContent = me?.email ? `${me.email}` : me?.id || "User";
      }

      const userRoleOrName = qs("#userRoleOrName");
      if (userRoleOrName) {
        userRoleOrName.textContent = me?.username || me?.email || "User";
      }
    } catch (e) {
      // token invalid -> logout
      localStorage.removeItem("token");
      window.location.href = "index.html";
    }
  })();

  // Logout
  const logoutBtn = qs("#logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "index.html";
    });
  }

  const showTokenBtn = qs("#showTokenBtn");
  if (showTokenBtn) {
    showTokenBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(token || "").then(() => toast("Token copied to clipboard"));
    });
  }
}




// Get Current User
async function renderGetUser() {
  setPageTitle("Get Current User");
  const content = qs("#mainContent");
  content.innerHTML = `<div class="card form-section shadow-sm"><div class="card-body">
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h5 class="mb-0">Current User</h5>
      <button class="btn btn-sm btn-primary" id="refreshBtn"><i class="bi bi-arrow-clockwise me-1"></i>Refresh</button>
    </div>
    <div id="userResult" class="border rounded p-3 bg-light-subtle">Loading...</div>
  </div></div>`;

  const load = async () => {
    try {
      const me = await apiFetch("/auth/me");
      qs("#userResult").innerHTML = pretty(me);
    } catch (e) {
      qs("#userResult").innerHTML = `<div class="text-danger">${escapeHtml(e.message)}</div>`;
    }
  };
  qs("#refreshBtn").addEventListener("click", load);
  load();
}

// Create DB Connection
function renderCreateConnection() {
  setPageTitle("Create DB Connection");
  qs("#mainContent").innerHTML = `<div class="card form-section shadow-sm"><div class="card-body">
    <h5 class="mb-3">New MongoDB Connection</h5>
    <form id="connForm" class="row g-3">
      <div class="col-md-8">
        <label class="form-label">Host</label>
        <input type="text" class="form-control" id="host" placeholder="cluster0.mongodb.net" required>
      </div>
      <div class="col-md-4">
        <label class="form-label">Port (optional)</label>
        <input type="number" class="form-control" id="port" placeholder="27017">
      </div>
      <div class="col-md-6">
        <label class="form-label">Username</label>
        <input type="text" class="form-control" id="dbuser" required>
      </div>
      <div class="col-md-6">
        <label class="form-label">Password</label>
        <input type="password" class="form-control" id="dbpass" required>
      </div>
      <div class="col-md-6">
        <label class="form-label">Database</label>
        <input type="text" class="form-control" id="database" required>
      </div>
      <div class="col-12 d-flex gap-2">
        <button class="btn btn-primary" id="saveConnBtn" type="submit"><i class="bi bi-save me-1"></i> Save Connection</button>
        <button class="btn btn-outline-secondary" type="reset">Reset</button>
      </div>
    </form>
    <div class="mt-3" id="connResult"></div>
  </div></div>`;
  //pop//
  restorePageState("createConnection");
  //pop//
  qs("#connForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = qs("#saveConnBtn");
    const body = {
      host: qs("#host").value.trim(),
      port: qs("#port").value ? Number(qs("#port").value) : undefined,
      username: qs("#dbuser").value.trim(),
      password: qs("#dbpass").value,
      database: qs("#database").value.trim()
    };
    try {
      loadingBtn(btn, true);
      const res = await apiFetch("/db/connect", { method: "POST", body: JSON.stringify(body) });
      qs("#connResult").innerHTML = `<div class="alert alert-success">Connection saved.</div>${pretty(res)}`;
    } catch (e) {
      qs("#connResult").innerHTML = `<div class="alert alert-danger">${escapeHtml(e.message)}</div>`;
    } finally {
      loadingBtn(btn, false);
    }
  });
}

// List Connections
async function renderListConnections() {
  setPageTitle("List Connections");
  const content = qs("#mainContent");
  content.innerHTML = `<div class="card shadow-sm"><div class="card-body">
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h5 class="mb-0">Your Connections</h5>
      <button class="btn btn-sm btn-primary" id="refreshList"><i class="bi bi-arrow-clockwise me-1"></i>Refresh</button>
    </div>
    <div id="listArea"></div>
  </div></div>`;

  async function load() {
    try {
      const list = await apiFetch("/db/connections");
      if (!list || !list.length) {
        qs("#listArea").innerHTML = `<div class="text-secondary">No connections yet.</div>`;
        return;
      }
      const rows = list.map(c => `
        <tr>
          <td>${escapeHtml(c.id)}</td>
          <td>${escapeHtml(c.host)}</td>
          <td>${escapeHtml(String(c.port))}</td>
          <td>${escapeHtml(c.username)}</td>
          <td>${escapeHtml(c.database)}</td>
          <td><code>${escapeHtml(c.created_by || "")}</code></td>
        </tr>`).join("");
      qs("#listArea").innerHTML = `
        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead>
              <tr><th>ID</th><th>Host</th><th>Port</th><th>User</th><th>DB</th><th>Created By</th></tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>`;
    } catch (e) {
      qs("#listArea").innerHTML = `<div class="alert alert-danger">${escapeHtml(e.message)}</div>`;
    }
  }
  qs("#refreshList").addEventListener("click", load);
  load();
}

// Ingest Metadata
async function renderIngestMetadata() {
  setPageTitle("Ingest Metadata");
  const content = qs("#mainContent");
  content.innerHTML = `<div class="card form-section shadow-sm"><div class="card-body">
    <h5 class="mb-3">Ingest from MongoDB Connection</h5>
    <form id="ingestForm" class="row g-3">
      <div class="col-12">
        <label class="form-label">Select Connection</label>
        <select id="connSelect" class="form-select" required>
          <option value="">Loading...</option>
        </select>
      </div>
      <div class="col-12 d-flex gap-2">
        <button class="btn btn-primary" id="ingestBtn" type="submit">
          <i class="bi bi-cloud-arrow-down me-1"></i> Ingest
        </button>
      </div>
    </form>
    <div class="mt-3" id="ingestResult"></div>
  </div></div>`;

  qs("#ingestResult").innerHTML = "";

  // Populate connections
  try {
    const list = await apiFetch("/db/connections");
    const sel = qs("#connSelect");
    if (!list || !list.length) {
      sel.innerHTML = `<option value="">No connections found</option>`;
    } else {
      sel.innerHTML = `<option value="">Select a connection</option>` +
        list.map(c => `<option value="${escapeHtml(c.id)}">${escapeHtml(c.host)} (${escapeHtml(c.database)})</option>`).join("");

      // ✅ Restore last selected connection if available
      if (dashboardState.ingestMetadata?.selectedConnection) {
        sel.value = dashboardState.ingestMetadata.selectedConnection;
      }
    }
  } catch (e) {
    qs("#ingestResult").innerHTML = `<div class="alert alert-danger">${escapeHtml(e.message)}</div>`;
  }

  // ✅ Restore previous ingestion result if available
  if (dashboardState.ingestMetadata?.ingestResultData) {
    qs("#ingestResult").innerHTML = `<div class="alert alert-success">Ingestion completed (restored).</div>`;
    renderIngestResult(dashboardState.ingestMetadata.ingestResultData);
  }

  // Handle ingestion form submit
  qs("#ingestForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = qs("#connSelect").value;
    if (!id) return toast("Please select a connection");
    const btn = qs("#ingestBtn");
    try {
      loadingBtn(btn, true);
      const data = await apiFetch(`/ingest/mongodb/${encodeURIComponent(id)}`, { method: "POST" });
      qs("#ingestResult").innerHTML = `<div class="alert alert-success">Ingestion completed.</div>`;

      // ✅ Save state (connection + result)
      dashboardState.ingestMetadata = dashboardState.ingestMetadata || {};
      dashboardState.ingestMetadata.selectedConnection = id;
      dashboardState.ingestMetadata.ingestResultData = data;

      renderIngestResult(data);  // show table
      populateMetadataDropdowns(data);

    } catch (e) {
      qs("#ingestResult").innerHTML = `<div class="alert alert-danger">${escapeHtml(e.message)}</div>`;
    } finally {
      loadingBtn(btn, false);
    }
  });
}

function useForEnrichment(metadataId) {
  ['metadataId', 'f_metadataId', 'piiMetadataId'].forEach(id => {
    const sel = document.getElementById(id);
    if (sel) sel.value = metadataId;
  });
  toast(`Metadata ${metadataId} selected for enrichment/PII`);
}




// Enrich Collection
function renderEnrichCollection() {
  setPageTitle("Enrich Collection");
  qs("#mainContent").innerHTML = `<div class="card form-section shadow-sm"><div class="card-body">
    <h5 class="mb-3">Update Collection Metadata</h5>
    <form id="colForm" class="row g-3">
      <div class="col-12">
        <label class="form-label">Collection sName</label>
        <select class="form-select" id="metadataId" required>
  <option value="">Select Collection</option>
</select>

      </div>
      <div class="col-12">
        <label class="form-label">Description</label>
        <textarea class="form-control" id="colDesc" rows="2" placeholder="Describe the collection"></textarea>
      </div>
      <div class="col-md-8">
        <label class="form-label">Tags (comma separated)</label>
        <input type="text" class="form-control" id="colTags" placeholder="sales,finance,pii">
      </div>
      <div class="col-md-4">
        <label class="form-label">Owner (email/username)</label>
        <input type="text" class="form-control" id="colOwner" placeholder="owner@example.com">
      </div>
      <div class="col-12">
        <button class="btn btn-primary" id="saveColBtn" type="submit"><i class="bi bi-save me-1"></i> Save</button>
      </div>
    </form>
    <div class="mt-3" id="colResult"></div>
  </div></div>`;


  //pop//
  restorePageState("enrichCollection");
  //pop//
  ensureMetadataDropdowns();
  qs("#colForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = qs("#saveColBtn");
    const id = qs("#metadataId").value.trim();
    const body = {};
    const desc = qs("#colDesc").value.trim();
    const tags = qs("#colTags").value.trim();
    const owner = qs("#colOwner").value.trim();
    if (desc) body.description = desc;
    if (tags) body.tags = tags.split(",").map(s => s.trim()).filter(Boolean);
    if (owner) body.owner = owner;

    try {
      loadingBtn(btn, true);
      const data = await apiFetch(`/metadata/${encodeURIComponent(id)}/collection`, {
        method: "PATCH",
        body: JSON.stringify(body)
      });
      qs("#colResult").innerHTML = `<div class="alert alert-success">${escapeHtml(data.msg || "Updated")}</div>`;
    } catch (e) {
      qs("#colResult").innerHTML = `<div class="alert alert-danger">${escapeHtml(e.message)}</div>`;
    } finally {
      loadingBtn(btn, false);
    }
  });
}

async function renderViewMetadata() {
  qs("#pageTitle").textContent = "View Metadata";
  qs("#mainContent").innerHTML = `
    <div class="container">
      <h5>Metadata Records</h5>
      <div class="mb-3">
        <label class="form-label">Select Collection</label>
        <select id="view_metadataId" class="form-select"></select>
      </div>
      <button class="btn btn-sm btn-primary mb-3" onclick="fetchMetadata()">Fetch Metadata</button>
      <div id="metadataResult" class="mt-3"></div>
    </div>
  `;

  ensureMetadataDropdowns(); // already exists in your app
}

async function fetchMetadata() {
  const id = qs("#view_metadataId").value;
  if (!id) return;
  try {
    const res = await fetch(`/metadata/${id}`, {
      headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
    });
    const data = await res.json();
    qs("#metadataResult").innerHTML =
      "<pre>" + JSON.stringify(data, null, 2) + "</pre>";
  } catch (err) {
    console.error(err);
    qs("#metadataResult").innerHTML =
      `<div class="alert alert-danger">Failed to load metadata</div>`;
  }
}



// Enrich Field
function renderEnrichField() {
  setPageTitle("Enrich Field");
  qs("#mainContent").innerHTML = `<div class="card form-section shadow-sm"><div class="card-body">
    <h5 class="mb-3">Update Field Metadata</h5>
    <form id="fieldForm" class="row g-3">
      <div class="col-md-6">
        <label class="form-label">Collection Name</label>
        <select class="form-select" id="f_metadataId" required>
  <option value="">Select Collection</option>
</select>

      </div>
      <div class="col-md-6">
        <label class="form-label">Field Name</label>
       <select class="form-select" id="f_fieldName" required>
    <option value="">Select Field</option>
  </select>
      </div>
      <div class="col-12">
        <label class="form-label">Description</label>
        <textarea class="form-control" id="f_desc" rows="2" placeholder="Describe the field"></textarea>
      </div>
      <div class="col-12">
        <label class="form-label">Tags (comma separated)</label>
        <input type="text" class="form-control" id="f_tags" placeholder="pii,email,identifier">
      </div>
      <div class="col-12">
        <button class="btn btn-primary" id="saveFieldBtn" type="submit"><i class="bi bi-save me-1"></i> Save</button>
      </div>
    </form>
    <div class="mt-3" id="fieldResult"></div>
  </div></div>`;


  //pop//
  restorePageState("enrichField");
  //pop//
  ensureMetadataDropdowns();
  qs("#fieldForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = qs("#saveFieldBtn");
    const id = qs("#f_metadataId").value.trim();
    const field = qs("#f_fieldName").value.trim();
    const body = {};
    const desc = qs("#f_desc").value.trim();
    const tags = qs("#f_tags").value.trim();
    if (desc) body.description = desc;
    if (tags) body.tags = tags.split(",").map(s => s.trim()).filter(Boolean);

    try {
      loadingBtn(btn, true);
      const data = await apiFetch(`/metadata/${encodeURIComponent(id)}/field/${encodeURIComponent(field)}`, {
        method: "PATCH",
        body: JSON.stringify(body)
      });
      qs("#fieldResult").innerHTML = `<div class="alert alert-success">${escapeHtml(data.msg || "Updated")}</div>`;
    } catch (e) {
      qs("#fieldResult").innerHTML = `<div class="alert alert-danger">${escapeHtml(e.message)}</div>`;
    } finally {
      loadingBtn(btn, false);
    }
  });
}

// Auto PII Tagging
function renderAutoPII() {
  setPageTitle("Auto PII Tagging");
  qs("#mainContent").innerHTML = `<div class="card form-section shadow-sm"><div class="card-body">
    <h5 class="mb-3">Run Automatic PII Detection</h5>
    <form id="piiForm" class="row g-3">
      <div class="col-md-8">
        <label class="form-label">Collection Name</label>
        <select class="form-select" id="piiMetadataId" required>
  <option value="">Select Collection</option>
</select>

      </div>
      <div class="col-12">
        <button class="btn btn-primary" id="piiBtn" type="submit"><i class="bi bi-shield-lock me-1"></i> Run</button>
      </div>
    </form>
    <div class="mt-3" id="piiResult"></div>
  </div></div>`;


  //pop//
  restorePageState("autoPII");
  //pop//
  ensureMetadataDropdowns();
  qs("#piiForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = qs("#piiBtn");
    const id = qs("#piiMetadataId").value.trim();
    try {
      loadingBtn(btn, true);
      const data = await apiFetch(`/metadata/${encodeURIComponent(id)}/auto-pii`, { method: "POST" });
      qs("#piiResult").innerHTML = `<div class="alert alert-success">${escapeHtml(data.msg || "PII tagging complete")}</div>`;
    } catch (e) {
      qs("#piiResult").innerHTML = `<div class="alert alert-danger">${escapeHtml(e.message)}</div>`;
    } finally {
      loadingBtn(btn, false);
    }
  });
}

function populateMetadataDropdowns(metadataList) {
  const dropdownIds = ['metadataId', 'f_metadataId', 'piiMetadataId', 'view_metadataId'];

  dropdownIds.forEach(dropdownId => {
    const dropdown = document.getElementById(dropdownId);
    if (dropdown) {
      dropdown.innerHTML = '<option value="">Select Collection</option>';
      metadataList.forEach(meta => {
        const option = document.createElement('option');
        option.value = meta.id;
        option.textContent = `${meta.collection}`;
        dropdown.appendChild(option);
      });
    }
  });
}

function ensureMetadataDropdowns() {
  if (dashboardState.ingestMetadata?.ingestResultData) {
    populateMetadataDropdowns(dashboardState.ingestMetadata.ingestResultData);

    const lastMetaId =
      dashboardState.enrichCollection?.metadataId ||
      dashboardState.enrichField?.metadataId ||
      dashboardState.autoPII?.metadataId;
      dashboardState.viewMetadata?.metadataId;

    if (lastMetaId) {
      ['metadataId', 'f_metadataId', 'piiMetadataId', 'view_metadataId'].forEach(id => {
        const sel = document.getElementById(id);
        if (sel) sel.value = lastMetaId;
      });
    }
    // 🔥 Add this: populate field names dynamically
    const fieldMetaSelect = document.getElementById("f_metadataId");
    const fieldNameSelect = document.getElementById("f_fieldName");

    if (fieldMetaSelect && fieldNameSelect) {
      fieldMetaSelect.addEventListener("change", () => {
        const metaId = fieldMetaSelect.value;
        fieldNameSelect.innerHTML = '<option value="">Select Field</option>';

        const selectedMeta = dashboardState.ingestMetadata.ingestResultData.find(m => m.id === metaId);
        if (selectedMeta && selectedMeta.fields) {
          selectedMeta.fields.forEach(f => {
            const opt = document.createElement("option");
            opt.value = f.name;
            opt.textContent = `${f.name} (${f.type})`;
            fieldNameSelect.appendChild(opt);
          });
        }
      });

      // Restore if previously chosen
      if (dashboardState.enrichField?.fieldName) {
        fieldNameSelect.value = dashboardState.enrichField.fieldName;
      }
    }
  }
}

