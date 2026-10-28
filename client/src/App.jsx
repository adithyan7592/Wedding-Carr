import { useEffect, useState } from "react";
import Envelope from "./components/Envelope.jsx";
import Blossoms from "./components/Blossoms.jsx";
import Invitation from "./components/Invitation.jsx";
import ScratchHeart from "./components/ScratchHeart.jsx";
import Details from "./components/Details.jsx";
import Families from "./components/Families.jsx";
import Rsvp from "./components/Rsvp.jsx";
import Wishes from "./components/Wishes.jsx";
import Footer from "./components/Footer.jsx";
import { GoldDefs } from "./components/Ornaments.jsx";
import useReveal from "./lib/useReveal.js";
import MusicButton from "./components/MusicButton.jsx";
import Madhuram from "./components/Madhuram.jsx";

export default function App() {
  const [open, setOpen] = useState(false);
  useReveal(open);

  useEffect(() => {
    document.documentElement.classList.toggle("locked", !open);
    if (open) window.scrollTo(0, 0);
  }, [open]);

  return (
    <div className={`app ${open ? "is-open" : ""}`}>
      <GoldDefs />
      <div className="bokeh" aria-hidden="true" />
      <Blossoms active={open} />
      <Envelope onOpen={() => setOpen(true)} />
        <MusicButton visible={open} />
      <main aria-hidden={!open}>
        <Invitation />
        <ScratchHeart />
        <Details />
         <Madhuram />
        <Families />
        <Rsvp />
        <Wishes />
        <Footer />
      </main>
    </div>
  );
}
