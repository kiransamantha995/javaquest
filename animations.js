// JavaQuest — animations.js
// Interactive Neobrutalist Visualizers, Java Syntax Highlighter & Canvas Animations

/* ── Helpers ─────────────────────────────────────── */
function escHtml(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/* ── Java Syntax Highlighter ─────────────────────── */
const KW = new Set(['abstract','assert','boolean','break','byte','case','catch','char','class',
  'const','continue','default','do','double','else','enum','extends','final','finally',
  'float','for','goto','if','implements','import','instanceof','int','interface','long',
  'native','new','package','private','protected','public','return','short','static',
  'strictfp','super','switch','synchronized','this','throw','throws','transient','try',
  'var','void','volatile','while','record','sealed','permits','yield']);
const TYPES = new Set(['String','Integer','Double','Boolean','Character','Long','Float','Short',
  'Byte','Object','System','Math','Scanner','ArrayList','LinkedList','HashMap','HashSet',
  'List','Map','Set','Queue','Stack','Arrays','Collections','Optional','StringBuilder',
  'StringBuffer','Exception','RuntimeException','Thread','Runnable','Iterable','Stream',
  'Collectors','Predicate','Function','Consumer','Supplier','CompletableFuture']);

function highlightSyntax(code) {
  let r = '', i = 0, n = code.length;
  while (i < n) {
    if (code[i]==='/' && code[i+1]==='/') {
      let j=i; while(j<n && code[j]!=='\n') j++;
      r+=`<span class="syn-cmt">${escHtml(code.slice(i,j))}</span>`; i=j; continue;
    }
    if (code[i]==='/' && code[i+1]==='*') {
      let j=i+2; while(j<n-1&&!(code[j]==='*'&&code[j+1]==='/')) j++; j+=2;
      r+=`<span class="syn-cmt">${escHtml(code.slice(i,j))}</span>`; i=j; continue;
    }
    if (code[i]==='"') {
      let j=i+1; while(j<n&&code[j]!=='"'){if(code[j]==='\\')j++;j++;}j++;
      r+=`<span class="syn-str">${escHtml(code.slice(i,j))}</span>`; i=j; continue;
    }
    if (code[i]==="'") {
      let j=i+1; while(j<n&&code[j]!=="'"){if(code[j]==='\\')j++;j++;}j++;
      r+=`<span class="syn-str">${escHtml(code.slice(i,j))}</span>`; i=j; continue;
    }
    if (code[i]==='@') {
      let j=i+1; while(j<n&&/[A-Za-z0-9_]/.test(code[j]))j++;
      r+=`<span class="syn-ann">${escHtml(code.slice(i,j))}</span>`; i=j; continue;
    }
    if (/[0-9]/.test(code[i]) && (i===0||!/[A-Za-z_]/.test(code[i-1]))) {
      let j=i; while(j<n&&/[0-9._xXbBfFlL]/.test(code[j]))j++;
      r+=`<span class="syn-num">${escHtml(code.slice(i,j))}</span>`; i=j; continue;
    }
    if (/[A-Za-z_$]/.test(code[i])) {
      let j=i; while(j<n&&/[A-Za-z0-9_$]/.test(code[j]))j++;
      const w=code.slice(i,j);
      const after=code.slice(j).trimStart();
      if (after.startsWith('(')&&!KW.has(w)) r+=`<span class="syn-fn">${escHtml(w)}</span>`;
      else if (KW.has(w))    r+=`<span class="syn-kw">${escHtml(w)}</span>`;
      else if (TYPES.has(w)) r+=`<span class="syn-type">${escHtml(w)}</span>`;
      else r+=escHtml(w);
      i=j; continue;
    }
    if (/[+\-*/%=<>!&|^~?:;,.]/.test(code[i])) {
      r+=`<span class="syn-op">${escHtml(code[i])}</span>`; i++; continue;
    }
    r+=escHtml(code[i]); i++;
  }
  return r;
}

/* ── Code Block ──────────────────────────────────── */
function buildCodeBlock(code, lang) {
  lang = lang || 'Java';
  return `<div class="code-block">
    <div class="code-block-header">
      <span class="code-lang-tag">${lang}</span>
      <button class="code-copy-btn" onclick="copyCode(this)">Copy</button>
    </div>
    <pre>${highlightSyntax(code)}</pre>
  </div>`;
}

function copyCode(btn) {
  const pre = btn.closest('.code-block').querySelector('pre');
  navigator.clipboard.writeText(pre.innerText).then(function() {
    btn.textContent = 'Copied!';
    setTimeout(function(){ btn.textContent = 'Copy'; }, 1800);
  }).catch(function() {});
}

/* ═════════════════════════════════════════════════════════════════════
   MASTER VISUALIZER DISPATCHER
   ═════════════════════════════════════════════════════════════════════ */
function renderVisualizer(container, type, data) {
  if (!container) return;
  container.innerHTML = '';

  if (type === 'jvm') {
    renderJVMVisualizer(container, data);
  } else if (type === 'memory') {
    renderMemoryDiagram(container, data);
  } else if (type === 'hashmap') {
    renderHashMapVisualizer(container, data);
  } else if (type === 'stream') {
    renderStreamVisualizer(container, data);
  } else if (type === 'thread' || type === 'threads') {
    renderThreadVisualizer(container, data);
  } else if (type === 'loop') {
    renderLoopTracer(container, data);
  } else if (type === 'flowchart') {
    renderFlowchart(container, data);
  } else if (type === 'class-diagram') {
    renderClassDiagram(container, data);
  } else {
    container.innerHTML = `<div style="padding:1.5rem;text-align:center;">
      <div style="font-size:2.5rem;margin-bottom:0.5rem">🎯</div>
      <div style="font-weight:800;color:var(--ink)">${escHtml(type ? type.toUpperCase() : 'INTERACTIVE VISUALIZER')}</div>
    </div>`;
  }
}

/* ── 1. JVM Architecture & Execution Pipeline Visualizer ─────────── */
function renderJVMVisualizer(container, data) {
  const stages = [
    { id: 'src', title: '1. Source (.java)', desc: 'Human-readable Java code with classes and methods.' },
    { id: 'cmp', title: '2. javac Compiler', desc: 'Type-checks and compiles source into portable .class bytecode.' },
    { id: 'cld', title: '3. ClassLoader', desc: 'Loads, verifies, prepares, and links classes into memory.' },
    { id: 'mem', title: '4. JVM Runtime Memory', desc: 'Allocates Metaspace (classes), Heap (objects), and Thread Stacks.' },
    { id: 'eng', title: '5. Execution Engine', desc: 'Interpreter + HotSpot JIT (C1/C2 tiered compilation) + GC.' },
    { id: 'cpu', title: '6. Native Silicon', desc: 'Executes native machine code directly on OS hardware.' }
  ];

  let activeIdx = 0;
  const wrap = document.createElement('div');
  wrap.className = 'vis-neobrutal-wrap';
  wrap.innerHTML = `
    <div class="vis-header-bar">
      <span class="vis-title-badge">⚙️ JVM EXECUTION ARCHITECTURE</span>
      <span class="vis-sub-badge">Click steps to inspect</span>
    </div>
    <div class="vis-pipeline-steps" id="jvm-steps-row"></div>
    <div class="vis-detail-card" id="jvm-detail-box"></div>
    <div class="vis-control-bar">
      <button class="vis-ctrl-btn" id="jvm-btn-prev">← Previous</button>
      <button class="vis-ctrl-btn active" id="jvm-btn-step">Step Next ⚡</button>
      <button class="vis-ctrl-btn" id="jvm-btn-auto">Auto Run ▶</button>
    </div>
  `;

  container.appendChild(wrap);

  const row = wrap.querySelector('#jvm-steps-row');
  const detail = wrap.querySelector('#jvm-detail-box');

  function renderSteps() {
    row.innerHTML = '';
    stages.forEach((st, idx) => {
      const stepEl = document.createElement('div');
      stepEl.className = 'vis-step-chip' + (idx === activeIdx ? ' active' : '') + (idx < activeIdx ? ' passed' : '');
      stepEl.textContent = st.title;
      stepEl.addEventListener('click', () => { activeIdx = idx; renderSteps(); });
      row.appendChild(stepEl);
      if (idx < stages.length - 1) {
        const arrow = document.createElement('span');
        arrow.className = 'vis-step-arrow';
        arrow.textContent = '➔';
        row.appendChild(arrow);
      }
    });

    const curr = stages[activeIdx];
    detail.innerHTML = `
      <div class="vis-card-title">${curr.title}</div>
      <div class="vis-card-desc">${curr.desc}</div>
      <div class="vis-card-stat">Status: <strong>Active Stage ${activeIdx + 1} of ${stages.length}</strong></div>
    `;
  }

  renderSteps();

  wrap.querySelector('#jvm-btn-step').onclick = () => {
    activeIdx = (activeIdx + 1) % stages.length;
    renderSteps();
  };
  wrap.querySelector('#jvm-btn-prev').onclick = () => {
    activeIdx = (activeIdx - 1 + stages.length) % stages.length;
    renderSteps();
  };

  let autoTimer = null;
  wrap.querySelector('#jvm-btn-auto').onclick = function() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
      this.textContent = 'Auto Run ▶';
    } else {
      this.textContent = 'Pause ⏸';
      autoTimer = setInterval(() => {
        activeIdx = (activeIdx + 1) % stages.length;
        renderSteps();
      }, 1600);
    }
  };
}

