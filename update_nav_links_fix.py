import os
import re

for filename in os.listdir('.'):
    if filename.endswith('.html'):
        with open(filename, 'r') as f:
            content = f.read()
        
        def replacer(match):
            attributes = match.group(1)
            text = match.group(2)
            # Avoid adding if already there
            if 'data-text' not in attributes:
                # We know 'class="' is in there.
                # Just add data-text right before the closing >
                attributes = attributes.strip() + f' data-text="{text.strip()}"'
            return f'<a {attributes}>{text}</a>'
            
        # Match <a ... class="...nav-link..." ...>Text</a>
        new_content = re.sub(r'<a ([^>]*?class="[^"]*nav-link[^"]*"[^>]*?)>([^<]+)</a>', replacer, content)
        
        if content != new_content:
            with open(filename, 'w') as f:
                f.write(new_content)
            print(f"Fixed {filename}")

