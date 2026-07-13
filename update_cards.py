import re

with open('index.html', 'r') as f:
    content = f.read()

# We need to insert the Selengkapnya button right after the description
btn_html = '\n                                    <a href="#" class="service-card-btn">Selengkapnya <span style="font-size:14px;">→</span></a>'

# Find all occurrences of </p> inside service-card-text-wrapper
pattern = r'(<p class="service-card-desc">.*?</p>)'
new_content = re.sub(pattern, r'\1' + btn_html, content, flags=re.DOTALL)

with open('index.html', 'w') as f:
    f.write(new_content)

print("Updated index.html")
