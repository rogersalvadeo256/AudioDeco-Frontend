import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getAudiobook, addBookmark, getBookmarks, deleteBookmark } from '../services/api';
import { usePlayer } from '../context/PlayerContext';
import { FaBookmark, FaList, FaPlay, FaPause, FaTrash } from 'react-icons/fa';

interface Bookmark {
    id: number;
    timestamp: string;
    note: string;
    createdAt: string;
}

const Player: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const {
        currentBook, isPlaying, togglePlay, playBook,
        currentTime, duration,
        currentChapterIndex, setCurrentChapterIndex,
        audioRef
    } = usePlayer();

    const [book, setBook] = useState<any>(null);
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [activeTab, setActiveTab] = useState<'chapters' | 'bookmarks'>('chapters');
    const [newNote, setNewNote] = useState<string>('');
    const [showNoteInput, setShowNoteInput] = useState<boolean>(false);

    const isCurrentBook = currentBook?.id === parseInt(id || '0');

    const loadBookmarks = useCallback(async () => {
        if (!id) return;
        try {
            const data = await getBookmarks(id);
            setBookmarks(data);
        } catch (error) {
            console.error('Error loading bookmarks:', error);
        }
    }, [id]);

    useEffect(() => {
        if (!id) return;
        getAudiobook(id).then(data => {
            setBook(data);
        });
        loadBookmarks();
    }, [id, loadBookmarks]);

    if (!id) return <div className="flex justify-center items-center h-screen text-deco-gold">Book not found</div>;

    const handlePlayPause = () => {
        if (isCurrentBook) {
            togglePlay();
        } else {
            playBook(book);
        }
    };

    const handleChapterClick = (index: number) => {
        if (isCurrentBook) {
            setCurrentChapterIndex(index);
        } else {
            playBook(book);
            setTimeout(() => setCurrentChapterIndex(index), 0);
        }
    };

    const formatTime = (seconds: number): string => {
        if (!seconds) return "00:00";
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleAddBookmark = async () => {
        if (!isCurrentBook || !audioRef.current) {
            alert("Play the book to add a bookmark.");
            return;
        }

        let timestampSeconds = audioRef.current.currentTime;

        const isMultiFile = book && book.chapters && book.chapters.some((c: any) => c.fileName);

        if (isMultiFile && currentChapterIndex >= 0 && book.chapters[currentChapterIndex]) {
            const currentChapter = book.chapters[currentChapterIndex];

            const parseTime = (timeStr: string): number => {
                if (!timeStr) return 0;
                const parts = timeStr.split(':');
                let seconds = 0;
                if (parts.length === 3) {
                    seconds += parseInt(parts[0]) * 3600;
                    seconds += parseInt(parts[1]) * 60;
                    seconds += parseFloat(parts[2]);
                } else if (parts.length === 2) {
                    seconds += parseInt(parts[0]) * 60;
                    seconds += parseFloat(parts[1]);
                }
                return seconds;
            };

            const chapterStartSeconds = parseTime(currentChapter.startTime);

            timestampSeconds = chapterStartSeconds + audioRef.current.currentTime;
        }

        const timeString = formatTime(timestampSeconds);
        const bookmark = {
            timestamp: timeString,
            note: newNote
        };

        try {
            await addBookmark(id, bookmark);
            setNewNote('');
            setShowNoteInput(false);
            loadBookmarks();
        } catch (error) {
            console.error('Error adding bookmark:', error);
        }
    };

    const handleDeleteBookmark = async (bookmarkId: number) => {
        try {
            await deleteBookmark(id, bookmarkId);
            loadBookmarks();
        } catch (error) {
            console.error('Error deleting bookmark:', error);
        }
    };

    const jumpToBookmark = (timestamp: string) => {
        if (!isCurrentBook) {
            playBook(book);
        }

        const parts = timestamp.split(':');
        let seconds = 0;
        if (parts.length === 3) {
            seconds = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
        } else if (parts.length === 2) {
            seconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
        }

        if (audioRef.current) {
            audioRef.current.currentTime = seconds;
            if (!isPlaying) togglePlay();
        }
    };

    if (!book) return <div className="flex justify-center items-center h-screen text-deco-gold">Loading Book Details...</div>;

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-100px)] overflow-hidden bg-deco-light-bg dark:bg-deco-dark-bg text-deco-light-text dark:text-deco-dark-text">
            <div className="w-full lg:w-1/2 p-6 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-deco-purple dark:border-deco-silver overflow-y-auto">
                <div className="w-64 h-64 mb-8 shadow-2xl border-4 border-deco-gold dark:border-deco-red flex-shrink-0">
                    {book.coverPath ? (
                        <img src={`${process.env.REACT_APP_BACKEND_URL}${book.coverPath}`} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center text-5xl text-deco-gold">
                            {book.title[0]}
                        </div>
                    )}
                </div>

                <h2 className="text-2xl font-deco text-center mb-2">{book.title}</h2>
                <p className="text-lg opacity-75 mb-6">{book.author}</p>

                <div className="flex flex-col items-center gap-6 mb-8 w-full max-w-md">
                    {isCurrentBook ? (
                        <>
                            <div className="w-full bg-gray-300 dark:bg-gray-700 h-2 mb-2 rounded-full overflow-hidden">
                                <div
                                    className="bg-deco-gold dark:bg-deco-red h-full transition-all duration-100"
                                    style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between text-xs font-mono opacity-75 w-full">
                                <span>{formatTime(currentTime)}</span>
                                <span>{formatTime(duration)}</span>
                            </div>

                            <button onClick={handlePlayPause} className="w-16 h-16 rounded-full bg-deco-gold dark:bg-deco-red text-white flex items-center justify-center hover:scale-105 transition shadow-lg">
                                {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} className="ml-1" />}
                            </button>
                        </>
                    ) : (
                        <button onClick={handlePlayPause} className="px-8 py-3 rounded-full bg-deco-gold dark:bg-deco-red text-white font-bold uppercase tracking-widest hover:scale-105 transition shadow-lg flex items-center gap-2">
                            <FaPlay /> Start Listening
                        </button>
                    )}
                </div>

                <button
                    onClick={() => setShowNoteInput(!showNoteInput)}
                    className={`flex items-center gap-2 px-4 py-2 bg-deco-purple dark:bg-deco-silver text-white dark:text-gray-900 rounded-lg hover:opacity-90 transition ${!isCurrentBook ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!isCurrentBook}
                    title={!isCurrentBook ? "Play book to add notes" : ""}
                >
                    <FaBookmark />
                    {showNoteInput ? 'Cancel Note' : 'Add Note / Clip'}
                </button>

                {showNoteInput && isCurrentBook && (
                    <div className="mt-4 w-full max-w-md flex gap-2 animate-fade-in">
                        <input
                            type="text"
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            placeholder="Enter a note (optional)..."
                            className="flex-1 p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                        />
                        <button
                            onClick={handleAddBookmark}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            Save
                        </button>
                    </div>
                )}
            </div>

            <div className="w-full lg:w-1/2 flex flex-col bg-gray-50 dark:bg-gray-900">
                <div className="flex border-b border-gray-200 dark:border-gray-700">
                    <button
                        className={`flex-1 py-4 font-bold flex items-center justify-center gap-2 ${activeTab === 'chapters' ? 'text-deco-gold dark:text-deco-red border-b-2 border-deco-gold dark:border-deco-red' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('chapters')}
                    >
                        <FaList /> Chapters
                    </button>
                    <button
                        className={`flex-1 py-4 font-bold flex items-center justify-center gap-2 ${activeTab === 'bookmarks' ? 'text-deco-gold dark:text-deco-red border-b-2 border-deco-gold dark:border-deco-red' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('bookmarks')}
                    >
                        <FaBookmark /> Bookmarks ({bookmarks.length})
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {activeTab === 'chapters' ? (
                        <ul className="space-y-2">
                            {book.chapters.map((c: any, i: number) => {
                                const isCurrentChapter = isCurrentBook && i === currentChapterIndex;
                                return (
                                    <li
                                        key={c.id}
                                        onClick={() => handleChapterClick(i)}
                                        className={`flex justify-between items-center p-3 cursor-pointer transition rounded-md
                                            ${isCurrentChapter
                                                ? 'bg-deco-gold text-white dark:bg-deco-red shadow-md'
                                                : 'hover:bg-gray-200 dark:hover:bg-gray-800'}`}
                                    >
                                        <div className="font-medium">
                                            {isCurrentChapter ? '▶️ ' : ''}{i + 1}. {c.title}
                                        </div>
                                        <div className="text-sm opacity-75 font-mono">
                                            {c.startTime}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <div className="space-y-3">
                            {bookmarks.length === 0 && (
                                <p className="text-center text-gray-500 mt-10">No bookmarks yet. Add one while listening!</p>
                            )}
                            {bookmarks.map((b) => (
                                <div key={b.id} className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow flex justify-between items-start group">
                                    <div
                                        className="flex-1 cursor-pointer"
                                        onClick={() => jumpToBookmark(b.timestamp)}
                                    >
                                        <div className="flex items-center gap-2 text-deco-purple dark:text-deco-silver font-bold mb-1">
                                            <FaBookmark size={12} />
                                            <span>{b.timestamp}</span>
                                        </div>
                                        {b.note && (
                                            <p className="text-sm text-gray-700 dark:text-gray-300">{b.note}</p>
                                        )}
                                        <p className="text-xs text-gray-400 mt-1">
                                            {new Date(b.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteBookmark(b.id)}
                                        className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition p-2"
                                        title="Delete Bookmark"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Player;