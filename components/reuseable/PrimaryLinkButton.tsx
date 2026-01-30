import Link from "next/link";

interface PrimaryButtonProps {
  title: string;
  href: string;
  className?: string;
}

const PrimaryLinkButton = ({ title, href, className }: PrimaryButtonProps) => {
  return (
    <Link
      href={href}
      className={`
        relative inline-flex items-center justify-center
        overflow-hidden
        bg-primary hover:bg-[#13d155]
        rounded-lg px-6 py-2
        text-black cursor-pointer uppercase
        group
        ${className}
      `}
    >
      {/* Wrapper keeps height consistent */}
      <span className="relative block  overflow-hidden">
        {/* Default text */}
        <span className="block transition-transform duration-300 ease-out group-hover:-translate-y-full">
          {title}
        </span>

        {/* Hover text */}
        <span className="absolute left-0 top-full block  transition-transform duration-300 ease-out group-hover:-translate-y-full">
          {title}
        </span>
      </span>
    </Link>
  );
};

export default PrimaryLinkButton;
