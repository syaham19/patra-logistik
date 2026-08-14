// Reset scroll position on page refresh
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

(function initPageLoader() {
    const loader = document.getElementById("page-loader");
    const percentEl = document.getElementById("loader-percent");
    const barFill = document.getElementById("loader-bar-fill");

    if (!loader || !percentEl || !barFill) return;

    let progress = 0;
    let isPageLoaded = false;
    let hideTimeout;

    const updateProgress = (value) => {
        progress = Math.min(100, Math.max(0, Math.round(value)));
        percentEl.textContent = `${progress}%`;
        barFill.style.width = `${progress}%`;
    };

    const hideLoader = () => {
        updateProgress(100);
        loader.classList.add("is-hidden");
        document.body.classList.remove("loading");

        hideTimeout = window.setTimeout(() => {
            loader.remove();
        }, 600);
    };

    const tick = () => {
        if (progress >= 100) return;

        const target = isPageLoaded ? 100 : 90;
        const step = progress < 70 ? 4 : progress < 90 ? 2 : 1;

        if (progress < target) {
            updateProgress(progress + step);
        }

        if (progress < 100) {
            window.requestAnimationFrame(tick);
        } else {
            hideLoader();
        }
    };

    updateProgress(0);
    window.requestAnimationFrame(tick);

    window.addEventListener("load", () => {
        isPageLoaded = true;
    });

    window.setTimeout(() => {
        if (!loader.classList.contains("is-hidden")) {
            isPageLoaded = true;
            hideLoader();
        }
    }, 5000);
})();