/* ── 2. Memory Diagram (Stack, Heap & String Pool) ────────────────── */
function renderMemoryDiagram(container, data) {
  let isReassigned = false;
  const wrap = document.createElement('div');
  wrap.className = 'vis-neobrutal-wrap';
  
  function renderLayout() {
    wrap.innerHTML = `
      <div class="vis-header-bar">
        <span class="vis-title-badge">🗃️ JAVA MEMORY MODEL (STACK VS HEAP)</span>
        <button class="vis-pill-action" id="mem-toggle-btn">${isReassigned ? 'Reset Initial Reference ↺' : 'Simulate: p = null (Trigger GC) 🧹'}</button>
      </div>
      <div class="vis-memory-grid">
        <!-- STACK FRAME -->
        <div class="vis-mem-col stack-col">
          <div class="vis-col-header">🧵 Thread Stack (main() frame)</div>
          <div class="vis-mem-entry">
            <span class="vis-type">int</span> <span class="vis-name">count</span> = <span class="vis-val">42</span>
          </div>
          <div class="vis-mem-entry">
            <span class="vis-type">boolean</span> <span class="vis-name">active</span> = <span class="vis-val">true</span>
          </div>
          <div class="vis-mem-entry highlight">
            <span class="vis-type">Person</span> <span class="vis-name">p</span> = <span class="vis-val">${isReassigned ? 'null' : '0x7F2B ➔'}</span>
          </div>
          <div class="vis-mem-entry">
            <span class="vis-type">String</span> <span class="vis-name">s1</span> = <span class="vis-val">0x33A0 ➔</span>
          </div>
        </div>

        <!-- HEAP MEMORY -->
        <div class="vis-mem-col heap-col">
          <div class="vis-col-header">📦 JVM Heap Space (Dynamic Objects)</div>
          
          <div class="vis-heap-object ${isReassigned ? 'garbage' : ''}">
            <div class="vis-obj-addr">Address: 0x7F2B ${isReassigned ? '<span class="vis-gc-badge">UNREACHABLE (GC Candidate)</span>' : '<span class="vis-live-badge">Referenced by p</span>'}</div>
            <div class="vis-obj-name">new Person("Alice", 28)</div>
            <div class="vis-obj-field">• name: "Alice" (String)</div>
            <div class="vis-obj-field">• age: 28</div>
          </div>

          <div class="vis-heap-object pool-obj">
            <div class="vis-obj-addr">Address: 0x33A0 <span class="vis-live-badge">String Constant Pool</span></div>
            <div class="vis-obj-name">"JavaQuest" (Interned Literal)</div>
            <div class="vis-obj-field">• All matching literals share this 1 instance</div>
          </div>
        </div>
      </div>
    `;

    wrap.querySelector('#mem-toggle-btn').onclick = () => {
      isReassigned = !isReassigned;
      renderLayout();
    };
  }

  renderLayout();
  container.appendChild(wrap);
}

