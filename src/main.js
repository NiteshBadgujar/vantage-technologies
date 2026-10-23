import "./styles.css";

const company = {
  name: "Vantage Technologies",
  email: "hello@vantagetechnologies.in",
  location: "Nashik, Maharashtra, India",
};

const apiBaseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

// Keep this content object intentionally small and easy to edit as the business grows.
const services = [
  {
    number: "01",
    slug: "software",
    title: "Software & web applications",
    short: "Useful products with the right amount of technology behind them.",
    detail: "From a focused internal tool to a customer-facing web application, we help turn a rough idea into a dependable product that is clear to use and straightforward to evolve.",
    useCases: ["Internal tools", "Customer portals", "Operations software"],
    icon: "brackets",
  },
  {
    number: "02",
    slug: "ai",
    title: "Applied AI & machine learning",
    short: "Practical intelligence for the work your team already does.",
    detail: "We explore where AI can remove repetitive work, improve decisions, or make a product more useful — with attention to data, reliability, and the limits of the technology.",
    useCases: ["Document workflows", "Prediction & classification", "AI-assisted products"],
    icon: "spark",
  },
  {
    number: "03",
    slug: "consulting",
    title: "Consulting & technical direction",
    short: "A clearer technical path before time and budget get committed.",
    detail: "For founders and small teams, an outside technical perspective can turn a long list of possibilities into a sensible sequence of decisions, risks, and next steps.",
    useCases: ["Architecture reviews", "Technical roadmaps", "Build-vs-buy decisions"],
    icon: "compass",
  },
  {
    number: "04",
    slug: "automation",
    title: "Workflow automation",
    short: "Less manual hand-off. More room for the work that needs judgment.",
    detail: "We map the places where information gets copied, delayed, or lost, then connect the tools and steps that keep a business moving.",
    useCases: ["Approval flows", "Data movement", "Reporting systems"],
    icon: "flow",
  },
  {
    number: "05",
    slug: "integration",
    title: "API & systems integration",
    short: "Connected systems that behave like one considered experience.",
    detail: "We design and build the interfaces between products, services, and data sources so teams can work from more consistent information.",
    useCases: ["API design", "Third-party integrations", "Data synchronisation"],
    icon: "link",
  },
  {
    number: "06",
    slug: "prototype",
    title: "Technical prototyping & MVP development",
    short: "A focused first version that turns an assumption into something testable.",
    detail: "We help shape the smallest useful version of a product, so founders and teams can learn from a real experience before committing to a larger build.",
    useCases: ["Product validation", "Founder-led products", "Proofs of concept"],
    icon: "prototype",
  },
];

const routes = {
  "/": { label: "Home", title: "Technology for the move ahead" },
  "/services": { label: "Services", title: "Services with a point of view" },
  "/projects": { label: "Projects", title: "Selected work and experiments" },
  "/about": { label: "About", title: "Small by design. Serious about the work" },
  "/contact": { label: "Contact", title: "Let’s make the next move clear" },
};

const iconPaths = {
  arrow: '<path d="M5 12h13M13 6l6 6-6 6"/>',
  arrowUp: '<path d="M5 19 19 5M8 5h11v11"/>',
  brackets: '<path d="m8 4-4 8 4 8M16 4l4 8-4 8M13 3l-2 18"/>',
  spark: '<path d="m12 3 1.8 6.2L20 11l-6.2 1.8L12 19l-1.8-6.2L4 11l6.2-1.8L12 3ZM19 17v4M21 19h-4"/>',
  compass: '<circle cx="12" cy="12" r="8.5"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>',
  prototype: '<rect x="4" y="4" width="16" height="16" rx="1"/><path d="M8 12h8M12 8v8"/>',
  flow: '<circle cx="5" cy="6" r="2"/><circle cx="19" cy="18" r="2"/><path d="M7 6h4a3 3 0 0 1 3 3v3a3 3 0 0 0 3 3h0M17 18h-4a3 3 0 0 1-3-3v-3a3 3 0 0 0-3-3H7"/>',
  link: '<path d="m9.5 14.5-1 1a3.5 3.5 0 0 1-5-5l2-2a3.5 3.5 0 0 1 5 0M14.5 9.5l1-1a3.5 3.5 0 0 1 5 5l-2 2a3.5 3.5 0 0 1-5 0M8 16l8-8"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3 7 9 6 9-6"/>',
  pin: '<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M5 5l14 14M19 5 5 19"/>',
};

