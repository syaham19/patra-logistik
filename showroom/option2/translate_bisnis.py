import json

with open('extracted_bisnis.json', 'r', encoding='utf-8') as f:
    texts = json.load(f)

# Hardcoded translations for bisnis.html
translations = {
    "Solusi Logistik & Energi": "Logistics & Energy Solutions",
    "Bisnis Kami": "Our Business",
    "Menyediakan rantai pasokan logistik energi yang terintegrasi, andal, dan berstandar internasional di seluruh Indonesia.": "Providing an integrated, reliable, and international-standard energy logistics supply chain across Indonesia.",
    "Patra Logistik hadir sebagai mitra transportasi logistik energi yang andal, dengan jaringan layanan yang luas, penerapan aspek keselamatan yang ketat, serta dukungan teknologi untuk memastikan setiap proses distribusi berjalan aman, efisien, dan terpantau secara real-time.": "Patra Logistik is here as a reliable energy logistics transportation partner, with an extensive service network, strict implementation of safety aspects, and technology support to ensure every distribution process runs safely, efficiently, and is monitored in real-time.",
    "Patra Logistik menyediakan layanan pengangkutan Bahan Bakar Minyak (BBM) melalui pengelolaan Awak Mobil Tangki (AMT) dan Mobil Tangki BBM yang terintegrasi, andal, dan berorientasi pada keselamatan. Layanan ini mendukung penyaluran BBM dari Fuel Terminal menuju SPBU, industri, maupun titik distribusi lainnya.": "Patra Logistik provides Fuel Oil (BBM) transportation services through the integrated, reliable, and safety-oriented management of Tank Truck Crews (AMT) and Fuel Tank Trucks. This service supports the distribution of fuel from the Fuel Terminal to gas stations, industries, and other distribution points.",
    "> Skema Layanan": "> Service Scheme",
    "Depot BBM Pertamina": "Pertamina Fuel Depot",
    "Armada Supply Patra Logistik": "Patra Logistik Supply Fleet",
    "Lokasi Serah Terima": "Handover Location",
    "Patra Logistik menyediakan layanan pengangkutan Liquefied Petroleum Gas (LPG) menggunakan armada truk tangki khusus bertekanan yang dirancang untuk menjaga keamanan, kualitas, dan keandalan distribusi gas dalam bentuk cair.": "Patra Logistik provides Liquefied Petroleum Gas (LPG) transportation services using specialized pressurized tank truck fleets designed to maintain safety, quality, and reliability of gas distribution in liquid form.",
    "Layanan ini mendukung penyaluran pasokan LPG secara massal dari depot atau terminal utama menuju Stasiun Pengisian Bulk Elpiji (SPBE) maupun titik layanan lainnya.": "This service supports mass LPG supply distribution from depots or main terminals to LPG Bulk Filling Stations (SPBE) and other service points.",
    "Skema Distribusi LPG (Mother-Daughter System)": "LPG Distribution Scheme (Mother-Daughter System)",
    "Mother Station": "Mother Station",
    "Transport (Skid Tank)": "Transport (Skid Tank)",
    "Daughter Station": "Daughter Station",
    "Skema Distribusi LNG (Virtual Pipeline System)": "LNG Distribution Scheme (Virtual Pipeline System)",
    "LNG Plant/LNG Terminal": "LNG Plant/LNG Terminal",
    "LNG Filling Station": "LNG Filling Station",
    "Trucking + ISO Tank": "Trucking + ISO Tank",
    "Regasification Facility": "Regasification Facility",
    "LNG Customer": "LNG Customer",
    "Mengelola distribusi rantai pasok pelumas secara dua arah, menjangkau area operasional mulai dari Depot Supply Point (DSP) hingga ke distributor di seluruh wilayah Indonesia maupun sebaliknya.": "Managing two-way lubricant supply chain distribution, reaching operational areas from Depot Supply Points (DSP) to distributors throughout Indonesia and vice versa.",
    "Ujung Berung": "Ujung Berung",
    "DISTRIBUTOR": "DISTRIBUTOR",
    "Door to Door": "Door to Door",
    "Layanan distribusi bahan bakar aviasi (Avtur) secara andal dan berstandar internasional dari Terminal Bahan Bakar Minyak (TBBM) menuju Depot Pengisian Pesawat Udara (DPPU) hingga pengisian langsung ke maskapai penerbangan.": "Reliable and international-standard aviation fuel (Avtur) distribution services from Fuel Terminals (TBBM) to Aircraft Refueling Depots (DPPU) up to direct refueling to airlines.",
    "Penyaluran Avtur volume besar menggunakan truk tangki (bridger avtur) dari TBBM utama/Kilang menuju tangki penyimpanan DPPU bandara.": "Large volume Avtur distribution using tank trucks (bridger avtur) from main TBBM/Refineries to airport DPPU storage tanks.",
    "Layanan pengisian bahan bakar langsung ke tangki pesawat udara menggunakan refueller truck maupun dispenser sistem hydrant bandara.": "Direct aircraft refueling services using refueller trucks or airport hydrant system dispensers.",
    "Pengangkutan limbah B3 (Bahan Berbahaya dan Beracun) sisa operasional logistik energi dengan izin resmi dan prosedur keselamatan yang sangat ketat untuk memastikan perlindungan lingkungan yang komprehensif.": "Transportation of B3 waste (Hazardous and Toxic Materials) from energy logistics operations with official permits and very strict safety procedures to ensure comprehensive environmental protection.",
    "Penghasil Limbah B3": "B3 Waste Generator",
    "Fleet B3 Berlisensi": "Licensed B3 Fleet",
    "Fasilitas Pengolah B3": "B3 Processing Facility",
    "Kenapa Perusahaan Mempercayakan Transportasi kepada Patra Logistik?": "Why do companies entrust transportation to Patra Logistik?",
    "Nationwide Network": "Nationwide Network",
    "Jaringan operasional yang tersebar di berbagai wilayah Indonesia, mendukung kebutuhan distribusi energi secara luas dan berkelanjutan.": "Operational network spread across various regions of Indonesia, supporting broad and sustainable energy distribution needs.",
    "HSSE Principle": "HSSE Principle",
    "Mengedepankan prinsip Health, Safety, Security, and Environment dalam setiap aktivitas operasional untuk memastikan layanan berjalan aman dan sesuai standar.": "Prioritizing Health, Safety, Security, and Environment principles in every operational activity to ensure services run safely and according to standards.",
    "Cost Effectiveness": "Cost Effectiveness",
    "Optimalisasi operasional untuk mendukung efisiensi biaya tanpa mengurangi kualitas, keselamatan, dan keandalan layanan.": "Operational optimization to support cost efficiency without compromising service quality, safety, and reliability.",
    "Real Time Monitoring": "Real Time Monitoring",
    "Pemantauan armada secara real-time untuk memastikan pergerakan kendaraan, rute, dan aktivitas distribusi dapat terpantau dengan akurat.": "Real-time fleet monitoring to ensure vehicle movements, routes, and distribution activities can be tracked accurately.",
    "Multi-Moda Integration": "Multi-Modal Integration",
    "Mendukung integrasi berbagai moda transportasi untuk menciptakan solusi logistik yang lebih fleksibel, efisien, dan terhubung.": "Supporting the integration of various transportation modes to create more flexible, efficient, and connected logistics solutions.",
    "Inventory Management": "Inventory Management",
    "Kami bertekad untuk memberikan pelayanan terbaik kepada Anda. Dengan beragam armada yang dikelola oleh tim yang memiliki dedikasi dan keahlian, kami berharap dapat menyampaikan keunggulan kepada Anda.": "We are determined to provide the best service to you. With diverse fleets managed by dedicated and expert teams, we hope to deliver excellence to you.",
    "Fuel Terminal Ketapang, berdiri pada tahun 2006, adalah pusat penyimpanan dan distribusi energi strategis di Kalimantan Barat. Terletak di alur Sungai Pawan, terminal ini vital menyuplai BBM (Biosolar, Pertalite, Pertamax) ke wilayah Ketapang dan Kayong Utara dengan kapasitas tangki timbun mencapai 7.200 kiloliter.": "Fuel Terminal Ketapang, established in 2006, is a strategic energy storage and distribution center in West Kalimantan. Located in the Pawan River channel, this terminal is vital in supplying Fuel (Biosolar, Pertalite, Pertamax) to the Ketapang and Kayong Utara regions with a storage tank capacity reaching 7,200 kiloliters.",
    "FT Ketapang dilengkapi dengan dermaga untuk muat dan bongkar, serta pengisian bahan bakar dengan kapasitas 3.000 DWT.": "FT Ketapang is equipped with a jetty for loading and unloading, as well as refueling with a capacity of 3,000 DWT.",
    "Kapasitas DWT": "DWT Capacity",
    "Total Kapasitas": "Total Capacity",
    "Patra Logistik berperan strategis dalam pengelolaan gudang dan distribusi pelumas PT Pertamina Lubricants (PTPL). Sinergi ini difokuskan pada penguatan rantai pasok (supply chain), optimalisasi infrastruktur warehouse, dan peningkatan layanan distribusi.": "Patra Logistik plays a strategic role in the warehouse management and distribution of PT Pertamina Lubricants (PTPL). This synergy is focused on strengthening the supply chain, optimizing warehouse infrastructure, and improving distribution services.",
    "Pengelolaan dan pendistribusian Depot Supply Point PT Pertamina Lubricants ini meliputi pengelolaan Gudang seperti Receiving, Storaging, Picking, serta menyediakan SDM guna untuk operasional Warehousing.": "The management and distribution of PT Pertamina Lubricants' Depot Supply Points include warehouse management such as Receiving, Storaging, Picking, as well as providing human resources for warehousing operations.",
    "DPPU (Depot Pengisian Pesawat Udara) adalah bentuk kolaborasi antara Pertamina Patra Niaga dengan PT Patra Logistik untuk mengelola operasional pengisian bahan bakar pesawat di berbagai bandara di Indonesia. Skema ini bertujuan memastikan keandalan stok avtur dan efisiensi pelayanan pengisian pesawat.": "DPPU (Aircraft Refueling Depot) is a form of collaboration between Pertamina Patra Niaga and PT Patra Logistik to manage aircraft refueling operations at various airports in Indonesia. This scheme aims to ensure the reliability of avtur stock and the efficiency of aircraft refueling services.",
    "Manajemen pengelolaan bahan bakar yang meliputi pengiriman bahan bakar, penyimpanan bahan bakar, hingga penyaluran bahan bakar serta pemeliharaan sarana penyimpanan bahan bakar yang tersedia di lokasi konsumen (Vendor Held Stocks).": "Fuel management covering fuel delivery, fuel storage, up to fuel distribution and maintenance of fuel storage facilities available at the consumer's location (Vendor Held Stocks).",
    "> Skema Alur Operasi VHS": "> VHS Operations Flow Scheme",
    "Sumber Pasokan": "Supply Source",
    "Depot BBM Patra Niaga": "Patra Niaga Fuel Depot",
    "🚢 Kapal (Laut)": "🚢 Ship (Sea)",
    "🚚 Armada (Darat)": "🚚 Fleet (Land)",
    "Lokasi Konsumen": "Consumer Location",
    "Storage VHS": "VHS Storage",
    "Fasilitas Storage": "Storage Facility",
    "🚢 Kapal Supply": "🚢 Supply Ship",
    "⚙️ Flowmeter": "⚙️ Flowmeter",
    "🚛 Service Tank Truck": "🚛 Service Tank Truck",
    "Destinasi Akhir": "Final Destination",
    "Equipment Customer": "Customer Equipment",
    "(Kapal, genset, alat berat, dll.)": "(Ships, generators, heavy equipment, etc.)",
    "Layanan pengelolaan gudang material proyek, suku cadang, dan peralatan pendukung untuk industri energi secara profesional. Kami menerapkan WMS (Warehouse Management System) modern untuk memastikan pencatatan inventori yang akurat, pelacakan real-time, dan tata letak penyimpanan yang optimal.": "Professional management services for project material warehouses, spare parts, and supporting equipment for the energy industry. We implement modern WMS (Warehouse Management System) to ensure accurate inventory recording, real-time tracking, and optimal storage layout.",
    "Material Storage": "Material Storage",
    "Penyimpanan material proyek dan peralatan industri dengan tata ruang aman dan higienis.": "Storage of project materials and industrial equipment with safe and hygienic spatial layouts.",
    "Sparepart Management": "Spare Part Management",
    "Pencatatan stock level suku cadang vital secara berkala untuk meminimalkan waktu henti (downtime) operasional.": "Periodic recording of vital spare part stock levels to minimize operational downtime.",
    "Other Business": "Other Business",
    "Layanan penyewaan kendaraan ringan penumpang (Light Passenger Vehicle) untuk mendukung kegiatan operasional perkantoran dan lapangan mitra kerja di berbagai daerah operasional seluruh Indonesia. Armada kami terawat secara berkala dan didukung oleh sistem pemantauan berkendara yang aman.": "Light Passenger Vehicle rental services to support office and field operational activities of working partners in various operational areas throughout Indonesia. Our fleet is maintained periodically and supported by a safe driving monitoring system.",
    "Layanan pengurusan administrasi kepabeanan, ekspor-impor, serta perizinan kepelabuhanan (Customs Clearance) secara cepat, tepat, dan patuh terhadap regulasi hukum yang berlaku. Kami mempermudah proses kepabeanan komoditas energi Anda agar alur distribusi berjalan lancar.": "Customs administration, export-import, and port licensing (Customs Clearance) services handled quickly, accurately, and in compliance with applicable legal regulations. We simplify the customs process for your energy commodities to ensure smooth distribution flow.",
    "Solusi teknologi informasi yang terintegrasi untuk mendukung operasional logistik, termasuk sistem manajemen transportasi (TMS), pelacakan real-time, integrasi data supply chain, dan pemeliharaan infrastruktur TI di wilayah operasi terpencil.": "Integrated information technology solutions to support logistics operations, including transportation management systems (TMS), real-time tracking, supply chain data integration, and IT infrastructure maintenance in remote operating areas.",
    "Penyediaan tenaga kerja profesional dan bersertifikat (seperti pengemudi mobil tangki/AMT, staf logistik, operasional lapangan) untuk menjamin standar keselamatan (HSSE) yang ketat dan efisiensi kerja tinggi pada ekosistem distribusi energi Anda.": "Provision of professional and certified manpower (such as tank truck drivers/AMT, logistics staff, field operations) to ensure strict safety standards (HSSE) and high work efficiency in your energy distribution ecosystem.",
    "Layanan pengangkutan produk energi non-BBM, seperti Fatty Acid Methyl Ester (FAME) dan refrigeran ramah lingkungan Breezon MC (refrigeran hidrokarbon dari Pertamina) untuk kebutuhan industri, otomotif, dan pendingin ruangan ramah lingkungan.": "Transportation services for non-fuel energy products, such as Fatty Acid Methyl Ester (FAME) and eco-friendly refrigerants Breezon MC (hydrocarbon refrigerants from Pertamina) for industrial, automotive, and eco-friendly air conditioning needs.",
    "Pengangkutan FAME": "FAME Transportation",
    "Pengangkutan FAME (Fatty Acid Methyl Ester) sebagai bahan campuran utama biodiesel guna mendukung bauran energi terbarukan nasional serta program ramah lingkungan pemerintah.": "Transportation of FAME (Fatty Acid Methyl Ester) as the main biodiesel blend component to support the national renewable energy mix and the government's eco-friendly programs.",
    "Bioenergy Distribution": "Bioenergy Distribution",
    "Pengangkutan BreezonMC": "Breezon MC Transportation",
    "Distribusi dan pengangkutan refrigeran hidrokarbon Breezon MC produksi Pertamina sebagai solusi media pendingin udara ramah lingkungan yang aman dan berefisiensi energi tinggi.": "Distribution and transportation of Pertamina's Breezon MC hydrocarbon refrigerant as a safe and highly energy-efficient eco-friendly air cooling medium solution.",
    "Green Refrigerant Transport": "Green Refrigerant Transport",
    "Fleet Management": "Fleet Management",
    "Melalui layanan": "Through integrated",
    "yang terintegrasi, Patra Logistik menghadirkan solusi menyeluruh untuk memastikan setiap armada beroperasi dalam performa terbaik, mulai dari pengelolaan operasional harian, pemantauan performa kendaraan, perawatan dan pemeliharaan berkala, hingga optimalisasi utilisasi armada.": "services, Patra Logistik presents comprehensive solutions to ensure every fleet operates at peak performance, starting from daily operational management, vehicle performance monitoring, periodic care and maintenance, to optimizing fleet utilization.",
    "Servis dan solusi yang kami kelola": "Services and solutions we manage",
    "Fleet Operations": "Fleet Operations",
    "Lacak seluruh transaksi operasional kendaraan, pantau penggunaan bensin, hingga pencatatan riwayat perjalanan secara akurat untuk maksimalkan penggunaan masing-masing kendaraan.": "Track all vehicle operational transactions, monitor fuel usage, to accurate travel history recording to maximize the use of each vehicle.",
    "Route Optimization": "Route Optimization",
    "Ketahui rute terpendek dan tercepat untuk sampai tujuan dengan mempertimbangkan faktor-faktor seperti kondisi lalu lintas, jarak, perkiraan cuaca hingga waktu tempuh. Meningkatkan efisiensi waktu perjalanan.": "Know the shortest and fastest route to your destination considering factors such as traffic conditions, distance, weather forecasts, and travel time. Increase travel time efficiency.",
    "Maintenance Management": "Maintenance Management",
    "Notifikasi real-time ketika armada Anda membutuhkan perbaikan. Menetapkan jadwal pemeliharaan berdasarkan interval waktu secara otomatis. Minimalisir downtime kendaraan Anda.": "Real-time notifications when your fleet needs repair. Automatically set maintenance schedules based on time intervals. Minimize your vehicle downtime.",
    "Driver Management": "Driver Management",
    "Kelola seluruh data pengemudi dalam driver management system yang terpusat. Pantau lokasi, jam kerja, dan aktivitas driver secara real-time.": "Manage all driver data in a centralized driver management system. Monitor location, working hours, and driver activities in real-time.",
    "Seamless Integration IoT": "Seamless IoT Integration",
    "Kemudahan integrasi geofencing, GPS, odometer, sensor, dan masih banyak lagi untuk memantau lokasi, kecepatan, dan kondisi operasional kendaraan secara real-time.": "Easy integration of geofencing, GPS, odometers, sensors, and much more to monitor location, speed, and vehicle operational conditions in real-time.",
    "Report Performance": "Performance Report",
    "Menyediakan data terperinci mengenai penggunaan kendaraan, termasuk konsumsi bahan bakar hingga kecepatan, yang dapat digunakan untuk membuat keputusan bisnis yang lebih baik.": "Provide detailed data regarding vehicle usage, including fuel consumption to speed, which can be used to make better business decisions.",
    "Sistem Operasional & Jangkauan Depot": "Operational System & Depot Reach",
    "Maintenance Management System (MMS)": "Maintenance Management System (MMS)",
    "Security & Surveillance": "Security & Surveillance",
    "GPS TRACK MT & DASHCAM": "GPS TRACK MT & DASHCAM",
    "Operation & Maintenance": "Operation & Maintenance",
    "Tyre Management System (TMS)": "Tyre Management System (TMS)",
    "Traffic Road Control (TRC)": "Traffic Road Control (TRC)",
    "Human Resource (Own Use)": "Human Resource (Own Use)",
    "Fleet Project": "Fleet Project",
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

with open('bisnis.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Generate JSON blocks
lang_id = ""
lang_en = ""

for i, text in enumerate(texts):
    if text not in translations:
        translations[text] = text
        
    key = f"biz_{i}"
    
    # Escape quotes
    escaped_id = text.replace('"', '\\"').replace('\n', ' ')
    escaped_en = translations[text].replace('"', '\\"').replace('\n', ' ')
    
    lang_id += f'        "{key}": "{escaped_id}",\n'
    lang_en += f'        "{key}": "{escaped_en}",\n'
    
    # Inject into HTML
    html = html.replace(f">{text}<", f" data-i18n=\"{key}\">{text}<")

# Update HTML file
with open('bisnis.html', 'w', encoding='utf-8') as f:
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

print("Bisnis translation injected successfully!")
