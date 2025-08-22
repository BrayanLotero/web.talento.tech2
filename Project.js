



document.addEventListener('DOMContentLoaded', function () {
   // --- DATA ---
   const APPLIANCE_DATA = [
      { name: 'Selecciona un aparato...', power: '' },
      { name: 'Nevera / Refrigerador', power: 150 },
      { name: 'Televisor LED 50"', power: 120 },
      { name: 'Computador de Escritorio', power: 250 },
      { name: 'Computador Portátil', power: 65 },
      { name: 'Bombillo LED', power: 10 },
      { name: 'Lavadora', power: 500 },
      { name: 'Microondas', power: 1100 },
      { name: 'Aire Acondicionado (Pequeño)', power: 1500 },
      { name: 'Ventilador', power: 75 },
      { name: 'Ducha Eléctrica', power: 4500 },
      { name: 'Otro (Manual)', power: '' }
   ];

   // --- DOM ELEMENTS ---
   const applianceList = document.getElementById('appliance-list');
   const addApplianceBtn = document.getElementById('add-appliance');
   const calculateBtn = document.getElementById('calculate-btn');
   const resetBtn = document.getElementById('reset-btn');
   const applianceTemplate = document.getElementById('appliance-template').firstElementChild;
   const resultsSection = document.getElementById('results-section');
   const priceInput = document.getElementById('electricity-price');

   // --- FUNCTIONS ---
   function createNewApplianceRow() {
      const newRow = applianceTemplate.cloneNode(true);
      const select = newRow.querySelector('.appliance-select');

      APPLIANCE_DATA.forEach(appliance => {
         const option = document.createElement('option');
         option.value = appliance.power;
         option.textContent = appliance.name;
         select.appendChild(option);
      });

      applianceList.appendChild(newRow);
   }

   function updatePowerOnSelect(selectElement) {
      const selectedPower = selectElement.value;
      const row = selectElement.closest('.appliance-row');
      const powerInput = row.querySelector('.power-input');
      if (selectedPower) {
         powerInput.value = selectedPower;
      } else {
         powerInput.value = '';
         powerInput.focus();
      }
   }

   function removeApplianceRow(buttonElement) {
      const rowToRemove = buttonElement.closest('.appliance-row');
      rowToRemove.remove();
   }

   function formatCurrency(value) {
      return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);
   }

   function calculateConsumption() {
      const pricePerKwh = parseFloat(priceInput.value) || 0;
      const applianceRows = applianceList.querySelectorAll('.appliance-row');

      let totalDailyKwh = 0;
      let totalMonthlyKwh = 0;
      const applianceBreakdownList = document.getElementById('appliance-breakdown');
      applianceBreakdownList.innerHTML = '';

      applianceRows.forEach((row, index) => {
         const power = parseFloat(row.querySelector('.power-input').value) || 0;
         const hours = parseFloat(row.querySelector('.hours-input').value) || 0;
         const days = parseFloat(row.querySelector('.days-input').value) || 0;
         const name = row.querySelector('.appliance-select').selectedOptions[0].text;

         if (power > 0 && hours > 0 && days > 0) {
            const dailyKwh = (power * hours) / 1000;
            const monthlyKwh = dailyKwh * days;

            totalDailyKwh += dailyKwh;
            totalMonthlyKwh += monthlyKwh;

            // Add to breakdown
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
            listItem.innerHTML = `${name} <span class="badge bg-primary rounded-pill">${monthlyKwh.toFixed(2)} kWh/mes</span>`;
            applianceBreakdownList.appendChild(listItem);
         }
      });

      // Calculate costs
      const dailyCost = totalDailyKwh * pricePerKwh;
      const monthlyCost = totalMonthlyKwh * pricePerKwh;
      const yearlyCost = monthlyCost * 12;

      // Calculate panels needed
      const PANEL_WATTAGE = 550;
      const SUN_HOURS = 4.5; // Average peak sun hours in Colombia
      const PERFORMANCE_RATIO = 0.85; // Accounts for system losses
      const energyPerPanelPerDay = (PANEL_WATTAGE * SUN_HOURS * PERFORMANCE_RATIO) / 1000;
      const panelsNeeded = (totalDailyKwh > 0 && energyPerPanelPerDay > 0) ? Math.ceil(totalDailyKwh / energyPerPanelPerDay) : 0;

      // --- NEW CALCULATIONS ---
      const estimatedInvestmentPerPanel = 1500000; // COP
      const totalInvestment = panelsNeeded * estimatedInvestmentPerPanel;
      const estimatedYearlySavings = yearlyCost; // Assuming full coverage
      const returnOnInvestmentYears = (estimatedYearlySavings > 0) ? (totalInvestment / estimatedYearlySavings) : 0;

      // --- UPDATE DOM ---
      document.getElementById('total-daily-consumption').textContent = `${totalDailyKwh.toFixed(2)} kWh`;
      document.getElementById('total-monthly-consumption').textContent = `${totalMonthlyKwh.toFixed(2)} kWh`;
      document.getElementById('daily-cost').textContent = formatCurrency(dailyCost);
      document.getElementById('monthly-cost').textContent = formatCurrency(monthlyCost);
      document.getElementById('yearly-cost').textContent = formatCurrency(yearlyCost);
      document.getElementById('panels-needed').textContent = panelsNeeded;

      // --- UPDATE NEW DOM ELEMENTS ---
      document.getElementById('total-investment').textContent = formatCurrency(totalInvestment);
      document.getElementById('yearly-savings').textContent = formatCurrency(estimatedYearlySavings);
      document.getElementById('return-of-investment').textContent = `${returnOnInvestmentYears.toFixed(1)} años`;

      resultsSection.classList.remove('d-none');
      resultsSection.scrollIntoView({ behavior: 'smooth' });
   }

   function resetCalculator() {
      // Clear appliance list
      applianceList.innerHTML = '';

      // Add one fresh row
      createNewApplianceRow();

      // Reset price
      priceInput.value = '750';

      // Hide results
      resultsSection.classList.add('d-none');

      // Scroll to top of calculator
      document.getElementById('calculator-section').scrollIntoView({ behavior: 'smooth' });
   }

   // --- EVENT LISTENERS ---
   addApplianceBtn.addEventListener('click', createNewApplianceRow);
   calculateBtn.addEventListener('click', calculateConsumption);
   resetBtn.addEventListener('click', resetCalculator);
   applianceList.addEventListener('click', function (e) {
      if (e.target.classList.contains('btn-remove')) {
         removeApplianceRow(e.target);
      }
   });
   applianceList.addEventListener('change', function (e) {
      if (e.target.classList.contains('appliance-select')) {
         updatePowerOnSelect(e.target);
      }
   });

   // --- INITIALIZATION ---
   createNewApplianceRow(); // Start with one row by default
});




   








