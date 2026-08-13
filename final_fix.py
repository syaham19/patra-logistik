with open('berita-detail.html', 'r') as f:
    html = f.read()

# Fix the logo
html = html.replace('src="assets/logo.png"', 'src="assets/logo-transparent.png"')

# Make sure all article-header occurrences are divs
html = html.replace('<header class="article-header"', '<div class="article-header"')
# Also fix the closing tag if it exists (which I did in my sed, but just in case)
html = html.replace('</header>\n\n            <figure class="article-hero"', '</div>\n\n            <figure class="article-hero"')

with open('berita-detail.html', 'w') as f:
    f.write(html)
