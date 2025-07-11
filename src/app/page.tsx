'use client';

import { useState, useEffect, useRef } from 'react';
import TrainingSection from '@/components/TrainingSection';
import FloatingChatbot from '@/components/FloatingChatbot';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, Bot, Upload, MessageSquare, Settings, ChevronDown } from 'lucide-react';

export default function Home() {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-white via-blue-50/50 to-purple-50/30 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-3xl"></div>
      </div>
      {/* Enhanced Header with gradient and better styling */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 shadow-lg">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Welcome back!</p>
                <p className="text-xs text-blue-100">{user?.email}</p>
              </div>
            </div>
            <div className="hidden md:block w-px h-8 bg-white/20"></div>
            <div className="hidden md:flex items-center gap-2 text-white/90">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">AI Assistant Online</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <Bot className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">AI Training Portal</span>
            </div>
            
            {/* Enhanced User Menu */}
            <div className="relative" ref={userMenuRef}>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleUserMenu}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur-sm"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{user?.email?.split('@')[0]}</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 z-50 animate-in slide-in-from-top-2">
                  <div className="py-2">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-900">{user?.email}</p>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span>Active Session</span>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content with top padding for header */}
      <div className="w-full flex pt-20">
        {/* Left: Training Section (wider) */}
        <div className="w-full md:w-3/4 lg:w-2/3 flex flex-col">
          <TrainingSection />
        </div>
        {/* Enhanced Right: Info panel */}
        <div className="hidden md:block flex-1 p-6">
          <div className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-3xl shadow-2xl border border-white/50 backdrop-blur-sm p-8 h-fit">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
                <p className="text-sm text-gray-500">Access your tools instantly</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {/* Upload Documents Card */}
              <div className="group relative overflow-hidden bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-blue-200/50 hover:border-blue-300/70 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">Upload Documents</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">Train your chatbot with new data and expand its knowledge base</p>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-xs text-blue-600 font-medium">Ready to upload</span>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Chat with AI Card */}
              <div className="group relative overflow-hidden bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-200/50 hover:border-green-300/70 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">Chat with AI</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">Test your trained chatbot and get instant responses</p>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-600 font-medium">AI Online</span>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Analytics Card */}
              <div className="group relative overflow-hidden bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-200/50 hover:border-purple-300/70 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">Manage Settings</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">Configure your chatbot settings and preferences</p>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-xs text-purple-600 font-medium">Configured</span>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Logout Section */}
              <div className="pt-6 border-t border-gray-200/50">
                <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-4 border border-red-200/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                      <LogOut className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">Sign Out</h3>
                      <p className="text-sm text-gray-600">End your current session</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogout}
                      className="bg-white/80 hover:bg-white border-red-200 text-red-600 hover:text-red-700 hover:border-red-300 transition-all duration-200"
                    >
                      Sign Out
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Chatbot (always visible) */}
      <FloatingChatbot />
    </div>
  );
}
