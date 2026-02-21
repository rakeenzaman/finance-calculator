"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import NumberFlow from "@number-flow/react";
import {
  CategoryScale,
  Chart,
  Filler,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";

Chart.register(CategoryScale, LinearScale, PointElement, LineController, LineElement, Tooltip, Legend, Filler);

export default function Home() {
  const [initialDeposit, setInitialDeposit] = useState("10000");
  const [monthlyContribution, setMonthlyContribution] = useState("500");
  const [apyPercent, setApyPercent] = useState("4.5");
  const [years, setYears] = useState("10");

  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart<"line"> | null>(null);

  const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

  const handleYearsChange = (value: string) => {
    if (value === "") {
      setYears("");
      return;
    }
    const nextValue = Number(value);
    if (Number.isNaN(nextValue)) {
      return;
    }
    setYears(String(clamp(nextValue, 0, 100)));
  };

  const handleApyChange = (value: string) => {
    if (value === "") {
      setApyPercent("");
      return;
    }
    if (!/^\d*\.?\d*$/.test(value)) {
      return;
    }

    const nextValue = Number(value);
    if (!Number.isNaN(nextValue) && nextValue > 100) {
      setApyPercent("100");
      return;
    }

    setApyPercent(value);
  };

  const initialDepositValue = Math.max(0, Number(initialDeposit) || 0);
  const monthlyContributionValue = Math.max(0, Number(monthlyContribution) || 0);
  const apyPercentValue = clamp(Number(apyPercent) || 0, 0, 100);
  const yearCount = Math.floor(clamp(Number(years) || 0, 0, 100));
  const compoundsPerYearValue = 12;

  const currency = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      }),
    [],
  );

  const { yearlyBalances, endBalance, totalContributions, interestEarned } = useMemo(() => {
    const annualRate = apyPercentValue / 100;
    const periodRate = annualRate / compoundsPerYearValue;
    const contributionPerPeriod = (monthlyContributionValue * 12) / compoundsPerYearValue;

    let runningBalance = initialDepositValue;
    const balances = [runningBalance];

    for (let yearIndex = 1; yearIndex <= yearCount; yearIndex += 1) {
      for (let period = 0; period < compoundsPerYearValue; period += 1) {
        runningBalance = runningBalance * (1 + periodRate) + contributionPerPeriod;
      }
      balances.push(runningBalance);
    }

    const contributions = initialDepositValue + monthlyContributionValue * 12 * yearCount;
    const earnedInterest = runningBalance - contributions;

    return {
      yearlyBalances: balances,
      endBalance: runningBalance,
      totalContributions: contributions,
      interestEarned: earnedInterest,
    };
  }, [apyPercentValue, initialDepositValue, monthlyContributionValue, yearCount]);

  useEffect(() => {
    if (!chartCanvasRef.current) {
      return;
    }

    chartInstanceRef.current?.destroy();
    chartInstanceRef.current = new Chart(chartCanvasRef.current, {
      type: "line",
      data: {
        labels: yearlyBalances.map((_, index) => `${index}`),
        datasets: [
          {
            label: "HYSA Balance",
            data: yearlyBalances,
            borderColor: "#64e183",
            backgroundColor: "rgba(100, 225, 131, 0.15)",
            fill: true,
            tension: 0.22,
            borderWidth: 2,
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => `Balance: ${currency.format(Number(context.parsed.y) || 0)}`,
            },
          },
        },
        scales: {
          x: {
            title: { display: true, text: "Years", color: "#9ca3af" },
            ticks: { color: "#9ca3af", minRotation: 0, maxRotation: 0 },
            grid: { color: "rgba(255,255,255,0.08)" },
          },
          y: {
            title: { display: true, text: "Balance", color: "#9ca3af" },
            ticks: {
              color: "#9ca3af",
              callback: (value) => currency.format(Number(value)),
            },
            grid: { color: "rgba(255,255,255,0.08)" },
          },
        },
      },
    });

    return () => {
      chartInstanceRef.current?.destroy();
      chartInstanceRef.current = null;
    };
  }, [currency, yearlyBalances]);

  return (
    <main className="ira-calc-page">
      <section className="ira-calc-card">
        <h1 className="ira-calc-title">High-Yield Savings Account Calculator</h1>
        <h2 className="ira-calc-subtitle">
          Estimate high-yield savings account growth with APY and monthly deposits using monthly compounding.
        </h2>

        <div className="ira-calc-inputs-and-chart">
          <div className="ira-calc-inputs-panel">
            <div className="ira-calc-inputs-grid">
              <label className="ira-calc-input-group">
                <span>Initial Deposit ($)</span>
                <input
                  type="text"
                  value={initialDeposit}
                  onChange={(event) => setInitialDeposit(event.target.value || "")}
                  className="ira-calc-input"
                />
              </label>

              <label className="ira-calc-input-group">
                <span>Monthly Contribution ($)</span>
                <input
                  type="text"
                  value={monthlyContribution}
                  onChange={(event) => setMonthlyContribution(event.target.value || "")}
                  className="ira-calc-input"
                />
              </label>

              <label className="ira-calc-input-group">
                <span>APY (%)</span>
                <input
                  type="text"
                  value={apyPercent}
                  onChange={(event) => handleApyChange(event.target.value || "")}
                  className="ira-calc-input"
                />
              </label>

              <label className="ira-calc-input-group">
                <span>Years</span>
                <input
                  type="text"
                  value={years}
                  onChange={(event) => handleYearsChange(event.target.value || "")}
                  className="ira-calc-input"
                />
              </label>
            </div>
          </div>

          <div className="ira-calc-chart-card">
            <h2 className="ira-calc-chart-title">Savings Growth Over Time</h2>
            <div className="ira-calc-chart-area">
              <canvas ref={chartCanvasRef} />
            </div>
          </div>
        </div>

        <div className="ira-calc-result-card">
          <div className="ira-calc-result-and-year">
            <div className="ira-calc-result-year">In {new Date().getFullYear() + yearCount} your balance will be</div>
            <div className="ira-calc-result-value">
              <NumberFlow value={endBalance} format={{ style: "currency", currency: "USD" }} />
            </div>
          </div>
          <div className="ira-calc-secondary-result">
            <div>Total contributions: {currency.format(totalContributions)}</div>
            <div>Interest earned: {currency.format(interestEarned)}</div>
          </div>
        </div>
      </section>
    </main>
  );
}
