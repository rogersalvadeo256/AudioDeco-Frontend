import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { getUserSettings, updateUserSettings } from '../services/api';
import { Settings as SettingsIcon, Save } from 'lucide-react';

const Settings: React.FC = () => {
    const { t, theme } = useTheme();
    const [skipInterval, setSkipInterval] = useState<number>(30);
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const settings = await getUserSettings();
            setSkipInterval(settings.skipInterval);
        } catch (error) {
            console.error('Error loading settings:', error);
            setMessage('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage('');
        try {
            await updateUserSettings(1, { skipInterval });
            setMessage('Settings saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error saving settings:', error);
            setMessage('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const skipOptions: number[] = [15, 30, 45, 60];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className={`text-lg ${t.textMuted}`}>Loading settings...</div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className={`${t.bgSecondary} border ${t.border} p-8 relative`}>
                <div className={`absolute top-0 left-0 w-4 h-4 border-t border-l ${t.borderAccent}`} />
                <div className={`absolute top-0 right-0 w-4 h-4 border-t border-r ${t.borderAccent}`} />
                <div className={`absolute bottom-0 right-0 w-4 h-4 border-b border-r ${t.borderAccent}`} />
                <div className={`absolute bottom-0 left-0 w-4 h-4 border-b border-l ${t.borderAccent}`} />

                <div className="flex items-center gap-3 mb-8">
                    <SettingsIcon className={t.textAccent} size={24} />
                    <h1 className={`text-3xl font-serif ${t.textMain}`}>System Settings</h1>
                </div>

                <div className={`h-px ${theme === 'dark' ? 'bg-red-500/20' : 'bg-amber-500/20'} mb-8`} />

                <div className="mb-8">
                    <label className={`block text-xs uppercase tracking-widest ${t.textMuted} mb-4`}>
                        Skip Interval (Seconds)
                    </label>
                    <p className={`text-sm ${t.textMuted} mb-6`}>
                        Configure how many seconds to skip forward or backward when using the skip buttons.
                    </p>

                    <div className="grid grid-cols-4 gap-4">
                        {skipOptions.map(option => (
                            <button
                                key={option}
                                onClick={() => setSkipInterval(option)}
                                className={`p-4 border transition-all duration-300 ${skipInterval === option
                                        ? `${t.borderAccent} ${t.accentBg} ${t.textAccent}`
                                        : `${t.border} ${t.bgTertiary} ${t.textMuted} hover:${t.borderAccent}`
                                    }`}
                            >
                                <div className="text-2xl font-bold mb-1">{option}</div>
                                <div className="text-xs uppercase tracking-widest">seconds</div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t ${t.border}">
                    {message && (
                        <div className={`text-sm ${message.includes('success') ? 'text-green-500' : 'text-red-500'}`}>
                            {message}
                        </div>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={`ml-auto px-8 py-3 ${t.accentBg} border ${t.borderAccent} ${t.textAccent} text-xs uppercase tracking-widest hover:bg-opacity-80 transition-all flex items-center gap-2 ${saving ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        <Save size={16} />
                        {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </div>

            <div className={`mt-6 ${t.bgTertiary} border ${t.border} p-6`}>
                <h3 className={`text-sm uppercase tracking-widest ${t.textMuted} mb-3`}>About Skip Controls</h3>
                <p className={`text-sm ${t.textMuted} leading-relaxed`}>
                    The skip buttons in the player bar allow you to quickly jump forward or backward in your audiobook.
                    Choose a skip interval that matches your listening preferences. Common choices are 30 seconds for
                    general listening or 15 seconds for more precise control.
                </p>
            </div>
        </div>
    );
};

export default Settings;