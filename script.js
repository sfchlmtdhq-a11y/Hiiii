/* =========================================================
   SFCH LIMITED — Shared Script
   Handles: mobile nav, scroll reveal, chat widget,
   gallery filtering + lightbox, contact form.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initScrollReveal();
  initChatPage();
  initGalleryPage();
  initContactForm();
  initActiveNavLink();
  initOfflineOverlay();
  initTeamCarousel();
  initBackToTop();
  initImageLightbox();
  initPageTransitions();
  initToasts();
});

/* ---------- Mobile Nav (hamburger) ---------- */
function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;

  // Explicit state instead of re-reading the DOM each click, so the
  // toggle can't silently get out of sync with what's on screen.
  let isOpen = false;

  function openMenu() {
    isOpen = true;
    links.classList.add("open");
    toggle.classList.add("open");
    toggle.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    isOpen = false;
    links.classList.remove("open");
    toggle.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }

  function toggleMenu() {
    isOpen ? closeMenu() : openMenu();
  }

  toggle.addEventListener("click", (e) => {
    e.preventDefault();
    toggleMenu();
  });

  // Close the menu after tapping a link
  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", closeMenu);
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen) closeMenu();
  });

  // Close if the viewport is resized back up to desktop width
  window.addEventListener("resize", () => {
    if (window.innerWidth > 760 && isOpen) closeMenu();
  });
}

/* Highlight current page in nav */
function initActiveNavLink() {
  const current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === current) link.classList.add("active");
  });
}

/* ---------- Scroll Reveal (fade-in on scroll) ---------- */
function initScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((el) => observer.observe(el));
}

