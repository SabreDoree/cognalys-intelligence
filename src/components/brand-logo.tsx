import Image from "next/image";

export function BrandLogo() {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return <>
    <Image src={`${base}/wordmark.svg`} alt="Cognalys Intelligence" width={954} height={113} className="brand-logo brand-logo-light" unoptimized />
    <Image src={`${base}/wordmark-dark.svg`} alt="Cognalys Intelligence" width={954} height={113} className="brand-logo brand-logo-dark" unoptimized />
  </>;
}
