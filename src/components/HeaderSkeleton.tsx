// HeaderSkeleton.jsx
import { CustomSkeleton } from "./SkeletonLoading"; // adjust path as needed

const HeaderSkeleton = () => (
  <header className="bg-white border-b border-gray-200 py-4 lg:py-6 px-4 lg:px-6">
    <div className="flex flex-col">
      {/* Title row: square pulse icon + title */}
      <div className="flex items-center mb-2">
        <div className="animate-pulse block lg:hidden h-6 w-6 bg-gray-200 mr-3 lg:mr-4" />
        <CustomSkeleton className="h-6 w-32" />
      </div>

      {/* Description hidden when <1024px */}
      <CustomSkeleton className="hidden lg:block h-4 w-80" />
    </div>
  </header>
);

export default HeaderSkeleton;
