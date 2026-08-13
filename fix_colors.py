with open('berita-detail.html', 'r') as f:
    html = f.read()

old_style = '''        #navbar .nav-link::before { 
            color: #1E293B !important; 
        }
        /* Disable CSS content replacement to use actual img src */
        #navbar .logo-image {
            content: none !important;
        }'''

new_style = '''        #navbar .nav-link::before { 
            color: #1E293B !important; 
        }
        #navbar .nav-link::after { 
            color: #0056A6 !important; 
        }
        #navbar .lang-btn-current {
            color: #1E293B !important;
        }
        #navbar .menu-toggle {
            color: #1E293B !important;
        }
        /* Disable CSS content replacement and filter to show original colored logo */
        #navbar .logo-image {
            content: none !important;
            filter: none !important;
        }'''

html = html.replace(old_style, new_style)

with open('berita-detail.html', 'w') as f:
    f.write(html)
