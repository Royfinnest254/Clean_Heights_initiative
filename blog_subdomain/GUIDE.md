# 📖 Beginner's Guide: Managing Your Blog

Welcome to the **Storyteller Suite**! This guide will show you how to add new stories and photos like a pro.

---

### 🖼️ Step 1: Handling Photos (The Professional Way)

To keep your site fast and professional, follow these steps:

1.  **Prepare your photo**: Try to use horizontal (landscape) photos.
2.  **Upload**: 
    *   Open your **cPanel File Manager**.
    *   Go to the `blog.cleanheightsinitiative.org` folder.
    *   Open the `images` folder.
    *   Click **Upload** and drop your photo there (example: `village-view.jpg`).
3.  **Get the link**: Your link for the photo in the next step will simply be: `images/village-view.jpg`

---

### ✍️ Step 2: Adding a New Post

You don't need to code! You just need to update the "Post List."

1.  Open the folder `data` on your computer.
2.  Open the file `posts.json` with a text editor (like Notepad).
3.  Copy one of the existing stories (from the `{` to the `}`) and paste it at the top.
4.  **Change the text**:
    *   `"title"`: Your new headline.
    *   `"author"`: Your name.
    *   `"image"`: The link from Step 1 (e.g., `images/village-view.jpg`).
    *   `"content"`: Your full story. (Tip: Use `\n` to start a new paragraph).
5.  **Save and Upload**: Save the file and upload it back to the `data` folder on your server using cPanel.

---

### 🚀 Step 3: Best Practices for "Premium" Blogs

*   **Headlines**: Keep them punchy and emotional (e.g., "The Heart of the Rift" instead of "Blog Post 1").
*   **Excerpts**: The "excerpt" is the small text people see on the home page. Make it a "hook" that makes them want to click.
*   **Image Quality**: Use clear, bright photos. Avoid blurry shots.
*   **Categories**: Use simple categories like `Impact`, `Community`, or `Expedition`.

---

### 💡 Need Help?
If you get stuck, just ask me:
*   "How do I resize an image?"
*   "I broke the JSON file, can you fix it?"
*   "Can we add a YouTube video to a post?"

**You are now ready to be a Storyteller!**