document.addEventListener("DOMContentLoaded", () => {
    const heroVideo = document.querySelector(".hero-video");
    if (heroVideo) {
        heroVideo.play().catch(() => {});
    }

    // 1. Sticky Navbar Effect
    const navbar = document.getElementById("navbar");
    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // 2. Mobile menu toggle
    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("open");
            menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
            menuToggle.innerHTML = isOpen ? "&#10005;" : "&#9776;"; // X or Hamburger
        });

        navLinks.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", (e) => {
                if (link.nextElementSibling && link.nextElementSibling.classList.contains("dropdown-menu") && window.innerWidth <= 768) {
                    return; // Biarkan logika dropdown yang menangani ini
                }
                navLinks.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.innerHTML = "&#9776;";
            });
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 768) {
                navLinks.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    // 3. Intersection Observer untuk Fade-up Animation
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.15 // Animasi mulai saat 15% elemen terlihat
    };

    const observer = new IntersectionObserver((entries, localObserver) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                
                // Trigger count-up animation if it has .count-up elements
                const countUps = entry.target.querySelectorAll('.count-up');
                if (countUps.length > 0) {
                    countUps.forEach(startCountUp);
                }

                localObserver.unobserve(entry.target); // Hanya animate sekali
            }
        });
    }, observerOptions);

    function startCountUp(el) {
        const target = +el.getAttribute('data-target');
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 2000; // 2 detik
        const stepTime = 20; 
        const steps = duration / stepTime;
        const increment = target / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                el.innerText = target + suffix;
                clearInterval(timer);
            } else {
                el.innerText = Math.floor(current) + suffix;
            }
        }, stepTime);
    }

    const fadeElements = document.querySelectorAll(".fade-up");
    fadeElements.forEach((el) => observer.observe(el));

    // 4. Tracking Delivery Order Feature Logic
    const trackingForm = document.getElementById("tracking-form");
    const doInput = document.getElementById("do-number");
    const trackingModal = document.getElementById("tracking-modal");
    const closeModalBtn = document.getElementById("close-modal");
    const modalBackdrop = document.querySelector(".tracking-modal__backdrop");
    const resultContent = document.getElementById("tracking-result-content");
    const submitBtn = trackingForm ? trackingForm.querySelector("button[type='submit']") : null;

    // Database DO simulasi
    const trackingDb = {
        "DO-PATRA-001": {
            statusText: "Dalam Perjalanan",
            badgeClass: "transit",
            driver: "Budi Santoso",
            vehicle: "Hino 500 (B 9102 PFA)",
            fuel: "Pertamax - 16,000 L",
            eta: "10:15 WIB (SPBU 31.12345)",
            timeline: [
                { time: "10:15 WIB (Estimasi)", title: "Tiba di SPBU Tujuan", desc: "Estimasi armada tiba di SPBU 31.12345 Surabaya.", active: false },
                { time: "09:30 WIB", title: "Dalam Perjalanan - Tol Surabaya", desc: "Melintasi Tol Surabaya-Mojokerto (GPS Aktif, Kecepatan 55 km/jam).", active: true },
                { time: "08:45 WIB", title: "Armada Keluar TBBM", desc: "Dispatch selesai, armada mulai melakukan pengiriman.", active: false },
                { time: "08:00 WIB", title: "Pengisian Selesai", desc: "Proses loading BBM ke kompartemen tangki selesai di Gate 3.", active: false }
            ]
        },
        "DO-PATRA-002": {
            statusText: "Telah Tiba / Terkirim",
            badgeClass: "delivered",
            driver: "Supriadi",
            vehicle: "Mitsubishi Fuso (L 8443 UX)",
            fuel: "Solar Subsidi - 8,000 L",
            eta: "Tiba pada 09:15 WIB",
            timeline: [
                { time: "09:15 WIB", title: "Pengiriman Selesai", desc: "Diterima dengan baik oleh SPBU 34.67890. Tanda tangan & stempel terverifikasi.", active: true },
                { time: "08:50 WIB", title: "Proses Bongkar Muatan", desc: "Pembongkaran Solar ke tangki pendam SPBU selesai dilakukan.", active: false },
                { time: "08:15 WIB", title: "Armada Tiba di Lokasi", desc: "Armada telah sampai di SPBU 34.67890 dan melakukan pengecekan segel.", active: false },
                { time: "07:00 WIB", title: "Armada Keluar TBBM", desc: "Dispatch selesai dari TBBM Surabaya.", active: false }
            ]
        },
        "DO-PATRA-003": {
            statusText: "Menunggu Antrean",
            badgeClass: "loading",
            driver: "Joko Widodo",
            vehicle: "Hino Ranger (N 7721 UT)",
            fuel: "Pertamax Turbo - 12,000 L",
            eta: "Estimasi Dispatch 10:30 WIB",
            timeline: [
                { time: "09:45 WIB", title: "Menunggu Instruksi Dispatch", desc: "Pengecekan akhir kelengkapan dokumen pengiriman (LO/DO).", active: true },
                { time: "09:00 WIB", title: "Proses Quality Control", desc: "Pengecekan kualitas BBM oleh petugas laboratorium (Tepat Mutu).", active: false },
                { time: "08:30 WIB", title: "Antre di Loading Gate", desc: "Persiapan pengisian BBM di Loading Gate 2 TBBM Surabaya.", active: false },
                { time: "08:00 WIB", title: "Registrasi & HSSE Induction", desc: "Pengemudi melakukan registrasi dan pemeriksaan kesehatan rutin.", active: false }
            ]
        }
    };

    const performTracking = (doNumber) => {
        const cleanedDo = doNumber.trim().toUpperCase();
        if (!cleanedDo) return;

        // Visual loading state pada tombol
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span>MEMPROSES...</span><span style="display:inline-block; animation:spin 1s linear infinite;">⌛</span>`;
        }

        setTimeout(() => {
            const data = trackingDb[cleanedDo];
            
            if (data) {
                let timelineHtml = "";
                data.timeline.forEach(item => {
                    timelineHtml += `
                        <div class="tracking-timeline-item ${item.active ? 'active' : ''}">
                            <div class="tracking-timeline-node"></div>
                            <div class="tracking-timeline-time">${item.time}</div>
                            <h4 class="tracking-timeline-title">${item.title}</h4>
                            <p class="tracking-timeline-desc">${item.desc}</p>
                        </div>
                    `;
                });

                resultContent.innerHTML = `
                    <div class="tracking-result__title-wrapper">
                        <span class="tracking-result__status-badge status-badge--${data.badgeClass}">${data.statusText}</span>
                        <h3 class="tracking-result__do-title">No. DO: ${cleanedDo}</h3>
                    </div>
                    <div class="tracking-info-grid">
                        <div class="tracking-info-item">
                            <h5>Pengemudi / Driver</h5>
                            <p>${data.driver}</p>
                        </div>
                        <div class="tracking-info-item">
                            <h5>No. Kendaraan (Armada)</h5>
                            <p>${data.vehicle}</p>
                        </div>
                        <div class="tracking-info-item">
                            <h5>Muatan & Volume</h5>
                            <p>${data.fuel}</p>
                        </div>
                        <div class="tracking-info-item">
                            <h5>Estimasi / Waktu Tiba</h5>
                            <p>${data.eta}</p>
                        </div>
                    </div>
                    <h4 style="font-size:12px; text-transform:uppercase; letter-spacing:1px; margin-bottom:16px; color:rgba(255,255,255,0.8); font-weight: 700;">Riwayat Perjalanan</h4>
                    <div class="tracking-timeline">
                        ${timelineHtml}
                    </div>
                `;
            } else {
                resultContent.innerHTML = `
                    <div class="tracking-error-content">
                        <span class="tracking-error-icon">⚠️</span>
                        <h3 class="tracking-error-title">Nomor DO Tidak Ditemukan</h3>
                        <p class="tracking-error-desc">Nomor DO <strong>"${cleanedDo}"</strong> tidak terdaftar dalam sistem simulasi kami. Silakan gunakan nomor contoh di bawah untuk mencoba fitur pelacakan:</p>
                        <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin-top: 16px;">
                            <span class="do-pill modal-do-pill" data-do="DO-PATRA-001">DO-PATRA-001</span>
                            <span class="do-pill modal-do-pill" data-do="DO-PATRA-002">DO-PATRA-002</span>
                            <span class="do-pill modal-do-pill" data-do="DO-PATRA-003">DO-PATRA-003</span>
                        </div>
                    </div>
                `;

                // Add click listener to pills inside the error modal
                resultContent.querySelectorAll(".modal-do-pill").forEach(pill => {
                    pill.addEventListener("click", () => {
                        const targetDo = pill.getAttribute("data-do");
                        if (doInput) doInput.value = targetDo;
                        performTracking(targetDo);
                    });
                });
            }

            // Tampilkan Modal
            if (trackingModal) {
                trackingModal.classList.add("is-active");
                trackingModal.setAttribute("aria-hidden", "false");
                document.body.style.overflow = "hidden"; // disable scroll behind modal
            }

            // Restore submit button state
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `<span>LACAK SEKARANG</span><span class="btn-tracking__icon">→</span>`;
            }
        }, 800);
    };

    const closeModal = () => {
        if (trackingModal) {
            trackingModal.classList.remove("is-active");
            trackingModal.setAttribute("aria-hidden", "true");
            document.body.style.overflow = ""; // restore scroll
        }
    };

    // Event Listeners
    if (trackingForm) {
        trackingForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const val = doInput ? doInput.value : "";
            performTracking(val);
        });
    }

    // Click on examples in the tracking card footer
    document.querySelectorAll(".do-pill").forEach(pill => {
        pill.addEventListener("click", (e) => {
            e.stopPropagation();
            const targetDo = pill.textContent.replace(/[,\s]/g, "");
            if (doInput) doInput.value = targetDo;
            performTracking(targetDo);
        });
    });

    if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener("click", closeModal);

    // Keyboard support (Escape to close modal)
    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && trackingModal && trackingModal.classList.contains("is-active")) {
            closeModal();
        }
    });

    // 5. Interactive Map & Region Operational Stats Logic
    const morMarkers = document.querySelectorAll(".mor-marker");
    const panelCode = document.getElementById("panel-mor-code");
    const panelTitle = document.getElementById("panel-mor-title");
    const panelSubtitle = document.getElementById("panel-mor-subtitle");
    const panelCities = document.getElementById("panel-mor-cities");
    
    const panelInfoBlock = document.querySelector(".mor-detail-panel__info");

    const statRetailEl = document.getElementById("stat-retail");
    const statIndustrialEl = document.getElementById("stat-industrial");
    const statGasEl = document.getElementById("stat-gas");
    const statVmiEl = document.getElementById("stat-vmi");
    const statAviationEl = document.getElementById("stat-aviation");
    const statLubricantsEl = document.getElementById("stat-lubricants");
    const statWarehouseEl = document.getElementById("stat-warehouse");
    const statFuelTermEl = document.getElementById("stat-fuelterm");
    const statKrpEl = document.getElementById("stat-krp");

    const morDb = {
        "MOR-I": {
            code: "Region I",
            title: "Region I Sumatera Bagian Utara",
            subtitle: "Wilayah Layanan: Sumatera Bagian Utara",
            cities: ["Medan", "Banda Aceh", "Pekanbaru", "Batam", "Padang"],
            // Data: Retail=1, Industrial=27, VMI=9, Total=51
            stats: {retail: 1, industrial: 27, gas: 0, vmi: 9, aviation: 1, lubricants: 4, warehouse: 4, fuelterm: 0, krp: 5},
            projects: ["Retail Fuel Transport: 1 Project", "Industrial Fuel Transport (Franco): 27 Project", "Vendor Managed Inventory: 9 Lokasi", "Aviation Fuel Terminal: 1 Project", "Lubricants Transport: 4 Project", "Warehouse Service: 4 Project", "KRP: 5 Project"]
        },
        "MOR-II": {
            code: "Region II",
            title: "Region II Sumatera Bagian Selatan",
            subtitle: "Wilayah Layanan: Sumatera Bagian Selatan",
            cities: ["Palembang", "Lampung", "Jambi", "Bengkulu", "Pangkalpinang"],
            // Data: Retail=7, Industrial=12, VMI=12, Total=38
            stats: {retail: 7, industrial: 12, gas: 0, vmi: 12, aviation: 1, lubricants: 1, warehouse: 4, fuelterm: 0, krp: 1},
            projects: ["Retail Fuel Transport: 7 Project", "Industrial Fuel Transport (Franco): 12 Project", "Vendor Managed Inventory: 12 Lokasi", "Aviation Fuel Terminal: 1 Project", "Lubricants Transport: 1 Project", "Warehouse Service: 4 Project", "KRP: 1 Project"]
        },
        "MOR-III": {
            code: "Region III",
            title: "Region III Jawa Bagian Barat",
            subtitle: "Wilayah Layanan: Jawa Bagian Barat",
            cities: ["Jakarta", "Bandung", "Banten", "Depok", "Bekasi", "Cirebon"],
            // Data: Retail=5, Industrial=11, VMI=12, Total=43
            stats: {retail: 5, industrial: 11, gas: 5, vmi: 12, aviation: 0, lubricants: 6, warehouse: 2, fuelterm: 0, krp: 2},
            projects: ["Retail Fuel Transport: 5 Project", "Industrial Fuel Transport (Franco): 11 Project", "Gas Transport: 5 Project", "Vendor Managed Inventory: 12 Lokasi", "Lubricants Transport: 6 Project", "Warehouse Service: 2 Project", "KRP: 2 Project"]
        },
        "MOR-IV": {
            code: "Region IV",
            title: "Region IV Jawa Bagian Tengah",
            subtitle: "Wilayah Layanan: Jawa Bagian Tengah & DIY",
            cities: ["Semarang", "Yogyakarta", "Solo", "Cilacap", "Pekalongan", "Tegal"],
            // Data: Retail=7, Industrial=91, VMI=14, Total=123
            stats: {retail: 7, industrial: 91, gas: 3, vmi: 14, aviation: 0, lubricants: 0, warehouse: 1, fuelterm: 0, krp: 7},
            projects: ["Retail Fuel Transport: 7 Project", "Industrial Fuel Transport (Franco): 91 Project", "Gas Transport: 3 Project", "Vendor Managed Inventory: 14 Lokasi", "Warehouse Service: 1 Project", "KRP: 7 Project"]
        },
        "MOR-V": {
            code: "Region V",
            title: "Region V Jatimbalinus",
            subtitle: "Wilayah Layanan: Jawa Timur, Bali, & Nusa Tenggara",
            cities: ["Surabaya", "Malang", "Denpasar", "Mataram", "Kupang", "Madiun"],
            // Data: Retail=2, Industrial=13, VMI=3, Total=36
            stats: {retail: 2, industrial: 13, gas: 2, vmi: 3, aviation: 7, lubricants: 2, warehouse: 0, fuelterm: 6, krp: 1},
            projects: ["Retail Fuel Transport: 2 Project", "Industrial Fuel Transport (Franco): 13 Project", "Gas Transport: 2 Project", "Vendor Managed Inventory: 3 Lokasi", "Aviation Fuel Terminal: 7 Project", "Lubricants Transport: 2 Project", "Fuel Terminal: 6 Titik", "KRP: 1 Project"]
        },
        "MOR-VI": {
            code: "Region VI",
            title: "Region VI Kalimantan",
            subtitle: "Wilayah Layanan: Wilayah Kalimantan",
            cities: ["Balikpapan", "Banjarmasin", "Pontianak", "Samarinda", "Tarakan"],
            // Data: Retail=1, Industrial=7, VMI=2, Total=17
            stats: {retail: 1, industrial: 7, gas: 1, vmi: 2, aviation: 1, lubricants: 2, warehouse: 0, fuelterm: 1, krp: 2},
            projects: ["Retail Fuel Transport: 1 Project", "Industrial Fuel Transport (Franco): 7 Project", "Gas Transport: 1 Project", "Vendor Managed Inventory: 2 Lokasi", "Aviation Fuel Terminal: 1 Project", "Lubricants Transport: 2 Project", "Fuel Terminal: 1 Titik", "KRP: 2 Project"]
        },
        "MOR-VII": {
            code: "Region VII",
            title: "Region VII Sulawesi",
            subtitle: "Wilayah Layanan: Wilayah Sulawesi",
            cities: ["Makassar", "Manado", "Palu", "Kendari", "Gorontalo"],
            // Data: Retail=0, Industrial=7, VMI=1, Total=24
            stats: {retail: 0, industrial: 7, gas: 1, vmi: 1, aviation: 0, lubricants: 1, warehouse: 0, fuelterm: 13, krp: 1},
            projects: ["Industrial Fuel Transport (Franco): 7 Project", "Gas Transport: 1 Project", "Vendor Managed Inventory: 1 Lokasi", "Lubricants Transport: 1 Project", "Fuel Terminal: 13 Titik", "KRP: 1 Project"]
        },
        "MOR-VIII": {
            code: "Region VIII",
            title: "Region VIII Maluku Papua",
            subtitle: "Wilayah Layanan: Maluku & Papua",
            cities: ["Sorong", "Jayapura", "Ambon", "Ternate", "Manokwari", "Merauke"],
            // Data: Retail=1, Industrial=3, VMI=1, Total=8
            stats: {retail: 1, industrial: 3, gas: 0, vmi: 1, aviation: 2, lubricants: 0, warehouse: 0, fuelterm: 0, krp: 1},
            projects: ["Retail Fuel Transport: 1 Project", "Industrial Fuel Transport (Franco): 3 Project", "Vendor Managed Inventory: 1 Lokasi", "Aviation Fuel Terminal: 2 Project", "KRP: 1 Project"]
        }
    };


    // Helper function to animate number counter
    const animateCount = (element, start, end, duration = 800) => {
        if (!element) return;
        let startTime = null;

        const step = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const currentValue = Math.floor(progress * (end - start) + start);
            
            // Format number with dots as thousand separator (e.g. 1.092)
            element.textContent = currentValue.toLocaleString("id-ID");

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                element.textContent = end.toLocaleString("id-ID");
            }
        };

        window.requestAnimationFrame(step);
    };

    const parseCurrentValue = (element) => {
        if (!element) return 0;
        return parseInt(element.textContent.replace(/\./g, ""), 10) || 0;
    };

    const updateRegionDetails = (morKey) => {
        const data = morDb[morKey];
        if (!data) return;

        // Fade out details slightly
        if (panelInfoBlock) {
            panelInfoBlock.style.opacity = "0.3";
            panelInfoBlock.style.transform = "translateY(5px)";
        }
        if (panelCities) {
            panelCities.style.opacity = "0.3";
            panelCities.style.transform = "translateY(5px)";
        }

        setTimeout(() => {
            // Update panel text
            if (panelCode) panelCode.textContent = data.code;
            if (panelTitle) panelTitle.textContent = data.title;
            if (panelSubtitle) panelSubtitle.textContent = data.subtitle;

            // Update cities list
            if (panelCities) {
                panelCities.innerHTML = "";
                data.cities.forEach(city => {
                    const pill = document.createElement("span");
                    pill.className = "city-pill";
                    pill.textContent = city;
                    panelCities.appendChild(pill);
                });
            }

            // Update project list
            const projectList = document.getElementById("panel-mor-projects-list");
            if (projectList && data.projects) {
                projectList.innerHTML = "";
                data.projects.forEach(proj => {
                    const li = document.createElement("li");
                    li.textContent = proj;
                    projectList.appendChild(li);
                });
            }

            // Fade back in
            if (panelInfoBlock) {
                panelInfoBlock.style.opacity = "1";
                panelInfoBlock.style.transform = "translateY(0)";
            }
            if (panelCities) {
                panelCities.style.opacity = "1";
                panelCities.style.transform = "translateY(0)";
            }
        }, 200);

        // Animate statistic values
        animateCount(statRetailEl, parseCurrentValue(statRetailEl), data.stats.retail);
        animateCount(statIndustrialEl, parseCurrentValue(statIndustrialEl), data.stats.industrial);
        animateCount(statGasEl, parseCurrentValue(statGasEl), data.stats.gas);
        animateCount(statVmiEl, parseCurrentValue(statVmiEl), data.stats.vmi);
        animateCount(statAviationEl, parseCurrentValue(statAviationEl), data.stats.aviation);
        animateCount(statLubricantsEl, parseCurrentValue(statLubricantsEl), data.stats.lubricants);
        animateCount(statWarehouseEl, parseCurrentValue(statWarehouseEl), data.stats.warehouse);
        animateCount(statFuelTermEl, parseCurrentValue(statFuelTermEl), data.stats.fuelterm);
        animateCount(statKrpEl, parseCurrentValue(statKrpEl), data.stats.krp);
    };

    // Marker click event
    morMarkers.forEach(marker => {
        marker.addEventListener("click", () => {
            // Remove active class from other markers
            morMarkers.forEach(m => m.classList.remove("active"));
            
            // Add active class to clicked marker
            marker.classList.add("active");

            // Update panel details and animate stats
            const morKey = marker.getAttribute("data-mor");
            updateRegionDetails(morKey);
        });
    });

    // Initialize Default View (MOR III - Jawa Barat)
    const defaultMarker = document.querySelector('.mor-marker[data-mor="MOR-III"]');
    if (defaultMarker) {
        defaultMarker.classList.add("active");
        // No counter animation on page load, just set values immediately
        const defaultData = morDb["MOR-III"];
        if (defaultData) {
            if (statRetailEl) statRetailEl.textContent = defaultData.stats.retail.toLocaleString("id-ID");
            if (statIndustrialEl) statIndustrialEl.textContent = defaultData.stats.industrial.toLocaleString("id-ID");
            if (statGasEl) statGasEl.textContent = defaultData.stats.gas.toLocaleString("id-ID");
            if (statVmiEl) statVmiEl.textContent = defaultData.stats.vmi.toLocaleString("id-ID");
            if (statAviationEl) statAviationEl.textContent = defaultData.stats.aviation.toLocaleString("id-ID");
            if (statLubricantsEl) statLubricantsEl.textContent = defaultData.stats.lubricants.toLocaleString("id-ID");
            if (statWarehouseEl) statWarehouseEl.textContent = defaultData.stats.warehouse.toLocaleString("id-ID");
            if (statFuelTermEl) statFuelTermEl.textContent = defaultData.stats.fuelterm.toLocaleString("id-ID");
            if (statKrpEl) statKrpEl.textContent = defaultData.stats.krp.toLocaleString("id-ID");

            // Pre-populate project list for default region
            const projectList = document.getElementById("panel-mor-projects-list");
            if (projectList && defaultData.projects) {
                projectList.innerHTML = "";
                defaultData.projects.forEach(proj => {
                    const li = document.createElement("li");
                    li.textContent = proj;
                    projectList.appendChild(li);
                });
            }
        }
    }

    // Map Accordion Toggle
    const projectBtn = document.getElementById('panel-mor-project-btn');
    const projectContent = document.getElementById('panel-mor-project-content');
    if (projectBtn && projectContent) {
        projectBtn.addEventListener('click', () => {
            const isExpanded = projectBtn.getAttribute('aria-expanded') === 'true';
            projectBtn.setAttribute('aria-expanded', String(!isExpanded));
            projectContent.classList.toggle('open');
        });
    }

    // Reset accordion closed when switching regions
    morMarkers.forEach(marker => {
        marker.addEventListener('click', () => {
            if (projectBtn) projectBtn.setAttribute('aria-expanded', 'false');
            if (projectContent) projectContent.classList.remove('open');
        });
    });





    // Tabs switching logic for Services section
    const tabBtns = document.querySelectorAll(".services-tab-btn");
    const tabContents = document.querySelectorAll(".services-tab-content");

    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetTab = btn.getAttribute("data-tab");

            // Remove active class from all buttons and add to clicked
            tabBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            // Hide all tab contents and show the selected one
            tabContents.forEach(content => {
                content.classList.remove("active");
                if (content.id === `tab-${targetTab}`) {
                    content.classList.add("active");
                }
            });
        });
    });

    // Clone cards for marquee animation and set up JS-based scrolling
    const serviceTabContents = document.querySelectorAll('.services-tab-content');
    
    serviceTabContents.forEach(tabContent => {
        const grid = tabContent.querySelector('.services-cards-grid');
        if (!grid) return;
        
        const cards = Array.from(grid.children);
        // Duplicate once for infinite scroll
        cards.forEach(card => {
            const clone = card.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            grid.appendChild(clone);
        });

        // Setup JS scrolling loop
        let isHoveredOrTouched = false;
        let animationFrameId;

        // Interaction listeners to pause auto-scroll
        tabContent.addEventListener('mouseenter', () => isHoveredOrTouched = true);
        tabContent.addEventListener('mouseleave', () => isHoveredOrTouched = false);
        tabContent.addEventListener('touchstart', () => isHoveredOrTouched = true, {passive: true});
        tabContent.addEventListener('touchend', () => isHoveredOrTouched = false);

        function autoScroll() {
            if (!isHoveredOrTouched && tabContent.classList.contains('active')) {
                // Scroll speed
                tabContent.scrollLeft += 1;
                
                // If we scrolled exactly half the width (which is the original content)
                // We reset back to 0 to loop seamlessly
                if (tabContent.scrollLeft >= grid.scrollWidth / 2) {
                    tabContent.scrollLeft -= grid.scrollWidth / 2;
                }
            }
            animationFrameId = requestAnimationFrame(autoScroll);
        }

        // Start loop
        autoScroll();
    });
});

// Fungsi untuk mengatur Accordion pada bagian Layanan
function toggleService(element) {
    // Cari elemen yang sedang aktif
    const currentActive = document.querySelector('.service-item.active');
    
    // Jika yang diklik adalah yang sudah aktif, jangan lakukan apa-apa
    if (currentActive === element) return;

    // Hapus kelas active dari yang sebelumnya
    if (currentActive) {
        currentActive.classList.remove('active');
        currentActive.querySelector('.service-details').style.maxHeight = '0px';
    }

    // Tambahkan kelas active ke yang baru diklik
    element.classList.add('active');
    
    // Set max-height agar transisi CSS bekerja (angka 200px disesuaikan dgn isi konten)
    element.querySelector('.service-details').style.maxHeight = '200px'; 
}

// Mobile Dropdown Logic
document.addEventListener("DOMContentLoaded", () => {
    const dropdownLinks = document.querySelectorAll(".nav-links li.has-dropdown > .nav-link");
    
    dropdownLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            // Only apply accordion logic on mobile view (max-width: 768px)
            if (window.innerWidth <= 768) {
                e.preventDefault(); // Prevent direct navigation on first tap
                const parentLi = link.parentElement;
                
                // Toggle 'open' class
                parentLi.classList.toggle("open");
                
                // Optionally close others
                dropdownLinks.forEach(otherLink => {
                    if (otherLink !== link) {
                        otherLink.parentElement.classList.remove("open");
                    }
                });
            }
        });
    });
});

// Page Subnav Animation Helper
document.addEventListener("DOMContentLoaded", () => {
    const aboutMenuBtns = document.querySelectorAll(".about-menu-btn");
    aboutMenuBtns.forEach(btn => {
        if (!btn.getAttribute("data-text")) {
            btn.setAttribute("data-text", btn.textContent.trim());
        }
    });
});

// FAQ Accordion Logic
document.addEventListener("DOMContentLoaded", () => {
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(item => {
        const questionBtn = item.querySelector(".faq-question");
        const answer = item.querySelector(".faq-answer");
        
        questionBtn.addEventListener("click", () => {
            const isActive = item.classList.contains("active");
            
            // Close all items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove("active");
                otherItem.querySelector(".faq-answer").style.maxHeight = null;
            });

            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add("active");
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });
});

// CTA Banner Scroll Animation - Disabled by request

// Milestone Slideshow functionality
document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.ms-nav li');
    const slides = document.querySelectorAll('.ms-slide');
    const scrollWrapper = document.querySelector('.milestone-scroll-wrapper');
    const slideshow = document.querySelector('.milestone-slideshow');

    if (navItems.length > 0 && slides.length > 0) {
        let currentSlideIndex = 0;
        let slideInterval;

        // Helper function to update active slide
        const updateSlide = (index) => {
            navItems.forEach(nav => nav.classList.remove('active'));
            slides.forEach(slide => slide.classList.remove('active'));
            
            if (navItems[index]) navItems[index].classList.add('active');
            if (slides[index]) slides[index].classList.add('active');
        };

        const startSlideshow = () => {
            clearInterval(slideInterval);
            // Reset active class to re-trigger CSS animations
            const currentNav = navItems[currentSlideIndex];
            if (currentNav) {
                currentNav.classList.remove('active');
                void currentNav.offsetWidth; // trigger reflow
                currentNav.classList.add('active');
            }

            slideInterval = setInterval(() => {
                currentSlideIndex = (currentSlideIndex + 1) % slides.length;
                updateSlide(currentSlideIndex);
            }, 5000);
        };

        // Click handler
        navItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const index = parseInt(this.getAttribute('data-index'));
                currentSlideIndex = index;
                updateSlide(index);
                startSlideshow(); // Reset timer and restart animation
            });
        });

        // Initialize slideshow
        updateSlide(currentSlideIndex);
        startSlideshow();
    }

    // Map Zoom Logic
    const mapWrapper = document.querySelector('.map-wrapper');
    const btnZoomIn = document.getElementById('btn-zoom-in');
    const btnZoomOut = document.getElementById('btn-zoom-out');
    let currentMapZoom = 1;

    if (mapWrapper && btnZoomIn && btnZoomOut) {
        btnZoomIn.addEventListener('click', () => {
            if (currentMapZoom < 3) {
                currentMapZoom += 0.5;
                mapWrapper.style.width = `calc(90% * ${currentMapZoom})`;
                mapWrapper.style.maxWidth = `${900 * currentMapZoom}px`;
            }
        });

        btnZoomOut.addEventListener('click', () => {
            if (currentMapZoom > 1) {
                currentMapZoom -= 0.5;
                mapWrapper.style.width = `calc(90% * ${currentMapZoom})`;
                mapWrapper.style.maxWidth = `${900 * currentMapZoom}px`;
            }
        });
    }
});

/* =================================================================
   NEWSLETTER POPUP MODAL (Session Gated)
   ================================================================= */
document.addEventListener('DOMContentLoaded', () => {
    const popupOverlay = document.getElementById('nl-popup-overlay');
    if (!popupOverlay) return;

    const btnClose = document.getElementById('nl-popup-close');
    const btnSkip = document.getElementById('nl-popup-skip');
    const btnCloseSuccess = document.getElementById('nl-popup-close-success');
    const form = document.getElementById('nl-popup-form');
    const emailInput = document.getElementById('nlp-email');
    const submitBtn = document.getElementById('nlp-submit-btn');
    const formWrap = document.getElementById('nl-popup-form-wrap');
    const successWrap = document.getElementById('nl-popup-success');
    const errorMsg = document.getElementById('nlp-email-error');

    // Always ensure form is visible and success is hidden when popup opens
    const resetToForm = () => {
        if (formWrap) formWrap.hidden = false;
        if (successWrap) successWrap.hidden = true;
        if (emailInput) emailInput.value = '';
        if (errorMsg) errorMsg.textContent = '';
        if (emailInput) emailInput.classList.remove('is-error');
    };

    const openPopup = () => {
        resetToForm();
        popupOverlay.classList.add('is-open');
        popupOverlay.setAttribute('aria-hidden', 'false');
    };

    const closePopup = () => {
        popupOverlay.classList.remove('is-open');
        popupOverlay.setAttribute('aria-hidden', 'true');
        sessionStorage.setItem('patra_newsletter_seen', 'true');
    };

    // Show after 4s delay, only once per session
    if (!sessionStorage.getItem('patra_newsletter_seen')) {
        setTimeout(openPopup, 4000);
    }

    if (btnClose) btnClose.addEventListener('click', closePopup);
    if (btnSkip) btnSkip.addEventListener('click', closePopup);
    if (btnCloseSuccess) btnCloseSuccess.addEventListener('click', closePopup);

    // Close on click outside
    popupOverlay.addEventListener('click', (e) => {
        if (e.target === popupOverlay) {
            closePopup();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popupOverlay.classList.contains('is-open')) {
            closePopup();
        }
    });

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = emailInput.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                emailInput.classList.add('is-error');
                errorMsg.textContent = "Format email tidak valid";
                return;
            }

            emailInput.classList.remove('is-error');
            errorMsg.textContent = "";

            // Simulate loading
            submitBtn.classList.add('is-loading');

            setTimeout(() => {
                submitBtn.classList.remove('is-loading');
                formWrap.hidden = true;
                successWrap.hidden = false;
                sessionStorage.setItem('patra_newsletter_seen', 'true');
            }, 1200);
        });
    }

    if (emailInput) {
        emailInput.addEventListener('input', () => {
            if (emailInput.classList.contains('is-error')) {
                emailInput.classList.remove('is-error');
                errorMsg.textContent = "";
            }
        });
    }
});

/* =================================================================
   LANGUAGE SWITCHER
   ================================================================= */
document.addEventListener('DOMContentLoaded', () => {
    const langSwitch = document.querySelector('.lang-switch');
    const langBtnCurrent = document.getElementById('lang-btn-current');
    const currentLangText = document.getElementById('current-lang-text');
    const currentLangFlag = document.getElementById('current-lang-flag');
    const langOptions = document.querySelectorAll('.lang-option');
    
    if (!langSwitch || !langBtnCurrent) return;

    // Load saved language or default to 'id'
    const currentLang = localStorage.getItem('patra_lang') || 'id';

    function applyLanguage(lang) {
        if (typeof translations === 'undefined') return;
        const dict = translations[lang];
        if (!dict) return;

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key]) {
                if (el.tagName.toLowerCase() === 'input' && el.hasAttribute('placeholder')) {
                    el.setAttribute('placeholder', dict[key]);
                } else {
                    el.innerHTML = dict[key];
                }
            }
        });

        // Update data-text attributes for hover effects on nav links
        document.querySelectorAll('.nav-link[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key]) {
                el.setAttribute('data-text', dict[key]);
            }
        });
    }

    function updateSwitcherUI(lang) {
        if (lang === 'en') {
            currentLangText.textContent = 'ENG';
            currentLangFlag.src = 'https://flagcdn.com/w20/gb.png';
            currentLangFlag.alt = 'EN Flag';
        } else {
            currentLangText.textContent = 'INA';
            currentLangFlag.src = 'https://flagcdn.com/w20/id.png';
            currentLangFlag.alt = 'ID Flag';
        }
    }

    // Initial apply
    applyLanguage(currentLang);
    updateSwitcherUI(currentLang);

    // Toggle dropdown
    langBtnCurrent.addEventListener('click', (e) => {
        e.stopPropagation();
        langSwitch.classList.toggle('open');
        const isOpen = langSwitch.classList.contains('open');
        langBtnCurrent.setAttribute('aria-expanded', isOpen);
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        langSwitch.classList.remove('open');
        langBtnCurrent.setAttribute('aria-expanded', 'false');
    });

    // Handle clicks on options
    langOptions.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const btnTarget = e.currentTarget;
            const selectedLang = btnTarget.dataset.lang;
            if (selectedLang === localStorage.getItem('patra_lang')) return;

            // Save preference
            localStorage.setItem('patra_lang', selectedLang);

            // Create loading overlay
            const loaderOverlay = document.createElement('div');
            loaderOverlay.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(255,255,255,0.95);z-index:9999;display:flex;justify-content:center;align-items:center;opacity:0;transition:opacity 0.3s ease;';
            loaderOverlay.innerHTML = '<div style="width:50px;height:50px;border:4px solid #e2e8f0;border-top:4px solid #1E3A8A;border-radius:50%;animation:spin 1s linear infinite;"></div>';
            document.body.appendChild(loaderOverlay);
            
            // Trigger fade in
            requestAnimationFrame(() => {
                loaderOverlay.style.opacity = '1';
            });

            // Simulate loading process
            setTimeout(() => {
                // Apply new language
                applyLanguage(selectedLang);
                updateSwitcherUI(selectedLang);
                
                // Fade out
                loaderOverlay.style.opacity = '0';
                
                // Remove from DOM after fade out
                setTimeout(() => {
                    if(document.body.contains(loaderOverlay)) {
                        loaderOverlay.remove();
                    }
                }, 300);
            }, 600);
        });
    });
});

/* =================================================================
   PAGINATION LOGIC FOR NEWS
   ================================================================= */
document.addEventListener('DOMContentLoaded', () => {
    const newsGrid = document.getElementById('news-grid');
    if (!newsGrid) return;
    
    const cards = Array.from(newsGrid.querySelectorAll('.news-card'));
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const pageNumbers = document.getElementById('page-numbers');
    
    const cardsPerPage = 6;
    let currentPage = 1;
    const totalPages = Math.ceil(cards.length / cardsPerPage);
    
    function renderPage(page) {
        // Hide all
        cards.forEach(c => c.style.display = 'none');
        
        // Show for current page
        const start = (page - 1) * cardsPerPage;
        const end = start + cardsPerPage;
        cards.slice(start, end).forEach(c => {
            c.style.display = 'flex';
        });
        
        // Update buttons state
        prevBtn.disabled = page === 1;
        prevBtn.style.opacity = page === 1 ? '0.5' : '1';
        prevBtn.style.cursor = page === 1 ? 'not-allowed' : 'pointer';
        
        nextBtn.disabled = page === totalPages;
        nextBtn.style.opacity = page === totalPages ? '0.5' : '1';
        nextBtn.style.cursor = page === totalPages ? 'not-allowed' : 'pointer';
        
        // Render page numbers
        pageNumbers.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.textContent = i;
            btn.style.padding = '8px 12px';
            btn.style.border = '1px solid #CBD5E1';
            btn.style.borderRadius = '4px';
            btn.style.cursor = 'pointer';
            
            if (i === page) {
                btn.style.background = '#1E3A8A';
                btn.style.color = '#fff';
                btn.style.fontWeight = 'bold';
            } else {
                btn.style.background = '#fff';
                btn.style.color = '#1E3A8A';
            }
            
            btn.addEventListener('click', () => {
                currentPage = i;
                renderPage(currentPage);
                window.scrollTo({ top: newsGrid.offsetTop - 150, behavior: 'smooth' });
            });
            
            pageNumbers.appendChild(btn);
        }
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderPage(currentPage);
                window.scrollTo({ top: newsGrid.offsetTop - 150, behavior: 'smooth' });
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderPage(currentPage);
                window.scrollTo({ top: newsGrid.offsetTop - 150, behavior: 'smooth' });
            }
        });
    }
    
    // Initial render
    renderPage(currentPage);
});
