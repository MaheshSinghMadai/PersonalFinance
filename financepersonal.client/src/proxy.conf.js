const PROXY_CONFIG = [
  {
    context: [
      "/Expense",
    ],
    target: "https://localhost:7068",
    secure: false
  }
]

module.exports = PROXY_CONFIG;
