const LoadingCircle = () => {
  return (
    <div className="relative grid h-screen w-screen place-items-center bg-background">
      <div className="absolute aspect-square h-1/3 animate-spin rounded-full border-r-2 border-foreground" />
    </div>
  );
};

export default LoadingCircle;
