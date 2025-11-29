import React, { useEffect, useState } from 'react';
import { getAudiobooks, updateAudiobook, deleteAudiobook } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { usePlayer } from '../context/PlayerContext';
import { parseTimeToSeconds, formatTimeFromSeconds } from '../utils/time';
import DecoCorner from './common/DecoCorner';
import { Play, Pause, Edit2, Trash2, Clock, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Chapter {
    id?: number;
    title: string;
    startTime: string;
    endTime: string;
    fileName?: string;
}

interface Book {
    id: number;
    title: string;
    author: string;
    description: string;
    coverPath?: string;
    duration: string;
    currentTime: string;
    chapters: Chapter[];
}

interface BookCardProps {
    book: Book;
    t: any;
    theme: string;
    currentBook: Book | null;
    isPlaying: boolean;
    handlePlay: (book: Book) => void;
    handleEdit: (book: Book) => void;
    handleDelete: (id: number) => void;
    formatDuration: (duration: string) => string;
}



const Library: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const { t, theme } = useTheme();
    const { playBook, currentBook, isPlaying } = usePlayer();
    const [editingBook, setEditingBook] = useState<Book | null>(null);

    useEffect(() => {
        loadBooks();
    }, []);

    const loadBooks = () => {
        getAudiobooks()
            .then(setBooks)
            .catch(err => console.error(err));
    };

    const handlePlay = (book: Book) => {
        playBook(book);
    };

    const handleEdit = (book: Book) => {
        setEditingBook({ ...book });
    };

    const handleSaveEdit = async () => {
        if (!editingBook) return;
        try {
            await updateAudiobook(editingBook.id, editingBook);
            setBooks(books.map(b => b.id === editingBook.id ? editingBook : b));
            setEditingBook(null);
        } catch (error) {
            console.error("Failed to update book", error);
            alert("Failed to update book");
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this audiobook? This cannot be undone.")) {
            try {
                await deleteAudiobook(id);
                setBooks(books.filter(b => b.id !== id));
            } catch (error) {
                console.error("Failed to delete book", error);
                alert("Failed to delete book");
            }
        }
    };

    const EditModal = () => {
        if (!editingBook) return null;
        return (
            <div className={`fixed inset-0 ${theme === 'dark' ? 'bg-black/90' : 'bg-purple-900/20'} backdrop-blur-sm z-50 flex items-center justify-center p-4`}>
                <div className={`w-full max-w-md ${t.bgSecondary} border ${t.borderAccent} p-8 relative shadow-2xl`}>
                    <DecoCorner className="top-0 left-0 border-t border-l" />
                    <DecoCorner className="top-0 right-0 border-t border-r" />
                    <DecoCorner className="bottom-0 right-0 border-b border-r" />
                    <DecoCorner className="bottom-0 left-0 border-b border-l" />

                    <div className="flex justify-between items-center mb-6">
                        <h2 className={`text-2xl font-serif ${t.textAccent}`}>Edit Metadata</h2>
                        <button onClick={() => setEditingBook(null)} className={t.textMuted}><X size={20} /></button>
                    </div>

                    <div className="space-y-6">
                        <div className="group">
                            <label className={`block text-xs uppercase tracking-widest ${t.textMuted} mb-2`}>Title</label>
                            <input
                                value={editingBook.title}
                                onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                                className={`w-full bg-transparent border-b ${t.border} ${t.textMain} pb-2 focus:outline-none focus:${t.borderAccent} transition-colors font-serif text-lg`}
                            />
                        </div>
                        <div className="group">
                            <label className={`block text-xs uppercase tracking-widest ${t.textMuted} mb-2`}>Author</label>
                            <input
                                value={editingBook.author}
                                onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
                                className={`w-full bg-transparent border-b ${t.border} ${t.textMain} pb-2 focus:outline-none focus:${t.borderAccent} transition-colors`}
                            />
                        </div>
                        <div className="group">
                            <label className={`block text-xs uppercase tracking-widest ${t.textMuted} mb-2`}>Description</label>
                            <textarea
                                value={editingBook.description}
                                onChange={(e) => setEditingBook({ ...editingBook, description: e.target.value })}
                                className={`w-full bg-transparent border-b ${t.border} ${t.textMain} pb-2 focus:outline-none focus:${t.borderAccent} transition-colors h-24 resize-none`}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-8">
                        <button
                            onClick={() => setEditingBook(null)}
                            className={`px-6 py-2 ${t.textMuted} text-xs uppercase tracking-widest hover:${t.textMain} transition-colors`}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveEdit}
                            className={`px-6 py-2 ${t.accentBg} border ${t.borderAccent} ${t.textAccent} text-xs uppercase tracking-widest hover:bg-opacity-80 transition-all`}
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {books.map(book => (
                    <BookCard
                        key={book.id}
                        book={book}
                        t={t}
                        theme={theme}
                        currentBook={currentBook}
                        isPlaying={isPlaying}
                        handlePlay={handlePlay}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        formatDuration={(d) => formatTimeFromSeconds(parseTimeToSeconds(d))}
                    />
                ))}
            </div>
            {books.length === 0 && (
                <div className={`text-center py-20 ${t.textMuted}`}>
                    <p className="text-xl font-serif mb-4">The archives are empty.</p>
                    <p className="text-sm uppercase tracking-widest">Import some media to begin.</p>
                </div>
            )}
            <EditModal />
        </div>
    );
};



