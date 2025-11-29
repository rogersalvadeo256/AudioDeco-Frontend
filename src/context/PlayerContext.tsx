import React, { createContext, useContext, useState, useRef } from 'react';
import { updateProgress } from '../services/api';
import { formatTimeFromSeconds } from '../utils/time';

interface Book {
    id: number;
    title: string;
    author: string;
    description: string;
    coverPath?: string;
    duration: string;
    currentTime: string;
    chapters: any[];
}

interface PlayerContextType {
    currentBook: Book | null;
    setCurrentBook: (book: Book | null) => void;
    isPlaying: boolean;
    setIsPlaying: (playing: boolean) => void;
    playBook: (book: Book) => Promise<void>;
    togglePlay: () => void;
    currentTime: number;
    setCurrentTime: (time: number) => void;
    duration: number;
    setDuration: (duration: number) => void;
    currentChapterIndex: number;
    setCurrentChapterIndex: (index: number) => void;
    audioRef: React.RefObject<HTMLAudioElement>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const usePlayer = (): PlayerContextType => {
    const context = useContext(PlayerContext);
    if (!context) {
        throw new Error('usePlayer must be used within a PlayerProvider');
    }
    return context;
};

interface PlayerProviderProps {
    children: React.ReactNode;
}

export const PlayerProvider: React.FC<PlayerProviderProps> = ({ children }) => {
    const [currentBook, setCurrentBook] = useState<Book | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(0);
    const audioRef = useRef<HTMLAudioElement>(null);



    const playBook = async (book: Book): Promise<void> => {
        if (currentBook?.id === book.id) {
            setIsPlaying(!isPlaying);
        } else {
            if (currentBook && audioRef.current) {
                try {
                    const timeString = formatTimeFromSeconds(audioRef.current.currentTime);
                    await updateProgress(currentBook.id, timeString);
                } catch (e) {
                    console.error("Failed to save progress on switch", e);
                }
            }

            setCurrentBook(book);
            setIsPlaying(true);
            setCurrentChapterIndex(0);
        }
    };

    const togglePlay = (): void => {
        if (currentBook) {
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <PlayerContext.Provider value={{
            currentBook,
            setCurrentBook,
            isPlaying,
            setIsPlaying,
            playBook,
            togglePlay,
            currentTime,
            setCurrentTime,
            duration,
            setDuration,
            currentChapterIndex,
            setCurrentChapterIndex,
            audioRef
        }}>
            {children}
        </PlayerContext.Provider>
    );
};