function icon(name, className = "") {
  return `<svg class="icon ${className}" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${iconPaths[name] || iconPaths.arrow}</svg>`;
}

function logo() {
  return `<a class="brand" href="/" data-route aria-label="Vantage Technologies home">
    <span class="brand-mark" aria-hidden="true"><svg viewBox="0 0 42 42" fill="none"><path d="M7 31.5 19.5 9 35 33l-7.1-3.1-8.3-13.1-6.2 12.4Z" fill="currentColor"/><path d="m20 30 7.5-15.3" stroke="var(--accent)" stroke-width="2.3"/></svg></span>
    <span class="brand-text"><strong>Vantage</strong><small>Technologies</small></span>
  </a>`;
}

function header() {
  const currentPath = window.location.pathname;
  return `<a class="skip-link" href="#main-content">Skip to content</a><header class="site-header">
    <div class="container header-inner">
      ${logo()}
      <nav class="desktop-nav" aria-label="Primary navigation">
        ${Object.entries(routes).map(([path, route]) => `<a href="${path}" data-route class="nav-link ${currentPath === path ? "is-active" : ""}" ${currentPath === path ? 'aria-current="page"' : ""}>${route.label}</a>`).join("")}
      </nav>
      <div class="header-meta"><span class="header-signal">Micro enterprise · Nashik</span><a class="button button-small button-dark header-cta" href="/contact" data-route>Discuss a project ${icon("arrowUp")}</a></div>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open navigation">${icon("menu")}</button>
    </div>
    <div class="mobile-menu" id="mobile-menu" aria-hidden="true">
      <div class="container mobile-menu-inner">
        ${Object.entries(routes).map(([path, route]) => `<a href="${path}" data-route class="mobile-nav-link ${currentPath === path ? "is-active" : ""}"><span>${route.label}</span>${icon("arrowUp")}</a>`).join("")}
        <div class="mobile-menu-note">Nashik, Maharashtra · India</div>
      </div>
    </div>
  </header>`;
}

function footer() {
  return `<footer class="site-footer">
    <div class="container footer-top">
      <div class="footer-brand-block">
        ${logo()}
        <p>Practical technology for businesses with somewhere to go.</p>
      </div>
      <div class="footer-links">
        <div><span class="footer-label">Explore</span><a href="/services" data-route>Services</a><a href="/projects" data-route>Projects</a><a href="/about" data-route>About</a></div>
        <div><span class="footer-label">Start a conversation</span><a href="mailto:${company.email}">${company.email}</a><span>${company.location}</span></div>
      </div>
    </div>
    <div class="container footer-bottom"><span>© ${new Date().getFullYear()} Vantage Technologies</span><span>Independent technology consultancy · Nashik, India</span></div>
  </footer>`;
}

function eyebrow(text, number = "") {
  return `<div class="eyebrow"><span class="eyebrow-line"></span>${number ? `<span>${number}</span>` : ""}<span>${text}</span></div>`;
}

function button(label, href, className = "") {
  return `<a class="button ${className}" href="${href}" data-route>${label} ${icon("arrowUp")}</a>`;
}