/* ── 3. HashMap Internal Bucket & Treeification Visualizer ───────── */
function renderHashMapVisualizer(container, data) {
  let treeified = false;
  const wrap = document.createElement('div');
  wrap.className = 'vis-neobrutal-wrap';

  function renderMap() {
    wrap.innerHTML = `
      <div class="vis-header-bar">
        <span class="vis-title-badge">📦 HASHMAP INTERNALS: BUCKET ARRAY & TREEIFICATION</span>
        <button class="vis-pill-action" id="hm-tree-btn">${treeified ? 'Revert to Linked List ↩' : 'Simulate 8 Collisions (Treeify) 🌲'}</button>
      </div>
      <div class="vis-hm-meta">
        <div><strong>Formula:</strong> <code>index = (n - 1) & hash(key)</code></div>
        <div><strong>Treeify Threshold:</strong> 8 Nodes per bucket | <strong>Capacity:</strong> 16 Buckets</div>
      </div>
      <div class="vis-bucket-list">
        <div class="vis-bucket-row">
          <div class="vis-bucket-label">Bucket [0]</div>
          <div class="vis-bucket-content empty">null (Empty)</div>
        </div>
        <div class="vis-bucket-row">
          <div class="vis-bucket-label">Bucket [3]</div>
          <div class="vis-bucket-content">
            <span class="vis-node-chip">"Java" : 21</span>
          </div>
        </div>
        <div class="vis-bucket-row highlight-bucket">
          <div class="vis-bucket-label">Bucket [7]</div>
          <div class="vis-bucket-content">
            ${treeified ? `
              <div class="vis-tree-block">
                <span class="vis-tree-tag">🌲 Red-Black Tree (TreeNode)</span>
                <span class="vis-node-chip">O(log n) Lookup Time!</span>
                <span class="vis-node-chip">8 Linked Nodes Treeified</span>
              </div>
            ` : `
              <div class="vis-chain-block">
                <span class="vis-node-chip">"K1" : V1</span> ➔
                <span class="vis-node-chip">"K2" : V2</span> ➔
                <span class="vis-node-chip">"K3" : V3</span> ➔
                <span class="vis-chain-tail">(O(n) Collision Chain)</span>
              </div>
            `}
          </div>
        </div>
        <div class="vis-bucket-row">
          <div class="vis-bucket-label">Bucket [12]</div>
          <div class="vis-bucket-content">
            <span class="vis-node-chip">"Spring" : 3.2</span>
          </div>
        </div>
      </div>
    `;

    wrap.querySelector('#hm-tree-btn').onclick = () => {
      treeified = !treeified;
      renderMap();
    };
  }

  renderMap();
  container.appendChild(wrap);
}

