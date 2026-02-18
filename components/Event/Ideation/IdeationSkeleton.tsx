const IdeationEventSkeleton = () => {
  return (
    <div className=" flex flex-col animate-pulse">
      <div className="flex flex-row justify-between items-center">
        <div className="flex gap-3 items-center flex-row">
          <div className="min-h-8 w-64 bg-base-200 rounded-md" />

          {/* Badge */}
          <div className="h-6 w-20 bg-base-200 rounded-full" />
        </div>

        {/* Action Button */}
        <div className="h-10 w-32 bg-base-200 rounded-md" />
      </div>

      {/* Required Resources Title */}
      <div className="mt-10 mb-4">
        <div className="h-6 w-48 bg-base-200 rounded-md" />
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-5 border border-base-300 rounded-xl space-y-3"
          >
            <div className="h-5 w-40 bg-base-200 rounded-md" />
            <div className="h-4 w-full bg-base-200 rounded-md" />
            <div className="h-4 w-3/4 bg-base-200 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default IdeationEventSkeleton;
