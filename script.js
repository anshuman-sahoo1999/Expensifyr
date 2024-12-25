const transactions = [];
const balanceElement = document.getElementById('balance');
const transactionsList = document.getElementById('transactions');
const expenseChartCanvas = document.getElementById('expenseChart');
const themeToggleBtn = document.getElementById('theme-toggle');

let expenseChart;

// Add Transaction
function addTransaction() {
  const description = document.getElementById('description').value.trim();
  const amount = parseFloat(document.getElementById('amount').value.trim());
  const date = document.getElementById('date').value;

  if (description === '' || isNaN(amount) || date === '') {
    alert('Please enter a valid description, amount, and date');
    return;
  }

  const transaction = { id: Date.now(), description, amount, date };
  transactions.push(transaction);

  document.getElementById('description').value = '';
  document.getElementById('amount').value = '';
  document.getElementById('date').value = '';

  updateUI();
}

// Delete Transaction
function deleteTransaction(id) {
  const index = transactions.findIndex(tx => tx.id === id);
  if (index !== -1) {
    transactions.splice(index, 1);
  }
  updateUI();
}

// Update UI
function updateUI() {
  const balance = transactions.reduce((acc, tx) => acc + tx.amount, 0);
  balanceElement.textContent = balance.toFixed(2);

  transactionsList.innerHTML = '';
  transactions.forEach(tx => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${tx.date} | ${tx.description} <span>₹${tx.amount.toFixed(2)}</span>
      <button onclick="deleteTransaction(${tx.id})">Delete</button>
    `;
    transactionsList.appendChild(li);
  });

  updateChart();
}

// Update Chart
function updateChart() {
  const expenseLabels = transactions.map(tx => `${tx.description} (${tx.date})`);
  const expenseData = transactions.map(tx => tx.amount);

  if (expenseChart) {
    expenseChart.destroy();
  }

  expenseChart = new Chart(expenseChartCanvas, {
    type: 'pie',
    data: {
      labels: expenseLabels,
      datasets: [{
        data: expenseData,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#FF9F40'],
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

// Theme Toggle
function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  document.body.classList.toggle('light-mode');
  themeToggleBtn.textContent = document.body.classList.contains('dark-mode') ? '☀️ Light Mode' : '🌙 Dark Mode';
}

// Generate PDF Report
function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Expense Tracker Report', 20, 20);

  let y = 30;
  transactions.forEach((tx, index) => {
    doc.setFontSize(12);
    doc.text(`${index + 1}. ${tx.date} - ${tx.description}: ₹${tx.amount.toFixed(2)}`, 20, y);
    y += 10;
  });

  // Add Total Balance
  const totalBalance = transactions.reduce((acc, tx) => acc + tx.amount, 0);
  doc.setFontSize(14);
  doc.text(`Total Balance: ₹${totalBalance.toFixed(2)}`, 20, y + 10);

  doc.save('expense_report.pdf');
}

// Initialize
document.body.classList.add('light-mode');
updateUI();
