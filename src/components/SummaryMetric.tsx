type SummaryMetricProps = {
  label: string;
  value: string;
  tone?: "positive" | "negative";
};

export function SummaryMetric({ label, value, tone }: SummaryMetricProps) {
  return (
    <article className={`summary-card ${tone ?? ""}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}
