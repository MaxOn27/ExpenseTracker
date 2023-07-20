class ExpenseTracker {
  constructor() {
    this.totalIncome_form = document.forms["settings_form"];
    this.totalIncome_form ? this.accountSettings() : null;

    this.totalExpenses_form = document.forms["expense_form"];
    this.totalExpenses_form ? this.setExpensesToLocalStorage() : null;
    this.amount_spent = document.forms["amount_spent"];
    this.expense_option = this["expense_option"];
    this.loadChart();
  }

  init() {
    this.totalIncome();
    this.totalExpenses();
    this.totalBalance();
  }

  totalIncome() {
    const totalIncome = document.querySelector(".total_income")
    if (!totalIncome) {
      return;
    }

    const income = localStorage.getItem('totalIncome');
    totalIncome.innerHTML =
      income ? "$ " + `${income}` : "$0. 00";

  }

  accountSettings() {
    this.totalIncome_form.addEventListener("submit", function (event) {
      event.preventDefault();
      const totalIncome = localStorage.getItem('totalIncome');
      const username = localStorage.getItem('username');

      if (totalIncome) {
        localStorage.removeItem("totalIncome");
      }

      localStorage.setItem("totalIncome", this.total_amount_settings.value);
      localStorage.setItem("username", this.user_name.value);

      return window.location.reload()

    });
  }

  totalExpenses() {
    const totalExpenses = document.querySelector(".total_expenses")

    const totalExpensesData = JSON.parse(localStorage.getItem("totalExpensesData")) || [];

    const expenses = totalExpensesData.reduce((res, item) => {
      return res + +item.amount_spent;
    }, 0)

    localStorage.setItem("totalExpenses", JSON.stringify(expenses))

    if (totalExpenses) {
      return totalExpenses.innerHTML =
        expenses ? "$ " + `${expenses}` : "$0. 00";
    }
  }

  setExpensesToLocalStorage() {
    this.totalExpenses_form.addEventListener("submit", function (event) {
        event.preventDefault();
        const amount_spent = this.amount_spent.value;
        const expense_option = this.expense_option.value;

        const totalExpensesData = JSON.parse(localStorage.getItem("totalExpensesData")) || [];

        const key = totalExpensesData.find(item => item && item.type === expense_option);

        if (key && key.type === expense_option) {
          const amount = +key.amount_spent + +amount_spent;

          const filteredData = totalExpensesData.filter(item => item !== key);
          let data = [
            ...filteredData,
            {
              type: this.expense_option.value,
              amount_spent: `${amount}`
            }
          ];

          localStorage.setItem("totalExpensesData", JSON.stringify(data));
          return window.location.reload();
        }

        let data = [
          ...totalExpensesData,
          {
            type: this.expense_option.value,
            amount_spent: +this.amount_spent.value
          }
        ];

        localStorage.setItem("totalExpensesData", JSON.stringify(data));

        return window.location.reload();
      }
    );
  }

  totalBalance() {
    const totalIncome = localStorage.getItem('totalIncome');
    const totalExpensesData = JSON.parse(localStorage.getItem("totalExpensesData")) || [];

    const totalBalanceAmount = totalExpensesData && totalExpensesData.reduce((res, item) => {
      return res - (+item.amount_spent)
    }, +totalIncome)

    const totalBalance = document.querySelector(".total_balance")

    return totalIncome && totalBalance
      ? totalBalance.innerHTML = "$ " + `${totalBalanceAmount}`
      : totalBalance.innerHTML = "$ " + totalIncome
  }

  loadChart() {
    const myChart = document.getElementById('myChart');
    const chart = new Chart(myChart, {
      type: "pie",
      data: {
        labels: ['Food', 'Medicine', 'Entertainments'],
        datasets: [{
          label: 'Expenses in $',
          data: this.expensePercentage(),
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ]
        }],
        hoverOffset: 4
      }

    })
    return chart
  }

  expensePercentage() {
    const totalExpensesData = JSON.parse(localStorage.getItem("totalExpensesData"));
    const food = totalExpensesData.find(item => item.type === "Food").amount_spent || 1;
    const medicine = totalExpensesData.find(item => item.type === "Medicine").amount_spent || 1;
    const entertainments = totalExpensesData.find(item => item.type === "Entertainments").amount_spent || 1;


    return [+food, +medicine, entertainments];

  }
}

const tracker = new ExpenseTracker();

tracker
  .init();