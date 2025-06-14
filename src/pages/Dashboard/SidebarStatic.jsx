 import SidebarContent from './SidebarContent';

export default function SidebarStatic() {
  return (
      <div className="lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-56 lg:max-w-56 lg:flex-col overflow-hidden">
    <SidebarContent />
     </div>
  );
}