function systemVisual() {
  return `<div class="system-visual" aria-label="Illustration of a connected digital system">
    <div class="visual-topline"><span>VANTAGE / FIELD NOTE 01</span><span>19.9951° N · 73.7903° E</span></div>
    <div class="visual-grid"></div>
    <svg class="system-map" viewBox="0 0 620 500" role="img" aria-label="A diagram showing input, logic, and outcome connected through a clear system">
      <path d="M84 373 C162 360 156 254 241 252 S320 343 391 290 440 149 540 125" fill="none" stroke="#a8e9da" stroke-width="2" stroke-dasharray="6 7" opacity=".9"/>
      <path d="M83 374 L241 252 L391 290 L540 125" fill="none" stroke="#eef4ff" stroke-width="1" opacity=".23"/>
      <circle cx="84" cy="373" r="13" fill="#182023" stroke="#9bb3ff" stroke-width="2"/><circle cx="241" cy="252" r="13" fill="#182023" stroke="#9bb3ff" stroke-width="2"/><circle cx="391" cy="290" r="13" fill="#182023" stroke="#9bb3ff" stroke-width="2"/><circle cx="540" cy="125" r="15" fill="#436df4" stroke="#b9c8ff" stroke-width="2"/>
      <path d="M79 373h10M84 368v10M236 252h10M241 247v10M386 290h10M391 285v10" stroke="#eef4ff" stroke-width="1" opacity=".9"/>
      <g class="visual-label"><rect x="48" y="397" width="76" height="27" rx="2"/><text x="60" y="415">INPUT</text></g>
      <g class="visual-label"><rect x="199" y="207" width="86" height="27" rx="2"/><text x="211" y="225">LOGIC</text></g>
      <g class="visual-label"><rect x="356" y="325" width="88" height="27" rx="2"/><text x="368" y="343">SYSTEM</text></g>
      <g class="visual-label active"><rect x="492" y="76" width="95" height="27" rx="2"/><text x="504" y="94">OUTCOME</text></g>
      <text x="74" y="455" class="axis-label">01</text><text x="231" y="278" class="axis-label">02</text><text x="382" y="316" class="axis-label">03</text><text x="530" y="151" class="axis-label">04</text>
    </svg>
    <div class="visual-caption"><span>From question</span><span class="caption-arrow">→</span><span>to useful momentum</span></div>
  </div>`;
}

function homePage() {
  return `<main id="main-content" class="page page-home">
    <section class="hero container">
      <div class="hero-copy">
        ${eyebrow("Independent technology consultancy", "01")}
        <h1>Technology for the <em>move ahead.</em></h1>
        <p class="hero-lede">Vantage Technologies helps businesses turn ideas, bottlenecks, and ambitious next steps into practical digital systems.</p>
        <div class="button-row">${button("Discuss a project", "/contact", "button-blue")}${button("Explore services", "/services", "button-text")}</div>
        <div class="hero-footnote"><span>Based in Nashik</span><span class="footnote-rule"></span><span>Software · systems · direction</span></div>
      </div>
      ${systemVisual()}
    </section>

    <section class="intro-section section-border">
      <div class="container intro-grid">
        <div>${eyebrow("A clear point of view", "02")}</div>
        <div><h2>Good technology gives the business more room to move.</h2><p>We work at the intersection of software, systems, and the decisions around them. The goal is not to add complexity. It is to make the right things simpler, more dependable, and easier to build on.</p><div class="intro-tags"><span>For founders</span><span>For operators</span><span>For growing teams</span></div></div>
      </div>
    </section>

    <section class="services-preview container section-pad">
      <div class="section-heading"><div>${eyebrow("What we can help with", "03")}</div><p>Focused support for teams that need a technical partner who can see the whole shape of the problem.</p></div>
      <div class="service-list preview-list">${services.slice(0, 4).map(serviceRow).join("")}</div>
      <div class="section-action">${button("See all services", "/services", "button-outline")}</div>
    </section>

    <section class="dark-section project-preview">
      <div class="container project-preview-grid">
        <div class="project-intro">${eyebrow("A workbench, not a trophy case", "04")}<h2>Ideas are allowed to be in progress.</h2><p>We are building our public portfolio carefully. For now, this space shows the kind of thinking and system design Vantage brings to a project — without inventing client stories or results.</p>${button("View project notes", "/projects", "button-light")}</div>
        <div class="demo-system"><div class="demo-header"><span>DEMONSTRATION BUILD</span><span>STATUS / EXPLORING</span></div><div class="demo-canvas"><div class="demo-column"><span class="demo-index">01</span><strong>Question</strong><small>What needs to change?</small></div><div class="demo-connector">↗</div><div class="demo-column highlighted"><span class="demo-index">02</span><strong>System</strong><small>Make the path visible.</small></div><div class="demo-connector">↗</div><div class="demo-column"><span class="demo-index">03</span><strong>Next move</strong><small>Build with confidence.</small></div></div><div class="demo-footer"><span>Internal capability preview</span><span>V / 001</span></div></div>
      </div>
    </section>

    <section class="process-section container section-pad">
      <div class="process-heading"><div>${eyebrow("How we work", "05")}</div><h2>Clear steps. Useful output.</h2></div>
      <div class="process-list"><div class="process-item"><span>01</span><div><h3>Understand the ground</h3><p>We start with the business context, the people involved, and what a better outcome would make possible.</p></div></div><div class="process-item"><span>02</span><div><h3>Find the leverage</h3><p>We identify the smallest technical move that can create meaningful clarity or momentum.</p></div></div><div class="process-item"><span>03</span><div><h3>Make it real</h3><p>We prototype, build, and refine the system with enough rigour to be useful beyond the first release.</p></div></div><div class="process-item"><span>04</span><div><h3>Leave it stronger</h3><p>You get clear decisions, understandable technology, and a foundation your team can carry forward.</p></div></div></div>
    </section>

    ${ctaBand()}
  </main>`;
}

