
import React from 'react';

const DropletIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 sm:h-12 sm:w-12 text-brand-cyan" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.62 7.763c.273-.382.72-.613 1.21-.613h4.34c.49 0 .937.231 1.21.613l.683 1.025a.5.5 0 01-.424.762H6.361a.5.5 0 01-.424-.762l.683-1.025zM10 14a.5.5 0 01-.5-.5v-2.5a.5.5 0 011 0V13.5a.5.5 0 01-.5.5z" clipRule="evenodd" />
    </svg>
);

export const Header: React.FC = () => {
    return (
        <header className="text-center p-4 border-2 border-brand-cyan rounded-lg bg-slate-800/20 shadow-lg shadow-brand-cyan/20">
            <div className="flex justify-center items-center gap-4">
                <DropletIcon />
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-pink">
                    MilkDrop Alchemy
                </h1>
            </div>
            <p className="mt-4 text-md sm:text-lg text-slate-300 max-w-3xl mx-auto">
                Transmute legacy <span className="font-bold text-white">.milk</span> presets into modern, powerful assets. Generate GLSL shaders, JSON metadata, and video loops from your favorite classic visuals.
            </p>
        </header>
    );
};
