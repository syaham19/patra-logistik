from html.parser import HTMLParser
import json

class TextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.texts = []
        self.recording = 0
        self.ignore_tags = {'script', 'style', 'head', 'nav', 'footer', 'svg', 'button', 'a'}
        self.current_tag = []

    def handle_starttag(self, tag, attrs):
        self.current_tag.append(tag)
        if tag in self.ignore_tags:
            self.recording += 1
        
        # Check if it already has data-i18n
        for attr, value in attrs:
            if attr == 'data-i18n':
                self.recording += 1

    def handle_endtag(self, tag):
        if self.current_tag and self.current_tag[-1] == tag:
            self.current_tag.pop()
        
        if tag in self.ignore_tags or self.recording > 0:
            if self.recording > 0:
                self.recording -= 1

    def handle_data(self, data):
        if self.recording == 0:
            text = data.strip()
            if len(text) > 10:
                self.texts.append(text)

with open('bisnis.html', 'r', encoding='utf-8') as f:
    html = f.read()

parser = TextExtractor()
parser.feed(html)
print(f"Total extracted strings: {len(parser.texts)}")
with open('extracted_bisnis.json', 'w', encoding='utf-8') as f:
    json.dump(parser.texts, f, indent=2, ensure_ascii=False)
