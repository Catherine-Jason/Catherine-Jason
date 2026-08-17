function goBackOrFallback(fallbackUrl) {
  let sameOriginReferrer = false;

  if (document.referrer) {
    try {
      sameOriginReferrer = new URL(document.referrer).origin === window.location.origin;
    } catch (error) {
      sameOriginReferrer = false;
    }
  }

  if (window.history.length > 1 && sameOriginReferrer) {
    window.history.back();
    return;
  }

  window.location.href = fallbackUrl;
}
