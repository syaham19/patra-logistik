import glob

html_files = glob.glob('*.html')

for file in html_files:
    with open(file, 'r') as f:
        content = f.read()

    # Find the target block
    # We want to replace the current img tags and the Whistle Blowing System block.
    # To be safe, we can use regex or simple string replacements if they are uniform.
    
    # In index.html and karir.html it's indented with 24 spaces for `<div class="text">`, 
    # but the image and call-center-btn are indented with 20 spaces.
    # Let's just find the generic pattern regardless of indentation.
    
import re

for file in html_files:
    with open(file, 'r') as f:
        content = f.read()

    # 1. Remove the callcenter15.png image at the bottom.
    content = re.sub(r'[\ \t]*<img src="\./assets/callcenter15\.png" alt="Call Center 135"[^>]+>\n', '', content)
    
    # 2. Replace the Pertamina Call Center img with the flex container containing both.
    old_img_pattern = r'<img src="\./assets/Image%20\(Pertamina%20Call%20Center\)\.png" alt="Pertamina Call Center 135" style="max-width: 100%; height: auto; margin-bottom: 24px; display: block;">'
    
    new_imgs = """<div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
                        <img src="./assets/Image%20(Pertamina%20Call%20Center).png" alt="Pertamina Call Center 135" style="max-width: 55%; height: auto; display: block;">
                        <img src="./assets/callcenter15.png" alt="Call Center 135" style="max-width: 40%; height: auto; display: block;">
                    </div>"""
    
    content = content.replace(old_img_pattern, new_imgs)
    
    with open(file, 'w') as f:
        f.write(content)

print("Updated all html files")
