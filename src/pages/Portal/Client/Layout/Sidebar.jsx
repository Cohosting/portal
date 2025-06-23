// Sidebar.jsx
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Navigation from "./Navigation";
import { X } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const Sidebar = ({ portal_apps, portal, computedColors }) => {
    const { open, setOpen } = useSidebar();
    
    return (
        <Sheet  open={open} onOpenChange={setOpen}>
 
 
            <SheetContent  side="left" className="p-0 w-full max-w-[240px]  sm:max-w-[240px]">
                <div className="relative flex w-full flex-1">
                    <Navigation portal={portal} portal_apps={portal_apps} computedColors={computedColors} />
                </div>
            </SheetContent>
        </Sheet>
    );
}

export default Sidebar;