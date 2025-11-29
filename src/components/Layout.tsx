import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import { usePlayer } from '../context/PlayerContext';
import { Link, useLocation } from 'react-router-dom';
import { updateProgress, getUserSettings } from '../services/api';
import { parseTimeToSeconds, formatTimeFromSeconds } from '../utils/time';
import SidebarItem from './common/SidebarItem';
import DecoCorner from './common/DecoCorner';
import {
    Play, Pause, SkipForward, SkipBack,
    Library, Upload, Settings, Search,
    Disc, Volume2, Sun, Moon, List, X
} from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { theme, toggleTheme, t } = useTheme();
    const {
        currentBook, isPlaying, setIsPlaying, togglePlay,
        currentTime, setCurrentTime,
        duration, setDuration,
        currentChapterIndex, setCurrentChapterIndex,
        audioRef
    } = usePlayer();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [showChapters, setShowChapters] = useState<boolean>(false);
    const [skipInterval, setSkipInterval] = useState<number>(30); 

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const settings = await getUserSettings();
                setSkipInterval(settings.skipInterval);
            } catch (error) {
                console.error('Error loading settings:', error);
            }
        };
        loadSettings();
    }, []);



    const isMultiFile = useMemo(() => {
        return currentBook && currentBook.chapters ? currentBook.chapters.some((c: any) => c.fileName) : false;
    }, [currentBook]);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch((e: any) => console.warn("Play failed:", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, audioRef]);

    useEffect(() => {
        if (currentBook && audioRef.current) {
            const streamUrl = `${process.env.REACT_APP_BACKEND_URL}/api/audiobooks/${currentBook.id}/stream`;

            if (!isMultiFile && audioRef.current.src !== streamUrl) {
                audioRef.current.src = streamUrl;
                audioRef.current.load();
                if (isPlaying) audioRef.current.play().catch(console.warn);
            }
        }
    }, [currentBook, isMultiFile, audioRef, isPlaying]);

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const time = audioRef.current.currentTime;
            setCurrentTime(time);
            setDuration(audioRef.current.duration || 0);

            if (!isMultiFile && currentBook && currentBook.chapters.length > 1) {
                const foundIndex = currentBook.chapters.findIndex((c: any) => {
                    const start = parseTimeToSeconds(c.startTime);
                    const end = parseTimeToSeconds(c.endTime);
                    return time >= start && time < end;
                });
                if (foundIndex !== -1 && foundIndex !== currentChapterIndex) {
                    setCurrentChapterIndex(foundIndex);
                }
            }
        }
    };

    const handleEnded = () => {
        if (currentBook && currentChapterIndex < currentBook.chapters.length - 1) {
            playChapter(currentChapterIndex + 1);
        } else {
            setIsPlaying(false);
        }
    };

    const playChapter = async (index: number) => {
        if (!currentBook || !currentBook.chapters[index] || !audioRef.current) return;

        const chapter = currentBook.chapters[index];

        try {
            if (isMultiFile) {
                const streamUrl = `${process.env.REACT_APP_BACKEND_URL}/api/audiobooks/${currentBook.id}/stream?startTime=${encodeURIComponent(chapter.startTime)}`;
                audioRef.current.src = streamUrl;
                await audioRef.current.load();
            } else {
                const startTime = parseTimeToSeconds(chapter.startTime);
                audioRef.current.currentTime = startTime;
            }

            setCurrentChapterIndex(index);
            setIsPlaying(true);
            await audioRef.current.play();
        } catch (error) {
            console.error("Error playing chapter:", error);
        }
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!audioRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percent = x / rect.width;
        const newTime = percent * duration;
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const skip = (seconds: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime += seconds;
        }
    };



    return (
        <div className={`flex h-screen w-full ${t.bg} ${t.textMain} font-sans overflow-hidden ${t.selection} transition-colors duration-500`}>

            <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
                onError={(e: any) => console.error("Audio Error:", e)}
            />

            <div className={`w-20 lg:w-64 border-r ${t.border} flex flex-col flex-shrink-0 z-20 ${t.bgSecondary} transition-colors duration-500`}>
                <div className={`h-24 flex items-center justify-center lg:justify-start lg:px-8 border-b ${t.border}`}>
                    <Link to="/" className="flex items-center">
                        <div className={`w-8 h-8 border-2 ${theme === 'dark' ? 'border-red-600' : 'border-amber-400'} rotate-45 flex items-center justify-center mr-0 lg:mr-4`}>
                            <div className={`w-4 h-4 ${theme === 'dark' ? 'bg-red-900/40' : 'bg-amber-400/40'} -rotate-45`} />
                        </div>
                        <h1 className={`hidden lg:block font-serif text-xl tracking-widest ${t.textHighlight}`}>
                            AUDIO<span className={t.textAccent}>DECO</span>
                        </h1>
                    </Link>
                </div>

                <nav className="flex-1 py-8 px-2">
                    <SidebarItem icon={Library} label="Library" path="/library" />
                    <SidebarItem icon={Upload} label="Import" path="/upload" />
                    <SidebarItem icon={Settings} label="System" path="/settings" />
                </nav>

                <div className={`p-4 border-t ${t.border} flex flex-col gap-4`}>
                    <button
                        onClick={toggleTheme}
                        className={`w-full flex items-center justify-center lg:justify-start gap-3 p-3 ${t.bgTertiary} ${t.border} hover:${t.borderAccent} transition-colors`}
                    >
                        {theme === 'dark' ? <Sun size={16} className="text-stone-400" /> : <Moon size={16} className="text-purple-700" />}
                        <span className={`hidden lg:inline text-xs uppercase tracking-widest ${t.textMuted}`}>
                            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                        </span>
                    </button>

                    <div className={`${t.bgTertiary} p-4 border ${t.border} hidden lg:block`}>
                        <p className={`text-[10px] uppercase tracking-widest ${t.textMuted} mb-1`}>Server Status</p>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className={`text-xs ${t.textMuted}`}>Online • v1.0.4</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col relative transition-colors duration-500">
                <div className={`absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] ${theme === 'dark' ? 'invert-0' : 'invert'}`}></div>

                <header className={`h-24 border-b ${t.border} flex items-center justify-between px-8 ${t.bgSecondary}/80 backdrop-blur-md z-10 transition-colors duration-500`}>
                    <div className={`flex items-center gap-4 ${t.textMuted}`}>
                        <span className="uppercase tracking-[0.3em] text-xs font-semibold">Self-Hosted Manager</span>
                        <div className={`h-px w-12 ${theme === 'dark' ? 'bg-red-500/20' : 'bg-amber-500/20'}`}></div>
                    </div>

                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="SEARCH ARCHIVE..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`bg-transparent border-b ${t.border} pl-8 pr-4 py-2 w-64 text-sm ${t.textMain} focus:outline-none focus:${t.borderAccent} transition-colors placeholder:${t.textMuted} placeholder:text-xs placeholder:tracking-widest`}
                        />
                        <Search className={`absolute left-0 top-2 ${t.textMuted} group-focus-within:${t.textAccent} transition-colors`} size={16} />
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 pb-32">
                    {children}
                </main>
            </div>

            {showChapters && currentBook && (
                <div className={`fixed bottom-24 right-8 w-80 max-h-96 ${t.bgSecondary} border ${t.border} shadow-2xl z-50 flex flex-col`}>
                    <div className={`p-4 border-b ${t.border} flex justify-between items-center`}>
                        <h3 className={`font-serif ${t.textMain}`}>Chapters</h3>
                        <button onClick={() => setShowChapters(false)} className={t.textMuted}><X size={16} /></button>
                    </div>
                    <div className="overflow-y-auto flex-1 p-2 custom-scrollbar">
                        {currentBook.chapters.map((chapter: any, index: number) => (
                            <button
                                key={index}
                                onClick={() => playChapter(index)}
                                className={`w-full text-left p-3 text-sm mb-1 transition-colors ${index === currentChapterIndex
                                    ? `${t.accentBg} ${t.textAccent} border ${t.borderAccent}`
                                    : `${t.textMuted} hover:${t.bgTertiary}`
                                    }`}
                            >
                                <div className="flex justify-between">
                                    <span className="truncate font-medium">{index + 1}. {chapter.title}</span>
                                    <span className="opacity-70 text-xs">{chapter.startTime}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className={`fixed bottom-0 left-0 right-0 h-24 ${t.bgSecondary} border-t ${t.border} z-50 flex items-center px-4 md:px-8 gap-8 backdrop-blur-xl transition-colors duration-500`}>
                <div className="w-1/4 hidden md:flex items-center gap-4">
                    {currentBook ? (
                        <>
                            <div className={`w-12 h-12 bg-stone-800 border ${t.border} flex-shrink-0 relative overflow-hidden`}>
                                {currentBook.coverPath && (
                                    <img src={`${process.env.REACT_APP_BACKEND_URL}${currentBook.coverPath}`} alt="Cover" className="w-full h-full object-cover" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent"></div>
                            </div>
                            <div className="overflow-hidden">
                                <h4 className={`${t.textMain} font-serif text-sm truncate`}>{currentBook.title}</h4>
                                <p className={`${t.textMuted} text-[10px] uppercase tracking-widest truncate`}>{currentBook.author}</p>
                            </div>
                        </>
                    ) : (
                        <div className={`flex items-center gap-3 ${t.textMuted}`}>
                            <Disc className="animate-spin-slow opacity-20" />
                            <span className="text-xs uppercase tracking-widest">Select a title</span>
                        </div>
                    )}
                </div>

                <div className="flex-1 flex flex-col items-center justify-center gap-2">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => skip(-skipInterval)}
                            className={`${t.textMuted} ${t.accentHover} transition-colors flex flex-col items-center`}
                            title={`Skip back ${skipInterval}s`}
                        >
                            <SkipBack size={18} />
                            <span className="text-[8px] mt-0.5">{skipInterval}s</span>
                        </button>
                        <button
                            onClick={togglePlay}
                            className={`w-10 h-10 border flex items-center justify-center transition-all duration-300
                                ${currentBook
                                    ? `${t.playBtn}`
                                    : `${t.border} ${t.textMuted} cursor-not-allowed`}`
                            }
                        >
                            {isPlaying ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
                        </button>
                        <button
                            onClick={() => skip(skipInterval)}
                            className={`${t.textMuted} ${t.accentHover} transition-colors flex flex-col items-center`}
                            title={`Skip forward ${skipInterval}s`}
                        >
                            <SkipForward size={18} />
                            <span className="text-[8px] mt-0.5">{skipInterval}s</span>
                        </button>
                    </div>

                    <div className={`w-full max-w-md flex items-center gap-3 text-[10px] ${t.textMuted} font-mono`}>
                        <span>{formatTimeFromSeconds(currentTime)}</span>
                        <div
                            className={`flex-1 h-[2px] ${t.border} relative group cursor-pointer bg-gray-700/20`}
                            onClick={handleSeek}
                        >
                            <div
                                className={`absolute left-0 top-0 bottom-0 ${t.progressFill}`}
                                style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                            ></div>
                            <div
                                className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${t.bgSecondary} border ${t.borderAccent} opacity-0 group-hover:opacity-100 transition-opacity shadow-sm`}
                                style={{ left: `${(currentTime / (duration || 1)) * 100}%` }}
                            ></div>
                        </div>
                        <span>{formatTimeFromSeconds(duration)}</span>
                    </div>
                </div>

                <div className="w-1/4 hidden md:flex items-center justify-end gap-4">
                    <button
                        onClick={() => setShowChapters(!showChapters)}
                        className={`${t.textMuted} ${t.accentHover} transition-colors ${showChapters ? t.textAccent : ''}`}
                        title="Chapters"
                    >
                        <List size={18} />
                    </button>
                    <div className={`w-px h-8 ${t.border}`}></div>
                    <Volume2 size={16} className={`${t.textMuted}`} />
                    <div className={`w-24 h-[1px] ${t.border}`}>
                        <div className={`w-2/3 h-full ${theme === 'dark' ? 'bg-red-800' : 'bg-purple-300'}`}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Layout;