/* ── 4. Java Stream API Pipeline Visualizer ───────────────────────── */
function renderStreamVisualizer(container, data) {
  let step = 0;
  const wrap = document.createElement('div');
  wrap.className = 'vis-neobrutal-wrap';

  const stages = [
    { title: '1. Source Stream', desc: 'Data elements loaded into pipeline: [1, 2, 3, 4, 5, 6, 7, 8]' },
    { title: '2. .filter(x -> x % 2 == 0)', desc: 'Odd numbers rejected; only evens pass through: [2, 4, 6, 8]' },
    { title: '3. .map(x -> x * 10)', desc: 'Transforms each even number by multiplying by 10: [20, 40, 60, 80]' },
    { title: '4. .collect(Collectors.toList())', desc: 'Terminal operation triggers execution and returns final List<Integer>' }
  ];

  function renderStream() {
    wrap.innerHTML = `
      <div class="vis-header-bar">
        <span class="vis-title-badge">🌊 STREAM API PIPELINE (LAZY EVALUATION)</span>
        <button class="vis-pill-action" id="stream-next-btn">Step Pipeline (${step + 1}/4) ➔</button>
      </div>
      <div class="vis-stream-stage-desc">${stages[step].desc}</div>
      <div class="vis-stream-track">
        <div class="vis-stream-box ${step >= 0 ? 'active' : ''}">Source [1..8]</div>
        <span class="vis-stream-arrow">➔</span>
        <div class="vis-stream-box ${step >= 1 ? 'active' : ''}">.filter(even)</div>
        <span class="vis-stream-arrow">➔</span>
        <div class="vis-stream-box ${step >= 2 ? 'active' : ''}">.map(*10)</div>
        <span class="vis-stream-arrow">➔</span>
        <div class="vis-stream-box ${step >= 3 ? 'active' : ''}">.collect(toList)</div>
      </div>
      <div class="vis-stream-items">
        ${renderStreamChips(step)}
      </div>
    `;

    wrap.querySelector('#stream-next-btn').onclick = () => {
      step = (step + 1) % stages.length;
      renderStream();
    };
  }

  function renderStreamChips(s) {
    if (s === 0) {
      return [1,2,3,4,5,6,7,8].map(n => `<span class="vis-node-chip">${n}</span>`).join(' ');
    } else if (s === 1) {
      return [1,2,3,4,5,6,7,8].map(n => n % 2 === 0 ? `<span class="vis-node-chip pass">${n} (PASS)</span>` : `<span class="vis-node-chip drop">${n} (DROP)</span>`).join(' ');
    } else if (s === 2) {
      return [2,4,6,8].map(n => `<span class="vis-node-chip pass">${n * 10}</span>`).join(' ');
    } else {
      return `<div class="vis-result-box"><strong>Result:</strong> List.of(20, 40, 60, 80) 🎉</div>`;
    }
  }

  renderStream();
  container.appendChild(wrap);
}