/* ---------- Chat Page (chat.html) ---------- */
function initChatPage() {
  const chatPage = document.getElementById("chatPage");
  if (!chatPage) return; // only present on chat.html

  const body = document.getElementById("chatBody");
  const form = document.getElementById("chatForm");
  const input = document.getElementById("chatInput");
  const presetBtns = document.querySelectorAll(".chat-preset-btn");

  // Exact answers for the quick-reply buttons.
  const presetAnswers = {
    pricing: { text: "Check our packages above. All deliverables are digital files.", category: "sfch" },
    delivery: { text: "Logos: 2-3 days. Graphics: 24hrs. Websites: 7-14 days.", category: "sfch" },
    call: { text: "Let's talk on WhatsApp. Click the button to chat now.", category: "sfch" },
    coding: { text: "Ask me anything about HTML, CSS, JavaScript, frameworks, APIs, or how we build websites and apps at SFCH!", category: "coding" },
    design: { text: "Ask me about Photoshop, Illustrator, Figma, Canva, color theory, typography, or how we approach brand design here.", category: "design" },
    joke: { text: null, category: "general" }, // handled specially below
  };

  // Emoji "stickers" the bot fires off alongside a text reply, grouped by topic.
  const stickers = {
    sfch: ["🇳🇬🔥💼", "🙌🚀💙", "😎👍💯", "📱💻✅", "🥳🎉👏"],
    coding: ["🖥️💻⌨️", "🐛🔨✅", "☕📟🤓", "🚀👨‍💻🔥", "🤖💾✨"],
    design: ["🎨🖌️✨", "🌈📐💡", "🖼️🎭👌", "✂️📎🎯", "🦄🌟🎨"],
    general: ["😂🤣👍", "🙌✨😄", "🔥💯😎", "🤝💙🚀", "😅🙃👌"],
  };

  function randomSticker(category) {
    const pool = stickers[category] || stickers.general;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  const jokes = [
    "Why do programmers prefer dark mode? Because light attracts bugs. 🐛😂",
    "How many designers does it take to change a lightbulb? None, they'll just make the room darker and call it 'moody'. 💡😅",
    "I told my computer I needed a break. It said: 'No problem, I'll go to sleep too.' 😴💻",
    "Why did the CSS developer break up with JavaScript? Too many un-closed relationships. 😂🔗",
    "A client asked for a logo 'that pops'. We delivered fireworks. 🎆🎨",
  ];

  // Keyword-matched FAQ for anything typed into the free-text box.
  // First matching entry wins; falls back to the WhatsApp message.
  const faq = [
    // ---- SFCH Limited: pricing, services, logistics ----
    { category: "sfch", keywords: ["price", "pricing", "cost", "how much", "charge", "fee", "rate"],
      answer: "Our packages start from ₦50,000 for a Starter Logo, ₦150,000 for a Landing Page, and ₦10,000 for a single social media post. Check the Pricing section on the homepage for the full breakdown — all deliverables are digital files." },
    { category: "sfch", keywords: ["logo", "brand identity", "branding"],
      answer: "We offer three brand tiers: Starter Logo (₦50,000), Pro Brand Kit (₦120,000), and Premium Identity (₦250,000) — each includes concepts, revisions and digital brand files." },
    { category: "sfch", keywords: ["website", "web development", "landing page", "business site"],
      answer: "Website packages range from a ₦150,000 Landing Page (7 days) to a ₦350,000 Business Website (14 days) — fully responsive, with SEO setup and WhatsApp chat built in." },
    { category: "sfch", keywords: ["app", "web app", "mobile app", "dashboard", "software"],
      answer: "Custom Web Apps start from ₦800,000, including a dashboard, user login and database — delivery is usually 4–6 weeks depending on complexity." },
    { category: "sfch", keywords: ["graphic", "flyer", "social media post", "ad creative", "content pack", "poster"],
      answer: "We do social media posts (₦10,000 each), ad creatives (₦20,000 each), and a Monthly Content Pack of 12 posts for ₦80,000 — all delivered as digital files." },
    { category: "sfch", keywords: ["print", "printing", "physical copy", "hard copy"],
      answer: "We're 100% digital — SFCH Limited does not offer printing services. Every design is delivered as a ready-to-use digital file." },
    { category: "sfch", keywords: ["delivery", "how long", "turnaround", "how fast", "when will", "timeline"],
      answer: "Logos: 2–3 days. Graphics: 24hrs. Websites: 7–14 days. Web apps: 4–6 weeks." },
    { category: "sfch", keywords: ["revision", "changes", "edit my"],
      answer: "Most packages include 2–3 rounds of revisions depending on the tier — check the specific package above for the exact count." },
    { category: "sfch", keywords: ["where", "location", "based", "address", "lagos"],
      answer: "We're based in Lagos, Nigeria, and work with clients online — no need to visit in person." },
    { category: "sfch", keywords: ["contact", "whatsapp", "phone", "email", "reach you", "number"],
      answer: "You can reach us on WhatsApp at +234 707 757 9322 or email sfchlimited@gmail.com — WhatsApp usually gets the fastest reply." },
    { category: "sfch", keywords: ["hours", "open", "available", "when are you"],
      answer: "We're open Monday – Saturday, 9:00 AM – 6:00 PM WAT, and closed on Sundays." },
    { category: "sfch", keywords: ["portfolio", "sample", "example", "your work", "gallery"],
      answer: "Head over to our Gallery page to see logos, flyers, social content and church designs we've delivered for other clients." },
    { category: "sfch", keywords: ["payment", "pay", "deposit", "bank transfer"],
      answer: "Payment details are shared once we've discussed your project on WhatsApp — most projects start with a deposit before work begins." },
    { category: "sfch", keywords: ["get started", "how do i start", "begin", "start a project"],
      answer: "The easiest way to start is to chat with us on WhatsApp and tell us what you need — we'll recommend the right package and timeline." },
    { category: "sfch", keywords: ["discount", "cheaper", "negotiate", "bundle"],
      answer: "Our packages are priced to stay startup-friendly. For bundled services, like logo plus website, message us on WhatsApp and we're happy to discuss a bundle." },
    { category: "sfch", keywords: ["refund", "guarantee", "money back"],
      answer: "We work through revisions until you're happy with the direction before final files are delivered. For specific refund questions, please ask our team directly on WhatsApp." },
    { category: "sfch", keywords: ["ownership", "rights", "source file", "own the"],
      answer: "Once a project is paid for and delivered, you own the final files and full usage rights." },
    { category: "sfch", keywords: ["maintenance", "support", "after the project", "update my site"],
      answer: "We offer ongoing support and maintenance for websites and apps — ask us about it on WhatsApp." },
    { category: "sfch", keywords: ["who are you", "about sfch", "your team", "experience", "who is sfch", "founded", "founder"],
      answer: "SFCH Limited is a Lagos-based creative & tech agency specializing in brand identity, web/app development and digital graphics for startups and small businesses." },
    { category: "sfch", keywords: ["rush", "urgent", "asap", "fast track"],
      answer: "Rush delivery may be possible depending on our schedule — mention your deadline on WhatsApp and we'll let you know." },
    { category: "sfch", keywords: ["ecommerce", "e-commerce", "online store", "sell online"],
      answer: "Yes, we build e-commerce-ready websites — mention this when discussing your Business Website or Web App package." },
    { category: "sfch", keywords: ["church design", "church flyer", "church"],
      answer: "We design for churches too — from event flyers and sermon graphics to full church branding. Check the Church Designs category on our Gallery page." },
    { category: "sfch", keywords: ["book a call", "schedule a call", "talk to someone", "meeting"],
      answer: "Let's talk on WhatsApp. Click the button to chat now." },
    { category: "sfch", keywords: ["why choose", "why should i", "better than", "competitor"],
      answer: "We combine design and development in one team, deliver fast, and keep pricing startup-friendly — no juggling separate designers and developers." },
    { category: "sfch", keywords: ["team", "staff", "who works", "employee", "meet the team"],
      answer: "We're a small, senior team that handles your project end to end. Scroll down to the Meet Our Team section on the homepage to see who you'd be working with." },
    { category: "sfch", keywords: ["international", "outside nigeria", "diaspora", "abroad"],
      answer: "Yes, we work with clients outside Nigeria too — everything is handled over WhatsApp and every deliverable is a digital file, so location isn't a barrier." },
    { category: "sfch", keywords: ["installment", "instalment", "part payment", "split payment", "pay in stages"],
      answer: "For larger projects, we can split payment into milestones — bring it up on WhatsApp when we discuss your project scope." },
    { category: "sfch", keywords: ["rebrand", "redesign my logo", "redesign my site", "update my logo", "refresh my brand"],
      answer: "Yes — we handle rebrands and redesigns of existing logos and websites, not just new projects from scratch." },
    { category: "sfch", keywords: ["business email", "professional email", "company email"],
      answer: "We can set up a professional business email (like you@yourbrand.com) as part of a website package — ask about it on WhatsApp." },
    { category: "sfch", keywords: ["wordpress", "what platform", "site builder", "squarespace", "wix"],
      answer: "We hand-code your website rather than relying on a generic template builder like WordPress or Wix — it loads faster and is built specifically around your brand." },
    { category: "sfch", keywords: ["follow you", "social media handle", "instagram page", "tiktok", "facebook page", "your instagram"],
      answer: "You can find us on Instagram, Facebook and TikTok as @sfch.limited — links are in the footer of every page on this site." },
    { category: "sfch", keywords: ["testimonial", "review", "past client", "client feedback"],
      answer: "Take a look at our Gallery page for past work — for direct client feedback, ask us on WhatsApp and we're happy to share examples." },
    { category: "sfch", keywords: ["nda", "non-disclosure", "confidential", "keep it private"],
      answer: "We're comfortable discussing confidentiality for sensitive projects — raise it on WhatsApp before we start." },

    // ---- Coding & Web Development knowledge ----
    { category: "coding", keywords: ["what is html", "html mean"],
      answer: "HTML (HyperText Markup Language) is the standard markup language used to structure content on the web — headings, paragraphs, images, links and so on." },
    { category: "coding", keywords: ["what is css", "css mean"],
      answer: "CSS (Cascading Style Sheets) controls how a webpage looks — colors, layout, spacing, fonts — separate from the HTML content itself." },
    { category: "coding", keywords: ["what is javascript", "javascript do", "js mean"],
      answer: "JavaScript is the programming language that makes webpages interactive — think dropdown menus, form validation, animations, and this very chat!" },
    { category: "coding", keywords: ["domain", "hosting"],
      answer: "A domain is your website's address (like sfchlimited.com), and hosting is the server space where your site's files actually live. We can guide you through both — ask us on WhatsApp." },
    { category: "coding", keywords: ["what is an api", "what's an api", "api mean"],
      answer: "An API (Application Programming Interface) lets two different software systems talk to each other — like your website pulling weather data from another service." },
    { category: "coding", keywords: ["what is a database", "database mean"],
      answer: "A database stores and organizes information so an app can save, search and retrieve it — think user accounts, orders, or blog posts." },
    { category: "coding", keywords: ["react", "vue", "angular", "framework"],
      answer: "Frameworks like React, Vue and Angular are toolkits that make building complex, interactive websites faster and more organized than plain JavaScript alone." },
    { category: "coding", keywords: ["frontend", "front-end", "front end"],
      answer: "Frontend development is everything a user sees and clicks in their browser — built with HTML, CSS and JavaScript." },
    { category: "coding", keywords: ["backend", "back-end", "back end"],
      answer: "Backend development handles the behind-the-scenes logic — servers, databases, and APIs — that power what happens on the frontend." },
    { category: "coding", keywords: ["responsive design", "responsive website", "mobile friendly"],
      answer: "Responsive design means a website automatically adapts its layout to look great on any screen size, from phones to desktops — every site we build is responsive by default." },
    { category: "coding", keywords: ["git", "github", "version control"],
      answer: "Git is a version control system that tracks changes to code over time, and GitHub is a popular place to host and collaborate on that code." },
    { category: "coding", keywords: ["let const var", "let vs const", "var vs let", "difference between let"],
      answer: "In JavaScript: `var` is function-scoped and outdated, `let` is block-scoped and reassignable, and `const` is block-scoped but can't be reassigned. Most modern code uses `let` and `const`." },
    { category: "coding", keywords: ["how to learn to code", "learn coding", "learn programming", "learn to code"],
      answer: "Start with HTML and CSS to understand structure and style, then move to JavaScript for interactivity. Build small projects as you go — that's how most of us learned too!" },
    { category: "coding", keywords: ["best code editor", "vs code", "which editor", "text editor for code"],
      answer: "VS Code is the most popular free code editor right now — great extensions, built-in Git support, and it works for basically every language." },
    { category: "coding", keywords: ["debug", "console.log", "fix my code", "error in my code"],
      answer: "The classic first move: use `console.log()` to print values and see what's actually happening at each step — it solves more bugs than people expect!" },
    { category: "coding", keywords: ["what language", "programming language", "which language should i learn"],
      answer: "For web development: HTML/CSS/JavaScript are essential. If you want to branch into apps or backend work, Python and TypeScript are great next languages." },
    { category: "coding", keywords: ["seo", "google", "search engine"],
      answer: "SEO (Search Engine Optimization) is how you help Google understand and rank your site. Our Business Website package includes basic SEO setup out of the box." },

    // ---- Graphic Design & Tools knowledge ----
    { category: "design", keywords: ["photoshop"],
      answer: "Adobe Photoshop is the industry-standard tool for editing photos and creating raster (pixel-based) graphics — great for detailed image work and flyers." },
    { category: "design", keywords: ["illustrator"],
      answer: "Adobe Illustrator is built for vector graphics — perfect for logos and icons since they scale to any size without losing quality." },
    { category: "design", keywords: ["figma"],
      answer: "Figma is a browser-based design tool popular for UI/UX and website mockups, with real-time collaboration — we use it for a lot of our web design work." },
    { category: "design", keywords: ["canva"],
      answer: "Canva is a beginner-friendly design tool with templates — great for quick social posts, though custom brand work usually needs Illustrator or Photoshop for full control." },
    { category: "design", keywords: ["coreldraw", "corel draw"],
      answer: "CorelDRAW is another popular vector design tool, especially common for print and sign work — similar use case to Illustrator." },
    { category: "design", keywords: ["vector vs raster", "raster vs vector", "vector or raster", "difference between vector"],
      answer: "Vector graphics (like logos) are made of math-based shapes and scale infinitely without blurring. Raster graphics (like photos) are made of pixels and lose quality when scaled up too far." },
    { category: "design", keywords: ["png vs jpg", "jpg vs png", "png or jpg", "difference between png"],
      answer: "PNG supports transparency and is best for logos/graphics with clean edges. JPG compresses better and is best for photos where file size matters more than transparency." },
    { category: "design", keywords: ["svg"],
      answer: "SVG (Scalable Vector Graphics) is a vector format that scales perfectly at any size and loads fast on the web — ideal for logos and icons." },
    { category: "design", keywords: ["what is a pdf", "pdf format"],
      answer: "PDF is a fixed-layout file format that looks the same on any device — great for brand guideline documents and print-ready files." },
    { category: "design", keywords: ["color theory", "color palett
