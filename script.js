
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let budget = Number(localStorage.getItem("budget")) || 0;

/* =====================
   INIT
===================== */
document.addEventListener("DOMContentLoaded", () => {

  const budgetEl = document.getElementById("budgetAmount");
  if (budgetEl) budgetEl.innerText = `₹${budget}`;

  displayExpenses(expenses);
  updateSummary();
  updateProgress(); // ✅ IMPORTANT
});

/* =====================
   SET BUDGET
===================== */
function setBudget() {

  budget = Number(document.getElementById("budgetInput").value);

  localStorage.setItem("budget", budget);

  document.getElementById("budgetAmount").innerText = `₹${budget}`;

  updateSummary();
  updateProgress(); // ✅
}

/* =====================
   ADD EXPENSE
===================== */
function addExpense() {

  const title = document.getElementById("title").value;
  const amount = Number(document.getElementById("amount").value);
  const category = document.getElementById("category").value;
  const date = document.getElementById("date").value;

  if (!title || !amount || !date) {
    alert("Please fill all fields");
    return;
  }

  const expense = {
    id: Date.now(),
    title,
    amount,
    category,
    date
  };

  expenses.push(expense);

  localStorage.setItem("expenses", JSON.stringify(expenses));

  displayExpenses(expenses);
  updateSummary();
  updateProgress(); // ✅

  document.getElementById("title").value = "";
  document.getElementById("amount").value = "";
  document.getElementById("date").value = "";
}

/* =====================
   DISPLAY EXPENSES
===================== */
function displayExpenses(data) {

  const expenseList = document.getElementById("expenseList");

  if (!expenseList) return;

  expenseList.innerHTML = "";

  data.forEach(expense => {

    expenseList.innerHTML += `
      <tr>
        <td>${expense.title}</td>
        <td>${expense.category}</td>
        <td>₹${expense.amount}</td>
        <td>${expense.date}</td>
        <td>
          <button class="delete-btn" onclick="deleteExpense(${expense.id})">
            Delete
          </button>
        </td>
      </tr>
    `;
  });
}

/* =====================
   DELETE EXPENSE
===================== */
function deleteExpense(id) {

  expenses = expenses.filter(e => e.id !== id);

  localStorage.setItem("expenses", JSON.stringify(expenses));

  displayExpenses(expenses);
  updateSummary();
  updateProgress(); // ✅
}

/* =====================
   SUMMARY
===================== */
function updateSummary() {

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const totalEl = document.getElementById("totalExpenses");
  const remainingEl = document.getElementById("remainingBalance");

  if (totalEl) totalEl.innerText = `₹${total}`;

  const remaining = budget - total;

  if (remainingEl) {
    remainingEl.innerText = `₹${remaining}`;
    remainingEl.style.color = remaining < 0 ? "red" : "black";
  }
}

/* =====================
   SEARCH
===================== */
function searchExpense() {

  const search = document.getElementById("search").value.toLowerCase();

  const filtered = expenses.filter(e =>
    e.title.toLowerCase().includes(search) ||
    e.category.toLowerCase().includes(search)
  );

  displayExpenses(filtered);
}

/* =====================
   PROGRESS BAR OVERVIEW
===================== */
function updateProgress() {

  const categories = [
    { name: "Food", bar: "foodBar", text: "foodText", color: "#4f46e5" },
    { name: "Travel", bar: "travelBar", text: "travelText", color: "#22c55e" },
    { name: "Shopping", bar: "shoppingBar", text: "shoppingText", color: "#f59e0b" },
    { name: "Entertainment", bar: "entertainmentBar", text: "entertainmentText", color: "#ef4444" }
  ];

  const totalBudget = budget > 0 ? budget : 1;

  categories.forEach(cat => {

    const total = expenses
      .filter(e => e.category === cat.name)
      .reduce((sum, e) => sum + e.amount, 0);

    const percent = Math.min((total / totalBudget) * 100, 100);

    const bar = document.getElementById(cat.bar);
    const text = document.getElementById(cat.text);

    if (bar) {
      bar.style.width = percent + "%";
      bar.style.background = cat.color;
    }

    if (text) {
      text.innerText = `₹${total} (${percent.toFixed(1)}%)`;
    }
  });
}