/* ── 5. Thread Lifecycle & Lock Concurrency Visualizer ─────────────── */
function renderThreadVisualizer(container, data) {
  let lockedBy = 'Thread-1';
  const wrap = document.createElement('div');
  wrap.className = 'vis-neobrutal-wrap';

  function renderThreads() {
    wrap.innerHTML = `
      <div class="vis-header-bar">
        <span class="vis-title-badge">🧵 THREAD CONCURRENCY & MONITOR LOCKS</span>
        <button class="vis-pill-action" id="thread-switch-btn">Switch Lock Holder ⇄</button>
      </div>
      <div class="vis-thread-grid">
        <div class="vis-thread-card ${lockedBy === 'Thread-1' ? 'running' : 'blocked'}">
          <div class="vis-thread-name">Thread-1</div>
          <div class="vis-thread-status">${lockedBy === 'Thread-1' ? '🟢 RUNNABLE (Holding Lock)' : '🔴 BLOCKED (Waiting for Lock)'}</div>
          <div class="vis-thread-code">synchronized(lock) { ... }</div>
        </div>

        <div class="vis-lock-card">
          <div class="vis-lock-icon">🔒</div>
          <div class="vis-lock-title">Object Monitor Lock</div>
          <div class="vis-lock-owner">Owner: <strong>${lockedBy}</strong></div>
        </div>

        <div class="vis-thread-card ${lockedBy === 'Thread-2' ? 'running' : 'blocked'}">
          <div class="vis-thread-name">Thread-2</div>
          <div class="vis-thread-status">${lockedBy === 'Thread-2' ? '🟢 RUNNABLE (Holding Lock)' : '🔴 BLOCKED (Waiting for Lock)'}</div>
          <div class="vis-thread-code">synchronized(lock) { ... }</div>
        </div>
      </div>
    `;

    wrap.querySelector('#thread-switch-btn').onclick = () => {
      lockedBy = lockedBy === 'Thread-1' ? 'Thread-2' : 'Thread-1';
      renderThreads();
    };
  }

  renderThreads();
  container.appendChild(wrap);
}

