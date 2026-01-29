import { NavLink, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useI18n } from "../i18n";

export function Layout() {
    const linkClass = ({ isActive }: { isActive: boolean }) =>
        `px-3 py-2 rounded-xl ${isActive ? "bg-black text-white" : "hover:bg-black/10"}`;

    const location = useLocation();
    const reduceMotion = useReducedMotion();
    const { lang, setLang, t } = useI18n();

    return (
        <div className="min-h-screen">
            <header className="border-b">
                <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
                    <div className="font-semibold">{t("app_name")}</div>
                    <div className="flex items-center gap-3">
                        <nav className="flex items-center gap-2 text-sm">
                            <NavLink to="/" className={linkClass}>{t("nav_home")}</NavLink>
                            <NavLink to="/auctions" className={linkClass}>{t("nav_auctions")}</NavLink>
                            <NavLink to="/create" className={linkClass}>{t("nav_create")}</NavLink>
                        </nav>
                        <div className="flex items-center rounded-xl border p-1 text-xs">
                            <button
                                type="button"
                                onClick={() => setLang("pl")}
                                className={`px-2 py-1 rounded-lg ${lang === "pl" ? "bg-black text-white" : "hover:bg-black/10"}`}
                                aria-pressed={lang === "pl"}
                            >
                                PL
                            </button>
                            <button
                                type="button"
                                onClick={() => setLang("en")}
                                className={`px-2 py-1 rounded-lg ${lang === "en" ? "bg-black text-white" : "hover:bg-black/10"}`}
                                aria-pressed={lang === "en"}
                            >
                                EN
                            </button>
                        </div>
                    </div>
                </div>
            </header>

      <main className="mx-auto max-w-6xl px-4 py-6 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
