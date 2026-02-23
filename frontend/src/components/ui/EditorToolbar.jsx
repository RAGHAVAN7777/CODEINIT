import React, { useState, useEffect } from 'react';
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    List,
    ListOrdered,
    Quote,
    Image as ImageIcon,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Code
} from 'lucide-react';

export const EditorToolbar = ({ onCommand }) => {
    const [activeStates, setActiveStates] = useState({});

    const updateActiveStates = () => {
        const states = {
            bold: document.queryCommandState('bold'),
            italic: document.queryCommandState('italic'),
            underline: document.queryCommandState('underline'),
            strikeThrough: document.queryCommandState('strikeThrough'),
            justifyLeft: document.queryCommandState('justifyLeft'),
            justifyCenter: document.queryCommandState('justifyCenter'),
            justifyRight: document.queryCommandState('justifyRight'),
            orderedList: document.queryCommandState('insertOrderedList'),
            unorderedList: document.queryCommandState('insertUnorderedList'),
        };
        setActiveStates(states);
    };

    useEffect(() => {
        document.addEventListener('selectionchange', updateActiveStates);
        return () => document.removeEventListener('selectionchange', updateActiveStates);
    }, []);

    const executeCommand = (cmd, val) => {
        onCommand(cmd, val);
        setTimeout(updateActiveStates, 10);
    };

    return (
        <div className="flex flex-wrap items-center gap-1 bg-[#E2E2E2] p-1.5 rounded-t-xl border-x border-t border-border shadow-sm w-full mx-auto mb-[-1px]">
            {/* Basic Formatting */}
            <div className="flex items-center gap-0.5 pr-2 border-r border-slate-300">
                <ToolbarButton icon={Bold} active={activeStates.bold} onClick={() => executeCommand('bold')} />
                <ToolbarButton icon={Italic} active={activeStates.italic} onClick={() => executeCommand('italic')} />
                <ToolbarButton icon={Underline} active={activeStates.underline} onClick={() => executeCommand('underline')} />
                <ToolbarButton icon={Strikethrough} active={activeStates.strikeThrough} onClick={() => executeCommand('strikeThrough')} />
            </div>

            {/* Alignment */}
            <div className="flex items-center gap-0.5 px-2 border-r border-slate-300">
                <ToolbarButton icon={AlignLeft} active={activeStates.justifyLeft} onClick={() => executeCommand('justifyLeft')} />
                <ToolbarButton icon={AlignCenter} active={activeStates.justifyCenter} onClick={() => executeCommand('justifyCenter')} />
                <ToolbarButton icon={AlignRight} active={activeStates.justifyRight} onClick={() => executeCommand('justifyRight')} />
            </div>

            {/* Lists */}
            <div className="flex items-center gap-0.5 px-2 border-r border-slate-300">
                <ToolbarButton icon={ListOrdered} active={activeStates.orderedList} onClick={() => executeCommand('insertOrderedList')} />
                <ToolbarButton icon={List} active={activeStates.unorderedList} onClick={() => executeCommand('insertUnorderedList')} />
            </div>

            {/* Misc */}
            <div className="flex items-center gap-0.5 pl-2 border-r border-slate-300 pr-2">
                <ToolbarButton icon={Quote} onClick={() => executeCommand('formatBlock', '<blockquote>')} />
                <ToolbarButton icon={ImageIcon} onClick={() => alert('Image Upload System Integrated')} />
            </div>

            {/* Big Feature: Code Snippet */}
            <div className="flex-1 flex justify-end">
                <button
                    onClick={() => onCommand('insertCode')}
                    className="flex items-center gap-2 px-6 py-1.5 bg-slate-900 text-white rounded-lg font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all shadow-xl shadow-black/10 hover:scale-105 active:scale-95 group"
                >
                    <Code size={16} className="text-primary group-hover:rotate-12 transition-transform" />
                    Code Snippet
                </button>
            </div>
        </div>
    );
};

const ToolbarButton = ({ icon: Icon, onClick, active = false }) => (
    <button
        onClick={onClick}
        className={`p-1.5 rounded transition-all transition-colors duration-200 ${active
            ? 'bg-primary text-primary-foreground shadow-md scale-105'
            : 'text-slate-800 hover:bg-white/50'
            }`}
    >
        <Icon size={16} strokeWidth={active ? 3 : 2.5} />
    </button>
);
