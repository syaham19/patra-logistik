import re

with open("script.js", "r") as f:
    content = f.read()

# 1. Replace DOM variables
old_vars = """    const statMilikEl = document.getElementById("stat-milik");
    const statKelolaEl = document.getElementById("stat-kelola");
    const statSpbuEl = document.getElementById("stat-spbu");
    const statPertashopEl = document.getElementById("stat-pertashop");"""

new_vars = """    const statRetailEl = document.getElementById("stat-retail");
    const statIndustrialEl = document.getElementById("stat-industrial");
    const statGasEl = document.getElementById("stat-gas");
    const statVmiEl = document.getElementById("stat-vmi");
    const statAviationEl = document.getElementById("stat-aviation");
    const statLubricantsEl = document.getElementById("stat-lubricants");
    const statWarehouseEl = document.getElementById("stat-warehouse");
    const statFuelTermEl = document.getElementById("stat-fuelterm");
    const statKrpEl = document.getElementById("stat-krp");"""

content = content.replace(old_vars, new_vars)

# 2. Replace morDb stats
stats_replacements = {
    "MOR-I": "retail: 1, industrial: 27, gas: 0, vmi: 9, aviation: 1, lubricants: 4, warehouse: 4, fuelterm: 0, krp: 5",
    "MOR-II": "retail: 7, industrial: 12, gas: 0, vmi: 12, aviation: 1, lubricants: 1, warehouse: 4, fuelterm: 0, krp: 1",
    "MOR-III": "retail: 5, industrial: 11, gas: 5, vmi: 12, aviation: 0, lubricants: 6, warehouse: 2, fuelterm: 0, krp: 2",
    "MOR-IV": "retail: 7, industrial: 91, gas: 3, vmi: 14, aviation: 0, lubricants: 0, warehouse: 1, fuelterm: 0, krp: 7",
    "MOR-V": "retail: 2, industrial: 13, gas: 2, vmi: 3, aviation: 7, lubricants: 2, warehouse: 0, fuelterm: 6, krp: 1",
    "MOR-VI": "retail: 1, industrial: 7, gas: 1, vmi: 2, aviation: 1, lubricants: 2, warehouse: 0, fuelterm: 1, krp: 2",
    "MOR-VII": "retail: 0, industrial: 7, gas: 1, vmi: 1, aviation: 0, lubricants: 1, warehouse: 0, fuelterm: 13, krp: 1",
    "MOR-VIII": "retail: 1, industrial: 3, gas: 0, vmi: 1, aviation: 2, lubricants: 0, warehouse: 0, fuelterm: 0, krp: 1",
}

for k, v in stats_replacements.items():
    content = re.sub(rf'"{k}": \{{\s*code:.*?(stats: )\{{.*?\}}', f'"{k}": {{\\g<1>{{{v}}}', content, flags=re.DOTALL)

# 3. Replace animate calls
old_anim = """        // Animate statistic values
        animateCount(statMilikEl, parseCurrentValue(statMilikEl), data.stats.milik);
        animateCount(statKelolaEl, parseCurrentValue(statKelolaEl), data.stats.kelola);
        animateCount(statSpbuEl, parseCurrentValue(statSpbuEl), data.stats.spbu);
        animateCount(statPertashopEl, parseCurrentValue(statPertashopEl), data.stats.pertashop);"""

new_anim = """        // Animate statistic values
        animateCount(statRetailEl, parseCurrentValue(statRetailEl), data.stats.retail);
        animateCount(statIndustrialEl, parseCurrentValue(statIndustrialEl), data.stats.industrial);
        animateCount(statGasEl, parseCurrentValue(statGasEl), data.stats.gas);
        animateCount(statVmiEl, parseCurrentValue(statVmiEl), data.stats.vmi);
        animateCount(statAviationEl, parseCurrentValue(statAviationEl), data.stats.aviation);
        animateCount(statLubricantsEl, parseCurrentValue(statLubricantsEl), data.stats.lubricants);
        animateCount(statWarehouseEl, parseCurrentValue(statWarehouseEl), data.stats.warehouse);
        animateCount(statFuelTermEl, parseCurrentValue(statFuelTermEl), data.stats.fuelterm);
        animateCount(statKrpEl, parseCurrentValue(statKrpEl), data.stats.krp);"""

content = content.replace(old_anim, new_anim)

# 4. Replace defaultData assignments
old_default = """            if (statMilikEl) statMilikEl.textContent = defaultData.stats.milik.toLocaleString("id-ID");
            if (statKelolaEl) statKelolaEl.textContent = defaultData.stats.kelola.toLocaleString("id-ID");
            if (statSpbuEl) statSpbuEl.textContent = defaultData.stats.spbu.toLocaleString("id-ID");
            if (statPertashopEl) statPertashopEl.textContent = defaultData.stats.pertashop.toLocaleString("id-ID");"""

new_default = """            if (statRetailEl) statRetailEl.textContent = defaultData.stats.retail.toLocaleString("id-ID");
            if (statIndustrialEl) statIndustrialEl.textContent = defaultData.stats.industrial.toLocaleString("id-ID");
            if (statGasEl) statGasEl.textContent = defaultData.stats.gas.toLocaleString("id-ID");
            if (statVmiEl) statVmiEl.textContent = defaultData.stats.vmi.toLocaleString("id-ID");
            if (statAviationEl) statAviationEl.textContent = defaultData.stats.aviation.toLocaleString("id-ID");
            if (statLubricantsEl) statLubricantsEl.textContent = defaultData.stats.lubricants.toLocaleString("id-ID");
            if (statWarehouseEl) statWarehouseEl.textContent = defaultData.stats.warehouse.toLocaleString("id-ID");
            if (statFuelTermEl) statFuelTermEl.textContent = defaultData.stats.fuelterm.toLocaleString("id-ID");
            if (statKrpEl) statKrpEl.textContent = defaultData.stats.krp.toLocaleString("id-ID");"""

content = content.replace(old_default, new_default)

with open("script.js", "w") as f:
    f.write(content)

