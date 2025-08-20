// API Configuration
const API_URL = "http://localhost:8080/api"

// Global variables
let allBlogs = []
let currentBlog = null

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  loadBlogs()
  setupEventListeners()
})

// Setup event listeners
function setupEventListeners() {
  // Search functionality
  document.getElementById("search-input").addEventListener("input", (e) => {
    filterBlogs(e.target.value)
  })

  // Sort functionality
  document.getElementById("sort-select").addEventListener("change", (e) => {
    sortBlogs(e.target.value)
  })

  // Form submissions
  document.getElementById("create-blog-form").addEventListener("submit", handleCreateBlog)

  // Close modals when clicking outside
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) {
      closeModal(e.target.id)
    }
  })
}

// Blog functions
async function loadBlogs() {
  try {
    showLoading(true)
    const response = await fetch(`${API_URL}/blogs`)
    if (response.ok) {
      allBlogs = await response.json()
      displayBlogs(allBlogs)
    } else {
      showEmptyState()
    }
  } catch (error) {
    console.error("Error loading blogs:", error)
    showEmptyState()
  } finally {
    showLoading(false)
  }
}

function displayBlogs(blogs) {
  const grid = document.getElementById("blogs-grid")
  const noBlogs = document.getElementById("no-blogs")

  if (blogs.length === 0) {
    grid.innerHTML = ""
    noBlogs.classList.remove("hidden")
    return
  }

  noBlogs.classList.add("hidden")

  grid.innerHTML = blogs
    .map(
      (blog) => `
        <div class="blog-card" onclick="showBlogDetail(${blog.id})">
            <h3>${escapeHtml(blog.title)}</h3>
            <p>${escapeHtml(truncateText(blog.content, 150))}</p>
            <div class="blog-meta">
                <span class="blog-author">By ${escapeHtml(blog.authorName)}</span>
                <span class="blog-date">${formatDate(blog.createAt)}</span>
            </div>
            <div class="blog-actions" onclick="event.stopPropagation()">
                <div class="blog-stats">
                    <span><i class="fas fa-comment"></i> <span id="comments-${blog.id}">0</span></span>
                </div>
                <div class="blog-buttons">
                    <button class="btn btn-small btn-secondary" onclick="editBlog(${blog.id})">Edit</button>
                    <button class="btn btn-small" style="background: #dc3545; color: white;" onclick="deleteBlog(${blog.id})">Delete</button>
                </div>
            </div>
        </div>
    `,
    )
    .join("")

  // Load comment count for each blog
  blogs.forEach((blog) => {
    loadCommentCount(blog.id)
  })
}

async function loadCommentCount(blogId) {
  try {
    const commentResponse = await fetch(`${API_URL}/comments/blog/${blogId}`)
    if (commentResponse.ok) {
      const comments = await commentResponse.json()
      const commentElement = document.getElementById(`comments-${blogId}`)
      if (commentElement) commentElement.textContent = comments.length
    }
  } catch (error) {
    console.error("Error loading comment count:", error)
  }
}

async function handleCreateBlog(e) {
  e.preventDefault()

  const authorName = document.getElementById("author-name").value.trim() || "Anonymous"
  const title = document.getElementById("blog-title").value
  const content = document.getElementById("blog-content").value

  try {
    const response = await fetch(`${API_URL}/blogs/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, authorName }),
    })

    if (response.ok) {
      closeModal("create-blog-modal")
      document.getElementById("create-blog-form").reset()
      showNotification("Blog created successfully!", "success")
      loadBlogs()
    } else {
      showNotification("Failed to create blog. Please try again.", "error")
    }
  } catch (error) {
    console.error("Error creating blog:", error)
    showNotification("Failed to create blog. Please try again.", "error")
  }
}

async function showBlogDetail(blogId) {
  try {
    const response = await fetch(`${API_URL}/blogs/${blogId}`)
    if (response.ok) {
      currentBlog = await response.json()

      // Load comments
      const commentResponse = await fetch(`${API_URL}/comments/blog/${blogId}`)
      const comments = commentResponse.ok ? await commentResponse.json() : []

      displayBlogDetail(currentBlog, comments)
      showModal("blog-detail-modal")
    }
  } catch (error) {
    console.error("Error loading blog detail:", error)
    showNotification("Failed to load blog details.", "error")
  }
}

function displayBlogDetail(blog, comments) {
  const content = document.getElementById("blog-detail-content")

  content.innerHTML = `
        <div class="blog-detail">
            <h1>${escapeHtml(blog.title)}</h1>
            <div class="blog-detail-meta">
                <div>
                    <strong>By ${escapeHtml(blog.authorName)}</strong>
                    <span> • ${formatDate(blog.createAt)}</span>
                </div>
                <div>
                    <span><i class="fas fa-comment"></i> ${comments.length}</span>
                </div>
            </div>
            
            <div class="blog-detail-actions">
                <button class="btn btn-secondary" onclick="editBlog(${blog.id})">Edit</button>
                <button class="btn" style="background: #dc3545; color: white;" onclick="deleteBlog(${blog.id})">Delete</button>
            </div>
            
            <div class="blog-detail-content">
                ${formatContent(blog.content)}
            </div>
            
            <div class="comments-section">
                <h3>Comments (${comments.length})</h3>
                
                <div class="comment-form">
                    <input type="text" id="commenter-name" placeholder="Your name (optional)" style="margin-bottom: 10px;">
                    <textarea id="comment-input" placeholder="Write a comment..." rows="3"></textarea>
                    <button class="btn btn-primary" onclick="addComment()">Post Comment</button>
                </div>
                
                <div class="comments-list">
                    ${comments
                      .map(
                        (comment) => `
                        <div class="comment">
                            <div class="comment-header">
                                <span class="comment-author">${escapeHtml(comment.authorName)}</span>
                                <div>
                                    <span class="comment-date">${formatDate(comment.createdAt)}</span>
                                    <button class="btn btn-small" style="background: #dc3545; color: white; margin-left: 10px;" onclick="deleteComment(${comment.id})">Delete</button>
                                </div>
                            </div>
                            <div class="comment-content">${formatContent(comment.content)}</div>
                        </div>
                    `,
                      )
                      .join("")}
                </div>
            </div>
        </div>
    `
}

async function addComment() {
  const authorName = document.getElementById("commenter-name").value.trim() || "Anonymous"
  const content = document.getElementById("comment-input").value.trim()
  if (!content) {
    showNotification("Please write a comment.", "warning")
    return
  }

  try {
    const response = await fetch(`${API_URL}/comments/add?blogId=${currentBlog.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, authorName }),
    })

    if (response.ok) {
      showNotification("Comment added!", "success")
      showBlogDetail(currentBlog.id) // Refresh the blog detail
    } else {
      showNotification("Failed to add comment.", "error")
    }
  } catch (error) {
    console.error("Error adding comment:", error)
    showNotification("Failed to add comment.", "error")
  }
}