function serviceRow(service) {
  return `<a class="service-row" href="/services#${service.slug}" data-route><span class="service-number">${service.number}</span><span class="service-icon">${icon(service.icon)}</span><span class="service-content"><strong>${service.title}</strong><span>${service.short}</span></span><span class="service-arrow">${icon("arrowUp")}</span></a>`;
}

function servicesPage() {
  return `<main id="main-content" class="page page-services">
    <section class="page-hero container"><div>${eyebrow("Capabilities", "01")}<h1>Services with a <em>point of view.</em></h1></div><div class="page-hero-note"><p>Technology is only useful when it fits the way a business actually works. These are the areas where we can help you find that fit.</p><span class="hero-location">Nashik, Maharashtra / India</span></div></section>
    <section class="container services-detail section-pad-top"><div class="services-detail-intro"><span class="section-kicker">A considered starting point</span><p>Every engagement starts with a conversation, not a preselected package. We can shape the right scope once we understand the problem, constraints, and what success needs to look like.</p></div><div class="detail-list">${services.map(serviceDetail).join("")}</div></section>
    ${ctaBand("Have a problem worth making clearer?", "Tell us what is moving — or what is stuck.")}
  </main>`;
}

function serviceDetail(service) {
  return `<article class="service-detail" id="${service.slug}"><div class="detail-top"><span class="detail-number">${service.number}</span><div class="detail-title"><span class="service-icon">${icon(service.icon)}</span><h2>${service.title}</h2></div><a href="/contact?service=${encodeURIComponent(service.title)}" data-route class="detail-link" aria-label="Discuss ${service.title}">${icon("arrowUp")}</a></div><div class="detail-body"><p class="detail-lede">${service.short}</p><p>${service.detail}</p><div class="use-cases"><span>Good fit for</span>${service.useCases.map(useCase => `<span class="use-case">${useCase}</span>`).join("")}</div></div></article>`;
}

