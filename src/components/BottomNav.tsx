"use client";
import { useEffect } from "react";
import { HouseSimple, ChartBar, Plus, Notepad, GearSix } from "phosphor-react";

interface BottomNavProps {
  activeTab: 'home' | 'overview' | 'history' | 'settings';
  onNavigateHome: () => void;
  onNavigateInsights: () => void;
  onNavigateAdd: () => void;
  onNavigateHistory: () => void;
  onNavigateSettings: () => void;
}

export default function BottomNav({
  activeTab,
  onNavigateHome,
  onNavigateInsights,
  onNavigateAdd,
  onNavigateHistory,
  onNavigateSettings
}: BottomNavProps) {
  useEffect(() => {
    let lastScrollTop = 0;
    const nav = document.getElementById("bottomNav");

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (!nav) return;

      if (scrollTop > lastScrollTop) {
        // User scrolls down → make it more transparent and glassy
        nav.classList.add("bg-[#1C1B1F]/40", "backdrop-blur-xl");
        nav.classList.remove("bg-[#1C1B1F]/80", "backdrop-blur-md");
      } else {
        // User scrolls up → return to original solid look
        nav.classList.add("bg-[#1C1B1F]/80", "backdrop-blur-md");
        nav.classList.remove("bg-[#1C1B1F]/40", "backdrop-blur-xl");
      }

      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      id="bottomNav"
      className="fixed bottom-0 left-0 right-0 flex items-end justify-around px-4 py-2 bg-[#1C1B1F]/80 backdrop-blur-md border-t border-white/10 transition-all duration-300 z-50"
    >
      {/* Home */}
      <button 
        onClick={onNavigateHome}
        className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] py-1 transition-colors ${
          activeTab === 'home' 
            ? 'text-[#E6E1E5]' 
            : 'text-[#938F99] hover:text-[#E6E1E5]'
        }`}
      >
        <HouseSimple 
          size={22} 
          weight={activeTab === 'home' ? 'regular' : 'light'} 
          className={activeTab === 'home' ? 'text-[#E6E1E5]' : 'opacity-60 hover:opacity-100 transition-opacity'} 
        />
        <p className="text-[11px] font-medium">Home</p>
      </button>

      {/* Overview */}
      <button 
        onClick={onNavigateInsights}
        className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] py-1 transition-colors ${
          activeTab === 'overview' 
            ? 'text-[#E6E1E5]' 
            : 'text-[#938F99] hover:text-[#E6E1E5]'
        }`}
      >
        <ChartBar 
          size={22} 
          weight={activeTab === 'overview' ? 'regular' : 'light'} 
          className={activeTab === 'overview' ? 'text-[#E6E1E5]' : 'opacity-60 hover:opacity-100 transition-opacity'} 
        />
        <p className="text-[11px] font-medium">Overview</p>
      </button>

      {/* Add Button - Center & Elevated */}
      <button
        onClick={onNavigateAdd}
        className="flex flex-col items-center justify-center -mt-5"
      >
        <div className="bg-[#EC5429] rounded-full p-3 shadow-lg hover:bg-[#F76538] active:scale-95 transition-all">
          <Plus size={22} weight="bold" className="text-white" />
        </div>
      </button>

      {/* History */}
      <button 
        onClick={onNavigateHistory}
        className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] py-1 transition-colors ${
          activeTab === 'history' 
            ? 'text-[#E6E1E5]' 
            : 'text-[#938F99] hover:text-[#E6E1E5]'
        }`}
      >
        <Notepad 
          size={22} 
          weight={activeTab === 'history' ? 'regular' : 'light'} 
          className={activeTab === 'history' ? 'text-[#E6E1E5]' : 'opacity-60 hover:opacity-100 transition-opacity'} 
        />
        <p className="text-[11px] font-medium">History</p>
      </button>

      {/* Settings */}
      <button 
        onClick={onNavigateSettings}
        className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] py-1 transition-colors ${
          activeTab === 'settings' 
            ? 'text-[#E6E1E5]' 
            : 'text-[#938F99] hover:text-[#E6E1E5]'
        }`}
      >
        <GearSix 
          size={22} 
          weight={activeTab === 'settings' ? 'regular' : 'light'} 
          className={activeTab === 'settings' ? 'text-[#E6E1E5]' : 'opacity-60 hover:opacity-100 transition-opacity'} 
        />
        <p className="text-[11px] font-medium">Settings</p>
      </button>
    </div>
  );
}
