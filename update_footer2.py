import glob, re

html_files = glob.glob('*.html')

for file in html_files:
    with open(file, 'r') as f:
        content = f.read()

    pattern = r'[\ \t]*<img src="\./assets/Image(?:%20|\s*)\(Pertamina(?:%20|\s*)Call(?:%20|\s*)Center\)\.png"[^>]+>'
    
    new_imgs = """                    <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
                        <img src="./assets/Image%20(Pertamina%20Call%20Center).png" alt="Pertamina Call Center 135" style="max-width: 55%; height: auto; display: block;">
                        <img src="./assets/callcenter15.png" alt="Call Center 135" style="max-width: 40%; height: auto; display: block;">
                    </div>"""
    
    content = re.sub(pattern, new_imgs, content)
    
    with open(file, 'w') as f:
        f.write(content)

print("Updated all html files again")
