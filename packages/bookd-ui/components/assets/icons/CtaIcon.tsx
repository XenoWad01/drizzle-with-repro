export const CtaIcon = ({ fill }: { fill: string }) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M9.1239 5.875H17.1239L23.1239 11.875V23.875C23.1239 24.975 22.2239 25.875 21.1239 25.875H9.1139C8.0139 25.875 7.1239 24.975 7.1239 23.875L7.1339 7.875C7.1339 6.775 8.0239 5.875 9.1239 5.875ZM9.1239 7.875V23.875H21.1239V12.875H16.1239V7.875H9.1239Z"
        fill={fill}
      />
    </svg>
  );
};
