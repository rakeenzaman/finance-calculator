"use client";

import { useMemo, useState } from "react";
import NumberFlow from "@number-flow/react";

export default function Home() {
  const [homePrice, setHomePrice] = useState("450000");
  const [downPayment, setDownPayment] = useState("90000");
  const [interestRate, setInterestRate] = useState("6.5");
  const [loanYears, setLoanYears] = useState("30");

  const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

  const handleInterestChange = (value: string) => {
    if (value === "") {
      setInterestRate("");
      return;
    }

    if (!/^\d*\.?\d*$/.test(value)) {
      return;
    }

    const nextValue = Number(value);
    if (!Number.isNaN(nextValue) && nextValue > 100) {
      setInterestRate("100");
      return;
    }

    setInterestRate(value);
  };

  const handleLoanYearsChange = (value: string) => {
    if (value === "") {
      setLoanYears("");
      return;
    }
    const nextValue = Number(value);
    if (Number.isNaN(nextValue)) {
      return;
    }
    setLoanYears(String(Math.floor(clamp(nextValue, 1, 40))));
  };

  const homePriceValue = Math.max(0, Number(homePrice) || 0);
  const downPaymentValue = Math.max(0, Number(downPayment) || 0);
  const principal = Math.max(0, homePriceValue - downPaymentValue);
  const annualRate = clamp(Number(interestRate) || 0, 0, 100) / 100;
  const yearCount = Math.floor(clamp(Number(loanYears) || 0, 1, 40));

  const currency = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      }),
    [],
  );

  const { monthlyPayment, totalInterest, totalPaid } = useMemo(() => {
    const monthCount = yearCount * 12;
    const monthlyRate = annualRate / 12;

    if (monthCount <= 0 || principal <= 0) {
      return { monthlyPayment: 0, totalInterest: 0, totalPaid: 0 };
    }

    const payment =
      monthlyRate === 0
        ? principal / monthCount
        : (principal * monthlyRate * (1 + monthlyRate) ** monthCount) / ((1 + monthlyRate) ** monthCount - 1);

    let remainingBalance = principal;
    let paidInterest = 0;

    for (let month = 1; month <= monthCount; month += 1) {
      const interestPortion = remainingBalance * monthlyRate;
      let principalPortion = payment - interestPortion;
      if (principalPortion > remainingBalance) {
        principalPortion = remainingBalance;
      }

      remainingBalance -= principalPortion;
      paidInterest += interestPortion;
    }

    return {
      monthlyPayment: payment,
      totalInterest: paidInterest,
      totalPaid: principal + paidInterest,
    };
  }, [annualRate, principal, yearCount]);

  return (
    <main className="ira-calc-page">
      <section className="ira-calc-card">
        <h1 className="ira-calc-title">Mortgage Calculator</h1>
        <h2 className="ira-calc-subtitle">
          Estimate monthly mortgage payment, total interest paid, and total amount paid over the life of the loan.
        </h2>

        <div className="ira-calc-inputs-and-chart">
          <div className="ira-calc-inputs-panel no-chart">
            <div className="ira-calc-inputs-grid">
              <label className="ira-calc-input-group">
                <span>Home Price ($)</span>
                <input
                  type="text"
                  value={homePrice}
                  onChange={(event) => setHomePrice(event.target.value || "")}
                  className="ira-calc-input"
                />
              </label>

              <label className="ira-calc-input-group">
                <span>Down Payment ($)</span>
                <input
                  type="text"
                  value={downPayment}
                  onChange={(event) => setDownPayment(event.target.value || "")}
                  className="ira-calc-input"
                />
              </label>

              <label className="ira-calc-input-group">
                <span>Interest Rate (%)</span>
                <input
                  type="text"
                  value={interestRate}
                  onChange={(event) => handleInterestChange(event.target.value || "")}
                  className="ira-calc-input"
                />
              </label>

              <label className="ira-calc-input-group">
                <span>Loan Term (Years)</span>
                <input
                  type="text"
                  value={loanYears}
                  onChange={(event) => handleLoanYearsChange(event.target.value || "")}
                  className="ira-calc-input"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="ira-calc-result-card">
          <div className="ira-calc-result-and-year">
            <div className="ira-calc-result-year">Estimated monthly payment</div>
            <div className="ira-calc-result-value">
              <NumberFlow value={monthlyPayment} format={{ style: "currency", currency: "USD" }} />
            </div>
          </div>
          <div className="ira-calc-secondary-result">
            <div>Total interest: {currency.format(totalInterest)}</div>
            <div>Total amount: {currency.format(totalPaid)}</div>
          </div>
        </div>
      </section>
    </main>
  );
}