function projectsPage() {
  return `<main id="main-content" class="page page-projects">
    <section class="page-hero container"><div>${eyebrow("Project notes", "01")}<h1>Work that earns its <em>place.</em></h1></div><div class="page-hero-note"><p>A growing collection of builds, experiments, and useful patterns. Published with context when there is something real to say.</p><span class="hero-location">No invented case studies</span></div></section>
    <section class="container projects-content section-pad-top"><article class="project-feature"><div class="project-feature-visual"><div class="feature-grid-lines"></div><div class="feature-orbit orbit-one"></div><div class="feature-orbit orbit-two"></div><div class="feature-core">V<span>/</span></div><span class="feature-tag tag-a">INPUT</span><span class="feature-tag tag-b">DECISION</span><span class="feature-tag tag-c">OUTPUT</span></div><div class="project-feature-copy"><span class="project-status">Demonstration · Systems prototype</span><h2>The clarity layer</h2><p>A visual exploration of how an operational question can become a simpler, more traceable path through a business system.</p><div class="project-meta"><div><span>Focus</span><strong>Information flow</strong></div><div><span>Stage</span><strong>Exploration</strong></div><div><span>Published</span><strong>As the work evolves</strong></div></div><p class="project-disclaimer">This is a Vantage demonstration concept, not a client engagement. It is here to make our approach tangible while the public portfolio takes shape.</p></div></article><div class="projects-empty"><div class="empty-index">02</div><div><span class="project-status">Client work</span><h2>More project notes will arrive with the work.</h2><p>We will share real problems, decisions, and outcomes here when we have permission and enough context to do them justice.</p></div><a href="/contact" data-route class="text-link">Start the first conversation ${icon("arrowUp")}</a></div></section>
  </main>`;
}

function aboutPage() {
  return `<main id="main-content" class="page page-about">
    <section class="page-hero container"><div>${eyebrow("About Vantage", "01")}<h1>Small by design. <em>Serious about the work.</em></h1></div><div class="page-hero-note"><p>Vantage Technologies is a growing micro enterprise based in Nashik, Maharashtra — focused on useful technology and the thinking that makes it last.</p><span class="hero-location">Independent / hands-on / learning</span></div></section>
    <section class="about-statement dark-section"><div class="container about-statement-grid"><div class="statement-mark">V<span>/</span></div><div><span class="section-kicker light">Why we exist</span><h2>Technology should create more options, not more noise.</h2><p>We believe good technical work starts with listening closely. It should respect the realities of the business, make trade-offs visible, and leave people with something they can understand and use.</p></div></div></section>
    <section class="container about-content section-pad"><div class="about-column-label">Our approach</div><div class="about-principles"><article><span>01</span><h2>Clarity before velocity</h2><p>Moving quickly matters. Moving in the right direction matters more. We make the important questions explicit before the build gathers momentum.</p></article><article><span>02</span><h2>Useful over impressive</h2><p>New technology is not a goal by itself. We look for the point where it removes friction, improves a decision, or opens a better way to work.</p></article><article><span>03</span><h2>Built to be carried forward</h2><p>The strongest solution is one a team can keep improving. We value understandable systems, considered handovers, and honest documentation.</p></article></div></section>
    <section class="container about-facts"><div><span class="section-kicker">At a glance</span><h2>A focused partner for the next considered step.</h2></div><dl><div><dt>Base</dt><dd>Nashik, Maharashtra<br />India</dd></div><div><dt>Business</dt><dd>Micro enterprise<br />Technology consultancy</dd></div><div><dt>Working style</dt><dd>Direct, thoughtful,<br />practical</dd></div></dl></section>
    ${ctaBand("Have an idea worth working through?", "Start with the part that is hardest to explain.")}
  </main>`;
}

