export default function Loading() {
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">AI関連ニュース</h1>
        
        <div className="space-y-6">
          {[1, 2, 3, 4, 5].map((index) => (
            <div 
              key={index}
              className="bg-white border rounded-lg p-6 shadow-sm animate-pulse"
            >
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
} 