const BookCard: React.FC<BookCardProps> = ({ book, t, theme, currentBook, isPlaying, handlePlay, handleEdit, handleDelete, formatDuration }) => {
    const isCurrent = currentBook?.id === book.id;
    const playing = isCurrent && isPlaying;

    const currentSeconds = parseTimeToSeconds(book.currentTime);
    const totalSeconds = parseTimeToSeconds(book.duration);
    const progress = totalSeconds > 0 ? (currentSeconds / totalSeconds) * 100 : 0;

    return (
        <div className={`group relative ${t.bgSecondary} border ${t.border} hover:${t.borderAccent} transition-all duration-500 p-1 flex flex-col h-full shadow-sm`}>
            <div className={`absolute top-0 left-0 w-2 h-2 border-t border-l border-transparent group-hover:${t.borderAccent} transition-colors`} />
            <div className={`absolute top-0 right-0 w-2 h-2 border-t border-r border-transparent group-hover:${t.borderAccent} transition-colors`} />
            <div className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r border-transparent group-hover:${t.borderAccent} transition-colors`} />
            <div className={`absolute bottom-0 left-0 w-2 h-2 border-b border-l border-transparent group-hover:${t.borderAccent} transition-colors`} />

            <div className={`relative w-full aspect-[2/3] bg-stone-800 mb-4 overflow-hidden`}>
                {book.coverPath ? (
                    <img src={`${process.env.REACT_APP_BACKEND_URL}${book.coverPath}`} alt={book.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl font-deco text-white opacity-20">
                        {book.title[0]}
                    </div>
                )}

                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black to-transparent" />
                <div className={`absolute inset-0 border-[3px] border-double ${theme === 'dark' ? 'border-neutral-900/30' : 'border-white/30'} m-3`} />

                <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-black/60' : 'bg-purple-900/20'} opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm`}>
                    <button
                        onClick={() => handlePlay(book)}
                        className={`w-12 h-12 border flex items-center justify-center transition-all duration-300 ${t.playBtn}`}
                    >
                        {playing ? <Pause size={20} /> : <Play size={20} fill="currentColor" />}
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col px-2 pb-2">
                <Link to={`/player/${book.id}`}>
                    <h3 className={`${t.textMain} font-serif text-lg leading-tight mb-1 truncate hover:underline`} title={book.title}>{book.title}</h3>
                </Link>
                <p className={`${t.textMuted} text-xs uppercase tracking-wider mb-4 truncate`}>{book.author}</p>

                <div className={`mt-auto flex items-center justify-between border-t ${t.border} pt-3`}>
                    <span className={`${t.textMuted} text-xs flex items-center gap-1`}>
                        <Clock size={10} /> {formatDuration(book.duration)}
                    </span>
                    <div className="flex gap-2">
                        <button onClick={() => handleEdit(book)} className={`${t.textMuted} ${t.accentHover} transition-colors`}>
                            <Edit2 size={12} />
                        </button>
                        <button onClick={() => handleDelete(book.id)} className={`${t.textMuted} hover:text-red-500 transition-colors`}>
                            <Trash2 size={12} />
                        </button>
                    </div>
                </div>

                <div className={`w-full h-[1px] ${theme === 'dark' ? 'bg-neutral-800' : 'bg-purple-100'} mt-3 relative`}>
                    <div style={{ width: `${progress}%` }} className={`absolute left-0 top-0 bottom-0 ${t.progressFill}`} />
                </div>
            </div>
        </div>
    );
};

export default Library;