export default function SkeletonDetail() {
  return (
    <div className="max-w-[720px] mx-auto px-6 py-12 mt-10 animate-pulse bg-white min-h-screen">
      
      {/* Author Meta Block */}
      <div className="flex gap-4 mb-8">
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        <div className="flex flex-col gap-2 justify-center">
          <div className="h-4 bg-gray-200 w-32 rounded"></div>
          <div className="h-3 bg-gray-200 w-24 rounded"></div>
        </div>
      </div>

      {/* Title */}
      <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
      <div className="h-10 bg-gray-200 rounded w-3/4 mb-8"></div>

      {/* Action Bar (Top) */}
      <div className="flex items-center justify-between border-y border-gray-100 py-3.5 mb-10">
        <div className="flex items-center gap-8">
          <div className="w-12 h-6 bg-gray-200 rounded"></div>
          <div className="w-12 h-6 bg-gray-200 rounded"></div>
        </div>
        <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
      </div>

      {/* Main Content Paragraphs */}
      <div className="flex flex-col gap-4 mb-12">
        <div className="h-5 bg-gray-200 w-full rounded"></div>
        <div className="h-5 bg-gray-200 w-full rounded"></div>
        <div className="h-5 bg-gray-200 w-5/6 rounded"></div>
      </div>
      
      {/* Image Block */}
      <div className="h-64 md:h-96 bg-gray-200 rounded w-full mb-12"></div>

      <div className="flex flex-col gap-4 mb-12">
        <div className="h-5 bg-gray-200 w-full rounded"></div>
        <div className="h-5 bg-gray-200 w-full rounded"></div>
        <div className="h-5 bg-gray-200 w-4/5 rounded"></div>
      </div>

      {/* Tags */}
      <div className="flex gap-3 mb-8">
        <div className="w-20 h-8 bg-gray-200 rounded-full"></div>
        <div className="w-24 h-8 bg-gray-200 rounded-full"></div>
        <div className="w-16 h-8 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  );
}
