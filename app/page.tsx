import { TopBar } from "@/components/editor/TopBar";
import { SidePanel } from "@/components/editor/SidePanel";
import { MapCanvas } from "@/components/editor/MapCanvas";
import { MapFrame } from "@/components/editor/MapFrame";
import { OnboardingOverlay } from "@/components/editor/OnboardingOverlay";

import { ExportModal } from "@/components/editor/ExportModal";

export default function Home() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopBar />
      <main className="flex flex-1 overflow-hidden">
        <SidePanel />
        <div className="flex-1 relative bg-bg-base overflow-hidden">
          <MapFrame>
            <MapCanvas />
          </MapFrame>
        </div>
      </main>
      <ExportModal />
      <OnboardingOverlay />
    </div>
  );
}
