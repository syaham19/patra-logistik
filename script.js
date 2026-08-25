// Reset scroll position on page refresh
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// Track internal link navigation to skip loader when clicking links between pages
document.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (link && link.href && !link.target && link.origin === window.location.origin) {
        const isSamePageHash = link.pathname === window.location.pathname && link.hash;
        if (!isSamePageHash) {
            sessionStorage.setItem("is_internal_nav", "true");
        }
    }
});

(function initPageLoader() {
    const loader = document.getElementById("page-loader");
    if (!loader) return;

    // Detect navigation type: 'reload' (refresh) vs 'navigate' (initial open or link click)
    const navEntries = performance.getEntriesByType ? performance.getEntriesByType("navigation") : [];
    const isReload = navEntries.length > 0 ? navEntries[0].type === "reload" : (performance.navigation && performance.navigation.type === 1);
    const isInternalNav = sessionStorage.getItem("is_internal_nav") === "true";

    // Clear flag for subsequent reloads or visits
    sessionStorage.removeItem("is_internal_nav");

    // If navigating internally between pages (and NOT reloading/refreshing), skip the loader immediately
    if (isInternalNav && !isReload) {
        document.body.classList.remove("loading");
        loader.remove();
        return;
    }

    const percentEl = document.getElementById("loader-percent");
    const barFill = document.getElementById("loader-bar-fill");
    const truckWrapper = document.getElementById("loader-truck-wrapper");
    const truckAnimEl = document.getElementById("loader-truck-anim");

    if (!percentEl || !barFill) return;

    let progress = 0;
    let isPageLoaded = false;
    let hideTimeout;

    // Load Lottie animation for truck
    if (truckAnimEl) {
        const startLottie = () => {
            if (window.lottie) {
                window.lottie.loadAnimation({
                    container: truckAnimEl,
                    renderer: 'svg',
                    loop: true,
                    autoplay: true,
                    path: 'assets/truck-loader.json'
                });
            }
        };

        if (window.lottie) {
            startLottie();
        } else {
            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js";
            script.onload = startLottie;
            document.head.appendChild(script);
        }
    }

    const updateProgress = (value) => {
        progress = Math.min(100, Math.max(0, value));
        const displayPercent = Math.min(100, Math.floor(progress));
        percentEl.textContent = `${displayPercent}%`;
        barFill.style.width = `${progress}%`;
        if (truckWrapper) {
            truckWrapper.style.left = `${progress}%`;
        }
    };

    const hideLoader = () => {
        updateProgress(100);
        loader.classList.add("is-hidden");
        document.body.classList.remove("loading");

        hideTimeout = window.setTimeout(() => {
            loader.remove();
        }, 700);
    };

    let lastTime = null;
    const totalDuration = 2400; // ~2.4 seconds for smooth drive

    const tick = (timestamp) => {
        if (progress >= 100) return;

        if (!lastTime) lastTime = timestamp;
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;

        // Base progress rate (~100% in 2.4s)
        let rate = 100 / totalDuration; // % per ms
        if (!isPageLoaded && progress >= 88) {
            rate *= 0.15; // Slow down slightly near 88% if page resources are still loading
        } else if (isPageLoaded && progress < 100) {
            rate *= 1.4; // Smooth finish when loaded
        }

        const nextProgress = progress + (rate * deltaTime);
        updateProgress(nextProgress);

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
    }, 6000);
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


/* ============================================================
   TRUCK TRACKING MAP — FlightRadar-Style Engine
   Uses real Indonesia map from assets as background
   ============================================================ */
(function initTruckTracker() {

    const canvas = document.getElementById('truck-tracking-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const wrapper = canvas.parentElement;

    // ── City coordinates: calibrated from actual SVG path bounding boxes
    // SVG viewBox: 0 0 1110 484. Coords are (x/1110, y/484) from path centroids.
    // Kalimantan (path0): x~340-560, y~60-280 → center ~(450,170) → (0.405, 0.351)
    // Sumatra  (path1): x~30-290, y~35-320  → center ~(160,175) → (0.144, 0.362)
    // Papua    (path2): x~870-1088, y~180-490 → center ~(980,340) → (0.883, 0.702)
    // Sulawesi (path3): x~575-725, y~130-320  → center ~(648,225) → (0.584, 0.465)
    // Java     (path4): x~250-495, y~315-390  → center ~(370,355) → (0.333, 0.734)
    const CITIES = {
        // ── Jawa ──
        jakarta:    { x: 0.268, y: 0.720, label: 'Jakarta' },
        bandung:    { x: 0.295, y: 0.748, label: 'Bandung' },
        semarang:   { x: 0.358, y: 0.720, label: 'Semarang' },
        yogya:      { x: 0.375, y: 0.742, label: 'Yogyakarta' },
        surabaya:   { x: 0.425, y: 0.718, label: 'Surabaya' },
        malang:     { x: 0.432, y: 0.740, label: 'Malang' },
        // ── Bali & Nusa Tenggara ──
        bali:       { x: 0.466, y: 0.730, label: 'Bali' },
        // ── Sumatra ──
        medan:      { x: 0.128, y: 0.152, label: 'Medan' },
        pekanbaru:  { x: 0.162, y: 0.338, label: 'Pekanbaru' },
        palembang:  { x: 0.208, y: 0.492, label: 'Palembang' },
        lampung:    { x: 0.238, y: 0.574, label: 'Lampung' },
        // ── Kalimantan ──
        balikpapan: { x: 0.470, y: 0.428, label: 'Balikpapan' },
        banjarmasin:{ x: 0.428, y: 0.472, label: 'Banjarmasin' },
        // ── Sulawesi ──
        makassar:   { x: 0.580, y: 0.580, label: 'Makassar' },
        manado:     { x: 0.636, y: 0.310, label: 'Manado' },
        // ── Papua ──
        sorong:     { x: 0.808, y: 0.440, label: 'Sorong' },
        jayapura:   { x: 0.960, y: 0.480, label: 'Jayapura' },
    };

    // ── Truck fleet data — 12 active trucks ──
    const TRUCK_ROUTES = [
        { id:'PL-001', from:'jakarta',    to:'surabaya',    cargo:'Premium Pertamina',  status:'transit', color:'#F59E0B' },
        { id:'PL-002', from:'semarang',   to:'jakarta',     cargo:'Solar B30',           status:'loaded',  color:'#10B981' },
        { id:'PL-003', from:'bandung',    to:'semarang',    cargo:'Avtur',               status:'transit', color:'#F59E0B' },
        { id:'PL-004', from:'surabaya',   to:'bali',        cargo:'Pertamax Turbo',      status:'loaded',  color:'#10B981' },
        { id:'PL-005', from:'medan',      to:'pekanbaru',   cargo:'',                    status:'empty',   color:'#60A5FA' },
        { id:'PL-006', from:'palembang',  to:'lampung',     cargo:'LPG 3kg',             status:'loaded',  color:'#10B981' },
        { id:'PL-007', from:'lampung',    to:'jakarta',     cargo:'Solar Industri',      status:'transit', color:'#F59E0B' },
        { id:'PL-008', from:'yogya',      to:'malang',      cargo:'Premium',             status:'transit', color:'#F59E0B' },
        { id:'PL-009', from:'balikpapan', to:'banjarmasin', cargo:'',                    status:'empty',   color:'#60A5FA' },
        { id:'PL-010', from:'makassar',   to:'manado',      cargo:'Avtur',               status:'loaded',  color:'#10B981' },
        { id:'PL-011', from:'malang',     to:'semarang',    cargo:'LPG 12kg',            status:'transit', color:'#F59E0B' },
        { id:'PL-012', from:'pekanbaru',  to:'palembang',   cargo:'Pertamax Plus',       status:'loaded',  color:'#10B981' },
    ];

    // ── State ──
    let trucks        = [];
    let hoveredTruck  = null;
    let focusedTruck  = null;   // truck currently in focus/detail mode
    let autoFollow    = true;   // auto-pan to follow focused truck
    let activeFilter  = 'all';
    let animFrame     = null;
    let lastStatUpdate = 0;
    let distanceToday  = 2847;

    // Approximate route distances in km (for ETA estimation)
    const ROUTE_DISTANCES = {
        'jakarta-surabaya': 780, 'semarang-jakarta': 450, 'bandung-semarang': 380,
        'surabaya-bali': 300,    'medan-pekanbaru': 370,   'palembang-lampung': 220,
        'lampung-jakarta': 250,  'yogya-malang': 200,      'balikpapan-banjarmasin': 290,
        'makassar-manado': 870,  'malang-semarang': 380,   'pekanbaru-palembang': 400,
    };
    function getRouteDist(truck) {
        const key = truck.from + '-' + truck.to;
        return ROUTE_DISTANCES[key] || 500;
    }


    // ── Create truck instances ──
    function createTrucks() {
        trucks = TRUCK_ROUTES.map((route, i) => {
            const fromCity = CITIES[route.from];
            const toCity   = CITIES[route.to];
            const t = (i * 0.083 + Math.random() * 0.06) % 1.0;
            return {
                ...route,
                fromCity, toCity,
                t,
                speed:    0.0007 + Math.random() * 0.0005,
                speedKmh: Math.floor(62 + Math.random() * 32),
                progress: Math.floor(t * 100),
                pulse:    0,
                pulseDir: 1,
            };
        });
    }

    // ── Convert normalized coords → canvas pixels ──
    // Uses 'contain' scaling (Math.min) to match object-fit: contain on the image.
    // Both image and canvas use the same scaling → dots always land on correct islands.
    function normToCanvas(nx, ny) {
        const W = canvas.width  / (window.devicePixelRatio || 1);
        const H = canvas.height / (window.devicePixelRatio || 1);
        const svgW = 1110, svgH = 484;
        // contain = fit entire SVG inside canvas, maintain aspect, center remainder
        const scale = Math.min(W / svgW, H / svgH);
        const drawW = svgW * scale;
        const drawH = svgH * scale;
        const offX  = (W - drawW) / 2;
        const offY  = (H - drawH) / 2;
        return {
            x: offX + nx * drawW,
            y: offY + ny * drawH,
        };
    }

    function truckPos(truck) {
        const fx = truck.fromCity.x, fy = truck.fromCity.y;
        const tx = truck.toCity.x,   ty = truck.toCity.y;
        // Slight Bezier curve — arc perpendicular to route direction
        const mx = (fx + tx) / 2 + (ty - fy) * 0.10;
        const my = (fy + ty) / 2 - (tx - fx) * 0.10;
        const t  = truck.t;
        const nx = (1-t)*(1-t)*fx + 2*(1-t)*t*mx + t*t*tx;
        const ny = (1-t)*(1-t)*fy + 2*(1-t)*t*my + t*t*ty;
        const p  = normToCanvas(nx, ny);

        // Heading angle — derivative of Bezier at t
        const dx = 2*(1-t)*(mx - fx) + 2*t*(tx - mx);
        const dy = 2*(1-t)*(my - fy) + 2*t*(ty - my);
        return { x: p.x, y: p.y, angle: Math.atan2(dy, dx) };
    }

    // ── Resize canvas (HiDPI aware) ──
    function resizeCanvas() {
        const dpr  = window.devicePixelRatio || 1;
        const rect = wrapper.getBoundingClientRect();
        canvas.width        = rect.width  * dpr;
        canvas.height       = rect.height * dpr;
        canvas.style.width  = rect.width  + 'px';
        canvas.style.height = rect.height + 'px';
        ctx.scale(dpr, dpr);
    }

    // ── Draw subtle dot-grid + radar rings (overlay only) ──
    function drawGridOverlay() {
        const W = canvas.width  / (window.devicePixelRatio || 1);
        const H = canvas.height / (window.devicePixelRatio || 1);
        // Very subtle dot grid
        ctx.fillStyle = 'rgba(56,189,248,0.04)';
        const step = 36;
        for (let gx = step; gx < W; gx += step) {
            for (let gy = step; gy < H; gy += step) {
                ctx.beginPath();
                ctx.arc(gx, gy, 1, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        // Subtle vignette dark edges
        const vig = ctx.createRadialGradient(W/2, H/2, H*0.2, W/2, H/2, H*0.85);
        vig.addColorStop(0, 'rgba(6,14,26,0)');
        vig.addColorStop(1, 'rgba(6,14,26,0.55)');
        ctx.fillStyle = vig;
        ctx.fillRect(0, 0, W, H);
    }

    // ── Draw city dots (overlaid on real map) ──
    function drawCities() {
        Object.values(CITIES).forEach(city => {
            const p = normToCanvas(city.x, city.y);
            // Outer glow ring
            ctx.beginPath();
            ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(56,189,248,0.20)';
            ctx.lineWidth = 1;
            ctx.stroke();
            // Inner dot
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(56,189,248,0.80)';
            ctx.fill();
        });
    }

    // ── Draw dashed route paths ──
    function drawRoutes() {
        trucks.forEach(truck => {
            if (activeFilter !== 'all' && truck.status !== activeFilter) return;
            const fx = truck.fromCity.x, fy = truck.fromCity.y;
            const tx = truck.toCity.x,   ty = truck.toCity.y;
            const mx = (fx + tx) / 2 + (ty - fy) * 0.10;
            const my = (fy + ty) / 2 - (tx - fx) * 0.10;
            const pFrom = normToCanvas(fx, fy);
            const pMid  = normToCanvas(mx, my);
            const pTo   = normToCanvas(tx, ty);
            ctx.beginPath();
            ctx.moveTo(pFrom.x, pFrom.y);
            ctx.quadraticCurveTo(pMid.x, pMid.y, pTo.x, pTo.y);
            ctx.strokeStyle = 'rgba(56,189,248,0.10)';
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 9]);
            ctx.stroke();
            ctx.setLineDash([]);
        });
    }

    // ── Draw glowing trail behind each truck ──
    function drawTrail(truck) {
        if (activeFilter !== 'all' && truck.status !== activeFilter) return;
        const fx = truck.fromCity.x, fy = truck.fromCity.y;
        const tx = truck.toCity.x,   ty = truck.toCity.y;
        const mx = (fx + tx) / 2 + (ty - fy) * 0.10;
        const my = (fy + ty) / 2 - (tx - fx) * 0.10;
        const tStart = Math.max(0, truck.t - 0.14);
        const steps  = 22;
        ctx.lineWidth = 2.5;
        for (let i = 0; i < steps; i++) {
            const t0 = tStart + (truck.t - tStart) * (i / steps);
            const t1 = tStart + (truck.t - tStart) * ((i + 1) / steps);
            const n0x = (1-t0)*(1-t0)*fx + 2*(1-t0)*t0*mx + t0*t0*tx;
            const n0y = (1-t0)*(1-t0)*fy + 2*(1-t0)*t0*my + t0*t0*ty;
            const n1x = (1-t1)*(1-t1)*fx + 2*(1-t1)*t1*mx + t1*t1*tx;
            const n1y = (1-t1)*(1-t1)*fy + 2*(1-t1)*t1*my + t1*t1*ty;
            const p0  = normToCanvas(n0x, n0y);
            const p1  = normToCanvas(n1x, n1y);
            const alpha = (i / steps) * 0.75;
            // Parse hex color to rgba
            const hex = truck.color.replace('#', '');
            const r = parseInt(hex.slice(0,2), 16);
            const g = parseInt(hex.slice(2,4), 16);
            const b = parseInt(hex.slice(4,6), 16);
            ctx.beginPath();
            ctx.moveTo(p0.x, p0.y);
            ctx.lineTo(p1.x, p1.y);
            ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
            ctx.stroke();
        }
    }

    // ── Draw truck icon (arrow/chevron pointing in heading direction) ──
    function drawTruck(truck) {
        if (activeFilter !== 'all' && truck.status !== activeFilter) return;
        const pos = truckPos(truck);
        const { x, y, angle } = pos;
        const isHovered = hoveredTruck && hoveredTruck.id === truck.id;
        const isFocused = focusedTruck  && focusedTruck.id  === truck.id;
        const isDimmed  = focusedTruck  && !isFocused;

        const hex = truck.color.replace('#', '');
        const r = parseInt(hex.slice(0,2), 16);
        const g = parseInt(hex.slice(2,4), 16);
        const b = parseInt(hex.slice(4,6), 16);

        // Dimmed ghost for background trucks in focus mode
        if (isDimmed && !isHovered) {
            ctx.save();
            ctx.globalAlpha = 0.18;
            ctx.translate(x, y); ctx.rotate(angle);
            ctx.beginPath();
            ctx.moveTo(7, 0); ctx.lineTo(-4.5, -4.2); ctx.lineTo(-1.75, 0); ctx.lineTo(-4.5, 4.2);
            ctx.closePath();
            ctx.fillStyle = `rgb(${r},${g},${b})`;
            ctx.fill();
            ctx.restore();
            return;
        }

        const size = (isFocused || isHovered) ? 12 : 8;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        if (isFocused || isHovered) {
            truck.pulse += 0.07 * truck.pulseDir;
            if (truck.pulse >= 1) truck.pulseDir = -1;
            if (truck.pulse <= 0) truck.pulseDir = 1;
            const gr  = (isFocused ? 28 : 20) + truck.pulse * 10;
            const grd = ctx.createRadialGradient(0, 0, 2, 0, 0, gr);
            grd.addColorStop(0, `rgba(${r},${g},${b},${isFocused ? 0.75 : 0.55})`);
            grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
            ctx.fillStyle = grd;
            ctx.beginPath(); ctx.arc(0, 0, gr, 0, Math.PI * 2); ctx.fill();
        }

        ctx.beginPath();
        ctx.moveTo(size, 0);
        ctx.lineTo(-size * 0.65, -size * 0.6);
        ctx.lineTo(-size * 0.25, 0);
        ctx.lineTo(-size * 0.65,  size * 0.6);
        ctx.closePath();
        ctx.fillStyle   = (isFocused || isHovered) ? '#FFFFFF' : truck.color;
        ctx.strokeStyle = isFocused ? truck.color : (isHovered ? truck.color : 'rgba(0,0,0,0.35)');
        ctx.lineWidth   = isFocused ? 2 : (isHovered ? 1.5 : 0.8);
        ctx.fill(); ctx.stroke();
        ctx.restore();

        if (isFocused || isHovered) {
            ctx.font = `bold ${isFocused ? 11 : 10}px "Helvetica Neue", sans-serif`;
            ctx.fillStyle = '#FFFFFF';
            ctx.textAlign = 'center';
            ctx.shadowColor = 'rgba(0,0,0,0.9)';
            ctx.shadowBlur  = 5;
            ctx.fillText(truck.id, x, y - (isFocused ? 19 : 16));
            ctx.shadowBlur = 0;
        }
    }

    // ── Highlighted route for focused truck ──
    function drawFocusedRoute(truck) {
        const fx = truck.fromCity.x, fy = truck.fromCity.y;
        const tx = truck.toCity.x,   ty = truck.toCity.y;
        const mx = (fx + tx) / 2 + (ty - fy) * 0.10;
        const my = (fy + ty) / 2 - (tx - fx) * 0.10;
        const pFrom = normToCanvas(fx, fy);
        const pMid  = normToCanvas(mx, my);
        const pTo   = normToCanvas(tx, ty);
        const hex   = truck.color.replace('#', '');
        const r = parseInt(hex.slice(0,2), 16);
        const g = parseInt(hex.slice(2,4), 16);
        const b = parseInt(hex.slice(4,6), 16);

        // Glow pass
        ctx.beginPath();
        ctx.moveTo(pFrom.x, pFrom.y);
        ctx.quadraticCurveTo(pMid.x, pMid.y, pTo.x, pTo.y);
        ctx.strokeStyle = `rgba(${r},${g},${b},0.18)`;
        ctx.lineWidth = 14; ctx.setLineDash([]); ctx.stroke();
        // Core line
        ctx.beginPath();
        ctx.moveTo(pFrom.x, pFrom.y);
        ctx.quadraticCurveTo(pMid.x, pMid.y, pTo.x, pTo.y);
        ctx.strokeStyle = `rgba(${r},${g},${b},0.9)`;
        ctx.lineWidth = 2.5; ctx.stroke();

        [[pFrom, truck.fromCity.label], [pTo, truck.toCity.label]].forEach(([p, label]) => {
            ctx.font = 'bold 10px "Helvetica Neue", sans-serif';
            ctx.fillStyle = '#E2E8F0'; ctx.textAlign = 'center';
            ctx.shadowColor = 'rgba(0,0,0,0.9)'; ctx.shadowBlur = 6;
            ctx.fillText(label, p.x, p.y - 12);
            ctx.shadowBlur = 0;
        });
    }

    // ── Main animation loop ──
    function draw(ts) {
        const W = canvas.width  / (window.devicePixelRatio || 1);
        const H = canvas.height / (window.devicePixelRatio || 1);
        ctx.clearRect(0, 0, W, H);

        // Auto-follow: smoothly pan toward focused truck
        if (focusedTruck && autoFollow) {
            const pos      = truckPos(focusedTruck);
            const targetPX = W / 2 - pos.x * mapScale;
            const targetPY = H / 2 - pos.y * mapScale;
            panX += (targetPX - panX) * 0.04;
            panY += (targetPY - panY) * 0.04;
            applyZoom();
        }

        ctx.save();
        ctx.translate(W / 2 + panX, H / 2 + panY);
        ctx.scale(mapScale, mapScale);
        ctx.translate(-W / 2, -H / 2);

        drawGridOverlay();
        drawCities();
        drawRoutes();
        if (focusedTruck) drawFocusedRoute(focusedTruck);

        trucks.forEach(truck => {
            truck.t += truck.speed;
            if (truck.t >= 1) {
                truck.t        = 0;
                truck.speed    = 0.0007 + Math.random() * 0.0005;
                truck.speedKmh = Math.floor(62 + Math.random() * 32);
            }
            truck.progress = Math.floor(truck.t * 100);
            drawTrail(truck);
        });

        trucks.forEach(truck => drawTruck(truck));
        ctx.restore();

        if (focusedTruck) updateFocusPanel(focusedTruck);

        if (ts - lastStatUpdate > 4000) {
            lastStatUpdate = ts;
            updateLiveStats();
        }
        animFrame = requestAnimationFrame(draw);
    }

    // ── Focus a truck: auto-zoom to route ──
    function focusTruck(truck) {
        focusedTruck = truck;
        autoFollow   = document.getElementById('fp-follow-check')?.checked ?? true;

        const W = canvas.width  / (window.devicePixelRatio || 1);
        const H = canvas.height / (window.devicePixelRatio || 1);
        const pFrom = normToCanvas(truck.fromCity.x, truck.fromCity.y);
        const pTo   = normToCanvas(truck.toCity.x, truck.toCity.y);
        const routeW = Math.abs(pTo.x - pFrom.x) + 160;
        const routeH = Math.abs(pTo.y - pFrom.y) + 120;
        const newScale = Math.min(W / routeW, H / routeH, 3.0);
        mapScale = Math.max(newScale, 1.8);
        const cx = (pFrom.x + pTo.x) / 2;
        const cy = (pFrom.y + pTo.y) / 2;
        panX = W / 2 - cx * mapScale;
        panY = H / 2 - cy * mapScale;
        applyZoom();

        document.getElementById('truck-focus-panel')?.classList.add('visible');
        wrapper.classList.add('focus-active');
        document.getElementById('truck-click-hint')?.classList.add('hidden');
        document.querySelectorAll('.fleet-list-item').forEach(el =>
            el.classList.toggle('active', el.dataset.id === truck.id));
        updateFocusPanel(truck);
    }

    // ── Exit focus mode ──
    function exitFocus() {
        focusedTruck = null;
        document.getElementById('truck-focus-panel')?.classList.remove('visible');
        wrapper.classList.remove('focus-active');
        document.getElementById('truck-click-hint')?.classList.remove('hidden');
        document.querySelectorAll('.fleet-list-item').forEach(el => el.classList.remove('active'));
        mapScale = 1.0; panX = 0; panY = 0;
        applyZoom();
    }

    // ── Update focus panel DOM with live data ──
    function updateFocusPanel(truck) {
        const dist   = getRouteDist(truck);
        const done   = truck.progress;
        const remKm  = Math.round(dist * (1 - done / 100));
        const etaH   = Math.floor(remKm / truck.speedKmh);
        const etaM   = Math.round((remKm / truck.speedKmh - etaH) * 60);
        const etaStr = etaH > 0 ? `~${etaH}j ${etaM}m` : `~${etaM}m`;

        const el = id => document.getElementById(id);
        if (!el('fp-id')) return;
        el('fp-id').textContent               = truck.id;
        el('fp-from').textContent             = truck.fromCity.label;
        el('fp-to').textContent               = truck.toCity.label;
        el('fp-speed').textContent            = truck.speedKmh + ' km/h';
        el('fp-cargo').textContent            = truck.cargo || 'Kosong';
        el('fp-eta').textContent              = etaStr;
        el('fp-dist').textContent             = remKm.toLocaleString('id-ID') + ' km';
        el('fp-progress-label').textContent   = done + '% selesai';
        el('fp-route-fill').style.width       = done + '%';
        el('fp-route-truck').style.left       = done + '%';
        const statusEl = el('fp-status');
        statusEl.textContent = truck.status === 'loaded' ? 'BERMUATAN' :
                               truck.status === 'empty'  ? 'KOSONG' : 'TRANSIT';
        statusEl.className   = 'truck-focus-status-badge' +
            (truck.status === 'loaded' ? ' loaded' : truck.status === 'empty' ? ' empty' : '');
    }

    // ── Build fleet list sidebar ──
    function buildFleetList() {
        const body = document.getElementById('fleet-list-body');
        if (!body) return;
        body.innerHTML = trucks.map(t => `
            <div class="fleet-list-item" data-id="${t.id}">
                <div class="fleet-list-dot" style="background:${t.color}"></div>
                <div class="fleet-list-info">
                    <div class="fleet-list-id">${t.id}</div>
                    <div class="fleet-list-route">${t.fromCity.label} → ${t.toCity.label}</div>
                </div>
            </div>`).join('');
        body.querySelectorAll('.fleet-list-item').forEach(item => {
            item.addEventListener('click', () => {
                const truck = trucks.find(t => t.id === item.dataset.id);
                if (truck) { focusTruck(truck); document.getElementById('fleet-list-panel')?.classList.remove('open'); }
            });
        });
    }


    // ── Live stats tick ──
    function updateLiveStats() {
        distanceToday += Math.floor(Math.random() * 20 + 6);
        const el = document.getElementById('stat-distance');
        if (el) {
            el.textContent = distanceToday.toLocaleString('id-ID');
            el.classList.add('updated');
            setTimeout(() => el.classList.remove('updated'), 600);
        }
        const transit = 6 + Math.floor(Math.random() * 4);
        const elT = document.getElementById('stat-transit');
        if (elT && Number(elT.textContent) !== transit) {
            elT.textContent = transit;
            elT.classList.add('updated');
            setTimeout(() => elT.classList.remove('updated'), 600);
        }
    }

    // ── Tooltip ──
    function showTooltip(truck, mx, my) {
        const tip = document.getElementById('truck-tooltip');
        if (!tip) return;
        document.getElementById('tt-id').textContent       = truck.id;
        document.getElementById('tt-location').textContent = truck.fromCity.label + ' → ' + truck.toCity.label;
        document.getElementById('tt-speed').textContent    = truck.speedKmh + ' km/h';
        document.getElementById('tt-cargo').textContent    = truck.cargo || 'Kosong';
        document.getElementById('tt-progress').style.width = truck.progress + '%';
        document.getElementById('tt-progress-label').textContent = truck.progress + '% rute selesai';
        const statusEl = document.getElementById('tt-status');
        statusEl.textContent = truck.status === 'transit' ? 'TRANSIT' : truck.status === 'loaded' ? 'BERMUATAN' : 'KOSONG';
        statusEl.className   = 'truck-tooltip-status' +
            (truck.status === 'loaded' ? ' status-loaded' : truck.status === 'empty' ? ' status-empty' : '');
        const wRect = wrapper.getBoundingClientRect();
        const tipW = 210, tipH = 165;
        let left = mx + 16, top = my - 20;
        if (left + tipW > wRect.width)  left = mx - tipW - 16;
        if (top  + tipH > wRect.height) top  = my - tipH;
        if (top < 0) top = 4;
        tip.style.left = left + 'px';
        tip.style.top  = top  + 'px';
        tip.classList.add('visible');
    }

    function hideTooltip() {
        const tip = document.getElementById('truck-tooltip');
        if (tip) tip.classList.remove('visible');
    }

    // ── Hit detection — inverse-transform mouse coords to match canvas space after zoom/pan ──
    function screenToCanvas(ex, ey) {
        const rect = canvas.getBoundingClientRect();
        const W    = rect.width;
        const H    = rect.height;
        // Reverse the transform: translate(W/2+panX, H/2+panY) scale(mapScale) translate(-W/2,-H/2)
        const sx = (ex - rect.left - W / 2 - panX) / mapScale + W / 2;
        const sy = (ey - rect.top  - H / 2 - panY) / mapScale + H / 2;
        return { x: sx, y: sy };
    }

    function getTruckAt(ex, ey) {
        const { x: mx, y: my } = screenToCanvas(ex, ey);
        for (const truck of trucks) {
            if (activeFilter !== 'all' && truck.status !== activeFilter) continue;
            const pos = truckPos(truck);
            // Hit radius scales inversely with zoom so it feels consistent
            const hitR = 14 / mapScale;
            const d = Math.hypot(pos.x - mx, pos.y - my);
            if (d < hitR) return truck;
        }
        return null;
    }

    // ── Mouse events for hover/tooltip (separate from drag pan below) ──
    canvas.addEventListener('mousemove', e => {
        if (isDragging) return; // suppress tooltip while dragging
        const hit = getTruckAt(e.clientX, e.clientY);
        if (hit) {
            hoveredTruck = hit;
            canvas.style.cursor = 'pointer';
            const rect = canvas.getBoundingClientRect();
            showTooltip(hit, e.clientX - rect.left, e.clientY - rect.top);
        } else {
            hoveredTruck = null;
            canvas.style.cursor = 'crosshair';
            hideTooltip();
        }
    });
    canvas.addEventListener('mouseleave', () => { hoveredTruck = null; hideTooltip(); });

    // ── Zoom + Pan controls ──
    // Both canvas (via draw transform) AND image (via CSS transform) use same mapScale/panX/panY
    const zoomInBtn  = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    let mapScale = 1.0;
    let panX = 0, panY = 0;
    let isDragging = false, dragStartX = 0, dragStartY = 0, dragPanX = 0, dragPanY = 0;
    const bgImg = document.getElementById('truck-map-bg-img');

    function applyZoom() {
        // Sync image transform: CSS origin is center (translate -50% -50%)
        if (bgImg) {
            bgImg.style.transform = `translate(calc(-50% + ${panX}px), calc(-50% + ${panY}px)) scale(${mapScale})`;
        }
        // Canvas transform is applied per-frame in draw() using same mapScale/panX/panY
    }

    if (zoomInBtn)  zoomInBtn.addEventListener('click', () => { mapScale = Math.min(mapScale + 0.25, 3.0); applyZoom(); });
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => { mapScale = Math.max(mapScale - 0.25, 0.6); panX *= 0.8; panY *= 0.8; applyZoom(); });

    // Wheel to zoom centered on cursor position
    canvas.addEventListener('wheel', e => {
        e.preventDefault();
        const rect  = canvas.getBoundingClientRect();
        const W     = rect.width;
        const H     = rect.height;
        const cx    = e.clientX - rect.left - W / 2;
        const cy    = e.clientY - rect.top  - H / 2;
        const delta = e.deltaY < 0 ? 0.15 : -0.15;
        const newScale = Math.max(0.6, Math.min(3.0, mapScale + delta));
        // Adjust pan to keep the point under cursor fixed
        const ratio = newScale / mapScale;
        panX = cx - ratio * (cx - panX);
        panY = cy - ratio * (cy - panY);
        mapScale = newScale;
        applyZoom();
    }, { passive: false });

    // Drag to pan
    canvas.addEventListener('mousedown', e => {
        isDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        dragPanX   = panX;
        dragPanY   = panY;
        canvas.style.cursor = 'grabbing';
    });
    window.addEventListener('mousemove', e => {
        if (!isDragging) return;
        panX = dragPanX + (e.clientX - dragStartX);
        panY = dragPanY + (e.clientY - dragStartY);
        applyZoom();
    });
    window.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            canvas.style.cursor = 'crosshair';
        }
    });

    // ── Filter controls ──
    ['ctrl-all', 'ctrl-transit', 'ctrl-loaded'].forEach(id => {
        const btn = document.getElementById(id);
        if (!btn) return;
        btn.addEventListener('click', () => {
            document.querySelectorAll('.truck-ctrl-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = id === 'ctrl-all' ? 'all' : id === 'ctrl-transit' ? 'transit' : 'loaded';
            const count = activeFilter === 'all' ? trucks.length : trucks.filter(t => t.status === activeFilter).length;
            const numEl = document.getElementById('truck-active-display');
            if (numEl) numEl.textContent = count;
        });
    });

    // ── Start / stop with IntersectionObserver ──
    function start() {
        resizeCanvas();
        createTrucks();
        buildFleetList();
        animFrame = requestAnimationFrame(draw);

        // ── Click on canvas → focus truck ──
        canvas.addEventListener('click', e => {
            if (isDragging) return;
            const hit = getTruckAt(e.clientX, e.clientY);
            if (hit) {
                focusTruck(hit);
            } else if (focusedTruck) {
                // Click empty area exits focus
                exitFocus();
            }
        });

        // ── Close focus panel ──
        document.getElementById('truck-focus-close')?.addEventListener('click', exitFocus);

        // ── ESC key exits focus ──
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && focusedTruck) exitFocus();
        });

        // ── Zoom reset button ──
        document.getElementById('zoom-reset')?.addEventListener('click', () => {
            if (focusedTruck) exitFocus();
            else { mapScale = 1.0; panX = 0; panY = 0; applyZoom(); }
        });

        // ── Fleet list toggle ──
        document.getElementById('fleet-list-toggle')?.addEventListener('click', () => {
            document.getElementById('fleet-list-panel')?.classList.toggle('open');
        });
        document.getElementById('fleet-list-close')?.addEventListener('click', () => {
            document.getElementById('fleet-list-panel')?.classList.remove('open');
        });

        // ── Follow toggle ──
        document.getElementById('fp-follow-check')?.addEventListener('change', e => {
            autoFollow = e.target.checked;
        });
    }


    const section = document.getElementById('truck-tracking-section');
    if (section && 'IntersectionObserver' in window) {
        const obs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animFrame) {
                    start();
                } else if (!entry.isIntersecting && animFrame) {
                    cancelAnimationFrame(animFrame);
                    animFrame = null;
                }
            });
        }, { threshold: 0.1 });
        obs.observe(section);
    } else {
        start();
    }

    // Resize handler
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => { if (animFrame) resizeCanvas(); }, 200);
    });

})();

