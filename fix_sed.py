with open('berita-detail.html', 'r') as f:
    html = f.read()

# Restore the closing tag of the main navbar
html = html.replace('</div>\n\n    <!-- Spacer to prevent overlap -->', '</header>\n\n    <!-- Spacer to prevent overlap -->')

with open('berita-detail.html', 'w') as f:
    f.write(html)
