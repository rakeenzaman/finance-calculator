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
  const [currentBalance, setCurrentBalance] = useState("25000");
  const [annualSalary, setAnnualSalary] = useState("90000");
  const [employeeContributionPercent, setEmployeeContributionPercent] = useState("10");
  const [employerMatchPercent, setEmployerMatchPercent] = useState("50");
  const [maxEmployerMatchPercent, setMaxEmployerMatchPercent] = useState("6");
  const [salaryGrowthPercent, setSalaryGrowthPercent] = useState("3");
  const [annualReturnPercent, setAnnualReturnPercent] = useState("7");
  const [years, setYears] = useState("30");

  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart<"line"> | null>(null);

  const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

  const handlePercent = (
    value: string,
    setter: (value: string) => void,
    max = 100,
  ) => {
    if (value === "") {
      setter("");
      return;
    }

    if (!/^\d*\.?\d*$/.test(value)) {
      return;
    }

    const nextValue = Number(value);
    if (!Number.isNaN(nextValue) && nextValue > max) {
      setter(String(max));
      return;
    }

    setter(value);
  };

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

  const currentBalanceValue = Math.max(0, Number(currentBalance) || 0);
  const annualSalaryValue = Math.max(0, Number(annualSalary) || 0);
  const employeePercentValue = clamp(Number(employeeContributionPercent) || 0, 0, 100);
  const employerPercentValue = clamp(Number(employerMatchPercent) || 0, 0, 100);
  const maxEmployerMatchPercentValue = clamp(Number(maxEmployerMatchPercent) || 0, 0, 100);
  const salaryGrowthValue = clamp(Number(salaryGrowthPercent) || 0, 0, 100) / 100;
  const annualReturnValue = clamp(Number(annualReturnPercent) || 0, 0, 100) / 100;
  const yearCount = Math.floor(clamp(Number(years) || 0, 0, 100));

  const currency = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      }),
    [],
  );

  const { yearlyBalances, projectedBalance, totalContributions } = useMemo(() => {
    let runningBalance = currentBalanceValue;
    let runningSalary = annualSalaryValue;
    let contributed = 0;
    const balances = [runningBalance];

    for (let yearIndex = 1; yearIndex <= yearCount; yearIndex += 1) {
      const employeeContribution = runningSalary * (employeePercentValue / 100);
      const matchablePercent = Math.min(employeePercentValue, maxEmployerMatchPercentValue);
      const employerContribution = runningSalary * (matchablePercent / 100) * (employerPercentValue / 100);
      const annualContribution = employeeContribution + employerContribution;
      contributed += annualContribution;
      runningBalance = runningBalance * (1 + annualReturnValue) + annualContribution;
      runningSalary = runningSalary * (1 + salaryGrowthValue);
      balances.push(runningBalance);
    }

    return {
      yearlyBalances: balances,
      projectedBalance: runningBalance,
      totalContributions: contributed,
    };
  }, [annualReturnValue, annualSalaryValue, currentBalanceValue, employeePercentValue, employerPercentValue, maxEmployerMatchPercentValue, salaryGrowthValue, yearCount]);

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
            label: "401(k) Balance",
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
        <h1 className="ira-calc-title">401(k) Calculator</h1>
        <h2 className="ira-calc-subtitle">
          Forecast retirement savings with employee contributions, employer match, salary growth, and market returns.
        </h2>

        <div className="ira-calc-inputs-and-chart">
          <div className="ira-calc-inputs-panel">
            <div className="ira-calc-inputs-grid">
              <label className="ira-calc-input-group">
                <span>Current Balance ($)</span>
                <input
                  type="text"
                  value={currentBalance}
                  onChange={(event) => setCurrentBalance(event.target.value || "")}
                  className="ira-calc-input"
                />
              </label>

              <label className="ira-calc-input-group">
                <span>Annual Salary ($)</span>
                <input
                  type="text"
                  value={annualSalary}
                  onChange={(event) => setAnnualSalary(event.target.value || "")}
                  className="ira-calc-input"
                />
              </label>

              <label className="ira-calc-input-group">
                <span>Employee Contribution (%)</span>
                <input
                  type="text"
                  value={employeeContributionPercent}
                  onChange={(event) => handlePercent(event.target.value || "", setEmployeeContributionPercent)}
                  className="ira-calc-input"
                />
              </label>

              <label className="ira-calc-input-group">
                <span>Employer Match Rate (%)</span>
                <input
                  type="text"
                  value={employerMatchPercent}
                  onChange={(event) => handlePercent(event.target.value || "", setEmployerMatchPercent)}
                  className="ira-calc-input"
                />
              </label>

              <label className="ira-calc-input-group">
                <span>Max Employer Match (%)</span>
                <input
                  type="text"
                  value={maxEmployerMatchPercent}
                  onChange={(event) => handlePercent(event.target.value || "", setMaxEmployerMatchPercent)}
                  className="ira-calc-input"
                />
              </label>

              <label className="ira-calc-input-group">
                <span>Salary Growth (%)</span>
                <input
                  type="text"
                  value={salaryGrowthPercent}
                  onChange={(event) => handlePercent(event.target.value || "", setSalaryGrowthPercent)}
                  className="ira-calc-input"
                />
              </label>

              <label className="ira-calc-input-group">
                <span>Annual Return (%)</span>
                <input
                  type="text"
                  value={annualReturnPercent}
                  onChange={(event) => handlePercent(event.target.value || "", setAnnualReturnPercent)}
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
            <h2 className="ira-calc-chart-title">401(k) Growth Over Time</h2>
            <div className="ira-calc-chart-area">
              <canvas ref={chartCanvasRef} />
            </div>
          </div>
        </div>

        <div className="ira-calc-result-card">
          <div className="ira-calc-result-and-year">
            <div className="ira-calc-result-year">In {new Date().getFullYear() + yearCount} projected 401(k) balance</div>
            <div className="ira-calc-result-value">
              <NumberFlow value={projectedBalance} format={{ style: "currency", currency: "USD" }} />
            </div>
          </div>
          <div className="ira-calc-secondary-result">Total contributions over period: {currency.format(totalContributions)}</div>
        </div>
      </section>
    </main>
  );
}
