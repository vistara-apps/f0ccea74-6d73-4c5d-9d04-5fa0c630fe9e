'use client';

import { Cube, Hexagon, Circle, Square } from 'lucide-react';

export function FloatingElements() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Floating cubes and shapes */}
      <div className="floating-element top-20 left-10 animate-float">
        <Cube size={32} className="text-purple-400" />
      </div>
      <div className="floating-element top-40 right-20 animate-float-delayed">
        <Hexagon size={24} className="text-blue-400" />
      </div>
      <div className="floating-element top-60 left-1/4 animate-float">
        <Square size={20} className="text-pink-400" />
      </div>
      <div className="floating-element bottom-40 right-10 animate-float-delayed">
        <Circle size={28} className="text-cyan-400" />
      </div>
      <div className="floating-element bottom-60 left-16 animate-float">
        <Cube size={36} className="text-purple-300" />
      </div>
      <div className="floating-element top-32 right-1/3 animate-float-delayed">
        <Hexagon size={30} className="text-blue-300" />
      </div>
      
      {/* Additional floating elements for mobile */}
      <div className="floating-element top-16 right-8 animate-float md:hidden">
        <Square size={16} className="text-pink-300" />
      </div>
      <div className="floating-element bottom-32 left-8 animate-float-delayed md:hidden">
        <Circle size={20} className="text-cyan-300" />
      </div>
    </div>
  );
}
