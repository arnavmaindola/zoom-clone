export default function LoadingState({ rows = 3 }: { rows?: number }) {
  return (
    <div className="loading-state" style={{ paddingTop: 4, paddingBottom: 8 }}>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="skeleton" />
      ))}
    </div>
  );
}