async function deleteComment(commentId) {
  if (!confirm("Are you sure you want to delete this comment?")) return

  try {
    const response = await fetch(`${API_URL}/comments/${commentId}/delete`, {
      method: "DELETE",
    })

    if (response.ok) {
      showNotification("Comment deleted!", "success")
      showBlogDetail(currentBlog.id) // Refresh the blog detail
    } else {
      showNotification("Failed to delete comment.", "error")
    }
  } catch (error) {
    console.error("Error deleting comment:", error)
    showNotification("Failed to delete comment.", "error")
  }
}

async function deleteBlog(blogId) {
  if (!confirm("Are you sure you want to delete this blog?")) return

  try {
    const response = await fetch(`${API_URL}/blogs/${blogId}/delete`, {
      method: "DELETE",
    })

    if (response.ok) {
      showNotification("Blog deleted!", "success")
      closeModal("blog-detail-modal")
      loadBlogs()
    } else {
      showNotification("Failed to delete blog.", "error")
    }
  } catch (error) {
    console.error("Error deleting blog:", error)
    showNotification("Failed to delete blog.", "error")
  }
}

function editBlog(blogId) {
  showNotification("Edit feature coming soon!", "warning")
}

// Utility functions
function filterBlogs(searchTerm) {
  if (!searchTerm.trim()) {
    displayBlogs(allBlogs)
    return
  }

  const filtered = allBlogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.authorName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  displayBlogs(filtered)
}

function sortBlogs(sortBy) {
  const sorted = [...allBlogs]

  switch (sortBy) {
    case "latest":
      sorted.sort((a, b) => new Date(b.createAt) - new Date(a.createAt))
      break
    case "oldest":
      sorted.sort((a, b) => new Date(a.createAt) - new Date(b.createAt))
      break
    case "title":
      sorted.sort((a, b) => a.title.localeCompare(b.title))
      break
  }

  displayBlogs(sorted)
}

function showLoading(show) {
  const loading = document.getElementById("loading")
  loading.classList.toggle("hidden", !show)
}

function showEmptyState() {
  const noBlogs = document.getElementById("no-blogs")
  noBlogs.classList.remove("hidden")
}

function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + "..."
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function formatContent(content) {
  return content
    .split("\n")
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join("")
}

function escapeHtml(text) {
  const div = document.createElement("div")
  div.textContent = text
  return div.innerHTML
}

// Modal functions
function showModal(modalId) {
  document.getElementById(modalId).classList.remove("hidden")
  document.body.style.overflow = "hidden"
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.add("hidden")
  document.body.style.overflow = ""
}

function showCreateBlog() {
  showModal("create-blog-modal")
}

// Notification functions
function showNotification(message, type = "info") {
  const notification = document.getElementById("notification")
  const messageElement = document.getElementById("notification-message")

  messageElement.textContent = message
  notification.className = `notification ${type}`
  notification.classList.remove("hidden")

  setTimeout(() => {
    hideNotification()
  }, 5000)
}

function hideNotification() {
  document.getElementById("notification").classList.add("hidden")
}
