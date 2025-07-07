document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const balanceEl   = document.querySelector(".balance");
  const incomeEl    = document.querySelector(".income");
  const expenseEl   = document.querySelector(".expense");
  const listEl      = document.querySelector("#transaction-list");
  const formEl      = document.querySelector("#transaction-form");
  const descInput   = document.querySelector("#description");
  const amountInput = document.getElementById("amount"); // ✅ FIXED!

  // State
  let transactions = loadTransactions();

  // Event Listeners
  formEl.addEventListener("submit", addTransaction);

  // Functions
  function addTransaction(e) {
    e.preventDefault();

    const description = descInput.value.trim();
    const amount = parseFloat(amountInput.value);

    if (!description || isNaN(amount)) {
      alert("Please enter a valid description and amount.");
      return;
    }

    transactions.push({
      id: Date.now(),
      description,
      amount,
    });

    saveTransactions();
    render();
    formEl.reset();
  }
function removeTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);

  saveTransactions();
  render();
}
window.removeTransaction = removeTransaction;

  function render() {
    renderList();
    renderSummary();
  }

  function renderList() {
    listEl.innerHTML = "";

    [...transactions].reverse().forEach(t => {
      const li = document.createElement("li");
      li.className = `transaction ${t.amount >= 0 ? "income" : "expense"}`;
      li.innerHTML = `
        <span>${t.description}</span>
        <span>
          ${formatINR(t.amount)}
          <button class="delete-btn" onclick="removeTransaction(${t.id})">x</button>
        </span>
      `;
      listEl.appendChild(li);
    });
  }

  function renderSummary() {
    const balance = transactions.reduce((sum, t) => sum + t.amount, 0);
    const income  = transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0);

    balanceEl.textContent = formatINR(balance);
    incomeEl.textContent  = formatINR(income);
    expenseEl.textContent = formatINR(Math.abs(expense));
  }

  function formatINR(num) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(num);
  }

  function loadTransactions() {
    try {
      const raw = JSON.parse(localStorage.getItem("transactions"));
      return Array.isArray(raw) ? raw.map(t => ({ ...t, amount: +t.amount })) : [];
    } catch {
      return [];
    }
  }

  function saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }

  // Initial render
  render();
});
