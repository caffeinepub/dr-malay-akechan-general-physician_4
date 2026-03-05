import Footer from "../components/Footer";
import About from "./About";
import Clinics from "./Clinics";
import Home from "./Home";
import Services from "./Services";
import SocialMedia from "./SocialMedia";

export default function MainPage() {
  return (
    <>
      <Home />
      <About />
      <Services />
      <Clinics />
      <SocialMedia />
      <Footer />
    </>
  );
}
