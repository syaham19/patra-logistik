import json

with open('extracted_tentang.json', 'r', encoding='utf-8') as f:
    texts = json.load(f)

# Hardcode translations for the first few items as a test, or provide a mapping
# Actually, I can use a simpler approach. I will translate them here in Python using a dictionary.

translations = {
    "Profil Korporasi": "Corporate Profile",
    "Mengenal Patra Logistik": "About Patra Logistik",
    "Solusi logistik energi terintegrasi dengan standar keselamatan dan kepatuhan tinggi untuk negeri.": "Integrated energy logistics solutions with high safety and compliance standards for the nation.",
    "Visi & Misi": "Vision & Mission",
    "\"Menjadi Perusahaan Penyedia Jasa Logistik Energi Terintegrasi yang Terkemuka, Handal, dan Berstandar Kelas Dunia di Indonesia.\"": "\"To become a Leading, Reliable, and World-Class Integrated Energy Logistics Service Provider in Indonesia.\"",
    "Menyelenggarakan jasa logistik energi terintegrasi yang efisien, aman, dan tepat waktu untuk menjamin pasokan energi nasional.": "Organizing efficient, safe, and timely integrated energy logistics services to ensure national energy supply.",
    "Menerapkan praktik HSSE (Health, Safety, Security & Environment) di tingkat tertinggi pada seluruh rantai operasional.": "Implementing the highest level of HSSE (Health, Safety, Security & Environment) practices across the entire operational chain.",
    "Membangun sinergi bisnis yang saling menguntungkan dengan mitra strategis serta memberikan nilai tambah optimal kepada pemangku kepentingan.": "Building mutually beneficial business synergies with strategic partners and providing optimal added value to stakeholders.",
    "Nilai Perusahaan (AKHLAK)": "Corporate Values (AKHLAK)",
    "Sebagai anak perusahaan dari grup BUMN Pertamina, kami memegang teguh nilai inti AKHLAK dalam menjalankan fungsi operasional sehari-hari:": "As a subsidiary of the state-owned Pertamina group, we uphold the core value of AKHLAK in carrying out our daily operational functions:",
    "Memegang teguh kepercayaan yang diberikan dengan integritas tinggi dan bertanggung jawab penuh.": "Upholding the trust given with high integrity and taking full responsibility.",
    "Terus belajar, berinovasi, dan meningkatkan kapabilitas untuk memberikan hasil kerja terbaik.": "Continuously learning, innovating, and improving capabilities to deliver the best work results.",
    "Saling peduli, berempati, dan menghargai keberagaman serta kontribusi setiap individu.": "Caring for, empathizing with, and respecting the diversity and contributions of each individual.",
    "Berdedikasi tinggi dan mengutamakan kepentingan bangsa serta kemajuan perusahaan.": "Highly dedicated and prioritizing the nation's interests as well as the company's progress.",
    "Cepat menyesuaikan diri, lincah menghadapi tantangan bisnis, dan terus melakukan perbaikan.": "Quick to adapt, agile in facing business challenges, and continuously making improvements.",
    "KOLABORATIF": "COLLABORATIVE",
    "Membangun kerja sama sinergis demi tujuan bersama dan pemenuhan energi nasional.": "Building synergistic cooperation for common goals and national energy fulfillment.",
    "SEJARAH PERUSAHAAN": "COMPANY HISTORY",
    "PT Patra Logistik berawal dari PT. Elnusa Kawasan Komersial yang didirikan pada tanggal 30 Agustus 1996 untuk mengelola Kawasan Komersil di Graha Elnusa TB Simatupang Kav 1-B, Jakarta Selatan. Tanggal 16 Agustus 2005 PT. Elnusa Kawasan Komersial berubah nama menjadi PT. Patra Logistik dan menjadi subsidiary dari PT. Pertamina Patra Niaga. PT Patra Logistik sekarang beralamatkan di Garden Avenue Rasuna lantai (1-3) Jl. Epicentrum Tengah No. 3 Kel. Setiabudi Jakarta Selatan.": "PT Patra Logistik originated from PT. Elnusa Kawasan Komersial, established on August 30, 1996, to manage the Commercial Area at Graha Elnusa TB Simatupang Kav 1-B, South Jakarta. On August 16, 2005, PT. Elnusa Kawasan Komersial changed its name to PT. Patra Logistik and became a subsidiary of PT. Pertamina Patra Niaga. PT Patra Logistik is now located at Garden Avenue Rasuna (floors 1-3) Jl. Epicentrum Tengah No. 3, Setiabudi, South Jakarta.",
    "PT Patra Logistik bergerak dibidang usaha hilir migas yang fokus pada kegiatan penyedia jasa logistik dan support jasa logistik lainnya. Berkomitmen dan berusaha penuh dengan sumber daya yang kami miliki untuk mengokohkan kompetensinya sebagai Perusahaan Logistik dengan memberikan layanan yang prima, PT Patra Logistik mengedepankan etos kerja yang profesional, transparan, dengan integritas yang tinggi yang berorientasi pada kepuasan pelanggan, stakeholder dan kesejahteraan serta tanggap dalam menghadapi dinamika": "PT Patra Logistik operates in the downstream oil and gas business, focusing on logistics service provision and other logistics support services. Committed and fully striving with the resources we have to strengthen its competence as a Logistics Company by providing prime services, PT Patra Logistik puts forward a professional and transparent work ethic with high integrity oriented towards customer and stakeholder satisfaction, welfare, and responsiveness in facing dynamics",
    "The Journey 2012–2013": "The Journey 2012–2013",
    "VHS BBM Timah, Pembangunan dan Pengoperasian DPPU Labuan Bajo": "Tin Fuel VHS, Construction and Operation of Labuan Bajo DPPU",
    "The Journey 2016–2017": "The Journey 2016–2017",
    "Franco BBM TNI, Pengelolaan KSO DPPU H.A.S. Hanandjoeddin": "TNI Fuel Franco, KSO Management of H.A.S. Hanandjoeddin DPPU",
    "The Journey 2018–2019": "The Journey 2018–2019",
    "Transportasi:": "Transportation:",
    "Transportasi Pelumas dari DSP Plumpang ke seluruh wilayah Indonesia Bagian Barat": "Lubricant Transportation from DSP Plumpang to all regions of Western Indonesia",
    "Transportasi CNG": "CNG Transportation",
    "Warehouse Management System": "Warehouse Management System",
    "Customs Clearance": "Customs Clearance",
    "The Journey 2019–2020": "The Journey 2019–2020",
    "The Journey 2020–2021": "The Journey 2020–2021",
    "Ekspansi pasar ke BUMN Non Pertamina Group dan Ekspansi bisnis special haulage heavy equipment.": "Market expansion to Non-Pertamina Group SOEs and business expansion in special haulage heavy equipment.",
    "Implementasi digitalisasi dan pengembangan aplikasi untuk mendukung kegiatan operasional.": "Implementation of digitalization and application development to support operational activities.",
    "The Journey 2022–2023": "The Journey 2022–2023",
    "Akuisisi TBBM Ketapang, VHS EP, VHS KAI, Fleet Management di Sorong & Ternate, Project APMS RPM, APMS Jatim Balinus.": "Acquisition of Ketapang TBBM, EP VHS, KAI VHS, Fleet Management in Sorong & Ternate, RPM APMS Project, Jatim Balinus APMS.",
    "The Journey 2024–2025": "The Journey 2024–2025",
    "Fleet Management di wilayah RJBT, Batam, Baturaja, Lahat & Lubuk Linggau.": "Fleet Management in RJBT, Batam, Baturaja, Lahat & Lubuk Linggau areas.",
    "Fleet Safety LPG Jatibalinus & RJBT.": "LPG Fleet Safety in Jatibalinus & RJBT.",
    "Angkutan FAME.": "FAME Transportation.",
    "Angkutan Produk Breezon MC-32.": "Breezon MC-32 Product Transportation.",
    "Awal berdiri sejak": "Initially established since",
    "30 Agustus 1996": "August 30, 1996",
    "sebagai PT. Elnusa Kawasan Komersial, PT Patra Logistik bervisi": "as PT. Elnusa Kawasan Komersial, PT Patra Logistik envisions",
    "menjadi pemimpin pasar logistik dan rantai suplai energi nasional.": "to become the market leader in national energy logistics and supply chain.",
    "Ekspansi pasar": "Market expansion",
    "ke BUMN Non Pertamina Group dan Ekspansi bisnis special haulage heavy equipment.": "to Non-Pertamina Group SOEs and business expansion in special haulage heavy equipment.",
    "Implementasi digitalisasi": "Implementation of digitalization",
    "dan pengembangan aplikasi untuk mendukung kegiatan operasional.": "and application development to support operational activities.",
    "TBBM Ketapang": "Ketapang TBBM",
    ", VHS EP, VHS KAI, Fleet Management di Sorong & Ternate, Project APMS RPM, APMS Jatim Balinus.": ", EP VHS, KAI VHS, Fleet Management in Sorong & Ternate, RPM APMS Project, Jatim Balinus APMS.",
    "Fleet Management": "Fleet Management",
    "di wilayah RJBT, Batam, Baturaja, Lahat & Lubuk Linggau.": "in RJBT, Batam, Baturaja, Lahat & Lubuk Linggau areas.",
    "Fleet Safety LPG": "LPG Fleet Safety",
    "Jatibalinus & RJBT.": "Jatibalinus & RJBT.",
    "Angkutan FAME": "FAME Transportation",
    "Angkutan Produk Breezon MC-32": "Breezon MC-32 Product Transportation",
    "Dewan Komisaris": "Board of Commissioners",
    "Budi YP Hutagaol": "Budi YP Hutagaol",
    "Komisaris Utama": "President Commissioner",
    "Achmad Tjachja Nugraha": "Achmad Tjachja Nugraha",
    "Komisaris Independent": "Independent Commissioner",
    "Dewan Direksi": "Board of Directors",
    "Yock Yorlando": "Yock Yorlando",
    "Direktur Utama": "President Director",
    "Joko Priyambodo": "Joko Priyambodo",
    "Direktur Operasional & Pemasaran": "Director of Operations & Marketing",
    "Struktur Perusahaan": "Corporate Structure",
    "Bagan kepemilikan saham, posisi holding, serta daftar anak perusahaan, patungan, dan afiliasi PT Patra Logistik (anak perusahaan PT Pertamina Patra Niaga).": "Shareholding structure, holding position, and list of subsidiaries, joint ventures, and affiliates of PT Patra Logistik (a subsidiary of PT Pertamina Patra Niaga).",
    "Government of": "Government of",
    "The Republic of Indonesia": "The Republic of Indonesia",
    "PT Pertamina (Persero)": "PT Pertamina (Persero)",
    "PT Pertamina Trans Kontinental": "PT Pertamina Trans Kontinental",
    "PATRA NIAGA": "PATRA NIAGA",
    "Pertamina Retail": "Pertamina Retail",
    "Fuel & Non Fuel Retail Business": "Fuel & Non Fuel Retail Business",
    "INTERNATIONAL": "INTERNATIONAL",
    "Pertamina International Marketing": "Pertamina International Marketing",
    "International Trading": "International Trading",
    "PETROCHEMICAL": "PETROCHEMICAL",
    "Petrochemical Trading": "Petrochemical Trading",
    "EPC, O&M, Plant Services": "EPC, O&M, Plant Services",
    "Trading & Services": "Trading & Services",
    "Marketing & Trading Aromatic & Olefin": "Marketing & Trading Aromatic & Olefin",
    "Marketing & Trading LBO": "Marketing & Trading LBO",
    "Pertamina Lubricants": "Pertamina Lubricants",
    "Lubricants & Special Chemical (Automotive Related)": "Lubricants & Special Chemical (Automotive Related)",
    "PATRA LOGISTIK": "PATRA LOGISTIK",
    "Patra Logistik": "Patra Logistik",
    "Transport & Inventory Management": "Transport & Inventory Management",
    "MAINTENANCE": "MAINTENANCE",
    "Maintenance & Construction": "Maintenance & Construction",
    "Pertamina International Timor": "Pertamina International Timor",
    "B2B & B2C Downstream Business": "B2B & B2C Downstream Business",
    "Pedeve Indonesia": "Pedeve Indonesia",
    "Investment and Business Portfolio Management": "Investment and Business Portfolio Management",
    "Anak Perusahaan (Subsidiary)": "Subsidiary",
    "Perusahaan Patungan (Joint Venture)": "Joint Venture",
    "Perusahaan Afiliasi (Affiliate)": "Affiliate",
    "Certification": "Certification",
    "Sebagai wujud komitmen terhadap kepuasan pelanggan, kesehatan, keselamatan, keamanan, dan lingkungan, kami menerapkan Manajemen Mutu serta Standar Health, Safety, Security and Environmental (HSSE). Komitmen kami dibuktikan dengan perolehan sertifikat standar internasional yang diperbarui secara berkala.": "As a manifestation of our commitment to customer satisfaction, health, safety, security, and the environment, we implement Quality Management and Health, Safety, Security, and Environmental (HSSE) Standards. Our commitment is proven by obtaining internationally updated standard certificates.",
    "ISO 9001:2015": "ISO 9001:2015",
    "Sistem Manajemen Mutu": "Quality Management System",
    "31 Desember 2021 – 30 Desember 2024": "December 31, 2021 – December 30, 2024",
    "ISO 14001:2015": "ISO 14001:2015",
    "Sistem Manajemen Lingkungan": "Environmental Management System",
    "ISO 45001:2018": "ISO 45001:2018",
    "Sistem Manajemen Kesehatan dan Keselamatan Kerja": "Occupational Health and Safety Management System",
    "Sistem Manajemen Keselamatan dan Kesehatan Kerja": "Occupational Safety and Health Management System",
    "Kementerian Ketenagakerjaan RI": "Ministry of Manpower of the Republic of Indonesia",
    "13 Mei 2022 – 12 Mei 2023": "May 13, 2022 – May 12, 2023",
    "Penghargaan Korporasi": "Corporate Awards",
    "Apresiasi dan penghargaan atas pencapaian kinerja, keselamatan kerja, serta kontribusi sosial PT Patra Logistik.": "Appreciation and awards for performance achievements, occupational safety, and social contributions of PT Patra Logistik.",
    "Sales Leaders Awards of The Year 2025 MarkPlus": "Sales Leaders Awards of The Year 2025 MarkPlus",
    "- Sales Strategy That Change The Game": "- Sales Strategy That Change The Game",
    "- Strategic Key Account Growth": "- Strategic Key Account Growth",
    "CSR Awards 2025 and CSR Brand Equity Summit 2025": "CSR Awards 2025 and CSR Brand Equity Summit 2025",
    "CSR Equity Awards in Logistic Category": "CSR Equity Awards in Logistic Category",
    "Sumatera Supplier Relationship Management (SRM) Summit 2025": "Sumatera Supplier Relationship Management (SRM) Summit 2025",
    "Best Performance Sinergi Pertamina Group": "Best Performance Synergy Pertamina Group",
    "SWA Media Awards 2024": "SWA Media Awards 2024",
    "Indonesia Best Business Transformation 2024": "Indonesia Best Business Transformation 2024",
    "Indonesia Logistic Awards (ILA) 2024 by Supply Chain Indonesia": "Indonesia Logistic Awards (ILA) 2024 by Supply Chain Indonesia",
    "The Best Performer for Energy Logistic Distribution of The Year": "The Best Performer for Energy Logistic Distribution of The Year",
    "Marketeers Editor's Choice Award (MECA) 2024": "Marketeers Editor's Choice Award (MECA) 2024",
    "Business Transformation of The Year": "Business Transformation of The Year",
    "The Iconomics Indonesia Innovation Awards 2024": "The Iconomics Indonesia Innovation Awards 2024",
    "Indonesia Innovation Company in Logistic Category": "Indonesia Innovation Company in Logistic Category",
    "Indonesia Public Relations Summit 2024 By The Iconomics": "Indonesia Public Relations Summit 2024 By The Iconomics",
    "Indonesia Popular Corporate Reputation Awards": "Indonesia Popular Corporate Reputation Awards",
    "Indonesia Fair Trusted Company GCG Awards 2023": "Indonesia Fair Trusted Company GCG Awards 2023",
    "Fair Trusted Company Based On Corporate Governance Perception Index (CGPI)": "Fair Trusted Company Based On Corporate Governance Perception Index (CGPI)",
    "Vendor Days Awards Pertamina Patra Niaga Reg. Kalimantan, Sulawesi, Papua Maluku 2024": "Vendor Days Awards Pertamina Patra Niaga Reg. Kalimantan, Sulawesi, Papua Maluku 2024",
    "- Best Performance Pertamina Group Affiliates": "- Best Performance Pertamina Group Affiliates",
    "- Business Support Penyaluran BBM 1 Harga": "- Business Support for 1-Price Fuel Distribution",
    "Vendor Day Awards PT Pertamina Lubricants 2024": "Vendor Day Awards PT Pertamina Lubricants 2024",
    "The Best Synergistic Alliance Achievement": "The Best Synergistic Alliance Achievement",
    "Best Practice Awards Pertamina Patra Niaga 2024": "Best Practice Awards Pertamina Patra Niaga 2024",
    "Performance Pencapaian ABI Fisik dan Finansial Anak Perusahaan Terbaik": "Best Subsidiary Physical and Financial ABI Achievement Performance",
    "Appreciation from President Director of PT Indonesia Air Asia": "Appreciation from President Director of PT Indonesia Air Asia",
    "Pertamina Komodo Airport Aircraft Refueling Depot, Labuan Bajo": "Pertamina Komodo Airport Aircraft Refueling Depot, Labuan Bajo",
    "Nation Aviation Forum tahun 2023": "National Aviation Forum 2023",
    "DPPU KSO Terbaik oleh DPPU Banyuwangi Atas Penyelesaian Closing Audit 100%": "Best KSO DPPU by Banyuwangi DPPU for 100% Audit Closing Completion",
    "Kantor Pusat": "Head Office",
    "Garden Avenue Rasuna Lantai 1-3, Jalan Epicentrum Tengah No. 3, RT.2/RW.5, Karet Kuningan, Kecamatan Setiabudi, Jakarta Selatan.": "Garden Avenue Rasuna Floors 1-3, Jalan Epicentrum Tengah No. 3, RT.2/RW.5, Karet Kuningan, Setiabudi District, South Jakarta.",
    "(021)-25196699": "(021)-25196699",
    "info.patralogistik@pertamina.com": "info.patralogistik@pertamina.com",
    "Whistle Blowing System": "Whistle Blowing System",
    "https://pertaminaclean.tipoffs.info/": "https://pertaminaclean.tipoffs.info/",
    "AFFILIATE OF:": "AFFILIATE OF:",
    "PERTAMINA PATRA NIAGA": "PERTAMINA PATRA NIAGA",
    "Semua konten, logo, dan hak cipta dilindungi oleh PT Patra Logistik dan\n                        PT Pertamina (Persero).": "All contents, logos, and copyrights are protected by PT Patra Logistik and\n                        PT Pertamina (Persero)."
}

with open('tentang-kami.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Generate JSON blocks
lang_id = ""
lang_en = ""

for i, text in enumerate(texts):
    if text not in translations:
        translations[text] = text
        
    key = f"about_{i}"
    
    # Escape quotes
    escaped_id = text.replace('"', '\\"').replace('\n', ' ')
    escaped_en = translations[text].replace('"', '\\"').replace('\n', ' ')
    
    lang_id += f'        "{key}": "{escaped_id}",\n'
    lang_en += f'        "{key}": "{escaped_en}",\n'
    
    # Inject into HTML
    # We only inject if it's currently >text<
    html = html.replace(f">{text}<", f" data-i18n=\"{key}\">{text}<")

# Update HTML file
with open('tentang-kami.html', 'w', encoding='utf-8') as f:
    f.write(html)

# Update lang.js
with open('lang.js', 'r', encoding='utf-8') as f:
    lang_content = f.read()

import re
lang_content = re.sub(
    r'(id: \{)',
    f'\\1\n{lang_id}',
    lang_content
)
lang_content = re.sub(
    r'(en: \{)',
    f'\\1\n{lang_en}',
    lang_content
)

with open('lang.js', 'w', encoding='utf-8') as f:
    f.write(lang_content)

print("Translation injected successfully!")
