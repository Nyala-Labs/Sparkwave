import SidebarLinks from "@/components/SidebarLinks";

import { ReactNode, Suspense } from "react";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content bg-base-300">
        <div className="px-5 py-8 min-h-screen">{children}</div>
      </div>

      <div className="drawer-side is-drawer-close:overflow-visible">
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="flex min-h-full flex-col items-start bg-base-200  is-drawer-close:w-14 is-drawer-open:w-64">
          <ul className="menu w-full grow gap-3 pt-10 ">
            <Suspense fallback={<div>Loading...</div>}>
              <SidebarLinks />
            </Suspense>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