/* ── 6. Loop Tracer ───────────────────────────────────────────────── */
function renderLoopTracer(container, config) {
  config = config || {};
  let start = config.start || 0, end = config.end || 5, varName = config.varName || 'i';
  let cur = start;

  const wrap = document.createElement('div');
  wrap.className = 'vis-neobrutal-wrap';

  function renderTracer() {
    wrap.innerHTML = `
      <div class="vis-header-bar">
        <span class="vis-title-badge">🔄 LOOP STEP TRACER: for (${varName} = ${start}; ${varName} &lt; ${end}; ${varName}++)</span>
        <button class="vis-pill-action" id="loop-step-btn">${cur >= end ? 'Reset Loop ↺' : 'Step Next ▶'}</button>
      </div>
      <div class="vis-loop-grid">
        <div class="vis-loop-state">
          <div>Current Variable: <strong>${varName} = ${cur}</strong></div>
          <div>Condition Check: <strong>${varName} &lt; ${end} ➔ ${cur < end ? '✅ TRUE (Continue)' : '❌ FALSE (Exit Loop)'}</strong></div>
        </div>
        <div class="vis-loop-steps">
          ${Array.from({ length: end - start }, (_, i) => start + i).map(n => `
            <span class="vis-step-chip ${n === cur ? 'active' : ''} ${n < cur ? 'passed' : ''}">Step ${n + 1}: ${varName}=${n}</span>
          `).join('')}
        </div>
      </div>
    `;

    wrap.querySelector('#loop-step-btn').onclick = () => {
      if (cur >= end) cur = start;
      else cur++;
      renderTracer();
    };
  }

  renderTracer();
  container.appendChild(wrap);
}

/* ── 7. Decision Flowchart ────────────────────────────────────────── */
function renderFlowchart(container, config) {
  config = config || {};
  const cond = config.condition || 'x > 0';
  const yes  = config.trueBranch || 'Execute True Block';
  const no   = config.falseBranch || 'Execute Else Block';

  container.innerHTML = `
    <div class="vis-neobrutal-wrap">
      <div class="vis-header-bar">
        <span class="vis-title-badge">🔀 CONTROL FLOW: DECISION BRANCH</span>
      </div>
      <div class="vis-flow-diagram">
        <div class="vis-flow-node start">START</div>
        <div class="vis-flow-arrow">↓</div>
        <div class="vis-flow-diamond">
          <div class="vis-diamond-text">if (${escHtml(cond)}) ?</div>
        </div>
        <div class="vis-flow-branches">
          <div class="vis-branch true-branch">
            <span class="vis-branch-tag">✅ TRUE</span>
            <div class="vis-flow-node action true-node">${escHtml(yes)}</div>
          </div>
          <div class="vis-branch false-branch">
            <span class="vis-branch-tag">❌ FALSE</span>
            <div class="vis-flow-node action false-node">${escHtml(no)}</div>
          </div>
        </div>
        <div class="vis-flow-arrow">↓</div>
        <div class="vis-flow-node end">CONTINUE EXECUTION</div>
      </div>
    </div>
  `;
}

