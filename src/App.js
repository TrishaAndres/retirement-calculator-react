import React, { useState } from "react";

export default function App() {
  const [mode, setMode] = useState("retirement");
  const [form, setForm] = useState({});
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const calculateRetirement = () => {
    const { firstAge, secondAge, retirementAge, savings, monthly, rate } = form;
    const r = parseFloat(rate) / 1200;

    const calc = (age) => {
      const months = (retirementAge - age) * 12;
      let balance = parseFloat(savings);
      let growth = 0;
      for (let i = 0; i < months; i++) {
        growth += balance * r;
        balance += balance * r + parseFloat(monthly);
      }
      return { balance, growth };
    };

    const res1 = calc(parseInt(firstAge));
    const res2 = calc(parseInt(secondAge));
    const missed = Math.abs(res1.balance - res2.balance);
    const diff = Math.abs(parseInt(firstAge) - parseInt(secondAge));

    setResult({
      mode: "retirement",
      res1,
      res2,
      diff,
      missed,
    });
  };

  const calculateLoan = () => {
    const { principal, rate, payment } = form;
    const r = parseFloat(rate) / 1200;
    const P = parseFloat(principal);
    const M = parseFloat(payment);

    const months = Math.round(
      (Math.log(M) - Math.log(M - r * P)) / Math.log(1 + r)
    );
    const years = (months / 12).toFixed(2);

    const bonus = M + 15;
    const faster = Math.round(
      (Math.log(bonus) - Math.log(bonus - r * P)) / Math.log(1 + r)
    );
    const saved = months - faster;

    setResult({
      mode: "loan",
      months,
      years,
      saved,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mode === "retirement" ? calculateRetirement() : calculateLoan();
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#4f46e5" }}>
        Clementine Financial Calculator
      </h1>

      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <button
          onClick={() => { setMode("retirement"); setResult(null); }}
          style={{
            padding: "10px 20px",
            marginRight: 10,
            background: mode === "retirement" ? "#4f46e5" : "#e5e7eb",
            color: mode === "retirement" ? "white" : "black",
            border: "none",
            borderRadius: 5
          }}
        >
          Retirement Estimator
        </button>
        <button
          onClick={() => { setMode("loan"); setResult(null); }}
          style={{
            padding: "10px 20px",
            background: mode === "loan" ? "#4f46e5" : "#e5e7eb",
            color: mode === "loan" ? "white" : "black",
            border: "none",
            borderRadius: 5
          }}
        >
          Loan Payoff Calculator
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
        {mode === "retirement" ? (
          <>
            <input name="firstAge" type="number" placeholder="First Starting Age" onChange={handleChange} required />
            <input name="secondAge" type="number" placeholder="Second Starting Age" onChange={handleChange} required />
            <input name="retirementAge" type="number" placeholder="Retirement Age" onChange={handleChange} required />
            <input name="savings" type="number" placeholder="Current Savings ($)" onChange={handleChange} required />
            <input name="monthly" type="number" placeholder="Monthly Contribution ($)" onChange={handleChange} required />
            <input name="rate" type="number" placeholder="Annual Return Rate (%)" onChange={handleChange} required />
          </>
        ) : (
          <>
            <input name="principal" type="number" placeholder="Loan Principal ($)" onChange={handleChange} required />
            <input name="rate" type="number" placeholder="Annual Interest Rate (%)" onChange={handleChange} required />
            <input name="payment" type="number" placeholder="Monthly Payment ($)" onChange={handleChange} required />
          </>
        )}

        <button type="submit" style={{
          background: "#16a34a",
          color: "white",
          padding: "12px",
          border: "none",
          borderRadius: 6,
          fontWeight: "bold",
          cursor: "pointer"
        }}>
          Calculate
        </button>
      </form>

      {result && (
        <div style={{
          background: "#eef2ff",
          padding: "1.5rem",
          marginTop: "2rem",
          borderRadius: 8,
          color: "#1e3a8a"
        }}>
          {result.mode === "retirement" ? (
            <>
              <h2>Retirement Results</h2>
              <p><strong>Start at Age {form.firstAge}:</strong> ${result.res1.balance.toFixed(2)}</p>
              <p><strong>Growth:</strong> ${result.res1.growth.toFixed(2)}</p>
              <p><strong>Start at Age {form.secondAge}:</strong> ${result.res2.balance.toFixed(2)}</p>
              <p><strong>Growth:</strong> ${result.res2.growth.toFixed(2)}</p>
              <p><strong>Missed Potential:</strong> ${result.missed.toFixed(2)} by waiting {result.diff} years</p>
            </>
          ) : (
            <>
              <h2>Loan Results</h2>
              <p><strong>Months to Pay Off:</strong> {result.months} ({result.years} years)</p>
              <p><strong>Pay $15 more → save:</strong> {result.saved} months</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
