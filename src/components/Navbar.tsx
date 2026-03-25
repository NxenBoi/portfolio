import { useState, useEffect } from "react";
import Icon from "./Images/Icon";

export default function Navbar() {
  const [activeHash, setActiveHash] = useState("#home");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const navItems = [
    { name: "home", href: "#home" },
    { name: "Examples", href: "#examples" },
    { name: "Promises", href: "#promises" },
    { name: "Contributions", href: "#contributions" },
    { name: "Contact", href: "#contact" },
  ];

  // --- THE DYNAMIC SCROLL LOGIC ---
  useEffect(() => {
    const observerOptions = {
      root: null, // Use the viewport
      rootMargin: "-40% 0px -40% 0px", // Trigger when section is in the middle 20% of screen
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveHash(`#${entry.target.id}`);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Watch every section that has an ID matching our nav items
    navItems.forEach((item) => {
      const el = document.querySelector(item.href);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [navItems]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    // Temporarily set active hash for immediate feedback
    setActiveHash(href);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed top-8 left-0 w-full flex justify-center z-100 pointer-events-none px-4">
      <nav className="relative flex items-center gap-1 p-1.5 rounded-2xl bg-[#0a0a0c] border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.05)] pointer-events-auto overflow-hidden">
        {/* ... (rest of your fancy UI code stays exactly the same) ... */}

        <div className="pl-3 pr-4 flex items-center">
          <Icon
            className="w-6 h-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-300"
            src="public/favicon.ico"
          />
        </div>

        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeHash === item.href;
            return (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleClick(e, item.href)}
                className={`relative px-5 py-2.5 rounded-xl text-[10px] leading-none uppercase tracking-[0.15em] transition-all duration-300 group ${
                  isActive ? "text-white" : "text-white/40 hover:text-white/70"
                }`}
              >
                <span className="relative z-10">{item.name}</span>
                {isActive && (
                  <div className="absolute inset-0 rounded-xl bg-white/3 border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]" />
                )}
                <div
                  className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-white/20 transition-all duration-300 ${isActive ? "w-4 opacity-100" : "w-0 opacity-0 group-hover:w-2 group-hover:opacity-50"}`}
                />
              </a>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