function contactPage() {
  const params = new URLSearchParams(window.location.search);
  const selectedService = params.get("service") || "";
  return `<main id="main-content" class="page page-contact">
     <section class="page-hero container contact-hero"><div>${eyebrow("Start a conversation", "01")}<h1>Let’s make the next move <em>clear.</em></h1></div><div class="page-hero-note"><p>Tell us what you are trying to build, improve, or understand. A useful first conversation does not need a finished brief.</p><span class="hero-location">Email or form / your choice</span></div></section>
    <section class="container contact-layout section-pad-top"><div class="contact-aside"><span class="section-kicker">Talk to Vantage</span><h2>Bring the question behind the request.</h2><p>Share as much or as little as you have. We will come back with a considered response and a sensible next step.</p><div class="contact-details"><a href="mailto:${company.email}">${icon("mail")}<span><small>Email</small>${company.email}</span></a><div>${icon("pin")}<span><small>Based in</small>${company.location}</span></div><div>${icon("clock")}<span><small>Start with</small>A clear question</span></div></div></div><form class="inquiry-form" id="inquiry-form" novalidate><div class="form-heading"><div><span class="form-kicker">Project inquiry</span><strong>Tell us what needs to move.</strong></div><span class="required-note">* Required</span></div><p class="form-intro">A finished brief is not required. A clear question is enough to begin.</p><div class="form-grid"><label class="field"><span>Name <b>*</b></span><input type="text" name="name" autocomplete="name" required aria-describedby="error-name" placeholder="Your name" /><small class="field-error" id="error-name" data-error-for="name"></small></label><label class="field"><span>Business email <b>*</b></span><input type="email" name="email" autocomplete="email" required aria-describedby="error-email" placeholder="you@company.com" /><small class="field-error" id="error-email" data-error-for="email"></small></label><label class="field"><span>Company <i>Optional</i></span><input type="text" name="company" autocomplete="organization" placeholder="Company or project name" /></label><label class="field"><span>Service of interest <b>*</b></span><select name="service" required aria-describedby="error-service"><option value="">Choose one</option>${services.map(service => `<option ${selectedService === service.title ? "selected" : ""}>${service.title}</option>`).join("")}<option>Not sure yet</option></select><small class="field-error" id="error-service" data-error-for="service"></small></label><label class="field"><span>Approximate budget <i>Optional</i></span><select name="budget"><option value="">Prefer to discuss</option><option>Under ₹50,000</option><option>₹50,000 – ₹2,00,000</option><option>₹2,00,000 – ₹5,00,000</option><option>₹5,00,000+</option></select></label><label class="field field-full"><span>What are you working through? <b>*</b></span><textarea name="description" required rows="6" aria-describedby="error-description" placeholder="A short description of the problem, idea, or outcome you have in mind"></textarea><small class="field-error" id="error-description" data-error-for="description"></small></label></div><input class="honeypot" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" /><div class="form-bottom"><p>We only use these details to respond to your inquiry.</p><button class="button button-dark" type="submit">Send inquiry ${icon("arrowUp")}</button></div><div class="form-feedback" id="form-feedback" role="status" aria-live="polite"></div></form></section>
  </main>`;
}

function ctaBand(title = "Ready to make the next move?", copy = "A good place to start is the thing that is not quite working yet.") {
  return `<section class="cta-band"><div class="container cta-inner"><div>${eyebrow("A considered starting point", "06")}<h2>${title}</h2><p>${copy}</p></div>${button("Discuss a project", "/contact", "button-light")}</div></section>`;
}

function notFoundPage() {
  return `<main id="main-content" class="page"><section class="container not-found"><span class="section-kicker">404 / Not found</span><h1>That route took a <em>wrong turn.</em></h1><p>There is no page here, but there is a way forward.</p>${button("Return home", "/", "button-blue")}</section></main>`;
}

function pageForPath() {
  switch (window.location.pathname) {
    case "/": return homePage();
    case "/services": return servicesPage();
    case "/projects": return projectsPage();
    case "/about": return aboutPage();
    case "/contact": return contactPage();
    default: return notFoundPage();
  }
}

function setDocumentMeta() {
  const route = routes[window.location.pathname] || { title: "Page not found" };
  document.title = `${route.title} — ${company.name}`;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.setAttribute("content", `${route.title}. Vantage Technologies builds practical digital systems, software, and technology solutions from Nashik, Maharashtra.`);
}

