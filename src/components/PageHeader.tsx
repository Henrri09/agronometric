interface PageHeaderProps {
  title: string;
  description: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="bg-primary p-4 rounded-lg text-white mb-4">
      <h1 className="text-xl font-semibold">{title}</h1>
      <p className="mt-1 text-primary-foreground/80 text-sm">{description}</p>
    </div>
  );
}