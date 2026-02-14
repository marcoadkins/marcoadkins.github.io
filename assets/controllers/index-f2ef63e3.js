import { Application } from "@hotwired/stimulus"
import MarkdownPreviewController from "controllers/markdown_preview_controller"
import CodeCopyController from "controllers/code_copy_controller"

const application = Application.start()

// Register controllers
application.register("markdown-preview", MarkdownPreviewController)
application.register("code-copy", CodeCopyController)

export { application }



