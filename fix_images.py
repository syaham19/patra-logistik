import re

def update_file(filename):
    with open(filename, 'r') as f:
        content = f.read()
    
    # 1. For berita-media.html
    content = content.replace(
        '<div class="press-hero-img" style="background: linear-gradient(135deg, #0056A6 0%, #1E293B 100%);"></div>',
        '<div class="press-hero-img" style="background: url(\\\'assets/Mobil%20Tangki%20Maos.png\\\') center/cover no-repeat;"></div>'
    )
    
    # 2. For berita-detail.html
    # Remove the logo inside
    old_hero = '''<div style="width: 100%; height: 450px; background: linear-gradient(135deg, #0056A6 0%, #1E293B 100%); display: flex; justify-content: center; align-items: center;">
                    <img src="assets/logo-transparent.png" style="width: 250px; opacity: 0.3;" alt="Patra Logistik Background">
                </div>'''
    new_hero = '''<div style="width: 100%; height: 450px; background: url(\'assets/Mobil%20Tangki%20Maos.png\') center/cover no-repeat; display: flex; justify-content: center; align-items: center;">
                </div>'''
    content = content.replace(old_hero, new_hero)
    
    with open(filename, 'w') as f:
        f.write(content)

update_file('berita-media.html')
update_file('berita-detail.html')
