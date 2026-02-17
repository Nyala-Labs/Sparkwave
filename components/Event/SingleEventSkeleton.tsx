export default function SingleEventSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-64 bg-base-500 rounded mb-8" />

      <div className="flex flex-col items-center my-10 w-full">
        <ul className="timeline justify-center">
          {Array.from({ length: 6 }).map((_, index) => (
            <li key={index} className="max-w-40 w-full">
              {index !== 0 && <hr className="w-full bg-base-300" />}

              <div className="timeline-start timeline-box">
                <div className="flex flex-col space-y-2">
                  <div className="h-5 w-24 bg-base-300 rounded" />
                  <div className="h-3 w-16 bg-base-300 rounded" />
                </div>
              </div>

              <div className="timeline-middle">
                <div className="h-6 w-6 rounded-full bg-base-300 border border-base-300" />
              </div>

              {index !== 3 && <hr className="w-full bg-base-300" />}
            </li>
          ))}
        </ul>
      </div>

      <div className="h-6 w-40 bg-base-500 rounded mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border bg-base-200 p-5 shadow-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-2">
                <div className="h-5 w-32 bg-base-300 rounded" />
                <div className="h-3 w-20 bg-base-300 rounded" />
              </div>
              <div className="h-6 w-6 bg-base-300 rounded" />
            </div>

            <div className="h-3 w-24 bg-base-300 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
