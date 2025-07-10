import TrainingSection from '@/components/TrainingSection';
import FloatingChatbot from '@/components/FloatingChatbot';

export default function Home() {
  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-white to-blue-50">
      {/* Left: Training Section (wider) */}
      <div className="w-full md:w-3/4 lg:w-2/3 flex flex-col">
        <TrainingSection />
      </div>
      {/* Right: Empty for now, can add illustration or info later */}
      <div className="hidden md:block flex-1" />
      {/* Floating Chatbot (always visible) */}
      <FloatingChatbot />
    </div>
  );
}
