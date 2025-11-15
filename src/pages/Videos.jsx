import { Play, FileVideo } from 'lucide-react'

export default function Videos() {
  const videos = [
    {
      id: 1,
      title: 'Quantum Interference Experiment',
      description: 'Demonstration of quantum interference patterns in a double-slit setup.',
      duration: '5:32',
      thumbnail: '🔬'
    },
    {
      id: 2,
      title: 'Thermodynamics Analysis',
      description: 'Detailed analysis of energy conversion systems and efficiency measurements.',
      duration: '8:15',
      thumbnail: '🔥'
    },
    {
      id: 3,
      title: 'Electromagnetic Field Visualization',
      description: 'Visual representation of electromagnetic fields in circuit design.',
      duration: '6:48',
      thumbnail: '⚡'
    },
    {
      id: 4,
      title: 'Final Presentation',
      description: 'Complete project presentation covering all research findings and conclusions.',
      duration: '15:30',
      thumbnail: '📊'
    }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <FileVideo className="w-10 h-10 text-red-600" />
              Video Library
            </h1>
            <p className="text-xl text-gray-600">Watch experiments and presentations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {videos.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-xl overflow-hidden card-shadow hover:card-shadow-hover transition-all border border-gray-100"
              >
                <div className="relative bg-gray-100 aspect-video flex items-center justify-center">
                  <div className="text-6xl">{video.thumbnail}</div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-40 transition-opacity">
                    <div className="bg-red-600 rounded-full p-4 hover:bg-red-700 transition-colors cursor-pointer">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                    {video.duration}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{video.title}</h3>
                  <p className="text-gray-600">{video.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-red-50 rounded-xl p-8 border border-red-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Video Player</h2>
            <div className="bg-black rounded-lg overflow-hidden aspect-video">
              <video
                controls
                className="w-full h-full"
                poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1280 720'%3E%3Crect fill='%23DC2626' width='1280' height='720'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='48' fill='white'%3EVideo Placeholder%3C/text%3E%3C/svg%3E"
              >
                <source src="#" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <p className="text-gray-600 mt-4 text-center">
              Upload your video files to see them play here
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

