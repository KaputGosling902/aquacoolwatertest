import { useEffect, useRef, useState, type MouseEvent } from "react";

/* ------------------------------------------------------------
   Reusable SVG wave — seamless tile (uses 2x path so animation
   can slide it by 50% without a visible seam)
   ------------------------------------------------------------ */
function WaveLayer({
  className,
  pathFill,
  pathD,
  label,
}: {
  className: string;
  pathFill: string;
  pathD: string;
  label?: string;
}) {
  return (
    <div className={`wave-layer ${className}`} aria-hidden={label ? "false" : "true"}>
      {/* viewBox width 1200 so the path repeats twice for seamless tiling */}
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        role={label ? "img" : undefined}
        aria-label={label || undefined}
      >
        <path d={pathD} fill={pathFill} />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------
   Animated bubbles — rendered once, pure CSS animation
   ------------------------------------------------------------ */
function Bubbles() {
  // Pre-computed positions — deterministic, no runtime randomness
  const bubbles = [
    { left: "8%",  size: 10, delay: "0s",   duration: "14s" },
    { left: "22%", size: 6,  delay: "3s",   duration: "18s" },
    { left: "35%", size: 14, delay: "6s",   duration: "22s" },
    { left: "50%", size: 8,  delay: "1.5s", duration: "16s" },
    { left: "64%", size: 12, delay: "4s",   duration: "20s" },
    { left: "78%", size: 5,  delay: "7s",   duration: "19s" },
    { left: "88%", size: 10, delay: "2s",   duration: "15s" },
  ];
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {bubbles.map((b, i) => (
        <span
          key={i}
          className="bubble"
          style={{
            left: b.left,
            width: `${b.size}px`,
            height: `${b.size}px`,
            animationDelay: b.delay,
            animationDuration: b.duration,
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------
   Reveal on scroll (lightweight IntersectionObserver)
   ------------------------------------------------------------ */
function useRevealOnScroll() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    if (els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ------------------------------------------------------------
   Navigation
   ------------------------------------------------------------ */
function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/70 border-b border-cyan-100/60">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 group">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-sky-600 shadow-md shadow-cyan-200/70 group-hover:shadow-cyan-300/70">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12s3-4 9-4 9 4 9 4-3 4-9 4-9-4-9-4z" />
              <path d="M3 17s3-4 9-4 9 4 9 4" />
            </svg>
          </span>
          <div className="leading-tight">
            <div className="font-semibold text-sky-900">Clearwater Pool Co.</div>
            <div className="text-xs text-sky-700/70">Pool Cleaning &amp; Filters</div>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-8 text-sm text-sky-900/80">
          <a href="#services" className="hover:text-sky-700">Services</a>
          <a href="#evaluation" className="hover:text-sky-700">Free Evaluation</a>
          <a href="#how" className="hover:text-sky-700">How It Works</a>
          <a href="#contact" className="hover:text-sky-700">Contact</a>
        </nav>

        <a href="#evaluation" className="ripple-btn hidden md:inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-sky-600 px-4 py-2 text-sm font-medium text-white shadow-md shadow-cyan-200/70 hover:shadow-cyan-300/80">
          Free Evaluation
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
        </a>

        <button
          aria-label="Toggle menu"
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-200 text-sky-800"
          onClick={() => setOpen((v) => !v)}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            {open ? <path d="M6 6l12 12M6 18L18 6" /> : <><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></>}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-cyan-100 bg-white/90">
          <div className="mx-auto max-w-6xl px-6 py-4 flex flex-col gap-3 text-sky-900">
            <a href="#services" onClick={() => setOpen(false)}>Services</a>
            <a href="#evaluation" onClick={() => setOpen(false)}>Free Evaluation</a>
            <a href="#how" onClick={() => setOpen(false)}>How It Works</a>
            <a href="#contact" onClick={() => setOpen(false)}>Contact</a>
          </div>
        </div>
      )}
    </header>
  );
}

/* ------------------------------------------------------------
   Hero
   ------------------------------------------------------------ */
function Hero() {
  return (
    <section id="top" className="relative water-surface">
      <div className="water-shimmer" aria-hidden="true" />
      <Bubbles />

      {/* Wave layers — back (light) to front (opaque) */}
      <WaveLayer
        className="w1"
        pathFill="rgba(255,255,255,0.35)"
        pathD="M0 60 C 150 20 300 100 600 60 C 900 20 1050 100 1200 60 L1200 120 L0 120 Z M0 60 C 150 20 300 100 600 60 C 900 20 1050 100 1200 60"
      />
      <WaveLayer
        className="w2"
        pathFill="rgba(255,255,255,0.6)"
        pathD="M0 70 C 150 30 300 110 600 70 C 900 30 1050 110 1200 70 L1200 120 L0 120 Z"
      />
      <WaveLayer
        className="w3"
        pathFill="#f6fbff"
        pathD="M0 80 C 200 40 400 120 600 80 C 800 40 1000 120 1200 80 L1200 120 L0 120 Z"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-16 pb-40 md:pt-24 md:pb-52 text-center">
        <div className="reveal inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/30 px-3 py-1 text-xs font-medium text-sky-900 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Now serving residential &amp; commercial pools
        </div>
        <h1 className="reveal mt-5 text-balance text-4xl md:text-6xl font-semibold tracking-tight text-sky-950">
          Pool cleaning. <span className="bg-gradient-to-r from-sky-700 via-cyan-500 to-sky-800 bg-clip-text text-transparent">Crystal clear.</span>
        </h1>
        <p className="reveal mt-5 max-w-2xl mx-auto text-lg text-sky-900/80">
          Professional pool cleaning and filter services. Clear water, healthy equipment, and a routine you can count on.
        </p>

        <div className="reveal mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href="#evaluation" className="ripple-btn inline-flex items-center gap-2 rounded-full bg-sky-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-900/20 hover:bg-sky-800">
            Get a Free Evaluation
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          </a>
          <a href="#services" className="inline-flex items-center gap-2 rounded-full border border-sky-900/20 bg-white/60 px-6 py-3 text-sm font-semibold text-sky-900 backdrop-blur hover:bg-white">
            See Services
          </a>
        </div>

        <div className="reveal mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {[
            { n: "Weekly", l: "pool cleaning" },
            { n: "Expert", l: "filter service" },
            { n: "On-time", l: "scheduled visits" },
            { n: "Licensed", l: "&amp; insured" },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl border border-white/40 bg-white/40 px-4 py-4 backdrop-blur">
              <div className="text-lg font-semibold text-sky-950">{s.n}</div>
              <div className="text-xs text-sky-900/70" dangerouslySetInnerHTML={{ __html: s.l }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------
   Services
   ------------------------------------------------------------ */
function Services() {
  const items = [
    {
      title: "Pool Cleaning",
      body:
        "Surface skimming, floor vacuuming, debris removal, tile brushing, and basket emptying — on a schedule that fits you.",
      bullets: ["Weekly & bi-weekly plans", "Leaf and debris removal", "Water testing"],
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12s3-4 9-4 9 4 9 4-3 4-9 4-9-4-9-4z"/>
          <path d="M3 16s3-4 9-4 9 4 9 4"/>
          <circle cx="12" cy="8" r="1.5"/>
        </svg>
      ),
    },
    {
      title: "Filter Service",
      body:
        "Cartridge, sand, and DE filter service — inspections, backwashing, cleaning, media replacement, and pressure checks.",
      bullets: ["Cartridge cleaning & replacement", "Sand & DE media service", "Pressure & flow testing"],
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <rect x="6" y="3" width="12" height="14" rx="2"/>
          <path d="M9 3v14M15 3v14"/>
          <path d="M12 17v4"/>
          <path d="M9 21h6"/>
          <path d="M8 7h8M8 10h8M8 13h8"/>
        </svg>
      ),
    },
    {
      title: "Equipment Check-Ups",
      body:
        "Regular inspection of pumps, heaters, and plumbing to catch small issues before they become expensive ones.",
      bullets: ["Pump & motor inspection", "Leak detection", "Flow rate verification"],
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a7.97 7.97 0 0 0 0-6l2-1.2-2-3.4-2.3 1a8 8 0 0 0-5.2-3L11.6 0h-4l-.3 2.4a8 8 0 0 0-5.2 3l-2.3-1-2 3.4 2 1.2a7.97 7.97 0 0 0 0 6l-2 1.2 2 3.4 2.3-1a8 8 0 0 0 5.2 3l.3 2.4h4l.3-2.4a8 8 0 0 0 5.2-3l2.3 1 2-3.4z"/>
        </svg>
      ),
    },
  ];

  return (
    <section id="services" className="relative">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="reveal max-w-2xl">
          <div className="text-sm font-semibold uppercase tracking-wider text-cyan-600">Services</div>
          <h2 className="mt-2 text-3xl md:text-4xl font-semibold text-sky-950 text-balance">
            Everything your pool needs, under one roof.
          </h2>
          <p className="mt-4 text-sky-900/75">
            We focus on two things: keeping your water clean and keeping your filter system working the way it should.
          </p>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {items.map((s, i) => (
            <article key={i} className="reveal pool-card p-6 flex flex-col" style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-100 to-sky-200 text-sky-700 mb-5">
                <div className="h-6 w-6">{s.icon}</div>
              </div>
              <h3 className="text-xl font-semibold text-sky-950">{s.title}</h3>
              <p className="mt-2 text-sky-900/75">{s.body}</p>
              <ul className="mt-5 space-y-2 text-sm text-sky-900/85">
                {s.bullets.map((b, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-cyan-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------
   Free Evaluation section
   ------------------------------------------------------------ */
function Evaluation() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    poolType: "",
    notes: "",
  });

  // Set ripple click position for buttons
  const onRipple = (e: MouseEvent<HTMLElement>) => {
    const btn = e.currentTarget as HTMLElement;
    const rect = btn.getBoundingClientRect();
    btn.style.setProperty("--rx", `${e.clientX - rect.left}px`);
    btn.style.setProperty("--ry", `${e.clientY - rect.top}px`);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // No backend yet — this is a landing-page form capture.
  };

  return (
    <section id="evaluation" className="relative overflow-hidden">
      {/* Decorative water "glass" background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-sky-50 via-cyan-50 to-white" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 opacity-60" aria-hidden="true">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="ripples" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="6" fill="none" stroke="rgba(34,211,238,0.25)" strokeWidth="0.3" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#ripples)" />
        </svg>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-start">
        <div className="reveal">
          <div className="text-sm font-semibold uppercase tracking-wider text-cyan-600">Free Evaluation</div>
          <h2 className="mt-2 text-3xl md:text-4xl font-semibold text-sky-950 text-balance">
            A clear look at your pool — at no cost.
          </h2>
          <p className="mt-4 text-sky-900/75 max-w-xl">
            We'll come out, take a look at your water and equipment, and give you a straightforward assessment. No pressure, no obligation.
          </p>

          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            {[
              { t: "Water condition",  d: "A quick read of clarity, chemistry, and balance." },
              { t: "Filter & pump",    d: "Flow, pressure, and visible signs of wear." },
              { t: "Equipment check",  d: "A look at seals, plumbing, and heater health." },
              { t: "Written notes",    d: "Clear observations and a recommended plan." },
            ].map((f, i) => (
              <div key={i} className="rounded-2xl border border-cyan-100 bg-white/70 p-5">
                <div className="text-sm font-semibold text-sky-950">{f.t}</div>
                <div className="text-sm text-sky-900/70 mt-1">{f.d}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-4 text-sm text-sky-900/70">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100 text-cyan-700">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92V21a1 1 0 0 1-1.1 1A19 19 0 0 1 2 4.1 1 1 0 0 1 3 3h4.09a1 1 0 0 1 1 .75l1 4a1 1 0 0 1-.27 1L7.21 10.79a16 16 0 0 0 6 6l2-1.61a1 1 0 0 1 1-.27l4 1a1 1 0 0 1 .75 1z"/>
              </svg>
            </div>
            <div>
              <div className="font-medium text-sky-950">Questions? Call us directly.</div>
              <div className="text-sky-900/70">We typically respond within one business day.</div>
            </div>
          </div>
        </div>

        <div className="reveal pool-card p-6 md:p-8">
          {!submitted ? (
            <>
              <h3 className="text-xl font-semibold text-sky-950">Request your free evaluation</h3>
              <p className="mt-2 text-sm text-sky-900/70">Tell us a bit about your pool and we'll reach out to schedule a visit.</p>
              <form onSubmit={onSubmit} className="mt-6 grid gap-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="block text-sm">
                    <span className="text-sky-900/80">Name</span>
                    <input required className="water-input mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Doe" />
                  </label>
                  <label className="block text-sm">
                    <span className="text-sky-900/80">Email</span>
                    <input required type="email" className="water-input mt-1" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
                  </label>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="block text-sm">
                    <span className="text-sky-900/80">Phone</span>
                    <input required className="water-input mt-1" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="(555) 123-4567" />
                  </label>
                  <label className="block text-sm">
                    <span className="text-sky-900/80">Address</span>
                    <input required className="water-input mt-1" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="123 Main St" />
                  </label>
                </div>
                <label className="block text-sm">
                  <span className="text-sky-900/80">Type of pool</span>
                  <select required className="water-input mt-1" value={form.poolType} onChange={(e) => setForm({ ...form, poolType: e.target.value })}>
                    <option value="">Select one…</option>
                    <option>Residential — in-ground</option>
                    <option>Residential — above-ground</option>
                    <option>Commercial</option>
                    <option>Not sure</option>
                  </select>
                </label>
                <label className="block text-sm">
                  <span className="text-sky-900/80">Anything we should know?</span>
                  <textarea rows={3} className="water-input mt-1" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="e.g. filter type, green water, unusual noise from pump" />
                </label>
                <button type="submit" onMouseDown={onRipple} className="ripple-btn mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-cyan-200/70 hover:shadow-cyan-300/80">
                  Submit request
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                </button>
                <p className="text-xs text-sky-900/60 text-center">We use your information only to contact you about your evaluation request.</p>
              </form>
            </>
          ) : (
            <div className="py-10 text-center">
              <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-cyan-100 text-cyan-700">
                <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-sky-950">Thanks — we got it.</h3>
              <p className="mt-2 text-sky-900/70 max-w-sm mx-auto">We'll review your request and reach out to schedule your free evaluation.</p>
              <button onClick={() => { setSubmitted(false); setForm({ name:"", email:"", phone:"", address:"", poolType:"", notes:"" }); }} className="mt-6 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white px-5 py-2.5 text-sm font-medium text-sky-900 hover:bg-cyan-50">
                Submit another request
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------
   How it works
   ------------------------------------------------------------ */
function HowItWorks() {
  const steps = [
    { t: "Get in touch",   d: "Request your free evaluation online or by phone." },
    { t: "On-site visit",  d: "We assess your water, filter, and equipment." },
    { t: "Clear plan",     d: "You receive a straightforward service plan." },
    { t: "Regular care",   d: "We keep your pool clean on a schedule you choose." },
  ];
  return (
    <section id="how" className="relative">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="reveal max-w-2xl mx-auto text-center">
          <div className="text-sm font-semibold uppercase tracking-wider text-cyan-600">How it works</div>
          <h2 className="mt-2 text-3xl md:text-4xl font-semibold text-sky-950 text-balance">Simple, straightforward pool care.</h2>
          <p className="mt-4 text-sky-900/75">From first contact to regular service visits, we keep the process easy to follow.</p>
        </div>
        <ol className="mt-14 grid md:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <li key={i} className="reveal pool-card p-6" style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-sky-600 text-white text-sm font-semibold shadow-md shadow-cyan-200/70">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-sky-950">{s.t}</h3>
              <p className="mt-2 text-sm text-sky-900/75">{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------
   Footer
   ------------------------------------------------------------ */
function Footer() {
  return (
    <footer id="contact" className="relative overflow-hidden bg-sky-950 text-sky-100">
      {/* Water-like footer curve */}
      <div className="absolute inset-x-0 top-0 h-16 -translate-y-1/2" aria-hidden="true">
        <svg viewBox="0 0 1200 80" preserveAspectRatio="none" className="h-full w-full">
          <path d="M0 80 C 200 0 400 80 600 40 C 800 0 1000 80 1200 40 L1200 80 L0 80 Z" fill="#082f49" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-16 grid md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-sky-600 shadow-md shadow-sky-900/40">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12s3-4 9-4 9 4 9 4-3 4-9 4-9-4-9-4z" />
                <path d="M3 17s3-4 9-4 9 4 9 4" />
              </svg>
            </span>
            <div className="font-semibold text-white">Clearwater Pool Co.</div>
          </div>
          <p className="mt-4 text-sm text-sky-200/70 max-w-xs">
            Pool cleaning and filter services. Straightforward care from a local team you can count on.
          </p>
        </div>

        <div className="text-sm">
          <div className="text-white font-semibold">Contact</div>
          <ul className="mt-4 space-y-2 text-sky-200/80">
            <li>Phone — call during business hours</li>
            <li>Email — reply within one business day</li>
            <li>Service area — local communities</li>
            <li>Hours — Monday through Saturday</li>
          </ul>
        </div>

        <div className="text-sm">
          <div className="text-white font-semibold">Get started</div>
          <p className="mt-4 text-sky-200/80">Request a free, no-obligation evaluation of your pool.</p>
          <a href="#evaluation" className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 px-5 py-2.5 text-sm font-semibold text-sky-950 hover:from-cyan-300 hover:to-sky-400">
            Free Evaluation
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          </a>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-sky-200/70">
          <div>© {new Date().getFullYear()} Clearwater Pool Co. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <a href="#services" className="hover:text-white">Services</a>
            <a href="#evaluation" className="hover:text-white">Free Evaluation</a>
            <a href="#how" className="hover:text-white">Process</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------
   Pause hero animations when tab is hidden (extra CPU guard)
   ------------------------------------------------------------ */
function usePauseWhenHidden() {
  const ref = useRef<HTMLStyleElement | null>(null);
  useEffect(() => {
    const style = document.createElement("style");
    style.setAttribute("data-pw", "1");
    document.head.appendChild(style);
    ref.current = style;

    const apply = (paused: boolean) => {
      if (!ref.current) return;
      ref.current.textContent = paused
        ? `.wave-layer,.bubble,.water-shimmer::before,.water-shimmer::after,.pool-card::before { animation-play-state: paused !important; }`
        : "";
    };

    const onVis = () => apply(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    // Also pause when window loses focus briefly (helps with laptops on battery)
    const onBlur = () => apply(true);
    const onFocus = () => apply(false);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
      ref.current?.remove();
    };
  }, []);
}

/* ------------------------------------------------------------
   Root App
   ------------------------------------------------------------ */
export default function App() {
  useRevealOnScroll();
  usePauseWhenHidden();

  return (
    <div className="min-h-screen bg-[#f6fbff] text-sky-950">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Evaluation />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}
