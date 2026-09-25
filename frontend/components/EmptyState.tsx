import type { ReactNode } from "react";

type EmptyStateProps = {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
};

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div style={{ color: "#98a2b3" }}>{icon}</div>
      <h3>{title}</h3>
      <p style={{ margin: "0 0 14px", fontSize: 13 }}>{description}</p>
      {action}
    </div>
  );
}