function bindNavigation() {
  document.querySelectorAll("[data-route]").forEach(link => {
    link.addEventListener("click", event => {
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:")) return;
      const target = new URL(href, window.location.origin);
      if (target.origin !== window.location.origin) return;
      event.preventDefault();
      navigate(`${target.pathname}${target.search}${target.hash}`);
    });
  });

  const menuToggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".mobile-menu");
  const closeMenu = () => {
    menuToggle?.setAttribute("aria-expanded", "false");
    menu?.setAttribute("aria-hidden", "true");
    menu?.classList.remove("is-open");
    menuToggle?.setAttribute("aria-label", "Open navigation");
  };
  menuToggle?.addEventListener("click", () => {
    const open = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!open));
    menu?.setAttribute("aria-hidden", String(open));
    menu?.classList.toggle("is-open", !open);
    menuToggle.setAttribute("aria-label", open ? "Open navigation" : "Close navigation");
  });
  document.querySelectorAll(".mobile-menu [data-route]").forEach(link => link.addEventListener("click", closeMenu));
  document.onkeydown = event => { if (event.key === "Escape") closeMenu(); };
}

function bindForm() {
  const form = document.querySelector("#inquiry-form");
  if (!form) return;
  const feedback = document.querySelector("#form-feedback");
  const fields = [...form.querySelectorAll("[name]")].filter(field => field.name !== "website");
  const showError = (name, message) => {
    const field = form.elements[name];
    const error = form.querySelector(`[data-error-for="${name}"]`);
    field?.classList.toggle("has-error", Boolean(message));
    field?.setAttribute("aria-invalid", message ? "true" : "false");
    if (error) error.textContent = message || "";
  };
  const validate = () => {
    let valid = true;
    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim();
    const service = form.elements.service.value;
    const description = form.elements.description.value.trim();
    showError("name", name.length < 2 ? "Please enter your name." : ""); valid &&= name.length >= 2;
    showError("email", /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email) ? "" : "Please enter a valid email."); valid &&= /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);
    showError("service", service ? "" : "Choose a service area."); valid &&= Boolean(service);
    showError("description", description.length < 20 ? "Please share at least 20 characters." : ""); valid &&= description.length >= 20;
    return valid;
  };
  fields.forEach(field => field.addEventListener("blur", validate));
  form.addEventListener("submit", async event => {
    event.preventDefault();
    feedback.className = "form-feedback";
    feedback.textContent = "";
    if (!validate()) {
      feedback.classList.add("is-error");
      feedback.textContent = "A few details need your attention before this can be sent.";
      form.querySelector(".has-error")?.focus();
      return;
    }
    const submitButton = form.querySelector("button[type=submit]");
    submitButton.disabled = true;
    submitButton.classList.add("is-loading");
    submitButton.innerHTML = `Sending ${icon("arrowUp")}`;
    try {
      const response = await fetch(`${apiBaseUrl}/api/inquiry`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
      const data = await response.json();
      if (!response.ok) {
        Object.entries(data.fields || {}).forEach(([field, message]) => showError(field, message));
        throw new Error(data.error || "We could not send this inquiry.");
      }
      form.reset();
      feedback.className = "form-feedback is-success";
      feedback.textContent = data.message;
    } catch (error) {
      feedback.className = "form-feedback is-error";
      feedback.textContent = `${error.message} You can also email ${company.email}.`;
    } finally {
      submitButton.disabled = false;
      submitButton.classList.remove("is-loading");
      submitButton.innerHTML = `Send inquiry ${icon("arrowUp")}`;
    }
  });
}

function navigate(url) {
  const [path, hash] = url.split("#");
  window.history.pushState({}, "", `${path}${hash ? `#${hash}` : ""}`);
  render();
  if (hash) requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" }));
  else window.scrollTo({ top: 0, behavior: "instant" });
}

function render() {
  const app = document.querySelector("#app");
  app.innerHTML = `${header()}${pageForPath()}${footer()}`;
  setDocumentMeta();
  bindNavigation();
  bindForm();
}

window.addEventListener("popstate", render);
render();
