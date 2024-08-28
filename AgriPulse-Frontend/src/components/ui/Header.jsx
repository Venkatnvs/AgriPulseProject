const Heading = ({ title, description }) => {
  return (
    <div>
      <h2 className='text-2xl font-bold tracking-tight'>{title}</h2>
      <p className='text-sm text-muted-foreground'>{description}</p>
    </div>
  );
};

export { Heading };
