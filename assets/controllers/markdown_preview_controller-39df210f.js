import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="markdown-preview"
export default class MarkdownPreviewController extends Controller {
  static targets = ["input", "preview"]
  static values = {
    url: String,
    debounceMs: { type: Number, default: 300 }
  }

  connect() {
    this.timeout = null
    console.log('[markdown-preview] Controller connected', { url: this.urlValue, hasInput: this.hasInputTarget, hasPreview: this.hasPreviewTarget })

    // If the textarea already has content (editing an existing post), render initial preview
    try {
      if (this.hasInputTarget && this.inputTarget.value && this.inputTarget.value.trim().length > 0) {
        this.fetchPreview()
      }
    } catch (e) {
      console.error('[markdown-preview] Error during connect:', e)
    }
  }

  disconnect() {
    clearTimeout(this.timeout)
  }

  update(event) {
    console.log('[markdown-preview] Update called with event:', event?.type)
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => this.fetchPreview(), this.debounceMsValue)
  }

  async fetchPreview() {
    const content = (this.hasInputTarget && this.inputTarget.value) ? this.inputTarget.value : ""
    console.log('[markdown-preview] Fetching preview for content length:', content.length)

    try {
      const tokenMeta = document.querySelector('meta[name="csrf-token"]')
      const token = tokenMeta ? tokenMeta.getAttribute('content') : ''
      const res = await fetch(this.urlValue, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': token,
          'Accept': 'text/html'
        },
        body: JSON.stringify({ content })
      })

      console.log('[markdown-preview] Response status:', res.status)

      if (!res.ok) {
        console.error('Preview fetch failed with status', res.status)
        this.previewTarget.innerHTML = '<div class="form-hint">Preview unavailable</div>'
        return
      }
      const rendered = await res.text()
      console.log('[markdown-preview] Rendered HTML length:', rendered.length)
      this.previewTarget.innerHTML = rendered
    } catch (err) {
      console.error('Preview fetch failed', err)
      if (this.hasPreviewTarget) this.previewTarget.innerHTML = '<div class="form-hint">Preview unavailable</div>'
    }
  }
}




