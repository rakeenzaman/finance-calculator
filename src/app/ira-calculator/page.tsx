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
  const [startingBalance, setStartingBalance] = useState("10000");
  const [years, setYears] = useState("30");
  const [yearlyContribution, setYearlyContribution] = useState("7500");
  const [rorPercent, setRorPercent] = useState("7");
  const [marginalTaxRate, setMarginalTaxRate] = useState("24");

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

  const handleRorPercentChange = (value: string) => {
    if (value === "") {
      setRorPercent("");
      return;
    }

    if (!/^\d*\.?\d*$/.test(value)) {
      return;
    }

    const nextValue = Number(value);
    if (!Number.isNaN(nextValue) && nextValue > 100) {
      setRorPercent("100");
      return;
    }

    setRorPercent(value);
  };

  const handleYearlyContributionChange = (value: string) => {
    if (value === "") {
      setYearlyContribution("");
      return;
    }

    const nextValue = Number(value);
    if (Number.isNaN(nextValue)) {
      return;
    }

    setYearlyContribution(String(clamp(nextValue, 0, 10000)));
  };

  const handleMarginalTaxRateChange = (value: string) => {
    if (value === "") {
      setMarginalTaxRate("");
      return;
    }

    if (!/^\d*\.?\d*$/.test(value)) {
      return;
    }

    const nextValue = Number(value);
    if (!Number.isNaN(nextValue) && nextValue > 100) {
      setMarginalTaxRate("100");
      return;
    }

    setMarginalTaxRate(value);
  };

  const startingBalanceValue = Number(startingBalance) || 0;
  const yearlyContributionValue = clamp(Number(yearlyContribution) || 0, 0, 10000);
  const rorPercentValue = clamp(Number(rorPercent) || 0, 0, 100);
  const marginalTaxRateValue = clamp(Number(marginalTaxRate) || 0, 0, 100);

  const yearCount = Math.floor(clamp(Number(years) || 0, 0, 100));
  const rate = rorPercentValue / 100;
  const growthFactor = (1 + rate) ** yearCount;
  const startingBalanceFutureValue = startingBalanceValue * growthFactor;
  const contributionFutureValue =
    rate === 0 ? yearlyContributionValue * yearCount : yearlyContributionValue * ((growthFactor - 1) / rate);
  const preTaxEndBalance = startingBalanceFutureValue + contributionFutureValue;
  const totalContributions = startingBalanceValue + yearlyContributionValue * yearCount;
  const interestEarned = preTaxEndBalance - totalContributions;
  const afterTaxEndBalance = preTaxEndBalance * (1 - marginalTaxRateValue / 100);

  const currency = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      }),
    [],
  );

  const yearlyBalances = useMemo(() => {
    return Array.from({ length: yearCount + 1 }, (_, index) => {
      const yearGrowthFactor = (1 + rate) ** index;
      const principalPart = startingBalanceValue * yearGrowthFactor;
      const contributionPart =
        rate === 0
          ? yearlyContributionValue * index
          : yearlyContributionValue * ((yearGrowthFactor - 1) / rate);

      return principalPart + contributionPart;
    });
  }, [rate, startingBalanceValue, yearCount, yearlyContributionValue]);

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
            label: "Traditional IRA (Pre-tax)",
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
        <h1 className="ira-calc-title">Traditional IRA Calculator</h1>
        <h2 className="ira-calc-subtitle">
          Estimate your Traditional IRA growth and projected after-tax withdrawal value.
        </h2>

        <div className="ira-calc-inputs-and-chart">
          <div className="ira-calc-inputs-panel">
            <div className="ira-calc-inputs-grid">
              <label className="ira-calc-input-group">
                <span>Starting Balance ($)</span>
                <input
                  type="text"
                  value={startingBalance}
                  onChange={(event) => setStartingBalance(event.target.value || "")}
                  className="ira-calc-input"
                />
              </label>

              <label className="ira-calc-input-group">
                <span>Number of Years</span>
                <input
                  type="text"
                  value={years}
                  onChange={(event) => handleYearsChange(event.target.value || "")}
                  className="ira-calc-input"
                />
              </label>

              <label className="ira-calc-input-group">
                <span>Rate of Return (%)</span>
                <input
                  type="text"
                  value={rorPercent}
                  onChange={(event) => handleRorPercentChange(event.target.value || "")}
                  className="ira-calc-input"
                />
              </label>

              <label className="ira-calc-input-group">
                <span>Yearly Contribution ($)</span>
                <input
                  type="text"
                  value={yearlyContribution}
                  onChange={(event) => handleYearlyContributionChange(event.target.value || "")}
                  className="ira-calc-input"
                />
              </label>

              <label className="ira-calc-input-group">
                <span>Tax Rate (%)</span>
                <input
                  type="text"
                  value={marginalTaxRate}
                  onChange={(event) => handleMarginalTaxRateChange(event.target.value || "")}
                  className="ira-calc-input"
                />
              </label>
            </div>
          </div>
          <div className="ira-calc-chart-card">
            <h2 className="ira-calc-chart-title">Compound Growth Over Time</h2>
            <div className="ira-calc-chart-area">
              <canvas ref={chartCanvasRef} />
            </div>
          </div>
        </div>

        <div className="ira-calc-result-card">
          <div className="ira-calc-result-and-year">
            <div className="ira-calc-result-year">In {new Date().getFullYear() + yearCount} your pre-tax balance will be</div>
            <div className="ira-calc-result-value">
              <NumberFlow value={preTaxEndBalance} format={{ style: "currency", currency: "USD" }} />
            </div>
          </div>
          <div className="ira-calc-secondary-result">
            <div>Total contributions: {currency.format(totalContributions)}</div>
            <div>Interest earned: {currency.format(interestEarned)}</div>
          </div>
          <div className="ira-calc-secondary-result">
            Estimated after-tax value at {marginalTaxRateValue}%: {currency.format(afterTaxEndBalance)}
          </div>
        </div>
      </section>
    </main>
  );
}
