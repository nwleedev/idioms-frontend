import { Link } from "@remix-run/react";

interface LogoProps {
  className?: string;
}

const Logo = (props: LogoProps) => {
  const { className = "" } = props;
  return (
    <Link to={"/"} draggable={false} className="flex">
      <section className={"flex items-center"}>
        <img src="/logo.svg" draggable={false} className={className} />
      </section>
    </Link>
  );
};

export default Logo;
