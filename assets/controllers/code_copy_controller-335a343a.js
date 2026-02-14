import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["button"]

  connect() {
    // Find all pre code blocks and add copy buttons
    const preElements = this.element.querySelectorAll("pre")
    preElements.forEach((pre, index) => {
      const code = pre.querySelector("code")
      if (code) {
        const button = document.createElement("button")
        button.type = "button"
        button.className = "code-copy-btn"
        button.setAttribute("data-action", "click->code-copy#copy")
        button.setAttribute("data-code-copy-index", index)
        button.setAttribute("title", "Copy code")
        button.innerHTML = `
          <span class="copy-icon">📋</span>
          <span class="copy-text">Copy</span>
        `

        // Create wrapper for button placement
        pre.style.position = "relative"
        pre.insertBefore(button, code)
      }
    })
  }

  copy(event) {
    event.preventDefault()
    const button = event.target.closest(".code-copy-btn")
    const pre = button.closest("pre")
    const code = pre.querySelector("code")

    if (code) {
      const text = code.textContent

      // Copy to clipboard
      navigator.clipboard.writeText(text).then(() => {
        // Show feedback
        const originalHTML = button.innerHTML
        button.innerHTML = `<span class="copy-icon">✓</span><span class="copy-text">Copied!</span>`
        button.classList.add("copied")

        // Reset button after 2 seconds
        setTimeout(() => {
          button.innerHTML = originalHTML
          button.classList.remove("copied")
        }, 2000)
      }).catch(() => {
        // Fallback for older browsers
        const originalHTML = button.innerHTML
        button.innerHTML = `<span class="copy-icon">✗</span><span class="copy-text">Failed</span>`
        button.classList.add("error")

        setTimeout(() => {
          button.innerHTML = originalHTML
          button.classList.remove("error")
        }, 2000)
      })
    }
  }
}

