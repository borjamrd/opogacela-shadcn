import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import { BsStripe, BsPaypal } from "react-icons/bs";
import { FaCcVisa } from "react-icons/fa";
import { SiKlarna, SiApplepay, SiGooglepay } from "react-icons/si";

const Icons = {
  klarna: () => (
    <SiKlarna className="w-full h-full text-primary dark:text-white" />
  ),
  visa: () => (
    <FaCcVisa className="w-full h-full text-primary dark:text-white" />
  ),
  paypal: () => (
    <BsPaypal className="w-full h-full text-primary dark:text-white" />
  ),
  applePay: () => (
    <SiApplepay className="w-full h-full text-primary dark:text-white" />
  ),
  googlePay: () => (
    <SiGooglepay className="w-full h-full text-primary dark:text-white" />
  ),
  stripe: () => (
    <BsStripe className="w-full h-full text-primary dark:text-white" />
  ),
};
export function Payments() {
  return (
    <div className="relative flex h-[400px] w-full flex-col items-center justify-center overflow-hidden">
      <OrbitingCircles path={true} radius={40} iconSize={40}>
        <Icons.klarna />
      </OrbitingCircles>
      <OrbitingCircles path={true} radius={100} iconSize={40}>
        <Icons.visa />
      </OrbitingCircles>
      <OrbitingCircles path={true} radius={120} iconSize={40}>
        <Icons.paypal />
      </OrbitingCircles>
      <OrbitingCircles path={false} radius={120} iconSize={40} speed={2}>
        <Icons.applePay />
      </OrbitingCircles>
      <OrbitingCircles path={true} radius={150} iconSize={40}>
        <Icons.googlePay />
      </OrbitingCircles>
      <OrbitingCircles path={false} radius={180} iconSize={40}>
        <Icons.stripe />
      </OrbitingCircles>
      <OrbitingCircles path={true} radius={180} iconSize={40} reverse speed={1}>
        <Icons.applePay />
      </OrbitingCircles>
    </div>
  );
}
