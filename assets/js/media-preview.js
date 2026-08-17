(function () {
  const previewLinks = document.querySelectorAll("[data-media-preview]");

  if (!previewLinks.length) {
    return;
  }

  const overlay = document.createElement("div");
  overlay.className = "media-preview";
  overlay.hidden = true;
  overlay.innerHTML = `
    <div class="media-preview-dialog" role="dialog" aria-modal="true" aria-labelledby="media-preview-title">
      <div class="media-preview-header">
        <h2 id="media-preview-title">Preview</h2>
        <div class="media-preview-actions">
          <a class="media-preview-btn" href="#" target="_blank" rel="noopener noreferrer">Open in new tab</a>
          <button type="button" class="media-preview-btn">Back to page</button>
        </div>
      </div>
      <div class="media-preview-content"></div>
    </div>
  `;

  document.body.appendChild(overlay);

  const dialog = overlay.querySelector(".media-preview-dialog");
  const title = overlay.querySelector("#media-preview-title");
  const content = overlay.querySelector(".media-preview-content");
  const openLink = overlay.querySelector("a.media-preview-btn");
  const closeButton = overlay.querySelector("button.media-preview-btn");
  const bodyChildren = Array.from(document.body.children).filter((child) => child !== overlay);
  let activeTrigger = null;

  function setBackgroundHidden(hidden) {
    bodyChildren.forEach((child) => {
      if (hidden) {
        const currentValue = child.getAttribute("aria-hidden");
        if (currentValue !== null) {
          child.dataset.mediaPreviewAriaHidden = currentValue;
        }
        child.setAttribute("aria-hidden", "true");
      } else if ("mediaPreviewAriaHidden" in child.dataset) {
        child.setAttribute("aria-hidden", child.dataset.mediaPreviewAriaHidden);
        delete child.dataset.mediaPreviewAriaHidden;
      } else {
        child.removeAttribute("aria-hidden");
      }
    });
  }

  function closePreview() {
    overlay.hidden = true;
    content.replaceChildren();
    document.body.classList.remove("media-preview-open");
    setBackgroundHidden(false);
    if (activeTrigger) {
      activeTrigger.focus();
      activeTrigger = null;
    }
  }

  function openPreview(link) {
    const href = link.getAttribute("href");
    const resolvedUrl = new URL(href, window.location.href);
    const type = (link.dataset.previewType || "").toLowerCase() || (resolvedUrl.pathname.toLowerCase().endsWith(".pdf") ? "pdf" : "image");
    const previewTitle = link.dataset.previewTitle || link.textContent.trim() || "Preview";
    const media = document.createElement(type === "pdf" ? "iframe" : "img");

    if (resolvedUrl.origin !== window.location.origin) {
      window.location.assign(resolvedUrl.href);
      return;
    }

    title.textContent = previewTitle;
    openLink.href = resolvedUrl.href;
    media.setAttribute("src", resolvedUrl.href);
    media.setAttribute(type === "pdf" ? "title" : "alt", previewTitle);
    content.replaceChildren(media);

    overlay.hidden = false;
    document.body.classList.add("media-preview-open");
    setBackgroundHidden(true);
    activeTrigger = link;
    closeButton.focus();
  }

  previewLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      openPreview(link);
    });
  });

  closeButton.addEventListener("click", closePreview);

  overlay.addEventListener("click", (event) => {
    if (!dialog.contains(event.target)) {
      closePreview();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !overlay.hidden) {
      closePreview();
    }
  });
})();
