interface PageHeaderProps {
  title: string;
  description: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="bg-primary p-6 rounded-lg text-white mb-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="mt-2 text-primary-foreground/80">{description}</p>
    </div>
  );
}