import "./XPPanel.scss";

type XPPanelProps = {
  children: React.ReactNode;
  className?: string;
};

export default function XPPanel({ children, className = "" }: XPPanelProps) {
  return (
    <div className={`xp-panel ${className}`}>
      {children}
    </div>
  );
}