/* ── 8. Class & Interface Diagram ─────────────────────────────────── */
function renderClassDiagram(container, config) {
  config = config || {};
  const classes = config.classes || [
    { name: 'Vehicle', type: 'abstract class', fields: ['String brand', 'int speed'], methods: ['startEngine()', 'abstract stop()'] },
    { name: 'Car', type: 'class (extends Vehicle)', fields: ['int numDoors'], methods: ['stop() [Overridden]', 'drift()'] }
  ];

  container.innerHTML = `
    <div class="vis-neobrutal-wrap">
      <div class="vis-header-bar">
        <span class="vis-title-badge">🏗️ OOP HIERARCHY & CLASS ARCHITECTURE</span>
      </div>
      <div class="vis-uml-grid">
        ${classes.map(cls => `
          <div class="vis-uml-card">
            <div class="vis-uml-header">
              <span class="vis-uml-kind">${escHtml(cls.type || 'class')}</span>
              <div class="vis-uml-name">${escHtml(cls.name)}</div>
            </div>
            ${cls.fields && cls.fields.length ? `
              <div class="vis-uml-section">
                <div class="vis-sec-label">Fields</div>
                ${cls.fields.map(f => `<div class="vis-uml-item">• ${escHtml(f)}</div>`).join('')}
              </div>
            ` : ''}
            ${cls.methods && cls.methods.length ? `
              <div class="vis-uml-section">
                <div class="vis-sec-label">Methods</div>
                ${cls.methods.map(m => `<div class="vis-uml-item method">ƒ ${escHtml(m)}</div>`).join('')}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/* ── XP Float & Particles ─────────────────────────────────────────── */
function showXpFloat(amount, sourceEl) {
  const el = document.createElement('div');
  el.className = 'xp-float';
  el.textContent = '+' + amount + ' XP';
  let left = window.innerWidth / 2 - 25, top = 120;
  if (sourceEl) {
    try {
      const r = sourceEl.getBoundingClientRect();
      left = r.left + r.width/2 - 25;
      top  = r.top + window.scrollY - 10;
    } catch(e) {}
  }
  el.style.left = left + 'px';
  el.style.top  = top  + 'px';
  document.body.appendChild(el);
  el.addEventListener('animationend', function(){ el.remove(); });
}

function burstParticles(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const colors = ['#FFD166','#6C63FF','#43D8C9','#F72585','#06D6A0','#FF6584'];
  for (let i = 0; i < 24; i++) {
    const p = document.createElement('div');
    p.className = 'lv-particle';
    const size  = 5 + Math.random() * 8;
    const angle = Math.random() * Math.PI * 2;
    const dist  = 50 + Math.random() * 80;
    p.style.cssText = `width:${size}px;height:${size}px;background:${colors[Math.floor(Math.random()*colors.length)]};left:50%;top:50%;--dx:${Math.cos(angle)*dist}px;--dy:${Math.sin(angle)*dist}px;animation-duration:${0.6+Math.random()*0.4}s;`;
    container.appendChild(p);
    setTimeout(function(){ p.remove(); }, 1200);
  }
}

/* ── Drag & Drop for Arrange Challenge ───────────── */
var _dragSrc = null;

function initDragAndDrop(container) {
  var items = container.querySelectorAll('.arrange-block');
  items.forEach(function(item) {
    item.addEventListener('dragstart', function(e) {
      _dragSrc = item;
      item.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    item.addEventListener('dragend', function() {
      item.classList.remove('dragging');
      container.querySelectorAll('.arrange-block').forEach(function(b){ b.classList.remove('drag-over'); });
    });
    item.addEventListener('dragover', function(e) {
      e.preventDefault();
      if (item !== _dragSrc) item.classList.add('drag-over');
    });
    item.addEventListener('dragleave', function() { item.classList.remove('drag-over'); });
    item.addEventListener('drop', function(e) {
      e.preventDefault();
      if (_dragSrc && _dragSrc !== item) {
        const all = Array.from(container.children);
        const fi = all.indexOf(_dragSrc);
        const ti = all.indexOf(item);
        if (fi < ti) container.insertBefore(_dragSrc, item.nextSibling);
        else         container.insertBefore(_dragSrc, item);
      }
      item.classList.remove('drag-over');
    });
  });
}
