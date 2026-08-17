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
  let activeTrigger = null;

  function closePreview() {
    overlay.hidden = true;
    content.replaceChildren();
    document.body.classList.remove("media-preview-open");
    if (activeTrigger) {
      activeTrigger.focus();
      activeTrigger = null;
    }
  }

  function openPreview(link) {
    const src = link.getAttribute("href");
    const type = (link.dataset.previewType || "").toLowerCase() || (src.toLowerCase().endsWith(".pdf") ? "pdf" : "image");
    const previewTitle = link.dataset.previewTitle || link.textContent.trim() || "Preview";
    const media = document.createElement(type === "pdf" ? "iframe" : "img");

    title.textContent = previewTitle;
    openLink.href = src;
    media.setAttribute("src", src);
    media.setAttribute(type === "pdf" ? "title" : "alt", previewTitle);
    content.replaceChildren(media);

    overlay.hidden = false;
    document.body.classList.add("media-preview-open");
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
