"use strict";

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [
    { amount: 200, date: "2019-11-18T21:31:17.178Z" },
    { amount: 455.23, date: "2019-12-23T07:42:02.383Z" },
    { amount: -306.5, date: "2020-01-28T09:15:04.904Z" },
    { amount: 25000, date: "2020-04-01T10:17:24.185Z" },
    { amount: -642.21, date: "2020-05-08T14:11:59.604Z" },
    { amount: -133.9, date: "2020-07-26T17:01:17.194Z" },
    { amount: 79.97, date: "2020-07-28T23:36:17.929Z" },
    { amount: 1300, date: "2020-08-01T10:51:36.790Z" },
  ],
  interestRate: 1.2, // %
  pin: 1111,
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [
    { amount: 5000, date: "2019-11-01T13:15:33.035Z" },
    { amount: 3400, date: "2019-11-30T09:48:16.867Z" },
    { amount: -150, date: "2019-12-25T06:04:23.907Z" },
    { amount: -790, date: "2020-01-25T14:18:46.235Z" },
    { amount: -3210, date: "2020-02-05T16:33:06.386Z" },
    { amount: -1000, date: "2020-04-10T14:43:26.374Z" },
    { amount: 8500, date: "2020-06-25T18:49:59.371Z" },
    { amount: -30, date: "2020-07-26T12:01:20.894Z" },
  ],
  interestRate: 1.5,
  pin: 2222,
  currency: "USD",
  locale: "en-US",
};
const account3 = {
  owner: "Emerald Emma",
  movements: [
    { amount: 10000, date: "2023-11-01T13:15:33.035Z" },
    { amount: 8700, date: "2023-11-30T09:48:16.867Z" },
    { amount: -180, date: "2024-12-25T06:04:23.907Z" },
    { amount: -940, date: "2024-01-25T14:18:46.235Z" },
    { amount: -9110, date: "2024-02-05T16:33:06.386Z" },
    { amount: -3800, date: "2024-04-10T14:43:26.374Z" },
    { amount: 7600, date: "2024-06-25T18:49:59.371Z" },
    { amount: -10, date: "2023-07-26T12:01:20.894Z" },
  ],
  interestRate: 1.5,
  pin: 3333,
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2, account3];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const mode = document.querySelector('.toggle_mode')
const body = document.body

// document.addEventListener("DOMContentLoaded", function () {
//   mode.addEventListener('click', function () {
//     console.log('hey');
//     if(body.style.backgroundColor == 'black' && body.style.color == 'white'){
//       body.style.backgroundColor = 'white'
//       body.style.color = 'black'
//       mode.innerHTML = "<i class='bx bxs-moon'></i> mode"
//     }else {
//       body.style.backgroundColor = 'black'
//       body.style.color = 'white'
//       mode.innerHTML = "<i class='bx bx-sun' ></i> mode"
//     }
//   })

// })

// Change to light or dark mode
document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.querySelector('.toggle_mode');
    const body = document.body;

    // Check for previously saved mode preference
    const savedMode = localStorage.getItem('mode');
    if (savedMode) {
        body.classList.add(savedMode);
    }

    toggleButton.addEventListener('click', () => {
      if(body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        mode.innerHTML = "<i class='bx bxs-moon'></i> mode"
      }else {
        body.classList.add('dark-mode');
        mode.innerHTML = "<i class='bx bx-sun' ></i> mode"
      }

      // Save the current mode preference
      if (body.classList.contains('dark-mode')) {
          localStorage.setItem('mode', 'dark-mode');
      } else {
          localStorage.removeItem('mode');
        }
    });
});


function formatMovementDate(date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
}

function formatCurrency(value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);
}

function displayMovements(acc, sort = false) {
  containerMovements.innerHTML = "";

  const movements = sort
    ? acc.movements.slice().sort((a, b) => a.amount - b.amount)
    : acc.movements;

  movements.forEach((mov, i) => {
    const type = mov.amount > 0 ? "deposit" : "withdrawal";

    const date = new Date(mov.date);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCurrency(mov.amount, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
}

function calcDisplayBalance(acc) {
  acc.balance = acc.movements.reduce((accu, curr) => accu + curr.amount, 0);
  labelBalance.textContent = formatCurrency(
    acc.balance,
    acc.locale,
    acc.currency
  );
}

function calcDisplaySummary(acc) {
  const sumIn = acc.movements
    .filter((mov) => mov.amount > 0)
    .reduce((accu, curr) => accu + curr.amount, 0);

  const sumOut = acc.movements
    .filter((mov) => mov.amount < 0)
    .reduce((accu, curr) => accu + curr.amount, 0);

  const sumInterest = (sumIn / 100) * acc.interestRate;

  labelSumIn.textContent = formatCurrency(sumIn, acc.locale, acc.currency);
  labelSumOut.textContent = formatCurrency(
    Math.abs(sumOut),
    acc.locale,
    acc.currency
  );
  labelSumInterest.textContent = formatCurrency(
    sumInterest,
    acc.locale,
    acc.currency
  );
}

function updateUI(acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
}

const createUsernames = function (accs) {
  accs.forEach((acc) => {
    acc.username = acc.owner
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .toLowerCase();
  });
};
createUsernames(accounts);

function startLogOutTimer() {
  function tick() {
    // Calculate minutes and seconds
    const min = Math.trunc(time / 60)
      .toString()
      .padStart(2, 0);
    const sec = Math.trunc(time % 60)
      .toString()
      .padStart(2, 0);

    // Print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = "Log in to get started";
      containerApp.style.opacity = 0;
    }

    // Decrease 1s
    time--;
  }
  
  // Timer duration
  let time = 600;
  
  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
}

let currentAccount, timer;
btnLogin.addEventListener("click", (e) => {
  e.preventDefault();

  // Find and save an account
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;

    // Display current balance date
    const now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    containerApp.style.opacity = 1;

    // Timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // Update UI
    updateUI(currentAccount);
  }

  // Clear input fields
  inputLoginUsername.value = inputLoginPin.value = "";
  inputLoginPin.blur();
});

btnTransfer.addEventListener("click", (e) => {
  e.preventDefault();

  const transferAmount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );

  if (
    transferAmount > 0 &&
    receiverAcc &&
    currentAccount.balance >= transferAmount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push({
      amount: -transferAmount,
      date: new Date().toISOString()
    });

    receiverAcc.movements.push({
      amount: transferAmount,
      date: new Date().toISOString(),
    });

    // Update UI
    updateUI(currentAccount);
  }

  // Clear input fields
  inputTransferTo.value = inputTransferAmount.value = "";
  inputTransferAmount.blur();


 
  // Reset timer
  if (timer) clearInterval(timer);
  timer = startLogOutTimer();
});

btnLoan.addEventListener("click", (e) => {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov.amount >= amount * 0.1)
  ) {
    setTimeout(() => {
      // Add movement
      currentAccount.movements.push({
        amount,
        date: new Date().toISOString(),
      });

      // Update UI
      updateUI(currentAccount);
    }, 3000);
  }
  inputLoanAmount.value = "";

  // Reset timer
  if (timer) clearInterval(timer);
  timer = startLogOutTimer();
});

btnClose.addEventListener("click", (e) => {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const accIndex = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );

    // Delete account
    accounts.splice(accIndex, 1);

    // Hide UI
    containerApp.style.opacity = 0;
    labelWelcome.textContent = "Log in to get started";
  }

  inputCloseUsername.value = inputClosePin.value = "";
});

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();

  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});






