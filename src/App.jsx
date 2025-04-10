import React, { useState, useRef, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const QRCodeGenerator = () => {
    const [text, setText] = useState('');
    const [copied, setCopied] = useState(false);
    const [fgColor, setFgColor] = useState('#2e7d32'); // Default green
    const [bgColor, setBgColor] = useState('#ffffff');
    const [theme, setTheme] = useState('green');
    const qrRef = useRef(null);

    // Theme presets
    const themes = {
        green: {
            primary: '#2e7d32',
            secondary: '#4caf50',
            text: '#ffffff'
        },
        blue: {
            primary: '#1976d2',
            secondary: '#2196f3',
            text: '#ffffff'
        },
        purple: {
            primary: '#7b1fa2',
            secondary: '#9c27b0',
            text: '#ffffff'
        },
        dark: {
            primary: '#424242',
            secondary: '#616161',
            text: '#ffffff',
            bgColor: '#303030'
        },
        custom: {
            primary: fgColor,
            secondary: fgColor,
            text: '#ffffff'
        }
    };

    const handleDownload = () => {
        const canvas = qrRef.current;
        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = 'qrcode.png';
        link.click();
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(text)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            });
    };

    useEffect(() => {
        if (theme !== 'custom') {
            setFgColor(themes[theme].primary);
            setBgColor(theme === 'dark' ? themes.dark.bgColor : '#ffffff');
        }
    }, [theme]);

    return (
        <div className="qr-generator" style={{ backgroundColor: themes[theme].bgColor || '#f5f5f5' }}>
            <div className="qr-header">
                <h1 style={{ color: themes[theme].primary }}>Fonate QR Code Generator</h1>
                <p className="subtitle">Create and download customizable QR codes</p>
            </div>

            <div className="theme-selector">
                <label>Theme:</label>
                <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    style={{
                        backgroundColor: themes[theme].primary,
                        color: themes[theme].text
                    }}
                >
                    <option value="green">Green</option>
                    <option value="blue">Blue</option>
                    <option value="purple">Purple</option>
                    <option value="dark">Dark</option>
                    <option value="custom">Custom</option>
                </select>

                {theme === 'custom' && (
                    <div className="color-pickers">
                        <div className="color-picker">
                            <label>QR Color:</label>
                            <input
                                type="color"
                                value={fgColor}
                                onChange={(e) => setFgColor(e.target.value)}
                            />
                        </div>
                        <div className="color-picker">
                            <label>Background:</label>
                            <input
                                type="color"
                                value={bgColor}
                                onChange={(e) => setBgColor(e.target.value)}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="input-group">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter URL or text"
                    className="qr-input"
                    style={{
                        borderColor: themes[theme].primary,
                        focusBorderColor: themes[theme].secondary
                    }}
                />
                {text && (
                    <button
                        onClick={copyToClipboard}
                        className={`copy-btn ${copied ? 'copied' : ''}`}
                        style={{
                            backgroundColor: copied ? themes[theme].secondary : themes[theme].primary,
                            color: themes[theme].text
                        }}
                    >
                        {copied ? '✓ Copied!' : 'Copy Text'}
                    </button>
                )}
            </div>

            {text && (
                <div className="qr-display">
                    <div className="qr-code-container" style={{ backgroundColor: bgColor }}>
                        <QRCodeCanvas
                            ref={qrRef}
                            value={text}
                            size={256}
                            bgColor={bgColor}
                            fgColor={fgColor}
                            level="H"
                        />
                    </div>

                    <div className="qr-actions">
                        <button
                            onClick={handleDownload}
                            className="download-btn"
                            style={{
                                backgroundColor: themes[theme].primary,
                                color: themes[theme].text
                            }}
                        >
                            Download PNG
                        </button>
                    </div>
                </div>
            )}

            <style jsx>{`
                .qr-generator {
                    max-width: 600px;
                    margin: 2rem auto;
                    padding: 2rem;
                    border-radius: 12px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    font-family: 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                    transition: all 0.3s ease;
                }
                
                .qr-header {
                    margin-bottom: 2rem;
                    text-align: center;
                }
                
                .qr-header h1 {
                    margin: 0;
                    font-weight: 600;
                    transition: color 0.3s;
                }
                
                .subtitle {
                    color: #666;
                    margin-top: 0.5rem;
                }
                
                .theme-selector {
                    margin-bottom: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                
                .theme-selector select {
                    padding: 8px 12px;
                    border-radius: 6px;
                    border: none;
                    cursor: pointer;
                    font-size: 14px;
                    max-width: 200px;
                }
                
                .color-pickers {
                    display: flex;
                    gap: 1rem;
                    flex-wrap: wrap;
                }
                
                .color-picker {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                
                .color-picker input[type="color"] {
                    width: 30px;
                    height: 30px;
                    border: 2px solid #ddd;
                    border-radius: 50%;
                    cursor: pointer;
                }
                
                .input-group {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 1.5rem;
                }
                
                .qr-input {
                    flex: 1;
                    padding: 12px 16px;
                    border: 2px solid;
                    border-radius: 8px;
                    font-size: 16px;
                    transition: all 0.3s;
                }
                
                .qr-input:focus {
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
                }
                
                .copy-btn {
                    padding: 0 16px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.2s;
                }
                
                .qr-display {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1.5rem;
                    animation: fadeIn 0.3s ease-out;
                }
                
                .qr-code-container {
                    padding: 20px;
                    border-radius: 12px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s;
                }
                
                .qr-actions {
                    display: flex;
                    gap: 1rem;
                }
                
                .download-btn {
                    padding: 12px 24px;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: 500;
                    transition: all 0.2s;
                    border: none;
                    cursor: pointer;
                }
                
                .download-btn:hover {
                    transform: translateY(-2px);
                    opacity: 0.9;
                }
                
                @media (max-width: 640px) {
                    .qr-generator {
                        padding: 1.5rem;
                        margin: 1rem;
                    }
                    
                    .input-group {
                        flex-direction: column;
                    }
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default QRCodeGenerator;