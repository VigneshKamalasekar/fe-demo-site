const sections = [
  "header",
  "hero",
  "about",
  "contact",
  "footer"
];

async function loadJSON(section) {
  const response = await fetch(`content/${section}.json`);

  if (!response.ok) {
    throw new Error(`Unable to load content/${section}.json`);
  }

  return response.json();
}

async function loadAllContent() {
  const entries = await Promise.all(
    sections.map(async (section) => {
      return [section, await loadJSON(section)];
    })
  );

  return Object.fromEntries(entries);
}

function escapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderHeader(data) {
  return `
    <header class="site-header">
      <div class="header-inner">
        <a href="${escapeHTML(data.logo.url)}" class="logo">
          <span class="logo-icon">${escapeHTML(data.logo.icon)}</span>
          <span>${escapeHTML(data.logo.text)}</span>
        </a>

        <nav class="site-nav">
          ${data.navigation.map(item => `
            <a href="${escapeHTML(item.url)}">${escapeHTML(item.label)}</a>
          `).join("")}

          <a class="nav-cta" href="${escapeHTML(data.cta.url)}">
            ${escapeHTML(data.cta.label)}
          </a>
        </nav>
      </div>
    </header>
  `;
}

function renderHero(data) {
  return `
    <section
      class="hero"
      id="home"
      style="background-image: url('${escapeHTML(data.backgroundImage)}')"
    >
      <div class="hero-content">
        <div class="hero-copy">
          <h1>${escapeHTML(data.title)}</h1>
          <p>${escapeHTML(data.description)}</p>

          <div class="hero-actions">
            <a class="primary-btn" href="${escapeHTML(data.primaryButton.url)}">
              ${escapeHTML(data.primaryButton.label)}
            </a>

            <a class="secondary-btn" href="${escapeHTML(data.secondaryButton.url)}">
              ${escapeHTML(data.secondaryButton.label)}
            </a>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderAbout(data) {
  return `
    <section class="about" id="about">
      <div class="container">
        <div class="section-label">${escapeHTML(data.sectionLabel)}</div>
        <h2>${escapeHTML(data.title)}</h2>
        <p class="about-intro">${escapeHTML(data.description)}</p>

        <div class="features" id="features">
          ${data.features.map(feature => `
            <article class="feature">
              <div class="feature-icon">${escapeHTML(feature.icon)}</div>
              <div>
                <h3>${escapeHTML(feature.title)}</h3>
                <p>${escapeHTML(feature.description)}</p>
              </div>
            </article>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderContact(data) {
  const formFields = data.form.fields.map(field => {
    const required = field.required ? "required" : "";

    if (field.type === "textarea") {
      return `
        <div class="form-group">
          <textarea
            name="${escapeHTML(field.name)}"
            placeholder="${escapeHTML(field.placeholder)}"
            ${required}
          ></textarea>
        </div>
      `;
    }

    return `
      <div class="form-group">
        <input
          type="${escapeHTML(field.type)}"
          name="${escapeHTML(field.name)}"
          placeholder="${escapeHTML(field.placeholder)}"
          ${required}
        >
      </div>
    `;
  });

  // Keep the first two fields side-by-side.
  const firstTwo = formFields.slice(0, 2).join("");
  const remaining = formFields.slice(2).join("");

  return `
    <section class="contact" id="contact">
      <div class="container">
        <div class="contact-wrapper">

          <div class="contact-info">
            <div class="section-label">${escapeHTML(data.sectionLabel)}</div>
            <h2>${escapeHTML(data.title)}</h2>
            <p>${escapeHTML(data.description)}</p>

            <div>
              ${data.details.map(detail => `
                <div class="contact-detail">
                  <div class="contact-detail-icon">${escapeHTML(detail.icon)}</div>
                  <div>
                    ${escapeHTML(detail.value)}
                    ${detail.secondaryValue
                      ? `<br>${escapeHTML(detail.secondaryValue)}`
                      : ""}
                  </div>
                </div>
              `).join("")}
            </div>
          </div>

          <form class="contact-form" id="contactForm">
            <div class="form-row">
              ${firstTwo}
            </div>

            ${remaining}

            <button class="form-submit" type="submit">
              ${escapeHTML(data.form.submitButton.label)}
            </button>

            <div class="form-message" id="formMessage" hidden></div>
          </form>

        </div>
      </div>
    </section>
  `;
}

function renderFooter(data) {
  return `
    <footer class="site-footer">
      <div class="container">

        <div class="footer-grid">

          <div>
            <div class="logo footer-logo">
              <span class="logo-icon">${escapeHTML(data.logo.icon)}</span>
              <span>${escapeHTML(data.logo.text)}</span>
            </div>
          </div>

          ${data.columns.map(column => `
            <div class="footer-column">
              <h4>${escapeHTML(column.title)}</h4>

              ${column.links.map(link => `
                <a href="${escapeHTML(link.url)}">
                  ${escapeHTML(link.label)}
                </a>
              `).join("")}
            </div>
          `).join("")}

          <div class="footer-column">
            <h4>${escapeHTML(data.social.title)}</h4>

            <div class="social-links">
              ${data.social.links.map(link => `
                <a
                  href="${escapeHTML(link.url)}"
                  aria-label="${escapeHTML(link.platform)}"
                >
                  ${escapeHTML(link.label)}
                </a>
              `).join("")}
            </div>
          </div>

        </div>

        <div class="copyright">
          ${escapeHTML(data.copyright)}
        </div>

      </div>
    </footer>
  `;
}

async function renderPage() {
  const app = document.getElementById("app");

  try {
    const content = await loadAllContent();

    app.innerHTML =
      renderHeader(content.header) +
      renderHero(content.hero) +
      renderAbout(content.about) +
      renderContact(content.contact) +
      renderFooter(content.footer);

    const form = document.getElementById("contactForm");
    const formMessage = document.getElementById("formMessage");

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      formMessage.textContent =
        content.contact.form.successMessage;

      formMessage.hidden = false;
      form.reset();
    });

  } catch (error) {
    console.error(error);

    app.innerHTML = `
      <div class="load-error">
        <strong>Unable to load the website content.</strong>
        <p>Please run this project through a local web server rather than opening index.html directly.</p>
      </div>
    `;
  }
}

renderPage();
