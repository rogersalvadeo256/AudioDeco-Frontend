import React, { useState } from 'react';
import { uploadAudiobook } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { Upload as UploadIcon } from 'lucide-react';

const Upload: React.FC = () => {
    const { t } = useTheme();
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [message, setMessage] = useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files?.[0] || null);
        setMessage('');
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Please select a file first');
            return;
        }

        setUploading(true);
        setProgress(0);
        setMessage('');

        try {
            await uploadAudiobook(file, (event: any) => {
                setProgress(Math.round((100 * event.loaded) / event.total));
            });
            setMessage('Upload successful!');
            setFile(null);
        } catch (error) {
            console.error(error);
            setMessage('Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className={`h-full flex flex-col items-center justify-center border-2 border-dashed ${t.border} rounded-none p-12 ${t.bgTertiary}`}>
            <div className={`w-24 h-24 mb-6 border ${t.borderAccent} flex items-center justify-center rotate-45`}>
                <UploadIcon className={`${t.textAccent} -rotate-45`} size={40} />
            </div>
            <h3 className={`text-xl font-serif ${t.textMain} mb-2`}>Ingest Media</h3>
            <p className={`${t.textMuted} text-sm tracking-wide mb-8`}>Drag & Drop audio files or click to select</p>

            <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept=".mp3,.m4b,.m4a,.zip"
            />

            <label
                htmlFor="file-upload"
                className={`px-8 py-3 ${t.bgSecondary} ${t.textAccent} uppercase tracking-[0.2em] text-xs border ${t.border} hover:${t.bgTertiary} hover:${t.borderAccent} transition-all cursor-pointer mb-4`}
            >
                {file ? file.name : 'Select Files'}
            </label>

            {file && (
                <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className={`px-8 py-3 ${t.accentBg} text-white uppercase tracking-[0.2em] text-xs border ${t.borderAccent} hover:opacity-90 transition-all disabled:opacity-50`}
                >
                    {uploading ? `Uploading ${progress}%` : 'Start Upload'}
                </button>
            )}

            {message && (
                <p className={`mt-4 text-sm ${message.includes('failed') ? 'text-red-500' : 'text-green-500'}`}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default Upload;