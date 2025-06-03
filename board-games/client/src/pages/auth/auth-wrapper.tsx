import { Link } from "react-router-dom";

export const AuthWrapper = ({
  headerLabel,
  footerLinkLabel,
  footerLinkHref,
  children,
}: {
  headerLabel: string;
  footerLinkLabel: string;
  footerLinkHref: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col gap-6 w-full py-10 max-w-[32rem]">
      <h1 className="text-3xl font-bold">{headerLabel}</h1>
      {children}
      <Link
        to={{ pathname: footerLinkHref }}
        className="text-wrap text-sm hover:underline text-start w-full font-normal"
        // href={}
      >
        {footerLinkLabel}
      </Link>
    </div>
  );
};
