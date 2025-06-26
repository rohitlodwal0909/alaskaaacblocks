import "flowbite";
import { useState, useEffect, useContext } from "react";
import { Navbar, Drawer } from "flowbite-react";
import { Icon } from "@iconify/react";
import FullLogo from "../../shared/logo/FullLogo";
import MobileHeaderItems from "./MobileHeaderItems";
import MobileSidebar from "../sidebar/MobileSidebar";
import HorizontalMenu from "../../horizontal/header/HorizontalMenu";
import { CustomizerContext } from "src/context/CustomizerContext";
import Notifications from "./Notifications";
import Profile from "./Profile";
import ReactFlagsSelect from "react-flags-select";
import { GetNotification } from "src/features/Notifications/NotificationSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

interface HeaderPropsType {
  layoutType: string;
}

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
    translateElementInitialized?: boolean;
  }
}

const Header = ({ layoutType }: HeaderPropsType) => {
  const [isSticky, setIsSticky] = useState(false);
  const [selected, setSelected] = useState("US");

  const languageMap: Record<string, string> = {
    US: "en", GB: "en", FR: "fr", DE: "de", ES: "es", IT: "it",
    CN: "zh-CN", TW: "zh-TW", JP: "ja", KR: "ko", IN: "hi", PK: "ur",
    RU: "ru", SA: "ar", IL: "he", VN: "vi", PT: "pt", NL: "nl",
    TH: "th", TR: "tr", PL: "pl", BD: "bn", GR: "el", RO: "ro",
    SE: "sv", NO: "no", FI: "fi", HU: "hu", CZ: "cs", SK: "sk"
  };

  const customLabels = {
    US: "English", GB: "English (UK)", FR: "Français", DE: "Deutsch", ES: "Español", IT: "Italiano",
    CN: "中文(简体)", TW: "中文(繁體)", JP: "日本語", KR: "한국어", IN: "हिन्दी", PK: "اردو",
    RU: "Русский", SA: "العربية", IL: "עברית", VN: "Tiếng Việt", PT: "Português", NL: "Nederlands",
    TH: "ไทย", TR: "Türkçe", PL: "Polski", BD: "বাংলা", GR: "Ελληνικά", RO: "Română",
    SE: "Svenska", NO: "Norsk", FI: "Suomi", HU: "Magyar", CZ: "Čeština", SK: "Slovenčina"
  };

const handleLanguageChange = (code: string) => {
  setSelected(code);
  const langCode = languageMap[code];

  const tryUpdateLang = () => {
    const select = document.querySelector("#google_translate_element select") as HTMLSelectElement | null;
    if (select) {
      for (let i = 0; i < select.options.length; i++) {
        console.log("Google Translate option:", select.options[i].value); // Debug
        if (select.options[i].value === langCode) {
          select.selectedIndex = i;
          select.dispatchEvent(new Event("change"));
          break;
        }
      }
    } else {
      setTimeout(tryUpdateLang, 500);
    }
  };

  tryUpdateLang();
};

  useEffect(() => {
    const initializeGoogleTranslate = () => {
      if (window.google?.translate?.TranslateElement && !window.translateElementInitialized) {
        window.translateElementInitialized = true;
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            layout: window.google.translate.TranslateElement.InlineLayout.LIST
          },
          "google_translate_element"
        );
      }
    };

    const addGoogleTranslateScript = () => {
      const existingScript = document.querySelector("script[src*='translate_a/element.js']");
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);
      } else {
        initializeGoogleTranslate();
      }
    };

    window.googleTranslateElementInit = () => initializeGoogleTranslate();

    addGoogleTranslateScript();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { setIsCollapse, isCollapse, isLayout, setActiveMode, activeMode } = useContext(CustomizerContext);
  const [mobileMenu, setMobileMenu] = useState("");
  const [isOpen, setIsOpen] = useState(false);
     const notifications = useSelector((state: any) => state.notifications.notificationData);
  const toggleMode = () =>
    setActiveMode((prevMode: string) => (prevMode === "light" ? "dark" : "light"));

  return (
    <>
      <header className={`sticky top-0 z-[5] ${isSticky ? "bg-lightgray dark:bg-dark shadow-md fixed w-full" : "bg-transparent"}`}>
        <Navbar
          fluid
          className={`rounded-none bg-transparent py-4 sm:px-30 px-4 ${layoutType === "horizontal" ? "container mx-auto" : ""} ${isLayout === "full" ? "!max-w-full" : ""}`}
        >
          {/* Mobile Toggle */}
          <span onClick={() => setIsOpen(true)} className="h-10 w-10 flex xl:hidden hover:text-primary hover:bg-lightprimary rounded-full justify-center items-center cursor-pointer text-black dark:text-white text-opacity-65">
            <Icon icon="solar:hamburger-menu-line-duotone" height={21} />
          </span>

          <Navbar.Collapse className="xl:block">
            <div className="flex gap-3 items-center">
              {layoutType === "horizontal" && <div className="me-3"><FullLogo /></div>}
              {layoutType !== "horizontal" && (
                <span
                  onClick={() => setIsCollapse(isCollapse === "full-sidebar" ? "mini-sidebar" : "full-sidebar")}
                  className="h-10 w-10 hover:text-primary hover:bg-lightprimary rounded-full flex justify-center items-center cursor-pointer"
                >
                  <Icon icon="solar:hamburger-menu-line-duotone" height={21} />
                </span>
              )}
            </div>
          </Navbar.Collapse>

          <Navbar.Collapse className="xl:block hidden">
            <div className="flex gap-3 items-center">
              <div className="flex items-center gap-2">
                <div id="google_translate_element" style={{ display: "none" }} />
                <ReactFlagsSelect
                  searchable
                  countries={Object.keys(languageMap)}
                  customLabels={customLabels}
                  selected={selected}
                  onSelect={(code, e) => {
                    e?.preventDefault?.();
                    handleLanguageChange(code);
                  }}
                />
              </div>

              <div
                onClick={toggleMode}
                className="h-10 w-10 hover:text-primary hover:bg-lightprimary rounded-full flex justify-center items-center cursor-pointer text-darklink dark:text-white"
              >
                <Icon
                  icon={activeMode === "light" ? "solar:moon-line-duotone" : "solar:sun-bold-duotone"}
                  width="20"
                />
              </div>

              <Notifications  />
              <Profile />
            </div>
          </Navbar.Collapse>

          <span className="h-10 w-10 flex xl:hidden hover:text-primary hover:bg-lightprimary rounded-full justify-center items-center cursor-pointer" onClick={() => setMobileMenu(mobileMenu === "active" ? "" : "active")}>
            <Icon icon="tabler:dots" height={21} />
          </span>
        </Navbar>

        <div className={`w-full xl:hidden block mobile-header-menu ${mobileMenu}`}>
          <MobileHeaderItems />
        </div>

        {layoutType === "horizontal" && (
          <div className="xl:border-y xl:border-ld">
            <div className={`${isLayout === "full" ? "w-full px-6" : "container"}`}>
              <HorizontalMenu />
            </div>
          </div>
        )}
      </header>

      <Drawer open={isOpen} onClose={() => setIsOpen(false)} className="w-130">
        <Drawer.Items>
          <MobileSidebar />
        </Drawer.Items>
      </Drawer>
    </>
  );
};

export default Header;
