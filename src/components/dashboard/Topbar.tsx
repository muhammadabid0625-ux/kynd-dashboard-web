type TopbarProps = {
  heading: string;
  description: string;
  name: string;
  roleLabel: string;
};

export function Topbar({ heading, description, name, roleLabel }: TopbarProps) {
  return (
    <div className="topbar">
      <div>
        <div className="eyebrow">{roleLabel}</div>
        <h1 className="page-title">{heading}</h1>
        <p className="page-description">{description}</p>
      </div>

      <div className="topbar-user">
        <div className="topbar-avatar">{name.slice(0, 1).toUpperCase()}</div>
        <div>
          <div className="topbar-name">{name}</div>
          <div className="topbar-role">{roleLabel}</div>
        </div>
      </div>
    </div>
  );
}
