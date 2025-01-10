import { useEffect, useState } from "react";

function Footer() {
  const [isSizeWidth, setSizeWidth] = useState();
  const [isSizeLap, setSizeLap] = useState(false);
  useEffect(() => {
    const handleSize = () => {
      setSizeWidth(document.documentElement.clientWidth);
    };
    window.addEventListener("resize", handleSize);
    return () => {
      window.removeEventListener("resize", handleSize);
    };
  }, []);
  useEffect(() => {
    if (isSizeWidth < 1024) {
      setSizeLap(true);
    } else {
      setSizeLap(false);
    }
  }, [isSizeWidth]);
  return (
    <div className="w-full overflow-x-hidden h-fit">
      <div className="flex w-full bg-[rgba(28,41,48,1.00)] p-4">
        <span className="text-white text-5xl font-bold tracking-wider">TRAVFRUIT</span>
      </div>
    </div>
  );
}
export default Footer;
