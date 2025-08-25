import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Scissors, 
  Sparkles, 
  Expand, 
  Palette, 
  Download,
  Layers,
  Wand2
} from 'lucide-react';

export const FuturisticAIEditorWindow = ({ 
  title = "AI Vision Studio", 
  className = "",
  showProcessing = true 
}) => {
  const [activeTool, setActiveTool] = useState('bg-remove');
  const [isProcessing, setIsProcessing] = useState(false);

  // Simulate AI processing
  useEffect(() => {
    if (showProcessing) {
      const interval = setInterval(() => {
        setIsProcessing(true);
        setTimeout(() => setIsProcessing(false), 2000);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [showProcessing]);

  const tools = [
    {
      id: 'bg-remove',
      name: 'Neural Background Removal',
      icon: Scissors,
      color: 'green-400',
      description: 'AI-powered background detection'
    },
    {
      id: 'enhance',
      name: 'Quantum Image Enhancement',
      icon: Sparkles,
      color: 'blue-400',
      description: 'Ultra-resolution upscaling'
    },
    {
      id: 'resize',
      name: 'Smart Resize Matrix',
      icon: Expand,
      color: 'purple-500',
      description: 'Content-aware scaling'
    },
    {
      id: 'color',
      name: 'Molecular Color Grading',
      icon: Palette,
      color: 'cyan-400',
      description: 'Professional color science'
    },
    {
      id: 'magic',
      name: 'Reality Synthesis',
      icon: Wand2,
      color: 'emerald-400',
      description: 'Generate missing content'
    }
  ];

  const ToolButton = ({ tool, isActive, onClick }) => {
    const Icon = tool.icon;
    
    return (
      <motion.button
        className={`
          relative w-12 h-12 rounded-lg backdrop-blur-lg bg-white/5 border transition-all duration-300
          ${isActive 
            ? `border-${tool.color} shadow-[0_0_20px_var(--tw-shadow-color)] shadow-${tool.color}/50` 
            : 'border-white/20 hover:border-white/40'
          }
          group
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onClick(tool.id)}
        data-tooltip={tool.name}
      >
        <Icon 
          className={`w-5 h-5 mx-auto transition-colors duration-300 ${
            isActive ? `text-${tool.color}` : 'text-gray-400 group-hover:text-white'
          }`} 
        />
        
        {/* Tooltip */}
        <div className="absolute left-14 top-1/2 transform -translate-y-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
          {tool.name}
        </div>
        
        {/* Active indicator */}
        {isActive && (
          <motion.div
            className={`absolute -right-1 -top-1 w-3 h-3 bg-${tool.color} rounded-full`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          />
        )}
      </motion.button>
    );
  };

  return (
    <motion.div
      className={`relative w-full max-w-4xl mx-auto ${className}`}
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      {/* Browser Window Container */}
      <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl shadow-2xl overflow-hidden">
        
        {/* Title Bar */}
        <motion.div 
          className="flex items-center justify-between px-6 py-4 bg-black/20 border-b border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Window Controls */}
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          
          {/* Title */}
          <h3 className="text-white font-semibold bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
            {title}
          </h3>
          
          {/* Status Indicator */}
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-blue-400 animate-pulse' : 'bg-green-400'}`}></div>
            <span className="text-xs text-gray-400">
              {isProcessing ? 'Processing...' : 'Ready'}
            </span>
          </div>
        </motion.div>

        {/* Main Interface */}
        <div className="flex flex-col lg:flex-row min-h-[400px]">
          
          {/* Tools Panel */}
          <motion.div 
            className="w-full lg:w-20 bg-black/10 border-r border-white/10 p-4"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="flex flex-row lg:flex-col space-x-3 lg:space-x-0 lg:space-y-3 overflow-x-auto lg:overflow-x-visible">
              {tools.map((tool, index) => (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <ToolButton
                    tool={tool}
                    isActive={activeTool === tool.id}
                    onClick={setActiveTool}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Canvas Area */}
          <motion.div 
            className="flex-1 relative p-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            
            {/* Canvas Container */}
            <div className="relative w-full h-80 lg:h-96 bg-slate-800 rounded-lg border border-white/10 overflow-hidden group">
              
              {/* Grid Pattern Background */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px'
                }}
              />
              
              {/* Sample Image/Content */}
              <div className="absolute inset-4 bg-gradient-to-br from-green-400/20 via-blue-400/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                
                {/* Processing Overlay */}
                {isProcessing && (
                  <motion.div
                    className="absolute inset-0 bg-blue-400/10 backdrop-blur-sm flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-blue-400 font-semibold">Neural Processing...</p>
                      <div className="w-32 h-1 bg-white/20 rounded-full mt-2 overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-blue-400 to-green-400"
                          initial={{ width: '0%' }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 2, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {/* Sample Content */}
                {!isProcessing && (
                  <motion.div 
                    className="text-center text-white/60"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Layers className="w-16 h-16 mx-auto mb-4 text-white/40" />
                    <p className="text-lg font-medium">Drop your image here</p>
                    <p className="text-sm text-white/40 mt-2">or click to browse</p>
                  </motion.div>
                )}
                
                {/* Neon Frame */}
                <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-green-400/50 transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]" />
              </div>
              
              {/* Corner Indicators */}
              <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-green-400/50"></div>
              <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-blue-400/50"></div>
              <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-purple-500/50"></div>
              <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-cyan-400/50"></div>
            </div>
            
            {/* Action Bar */}
            <motion.div 
              className="flex items-center justify-between mt-4 px-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <div className="text-sm text-gray-400">
                {tools.find(t => t.id === activeTool)?.description || 'Select a tool to begin'}
              </div>
              
              <div className="flex space-x-2">
                <motion.button
                  className="px-4 py-2 bg-gradient-to-r from-green-400 to-blue-400 text-black font-semibold rounded-lg text-sm hover:from-blue-400 hover:to-purple-500 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Process
                </motion.button>
                
                <motion.button
                  className="p-2 backdrop-blur-lg bg-white/10 border border-white/20 rounded-lg hover:border-green-400 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-300"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download className="w-4 h-4 text-gray-400" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Floating Elements */}
      <motion.div
        className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-full blur-sm opacity-60"
        animate={{ 
          y: [0, -10, 0],
          x: [0, 5, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: 'easeInOut' 
        }}
      />
      
      <motion.div
        className="absolute -bottom-4 -right-4 w-6 h-6 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full blur-sm opacity-60"
        animate={{ 
          y: [0, 10, 0],
          x: [0, -5, 0],
          scale: [1, 0.8, 1]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: 'easeInOut',
          delay: 1
        }}
      />
    </motion.div>
  );
};
