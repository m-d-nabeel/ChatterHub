const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid h-screen w-screen place-items-center">{children}</div>
  );
};

export default AuthLayout;
